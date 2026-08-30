import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsIn } from 'class-validator';

export class ConfiguracionBackupDto {
  @ApiProperty({ enum: ['diario', 'semanal', 'mensual'] })
  @IsIn(['diario', 'semanal', 'mensual'])
  frecuencia: 'diario' | 'semanal' | 'mensual';

  @ApiProperty()
  @IsBoolean()
  activado: boolean;
}