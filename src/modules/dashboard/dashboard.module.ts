import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Cliente } from '../cliente/entities/cliente.entity';
import { Pago } from '../pago/entities/pago.entity';
import { Equipo } from '../equipo/entities/equipo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente, Pago, Equipo])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}