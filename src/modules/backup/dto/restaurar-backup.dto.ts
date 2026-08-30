import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RestaurarBackupDto {
  @ApiProperty({
    description: 'Ruta completa del archivo de backup a restaurar',
  })
  @IsString()
  @IsNotEmpty()
  ruta: string;
}
