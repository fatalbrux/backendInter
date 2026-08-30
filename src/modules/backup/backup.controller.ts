import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Res,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import type { Response } from 'express';
import { BackupService } from './backup.service';
import { RestaurarBackupDto } from './dto/restaurar-backup.dto';
import { ConfiguracionBackupDto } from './dto/configuracion-backup.dto';

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Post('manual')
  async generarManual() {
    const ruta = await this.backupService.generarBackup();
    return { mensaje: 'Backup generado correctamente', ruta };
  }

  @Get()
  listar() {
    return this.backupService.listarBackups();
  }

  @Post('restaurar')
  async restaurar(@Body() dto: RestaurarBackupDto) {
    await this.backupService.restaurarBackup(dto.ruta);
    return { mensaje: 'Restauración completada correctamente' };
  }

  /**
   * Restaura a partir de un archivo .json subido desde el navegador,
   * por ejemplo un backup traído de otra PC o descargado del VPS.
   */
  @Post('restaurar-archivo')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        archivo: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('archivo', { storage: memoryStorage() }))
  async restaurarArchivo(@UploadedFile() archivo: Express.Multer.File) {
    if (!archivo) {
      throw new BadRequestException('Debes subir un archivo de backup (.json)');
    }
    await this.backupService.restaurarDesdeArchivoSubido(archivo.buffer);
    return { mensaje: 'Restauración completada correctamente desde el archivo subido' };
  }

  @Get('descargar/:nombre')
  descargar(@Param('nombre') nombre: string, @Res() res: Response) {
    const backups = this.backupService.listarBackups();
    const encontrado = backups.find((b) => b.nombre === nombre);
    if (!encontrado) {
      throw new BadRequestException('Backup no encontrado');
    }
    res.download(encontrado.ruta, nombre);
  }

  @Get('configuracion')
obtenerConfiguracion() {
  return this.backupService.obtenerConfiguracion();
}

@Post('configuracion')
guardarConfiguracion(@Body() dto: ConfiguracionBackupDto) {
  return this.backupService.guardarConfiguracion(dto);
}

}