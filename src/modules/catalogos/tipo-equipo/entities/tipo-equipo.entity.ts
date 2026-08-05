import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tipos_equipo')
export class TipoEquipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string; // ej: Router, ONU, Antena

  @Column({ nullable: true })
  descripcion: string;
}
