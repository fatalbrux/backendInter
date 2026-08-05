import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { EstadoPlan } from '../entities/plan.entity';

export class CreatePlanDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  anchoBanda?: string;

  @IsNumber()
  precioMensual: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsEnum(EstadoPlan)
  estado?: EstadoPlan;
}
