import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Zona } from './entities/zona.entity';
import { CreateZonaDto } from './dto/create-zona.dto';
import { UpdateZonaDto } from './dto/update-zona.dto';

@Injectable()
export class ZonaService {
  constructor(
    @InjectRepository(Zona)
    private readonly zonaRepository: Repository<Zona>,
  ) {}

  create(createZonaDto: CreateZonaDto) {
    const zona = this.zonaRepository.create({
      nombre: createZonaDto.nombre,
      estado: createZonaDto.estado,
      ciudad: { id: createZonaDto.ciudadId } as any,
    });
    return this.zonaRepository.save(zona);
  }

  findAll() {
    return this.zonaRepository.find({ relations: { ciudad: true } });
  }

  async findOne(id: number) {
    const zona = await this.zonaRepository.findOne({
      where: { id },
      relations: { ciudad: true },
    });
    if (!zona) {
      throw new NotFoundException(`Zona #${id} no encontrada`);
    }
    return zona;
  }

  async update(id: number, updateZonaDto: UpdateZonaDto) {
    const zona = await this.findOne(id);
    Object.assign(zona, {
      ...updateZonaDto,
      ciudad: updateZonaDto.ciudadId ? { id: updateZonaDto.ciudadId } : zona.ciudad,
    });
    return this.zonaRepository.save(zona);
  }

  async remove(id: number) {
    const zona = await this.findOne(id);
    return this.zonaRepository.remove(zona);
  }
}
