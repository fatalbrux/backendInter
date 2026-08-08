import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstalacionService } from './instalacion.service';
import { InstalacionController } from './instalacion.controller';
import { Instalacion } from './entities/instalacion.entity';
import { Equipo } from '../equipo/entities/equipo.entity';
import { Cliente } from '../cliente/entities/cliente.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Instalacion, Equipo, Cliente])],
  controllers: [InstalacionController],
  providers: [InstalacionService],
  exports: [TypeOrmModule],
})
export class InstalacionModule {}
