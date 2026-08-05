import { IsString, IsInt, IsOptional, IsEnum } from 'class-validator';
import { EstadoZona } from '../entities/zona.entity';

export class CreateZonaDto {
  @IsInt()
  ciudadId: number;

  @IsString()
  nombre: string;

  @IsOptional()
  @IsEnum(EstadoZona)
  estado?: EstadoZona;
}
