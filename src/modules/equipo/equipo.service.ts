import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipo } from './entities/equipo.entity';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';

@Injectable()
export class EquipoService {
  constructor(
    @InjectRepository(Equipo)
    private readonly equipoRepository: Repository<Equipo>,
  ) {}

 async create(createEquipoDto: CreateEquipoDto) {
  const codigo = createEquipoDto.codigo ?? (await this.generarCodigoEquipo());

  const equipo = this.equipoRepository.create({
    codigo,
    modelo: createEquipoDto.modelo,
    nroSerie: createEquipoDto.nroSerie,
    mac: createEquipoDto.mac,
    ip: createEquipoDto.ip,
    pppoeUsuario: createEquipoDto.pppoeUsuario,
    pppoePassword: createEquipoDto.pppoePassword,
    estado: createEquipoDto.estado,
    tipoEquipo: createEquipoDto.tipoEquipoId
      ? { id: createEquipoDto.tipoEquipoId }
      : null,
    marca: createEquipoDto.marcaId ? { id: createEquipoDto.marcaId } : null,
    cliente: createEquipoDto.clienteId
      ? { id: createEquipoDto.clienteId }
      : null,
  } as Partial<Equipo>);

  return this.equipoRepository.save(equipo);
}

async generarCodigoEquipo(): Promise<string> {
  const ultimo = await this.equipoRepository.count();
  return `EQ-${String(ultimo + 1).padStart(3, '0')}`;
}

  findAll() {
    return this.equipoRepository.find({
      relations: { tipoEquipo: true, marca: true, cliente: true },
    });
  }

  async findOne(id: number) {
    const equipo = await this.equipoRepository.findOne({
      where: { id },
      relations: { tipoEquipo: true, marca: true, cliente: true },
    });

    if (!equipo) {
      throw new NotFoundException(`Equipo #${id} no encontrado`);
    }

    return equipo;
  }

async update(id: number, updateEquipoDto: UpdateEquipoDto) {
  const equipo = await this.findOne(id);

  Object.assign(equipo, {
    ...updateEquipoDto,
    tipoEquipo: updateEquipoDto.tipoEquipoId
      ? { id: updateEquipoDto.tipoEquipoId }
      : equipo.tipoEquipo,
    marca: updateEquipoDto.marcaId ? { id: updateEquipoDto.marcaId } : equipo.marca,
    cliente:
      updateEquipoDto.clienteId === null
        ? null
        : updateEquipoDto.clienteId
        ? { id: updateEquipoDto.clienteId }
        : equipo.cliente,
  });

  return this.equipoRepository.save(equipo);
}

  async remove(id: number) {
    const equipo = await this.findOne(id);
    return this.equipoRepository.remove(equipo);
  }
}
