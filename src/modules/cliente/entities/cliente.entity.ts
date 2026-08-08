import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Zona } from '../../ubicaciones/zona/entities/zona.entity';
import { Plan } from '../../catalogos/plan/entities/plan.entity';

export enum EstadoCliente {
  ACTIVO = 'Activo',
  SUSPENDIDO = 'Suspendido',
  CORTE = 'Corte de servicio',
}

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  codigo: string; // ej: CLI-001

  @Column()
  nombres: string;

  @Column()
  apellidos: string;

  @Column({ nullable: true })
  ci: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  usuario: string | null;

  @ManyToOne(() => Zona, { nullable: true, eager: true })
  @JoinColumn({ name: 'zona_id' })
  zona: Zona | null;

  @ManyToOne(() => Plan, { nullable: true, eager: true })
  @JoinColumn({ name: 'plan_id' })
  plan: Plan | null;

  @Column({ nullable: true })
  direccion: string; // dirección completa en texto libre (ya no depende de "calle")

  @Column({ nullable: true })
  referencia: string;

  @Column({ name: 'fecha_instalacion', type: 'date', nullable: true })
  fechaInstalacion: string;

  @Column({ name: 'fecha_primer_pago', type: 'date', nullable: true })
  fechaPrimerPago: string;

  @Column({ type: 'enum', enum: EstadoCliente, default: EstadoCliente.ACTIVO })
  estado: EstadoCliente;

  @Column({ name: 'proximo_vencimiento', type: 'date', nullable: true })
  proximoVencimiento: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;
}
