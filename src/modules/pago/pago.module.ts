import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagoService } from './pago.service';
import { PagoController } from './pago.controller';
import { Pago } from './entities/pago.entity';
import { Cliente } from '../cliente/entities/cliente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pago, Cliente])],
  controllers: [PagoController],
  providers: [PagoService],
  exports: [TypeOrmModule],
})
export class PagoModule {}
