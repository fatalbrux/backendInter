import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Instalacion } from './entities/instalacion.entity';
import { Equipo, EstadoEquipo } from '../equipo/entities/equipo.entity';
import { Cliente } from '../cliente/entities/cliente.entity';
import { CreateInstalacionDto } from './dto/create-instalacion.dto';
import { UpdateInstalacionDto } from './dto/update-instalacion.dto';

@Injectable()
export class InstalacionService {
  constructor(
    @InjectRepository(Instalacion)
    private readonly instalacionRepository: Repository<Instalacion>,
    @InjectRepository(Equipo)
    private readonly equipoRepository: Repository<Equipo>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

async create(createInstalacionDto: CreateInstalacionDto, tecnicoId: number) {
  const instalacion = this.instalacionRepository.create({
    fechaInstalacion: createInstalacionDto.fechaInstalacion,
    direccion: createInstalacionDto.direccion,
    observaciones: createInstalacionDto.observaciones,
    cliente: { id: createInstalacionDto.clienteId } as any,
    equipo: { id: createInstalacionDto.equipoId } as any,
    zona: createInstalacionDto.zonaId ? ({ id: createInstalacionDto.zonaId } as any) : null,
    tecnico: { id: tecnicoId } as any,
  });

  const instalacionGuardada = await this.instalacionRepository.save(instalacion);

  const cliente = await this.clienteRepository.findOne({
    where: { id: createInstalacionDto.clienteId },
  });
  const equipo = await this.equipoRepository.findOne({
    where: { id: createInstalacionDto.equipoId },
  });

  // 1. Marca el equipo como Instalado, lo asocia al cliente, y autocompleta
  //    pppoeUsuario con el usuario del cliente (solo si el equipo no tenía uno ya)
  await this.equipoRepository.update(createInstalacionDto.equipoId, {
    estado: EstadoEquipo.INSTALADO,
    cliente: { id: createInstalacionDto.clienteId } as any,
    ...((!equipo?.pppoeUsuario && cliente?.usuario)
      ? { pppoeUsuario: cliente.usuario }
      : {}),
  });

  // 2. Si es la primera instalación del cliente y no tiene fechaInstalacion,
  //    la completa automáticamente
  if (createInstalacionDto.fechaInstalacion) {
    if (cliente && !cliente.fechaInstalacion) {
      await this.clienteRepository.update(createInstalacionDto.clienteId, {
        fechaInstalacion: createInstalacionDto.fechaInstalacion,
      });
    }
  }

  return instalacionGuardada;
}

  findAll() {
    return this.instalacionRepository.find({
      relations: { cliente: true, equipo: true, zona: true, tecnico: true },
    });
  }

  async findOne(id: number) {
    const instalacion = await this.instalacionRepository.findOne({
      where: { id },
      relations: { cliente: true, equipo: true, zona: true, tecnico: true },
    });
    if (!instalacion) {
      throw new NotFoundException(`Instalación #${id} no encontrada`);
    }
    return instalacion;
  }

  async update(id: number, updateInstalacionDto: UpdateInstalacionDto) {
    const instalacion = await this.findOne(id);
    Object.assign(instalacion, {
      ...updateInstalacionDto,
      cliente: updateInstalacionDto.clienteId
        ? { id: updateInstalacionDto.clienteId }
        : instalacion.cliente,
      equipo: updateInstalacionDto.equipoId
        ? { id: updateInstalacionDto.equipoId }
        : instalacion.equipo,
    });
    return this.instalacionRepository.save(instalacion);
  }

  async remove(id: number) {
    const instalacion = await this.findOne(id);
    return this.instalacionRepository.remove(instalacion);
  }
}