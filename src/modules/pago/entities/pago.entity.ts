import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Cliente } from '../../cliente/entities/cliente.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';

export enum BancoPago {
  UNION = 'Banco Unión',
  BNB = 'Banco BNB',
  PRODEM = 'Banco Prodem',
  TIGO_MONEY = 'Tigo Money',
}

export enum MetodoPago {
  EFECTIVO = 'Efectivo',
  CODIGO_QR = 'Código QR',
}

@Entity('pagos')
export class Pago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nro_recibo', unique: true })
  nroRecibo: string; // ej: REC-0521

  @ManyToOne(() => Cliente, { eager: true })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario | null; // quién registró el cobro

  @Column({ name: 'fecha_pago', type: 'date' })
  fechaPago: string;

  @Column({ name: 'meses_pagados', default: 1 })
  mesesPagados: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @Column({ name: 'metodo_pago', type: 'enum', enum: MetodoPago, nullable: true })
  metodoPago: MetodoPago;

  @Column({ name: 'vencimiento_anterior', type: 'date', nullable: true })
  vencimientoAnterior: string;

  @Column({ name: 'nuevo_vencimiento', type: 'date', nullable: true })
  nuevoVencimiento: string;

  @Column({ type: 'enum', enum: BancoPago, nullable: true })
  banco: BancoPago | null;

  @Column({ nullable: true })
  notas: string;

  @Column({ name: 'comprobante_url', type: 'varchar', nullable: true })
  comprobanteUrl: string | null;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;
}
