import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('resumen')
  resumen() {
    return this.dashboardService.resumen();
  }

  @Get('proximos-vencimientos')
  proximosVencimientos() {
    return this.dashboardService.proximosVencimientos();
  }

  @Get('deudores-corte')
  deudoresConCorte() {
    return this.dashboardService.deudoresConCorte();
  }

  @Get('morosos')
    morosos() {
    return this.dashboardService.morosos();
    }

    @Get('actualizar-estados-manual')
actualizarManual() {
  return this.dashboardService.actualizarEstadosAutomaticos();
}
}