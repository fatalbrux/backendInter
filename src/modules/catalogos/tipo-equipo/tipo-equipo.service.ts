import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoEquipo } from './entities/tipo-equipo.entity';
import { CreateTipoEquipoDto } from './dto/create-tipo-equipo.dto';
import { UpdateTipoEquipoDto } from './dto/update-tipo-equipo.dto';

@Injectable()
export class TipoEquipoService {
  constructor(
    @InjectRepository(TipoEquipo)
    private readonly tipoEquipoRepository: Repository<TipoEquipo>,
  ) {}

  create(createTipoEquipoDto: CreateTipoEquipoDto) {
    const tipoEquipo = this.tipoEquipoRepository.create(createTipoEquipoDto);
    return this.tipoEquipoRepository.save(tipoEquipo);
  }

  findAll() {
    return this.tipoEquipoRepository.find();
  }

  async findOne(id: number) {
    const tipoEquipo = await this.tipoEquipoRepository.findOne({ where: { id } });
    if (!tipoEquipo) {
      throw new NotFoundException(`Tipo de equipo #${id} no encontrado`);
    }
    return tipoEquipo;
  }

  async update(id: number, updateTipoEquipoDto: UpdateTipoEquipoDto) {
    const tipoEquipo = await this.findOne(id);
    Object.assign(tipoEquipo, updateTipoEquipoDto);
    return this.tipoEquipoRepository.save(tipoEquipo);
  }

  async remove(id: number) {
    const tipoEquipo = await this.findOne(id);
    return this.tipoEquipoRepository.remove(tipoEquipo);
  }
}
