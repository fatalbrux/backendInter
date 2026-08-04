import {
  Entity,
  PrimaryGeneratedColumn,
  Column
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

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nombre_completo', nullable: true })
  nombreCompleto: string;

  @Column({ unique: true })
  usuario: string; // ej: admin

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'enum', enum: RolUsuario, nullable: true })
  rol: RolUsuario;

  @Column({ type: 'enum', enum: EstadoUsuario, default: EstadoUsuario.ACTIVO })
  estado: EstadoUsuario;
}
