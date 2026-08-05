import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ciudad } from './entities/ciudad.entity';
import { CreateCiudadDto } from './dto/create-ciudad.dto';
import { UpdateCiudadDto } from './dto/update-ciudad.dto';

@Injectable()
export class CiudadService {
  constructor(
    @InjectRepository(Ciudad)
    private readonly ciudadRepository: Repository<Ciudad>,
  ) {}

  create(createCiudadDto: CreateCiudadDto) {
    const ciudad = this.ciudadRepository.create(createCiudadDto);
    return this.ciudadRepository.save(ciudad);
  }

  findAll() {
    return this.ciudadRepository.find();
  }

  async findOne(id: number) {
    const ciudad = await this.ciudadRepository.findOne({ where: { id } });
    if (!ciudad) {
      throw new NotFoundException(`Ciudad #${id} no encontrada`);
    }
    return ciudad;
  }

  async update(id: number, updateCiudadDto: UpdateCiudadDto) {
    const ciudad = await this.findOne(id);
    Object.assign(ciudad, updateCiudadDto);
    return this.ciudadRepository.save(ciudad);
  }

  async remove(id: number) {
    const ciudad = await this.findOne(id);
    return this.ciudadRepository.remove(ciudad);
  }
}
