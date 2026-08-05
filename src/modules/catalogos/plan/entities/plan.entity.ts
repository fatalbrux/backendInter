import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

export enum EstadoPlan {
  ACTIVO = 'Activo',
  INACTIVO = 'Inactivo',
}

@Entity('planes')
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string; // ej: Plan Básico 150 Bs

  @Column({ name: 'ancho_banda', nullable: true })
  anchoBanda: string; // ej: 20 Mbps

  @Column({
    name: 'precio_mensual',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  precioMensual: number;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ type: 'enum', enum: EstadoPlan, default: EstadoPlan.ACTIVO })
  estado: EstadoPlan;
}
