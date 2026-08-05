import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Ciudad } from '../../ciudad/entities/ciudad.entity';

export enum EstadoZona {
  ACTIVA = 'Activa',
  INACTIVA = 'Inactiva',
}

@Entity('zonas')
export class Zona {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Ciudad, { eager: true })
  @JoinColumn({ name: 'ciudad_id' })
  ciudad: Ciudad;

  @Column()
  nombre: string; // ej: Zona Norte

  @Column({ type: 'enum', enum: EstadoZona, default: EstadoZona.ACTIVA })
  estado: EstadoZona;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;
}
