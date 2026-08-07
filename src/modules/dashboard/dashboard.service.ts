import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente, EstadoCliente } from '../cliente/entities/cliente.entity';
import { Pago } from '../pago/entities/pago.entity';
import { Equipo, EstadoEquipo } from '../equipo/entities/equipo.entity';

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
    const hoy = new Date();
    const enUnaSemana = new Date(hoy);
    enUnaSemana.setDate(hoy.getDate() + 7);

    return this.clienteRepo
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.zona', 'zona')
      .leftJoinAndSelect('c.plan', 'plan')
      .where('c.proximoVencimiento BETWEEN :hoy AND :limite', {
        hoy: hoy.toISOString().slice(0, 10),
        limite: enUnaSemana.toISOString().slice(0, 10),
      })
      .orderBy('c.proximoVencimiento', 'ASC')
      .getMany();
  }

  async deudoresConCorte() {
    // clientes con estado Corte de servicio (3+ meses según tu regla de negocio)
    return this.clienteRepo
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.zona', 'zona')
      .where('c.estado = :estado', { estado: EstadoCliente.CORTE })
      .getMany();
  }

  async morosos() {
  const clientes = await this.clienteRepo
    .createQueryBuilder('c')
    .leftJoinAndSelect('c.zona', 'zona')
    .leftJoinAndSelect('c.plan', 'plan')
    .where('c.proximoVencimiento IS NOT NULL')
    .andWhere('c.proximoVencimiento < CURRENT_DATE')
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

  return clientes.map((c) => {
    const venc = new Date(c.proximoVencimiento);
    let meses = (hoy.getFullYear() - venc.getFullYear()) * 12 + (hoy.getMonth() - venc.getMonth());
    if (hoy.getDate() < venc.getDate()) meses -= 1;
    meses = Math.max(meses, 1);

    const precio = c.plan ? Number(c.plan.precioMensual) : 0;

    return {
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
    };
  });
}


}