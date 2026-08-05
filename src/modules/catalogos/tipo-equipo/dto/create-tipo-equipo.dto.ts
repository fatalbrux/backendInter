import { IsString, IsOptional } from 'class-validator';

export class CreateTipoEquipoDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
