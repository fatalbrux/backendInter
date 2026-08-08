import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
    }),
    UbicacionesModule,
    CatalogosModule,
    ClienteModule,
    EquipoModule,
    InstalacionModule,
    PagoModule,
    UsuarioModule,
    DashboardModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}