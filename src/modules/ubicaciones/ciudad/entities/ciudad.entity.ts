import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('ciudades')
export class Ciudad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string; // ej: Oruro, La Paz, Cochabamba

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;
}
