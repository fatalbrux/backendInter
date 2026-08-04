import { Module } from '@nestjs/common';
import { TipoEquipoService } from './tipo-equipo.service';
import { TipoEquipoController } from './tipo-equipo.controller';

@Module({
  controllers: [TipoEquipoController],
  providers: [TipoEquipoService],
})
export class TipoEquipoModule {}
