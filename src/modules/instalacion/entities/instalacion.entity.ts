import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Cliente } from '../../cliente/entities/cliente.entity';
import { Equipo } from '../../equipo/entities/equipo.entity';
import { Zona } from '../../ubicaciones/zona/entities/zona.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity('instalaciones')
export class Instalacion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cliente, { eager: true })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @ManyToOne(() => Equipo, { eager: true })
  @JoinColumn({ name: 'equipo_id' })
  equipo: Equipo;

  @ManyToOne(() => Zona, { nullable: true })
  @JoinColumn({ name: 'zona_id' })
  zona: Zona | null;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'tecnico_id' })
  tecnico: Usuario | null;

  @Column({ name: 'fecha_instalacion', type: 'date', nullable: true })
  fechaInstalacion: string;

  @Column({ nullable: true })
  direccion: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;
}
