import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalleService } from './calle/calle.service';
import { CalleController } from './calle/calle.controller';
import { Calle } from './calle/entities/calle.entity';
import { CiudadService } from './ciudad/ciudad.service';
import { CiudadController } from './ciudad/ciudad.controller';
import { Ciudad } from './ciudad/entities/ciudad.entity';
import { ZonaService } from './zona/zona.service';
import { ZonaController } from './zona/zona.controller';
import { Zona } from './zona/entities/zona.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Calle, Ciudad, Zona])],
  controllers: [CalleController, CiudadController, ZonaController],
  providers: [CalleService, CiudadService, ZonaService],
  exports: [TypeOrmModule],
})
export class UbicacionesModule {}
