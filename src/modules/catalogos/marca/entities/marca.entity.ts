import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('marcas')
export class Marca {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string; // ej: MikroTik, TP-Link, Ubiquiti
}
