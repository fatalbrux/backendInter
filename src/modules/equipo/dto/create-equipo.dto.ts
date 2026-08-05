import {
  IsString,
  IsOptional,
  IsInt,
  IsEnum,
  IsMACAddress,
  IsIP,
  MaxLength,
} from 'class-validator';
import { EstadoEquipo } from '../entities/equipo.entity';

export class CreateEquipoDto {
  @IsString()
  @MaxLength(20)
  codigo: string;

  @IsOptional()
  @IsInt()
  tipoEquipoId?: number;

  @IsOptional()
  @IsInt()
  marcaId?: number;

  @IsOptional()
  @IsString()
  modelo?: string;

  @IsOptional()
  @IsString()
  nroSerie?: string;

  @IsOptional()
  @IsMACAddress()
  mac?: string;

  @IsOptional()
  @IsIP()
  ip?: string;

  @IsOptional()
  @IsString()
  pppoeUsuario?: string;

  @IsOptional()
  @IsString()
  pppoePassword?: string;

  @IsOptional()
  @IsEnum(EstadoEquipo)
  estado?: EstadoEquipo;

  @IsOptional()
  @IsInt()
  clienteId?: number;
}
