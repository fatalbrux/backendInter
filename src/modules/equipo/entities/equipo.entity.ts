import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { TipoEquipo } from '../../catalogos/tipo-equipo/entities/tipo-equipo.entity';
import { Marca } from '../../catalogos/marca/entities/marca.entity';
import { Cliente } from '../../cliente/entities/cliente.entity';

export enum EstadoEquipo {
  INSTALADO = 'Instalado',
  DISPONIBLE = 'Disponible',
  EN_MANTENIMIENTO = 'En mantenimiento',
  DANADO = 'Dañado',
  RETIRADO = 'Retirado',
}

@Entity('equipos')
export class Equipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  codigo: string; // ej: RT-001

  @ManyToOne(() => TipoEquipo, { nullable: true, eager: true })
  @JoinColumn({ name: 'tipo_equipo_id' })
  tipoEquipo: TipoEquipo | null;

  @ManyToOne(() => Marca, { nullable: true, eager: true })
  @JoinColumn({ name: 'marca_id' })
  marca: Marca | null;

  @Column({ nullable: true })
  modelo: string; // ej: RB941-2nD (texto libre, varía mucho por marca)

  @Column({ name: 'nro_serie', unique: true, nullable: true })
  nroSerie: string;

  @Column({ nullable: true })
  mac: string;

  @Column({ nullable: true })
  ip: string;

  @Column({ name: 'pppoe_usuario', nullable: true })
  pppoeUsuario: string;

  @Column({ name: 'pppoe_password', nullable: true })
  pppoePassword: string;

  @Column({
    type: 'enum',
    enum: EstadoEquipo,
    default: EstadoEquipo.DISPONIBLE,
  })
  estado: EstadoEquipo;

  @ManyToOne(() => Cliente, { nullable: true })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente | null;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;
}
