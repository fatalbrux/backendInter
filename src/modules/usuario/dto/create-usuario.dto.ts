import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  MinLength,
} from 'class-validator';
import { RolUsuario, EstadoUsuario } from '../entities/usuario.entity';

export class CreateUsuarioDto {
  @IsOptional()
  @IsString()
  nombreCompleto?: string;

  @IsString()
  usuario: string;

  @IsString()
  @MinLength(6)
  password: string; // se hashea en el service antes de guardar

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(RolUsuario)
  rol?: RolUsuario;

  @IsOptional()
  @IsEnum(EstadoUsuario)
  estado?: EstadoUsuario;
}
