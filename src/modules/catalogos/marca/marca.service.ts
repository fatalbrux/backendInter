import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Marca } from './entities/marca.entity';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';

@Injectable()
export class MarcaService {
  constructor(
    @InjectRepository(Marca)
    private readonly marcaRepository: Repository<Marca>,
  ) {}

  create(createMarcaDto: CreateMarcaDto) {
    const marca = this.marcaRepository.create(createMarcaDto);
    return this.marcaRepository.save(marca);
  }

  findAll() {
    return this.marcaRepository.find();
  }

  async findOne(id: number) {
    const marca = await this.marcaRepository.findOne({ where: { id } });
    if (!marca) {
      throw new NotFoundException(`Marca #${id} no encontrada`);
    }
    return marca;
  }

  async update(id: number, updateMarcaDto: UpdateMarcaDto) {
    const marca = await this.findOne(id);
    Object.assign(marca, updateMarcaDto);
    return this.marcaRepository.save(marca);
  }

  async remove(id: number) {
    const marca = await this.findOne(id);
    return this.marcaRepository.remove(marca);
  }
}
