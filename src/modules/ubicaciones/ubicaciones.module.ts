import { Module } from '@nestjs/common';
import { CiudadModule } from './ciudad/ciudad.module';
import { CalleModule } from './calle/calle.module';
import { ZonaModule } from './zona/zona.module';

@Module({
  imports: [CiudadModule, ZonaModule, CalleModule]
})
export class UbicacionesModule {}
