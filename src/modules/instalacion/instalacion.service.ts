import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Instalacion } from './entities/instalacion.entity';
import { CreateInstalacionDto } from './dto/create-instalacion.dto';
import { UpdateInstalacionDto } from './dto/update-instalacion.dto';

@Injectable()
export class InstalacionService {
  constructor(
    @InjectRepository(Instalacion)
    private readonly instalacionRepository: Repository<Instalacion>,
  ) {}

 create(createInstalacionDto: CreateInstalacionDto, tecnicoId: number) {
    const instalacion = this.instalacionRepository.create({
      fechaInstalacion: createInstalacionDto.fechaInstalacion,
      direccion: createInstalacionDto.direccion,
      observaciones: createInstalacionDto.observaciones,
      cliente: { id: createInstalacionDto.clienteId } as any,
      equipo: { id: createInstalacionDto.equipoId } as any,
      zona: createInstalacionDto.zonaId ? ({ id: createInstalacionDto.zonaId } as any) : null,
      tecnico: { id: tecnicoId } as any,
    });

    return this.instalacionRepository.save(instalacion);
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
