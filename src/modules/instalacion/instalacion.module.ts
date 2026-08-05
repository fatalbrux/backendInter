import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstalacionService } from './instalacion.service';
import { InstalacionController } from './instalacion.controller';
import { Instalacion } from './entities/instalacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Instalacion])],
  controllers: [InstalacionController],
  providers: [InstalacionService],
  exports: [TypeOrmModule],
})
export class InstalacionModule {}
