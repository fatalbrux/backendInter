import {
  IsString,
  IsOptional,
  IsInt,
  IsEmail,
  IsEnum,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { EstadoCliente } from '../entities/cliente.entity';

export class CreateClienteDto {
  @IsString()
  codigo: string;

  @IsString()
  nombres: string;

  @IsString()
  apellidos: string;

  @IsOptional()
  @IsString()
  ci?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  usuario?: string;

  @IsOptional()
  @IsInt()
  zonaId?: number;

  @IsOptional()
  @IsInt()
  planId?: number;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  referencia?: string;

  @IsOptional()
  @IsDateString()
  fechaInstalacion?: string;

  @IsOptional()
  @IsDateString()
  fechaPrimerPago?: string;

  @IsOptional()
  @IsEnum(EstadoCliente)
  estado?: EstadoCliente;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @IsNumber()
  latitud?: number;

  @IsOptional()
  @IsNumber()
  longitud?: number;
}
