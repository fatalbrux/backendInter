import { IsInt, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateInstalacionDto {
  @IsInt()
  clienteId: number;

  @IsInt()
  equipoId: number;

  @IsOptional()
  @IsInt()
  zonaId?: number;

  @IsOptional()
  @IsInt()
  tecnicoId?: number;

  @IsOptional()
  @IsDateString()
  fechaInstalacion?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
