import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarcaService } from './marca/marca.service';
import { MarcaController } from './marca/marca.controller';
import { Marca } from './marca/entities/marca.entity';
import { TipoEquipoService } from './tipo-equipo/tipo-equipo.service';
import { TipoEquipoController } from './tipo-equipo/tipo-equipo.controller';
import { TipoEquipo } from './tipo-equipo/entities/tipo-equipo.entity';
import { PlanService } from './plan/plan.service';
import { PlanController } from './plan/plan.controller';
import { Plan } from './plan/entities/plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Marca, TipoEquipo, Plan])],
  controllers: [MarcaController, TipoEquipoController, PlanController],
  providers: [MarcaService, TipoEquipoService, PlanService],
  exports: [TypeOrmModule],
})
export class CatalogosModule {}
