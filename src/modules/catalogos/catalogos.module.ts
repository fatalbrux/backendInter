import { Module } from '@nestjs/common';
import { TipoEquipoModule } from './tipo-equipo/tipo-equipo.module';
import { MarcaModule } from './marca/marca.module';

@Module({
  imports: [TipoEquipoModule, MarcaModule]
})
export class CatalogosModule {}
