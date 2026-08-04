import { Module } from '@nestjs/common';
import { InstalacionService } from './instalacion.service';
import { InstalacionController } from './instalacion.controller';

@Module({
  controllers: [InstalacionController],
  providers: [InstalacionService],
})
export class InstalacionModule {}
