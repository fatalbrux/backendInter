import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum RolUsuario {
  ADMINISTRADOR = 'Administrador',
  TECNICO = 'Tecnico',
  OPERADOR = 'Operador',
}

export enum EstadoUsuario {
  ACTIVO = 'Activo',
  INACTIVO = 'Inactivo',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nombre_completo', nullable: true })
  nombreCompleto: string;

  @Column({ unique: true })
  usuario: string; // ej: admin

  @Column({ name: 'password', select: false })
  password: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'enum', enum: RolUsuario, nullable: true })
  rol: RolUsuario;

  @Column({ type: 'enum', enum: EstadoUsuario, default: EstadoUsuario.ACTIVO })
  estado: EstadoUsuario;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;
}
