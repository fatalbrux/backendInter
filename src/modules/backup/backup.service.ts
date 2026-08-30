import { Injectable, Logger, BadRequestException, OnModuleInit } from '@nestjs/common';
import { DataSource, EntityMetadata } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as fs from 'fs';
import * as path from 'path';

interface BackupData {
  version: number;
  fecha: string;
  tablas: Record<string, Record<string, any>[]>;
}

export type FrecuenciaBackup = 'diario' | 'semanal' | 'mensual';

export interface ConfiguracionBackup {
  frecuencia: FrecuenciaBackup;
  activado: boolean;
}

const CONFIG_POR_DEFECTO: ConfiguracionBackup = { frecuencia: 'diario', activado: true };

const UMBRAL_MS: Record<FrecuenciaBackup, number> = {
  diario: 24 * 60 * 60 * 1000,
  semanal: 7 * 24 * 60 * 60 * 1000,
  mensual: 30 * 24 * 60 * 60 * 1000,
};

@Injectable()
export class BackupService implements OnModuleInit {
  private readonly logger = new Logger(BackupService.name);
  private config: ConfiguracionBackup = CONFIG_POR_DEFECTO;
  constructor(private readonly dataSource: DataSource) {}

  private getBackupDir(): string {
    let baseDir: string;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { app } = require('electron');
      baseDir = app.getPath('userData');
    } catch {
      baseDir = process.env.BACKUP_BASE_DIR || path.join(process.cwd(), 'data');
    }

    const backupDir = path.join(baseDir, 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    return backupDir;
  }

  private getOrderedEntityMetadatas(): EntityMetadata[] {
    const metadatas = this.dataSource.entityMetadatas;
    const dependenciasPorTabla = new Map<string, Set<string>>();
    const metaPorTabla = new Map<string, EntityMetadata>();

    for (const meta of metadatas) {
      metaPorTabla.set(meta.tableName, meta);
      const deps = new Set<string>();
      for (const relation of meta.relations) {
        const esDuenaDeLaFk =
          relation.isManyToOne || (relation.isOneToOne && relation.isOwning);
        if (esDuenaDeLaFk) {
          const tablaDestino = relation.inverseEntityMetadata.tableName;
          if (tablaDestino !== meta.tableName) {
            deps.add(tablaDestino);
          }
        }
      }
      dependenciasPorTabla.set(meta.tableName, deps);
    }

    const resultado: EntityMetadata[] = [];
    const visitado = new Set<string>();
    const enProceso = new Set<string>();

    const visitar = (tabla: string) => {
      if (visitado.has(tabla) || enProceso.has(tabla)) return;
      enProceso.add(tabla);
      const deps = dependenciasPorTabla.get(tabla) ?? new Set<string>();
      for (const dep of deps) visitar(dep);
      enProceso.delete(tabla);
      visitado.add(tabla);
      const meta = metaPorTabla.get(tabla);
      if (meta) resultado.push(meta);
    };

    for (const tabla of dependenciasPorTabla.keys()) visitar(tabla);

    return resultado;
  }

  async generarBackup(): Promise<string> {
    const metadatasOrdenadas = this.getOrderedEntityMetadatas();
    const tablas: Record<string, Record<string, any>[]> = {};

    for (const meta of metadatasOrdenadas) {
      const filas = await this.dataSource.query(
        `SELECT * FROM "${meta.tableName}"`,
      );
      tablas[meta.tableName] = filas;
    }

    const backup: BackupData = {
      version: 1,
      fecha: new Date().toISOString(),
      tablas,
    };

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const nombreArchivo = `respaldo-${timestamp}.json`;
    const rutaCompleta = path.join(this.getBackupDir(), nombreArchivo);

    fs.writeFileSync(rutaCompleta, JSON.stringify(backup, null, 2), 'utf-8');
    this.logger.log(`Backup generado: ${rutaCompleta}`);

    return rutaCompleta;
  }

  /**
   * Lógica compartida de restauración: borra e inserta datos según el
   * objeto BackupData ya parseado. La usan tanto restaurarBackup()
   * (archivo local en la carpeta de backups) como
   * restaurarDesdeArchivoSubido() (archivo subido desde el navegador,
   * por ejemplo traído de otra PC).
   */
  private async restaurarDatos(backup: BackupData): Promise<void> {
    const metadatasOrdenadas = this.getOrderedEntityMetadatas();
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const meta of [...metadatasOrdenadas].reverse()) {
        await queryRunner.query(`DELETE FROM "${meta.tableName}"`);
      }

      for (const meta of metadatasOrdenadas) {
        const filas = backup.tablas[meta.tableName] ?? [];
        if (filas.length === 0) continue;

        for (const fila of filas) {
          const columnas = Object.keys(fila);
          const placeholders = columnas.map((_, i) => `$${i + 1}`);
          const sql = `INSERT INTO "${meta.tableName}" (${columnas
            .map((c) => `"${c}"`)
            .join(', ')}) VALUES (${placeholders.join(', ')})`;
          await queryRunner.query(
            sql,
            columnas.map((c) => fila[c]),
          );
        }

        const columnaId = meta.columns.find((c) => c.isPrimary && c.isGenerated);
        if (columnaId) {
          await queryRunner.query(
            `SELECT setval(pg_get_serial_sequence('"${meta.tableName}"', '${columnaId.databaseName}'), COALESCE((SELECT MAX("${columnaId.databaseName}") FROM "${meta.tableName}"), 1))`,
          );
        }
      }

      await queryRunner.commitTransaction();
      this.logger.log('Restauración completada');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error al restaurar backup', error as Error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /** Restaura desde un archivo que ya está en la carpeta de backups de esta misma instalación. */
  async restaurarBackup(rutaArchivo: string): Promise<void> {
    if (!fs.existsSync(rutaArchivo)) {
      throw new BadRequestException('El archivo de respaldo no existe');
    }
    const backup: BackupData = JSON.parse(fs.readFileSync(rutaArchivo, 'utf-8'));
    await this.restaurarDatos(backup);
  }

  /** Restaura desde un archivo subido por el usuario (ej. traído de otra PC o del VPS). */
  async restaurarDesdeArchivoSubido(buffer: Buffer): Promise<void> {
    let backup: BackupData;
    try {
      backup = JSON.parse(buffer.toString('utf-8'));
    } catch {
      throw new BadRequestException('El archivo subido no es un backup JSON válido');
    }
    if (!backup?.tablas) {
      throw new BadRequestException('El archivo no tiene el formato esperado de un backup');
    }
    await this.restaurarDatos(backup);
  }

  listarBackups(): { nombre: string; ruta: string; fecha: Date; tamanoKB: number }[] {
    const dir = this.getBackupDir();
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.json'))
      .map((nombre) => {
        const ruta = path.join(dir, nombre);
        const stats = fs.statSync(ruta);
        return {
          nombre,
          ruta,
          fecha: stats.mtime,
          tamanoKB: Math.round(stats.size / 1024),
        };
      })
      .sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
  }

  /*@Cron(CronExpression.EVERY_DAY_AT_2AM)
  async backupAutomatico() {
    this.logger.log('Ejecutando backup automático diario...');
    try {
      await this.generarBackup();
    } catch (error) {
      this.logger.error('Falló el backup automático', error as Error);
    }
  } */

  async onModuleInit() {
  await this.revisarBackupAutomatico();
}

private getConfigPath(): string {
  return path.join(this.getBackupDir(), '..', 'backup-config.json');
}

obtenerConfiguracion(): ConfiguracionBackup {
  const ruta = this.getConfigPath();
  if (!fs.existsSync(ruta)) return CONFIG_POR_DEFECTO;
  try {
    return { ...CONFIG_POR_DEFECTO, ...JSON.parse(fs.readFileSync(ruta, 'utf-8')) };
  } catch {
    return CONFIG_POR_DEFECTO;
  }
}

guardarConfiguracion(config: ConfiguracionBackup): ConfiguracionBackup {
  fs.writeFileSync(this.getConfigPath(), JSON.stringify(config, null, 2), 'utf-8');
  return config;
}

@Cron(CronExpression.EVERY_HOUR)
async revisarBackupAutomatico() {
  const config = this.obtenerConfiguracion();
  if (!config.activado) return;

  const [ultimo] = this.listarBackups(); // ya viene ordenado del más reciente al más viejo
  const umbral = UMBRAL_MS[config.frecuencia];
  const debeGenerar = !ultimo || Date.now() - ultimo.fecha.getTime() >= umbral;

  if (debeGenerar) {
    this.logger.log(`Toca backup automático (${config.frecuencia}), generando...`);
    try {
      await this.generarBackup();
    } catch (error) {
      this.logger.error('Falló el backup automático', error as Error);
    }
  }
}




}