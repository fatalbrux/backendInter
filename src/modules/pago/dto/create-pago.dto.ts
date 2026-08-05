import {
  IsInt,
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { MetodoPago } from '../entities/pago.entity';

export class CreatePagoDto {
  @IsOptional()
  @IsString()
  nroRecibo?: string;

  @IsInt()
  clienteId: number;

  @IsOptional()
  @IsInt()
  usuarioId?: number;

  @IsDateString()
  fechaPago: string;

  @IsOptional()
  @IsInt()
  mesesPagados?: number;

  @IsNumber()
  monto: number;

  @IsOptional()
  @IsEnum(MetodoPago)
  metodoPago?: MetodoPago;

  @IsOptional()
  @IsDateString()
  vencimientoAnterior?: string;

  @IsOptional()
  @IsDateString()
  nuevoVencimiento?: string;

  @IsOptional()
  @IsString()
  notas?: string;
}
