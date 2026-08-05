import { IsString } from 'class-validator';

export class CreateCiudadDto {
  @IsString()
  nombre: string;
}
