import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UbicacionesModule } from './modules/ubicaciones/ubicaciones.module';
import { CatalogosModule } from './modules/catalogos/catalogos.module';
import { ClienteModule } from './modules/cliente/cliente.module';
import { EquipoModule } from './modules/equipo/equipo.module';
import { InstalacionModule } from './modules/instalacion/instalacion.module';
import { PagoModule } from './modules/pago/pago.module';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot(),
    ScheduleModule.forRoot(), TypeOrmModule.forRoot({type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgresql',
  database: 'bd_internet',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false, }), 
  UbicacionesModule, CatalogosModule, ClienteModule, EquipoModule, InstalacionModule, PagoModule, UsuarioModule, DashboardModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
