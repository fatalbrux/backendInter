import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente, EstadoCliente } from '../cliente/entities/cliente.entity';
import { Pago } from '../pago/entities/pago.entity';
import { Equipo, EstadoEquipo } from '../equipo/entities/equipo.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Cliente) private readonly clienteRepo: Repository<Cliente>,
    @InjectRepository(Pago) private readonly pagoRepo: Repository<Pago>,
    @InjectRepository(Equipo) private readonly equipoRepo: Repository<Equipo>,
  ) {}

  async resumen() {
    const totalClientes = await this.clienteRepo.count();
    const clientesActivos = await this.clienteRepo.count({ where: { estado: EstadoCliente.ACTIVO } });
    const clientesSuspendidos = await this.clienteRepo.count({ where: { estado: EstadoCliente.SUSPENDIDO } });
    const clientesCorte = await this.clienteRepo.count({ where: { estado: EstadoCliente.CORTE } });

    const equiposInstalados = await this.equipoRepo.count({ where: { estado: EstadoEquipo.INSTALADO } });
    const equiposDisponibles = await this.equipoRepo.count({ where: { estado: EstadoEquipo.DISPONIBLE } });
    const equiposMantenimiento = await this.equipoRepo.count({ where: { estado: EstadoEquipo.EN_MANTENIMIENTO } });
    const equiposDanados = await this.equipoRepo.count({ where: { estado: EstadoEquipo.DANADO } });

    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const inicioAno = new Date(hoy.getFullYear(), 0, 1);

    const cobrosHoy = await this.pagoRepo
      .createQueryBuilder('p')
      .select('COALESCE(SUM(p.monto), 0)', 'total')
      .where('p.fecha_pago = CURRENT_DATE')
      .getRawOne();

    const ingresosMes = await this.pagoRepo
      .createQueryBuilder('p')
      .select('COALESCE(SUM(p.monto), 0)', 'total')
      .where('p.fecha_pago >= :inicio', { inicio: inicioMes })
      .getRawOne();

    const ingresosAno = await this.pagoRepo
      .createQueryBuilder('p')
      .select('COALESCE(SUM(p.monto), 0)', 'total')
      .where('p.fecha_pago >= :inicio', { inicio: inicioAno })
      .getRawOne();

    const clientesPorZona = await this.clienteRepo
      .createQueryBuilder('c')
      .leftJoin('c.zona', 'zona')
      .select('zona.nombre', 'zona')
      .addSelect('COUNT(c.id)', 'total')
      .groupBy('zona.nombre')
      .getRawMany();

    const ingresosMensuales = await this.pagoRepo
      .createQueryBuilder('p')
      .select(`TO_CHAR(p.fecha_pago, 'YYYY-MM')`, 'mes')
      .addSelect('SUM(p.monto)', 'total')
      .where('p.fecha_pago >= :inicio', { inicio: inicioAno })
      .groupBy('mes')
      .orderBy('mes', 'ASC')
      .getRawMany();

    const metodosPago = await this.pagoRepo
      .createQueryBuilder('p')
      .select('p.metodoPago', 'metodo')
      .addSelect('COUNT(p.id)', 'total')
      .groupBy('p.metodoPago')
      .getRawMany();

    return {
      totalClientes,
      clientesActivos,
      clientesSuspendidos,
      clientesCorte,
      equiposInstalados,
      equiposDisponibles,
      equiposMantenimiento,
      equiposDanados,
      cobrosHoy: Number(cobrosHoy.total),
      ingresosMes: Number(ingresosMes.total),
      ingresosAno: Number(ingresosAno.total),
      clientesPorZona,
      ingresosMensuales,
      metodosPago,
    };
  }

async proximosVencimientos() {
  const clientes = await this.clienteRepo.find({ relations: { zona: true, plan: true } });

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const enUnaSemana = new Date(hoy);
  enUnaSemana.setDate(hoy.getDate() + 7);

  return clientes
    .map((c) => ({ cliente: c, efectiva: this.fechaEfectivaVencimiento(c) }))
    .filter((x) => x.efectiva && x.efectiva >= hoy && x.efectiva <= enUnaSemana)
    .sort((a, b) => a.efectiva!.getTime() - b.efectiva!.getTime())
    .map((x) => ({
      id: x.cliente.id,
      codigo: x.cliente.codigo,
      nombres: x.cliente.nombres,
      apellidos: x.cliente.apellidos,
      zona: x.cliente.zona?.nombre ?? null,
      proximoVencimiento: x.efectiva,
      precioMensual: x.cliente.plan ? Number(x.cliente.plan.precioMensual) : 0,
    }));
}

async deudoresConCorte() {
  const clientes = await this.clienteRepo.find({ relations: { zona: true, plan: true } });

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const resultado: any[] = [];

  for (const c of clientes) {
    const efectiva = this.fechaEfectivaVencimiento(c);
    if (!efectiva || efectiva >= hoy) continue;

    let meses = (hoy.getFullYear() - efectiva.getFullYear()) * 12 + (hoy.getMonth() - efectiva.getMonth());
    if (hoy.getDate() < efectiva.getDate()) meses -= 1;
    meses = Math.max(meses, 1);

    if (meses < 3) continue;

    const precio = c.plan ? Number(c.plan.precioMensual) : 0;

    resultado.push({
      id: c.id,
      codigo: c.codigo,
      nombres: c.nombres,
      apellidos: c.apellidos,
      zona: c.zona?.nombre ?? null,
      mesesDeuda: meses,
      deudaTotal: precio * meses,
    });
  }

  return resultado.sort((a, b) => b.mesesDeuda - a.mesesDeuda);
}

 async morosos() {
  const clientes = await this.clienteRepo
    .createQueryBuilder('c')
    .leftJoinAndSelect('c.zona', 'zona')
    .leftJoinAndSelect('c.plan', 'plan')
    .getMany();

  const ids = clientes.map((c) => c.id);
  const ultimosPagos = ids.length
    ? await this.pagoRepo
        .createQueryBuilder('p')
        .select('p.cliente_id', 'clienteId')
        .addSelect('MAX(p.fecha_pago)', 'ultimoPago')
        .where('p.cliente_id IN (:...ids)', { ids })
        .groupBy('p.cliente_id')
        .getRawMany()
    : [];
  const mapaUltimoPago = new Map(ultimosPagos.map((p) => [p.clienteId, p.ultimoPago]));

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const resultado: any[] = [];

  for (const c of clientes) {
    const efectiva = this.fechaEfectivaVencimiento(c);
    if (!efectiva) continue; // sin ningún dato para calcular, se omite
    if (efectiva >= hoy) continue; // al día, no es moroso

    let meses = (hoy.getFullYear() - efectiva.getFullYear()) * 12 + (hoy.getMonth() - efectiva.getMonth());
    if (hoy.getDate() < efectiva.getDate()) meses -= 1;
    meses = Math.max(meses, 1);

    const precio = c.plan ? Number(c.plan.precioMensual) : 0;

    resultado.push({
      id: c.id,
      codigo: c.codigo,
      nombres: c.nombres,
      apellidos: c.apellidos,
      ci: c.ci,
      zona: c.zona?.nombre ?? null,
      precioMensual: precio,
      mesesDeuda: meses,
      deudaTotal: precio * meses,
      ultimoPago: mapaUltimoPago.get(c.id) ?? null,
      estado: c.estado,
    });
  }

  return resultado;
}

private fechaEfectivaVencimiento(c: Cliente): Date | null {
  if (c.proximoVencimiento) return new Date(c.proximoVencimiento);

  const base = c.fechaPrimerPago ?? c.fechaInstalacion;
  if (!base) return null;

  const fecha = new Date(base);
  fecha.setMonth(fecha.getMonth() + 1);
  return fecha;
}


@Cron(CronExpression.EVERY_DAY_AT_1AM)
async actualizarEstadosAutomaticos() {
  const clientes = await this.clienteRepo.find();
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  for (const c of clientes) {
    const efectiva = this.fechaEfectivaVencimiento(c);
    if (!efectiva) continue; // sin datos suficientes, no se toca

    let meses = 0;
    if (efectiva < hoy) {
      meses = (hoy.getFullYear() - efectiva.getFullYear()) * 12 + (hoy.getMonth() - efectiva.getMonth());
      if (hoy.getDate() < efectiva.getDate()) meses -= 1;
      meses = Math.max(meses, 1);
    }

    let nuevoEstado: EstadoCliente;
    if (meses <= 1) nuevoEstado = EstadoCliente.ACTIVO;
    else if (meses === 2) nuevoEstado = EstadoCliente.SUSPENDIDO;
    else nuevoEstado = EstadoCliente.CORTE;

    if (c.estado !== nuevoEstado) {
      await this.clienteRepo.update(c.id, { estado: nuevoEstado });
    }
  }
}


}