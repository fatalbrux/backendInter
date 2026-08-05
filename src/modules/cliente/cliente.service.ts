import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async create(createClienteDto: CreateClienteDto) {
    const existe = await this.clienteRepository.findOne({
      where: { codigo: createClienteDto.codigo },
    });
    if (existe) {
      throw new ConflictException(
        `Ya existe un cliente con el código ${createClienteDto.codigo}`,
      );
    }

    const cliente = this.clienteRepository.create({
      ...createClienteDto,
      zona: createClienteDto.zonaId ? ({ id: createClienteDto.zonaId } as any) : null,
      plan: createClienteDto.planId ? ({ id: createClienteDto.planId } as any) : null,
    });

    return this.clienteRepository.save(cliente);
  }

  findAll() {
    return this.clienteRepository.find({ relations: { zona: true, plan: true } });
  }

  async findOne(id: number) {
    const cliente = await this.clienteRepository.findOne({
      where: { id },
      relations: { zona: true, plan: true },
    });
    if (!cliente) {
      throw new NotFoundException(`Cliente #${id} no encontrado`);
    }
    return cliente;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    const cliente = await this.findOne(id);
    Object.assign(cliente, {
      ...updateClienteDto,
      zona: updateClienteDto.zonaId ? { id: updateClienteDto.zonaId } : cliente.zona,
      plan: updateClienteDto.planId ? { id: updateClienteDto.planId } : cliente.plan,
    });
    return this.clienteRepository.save(cliente);
  }

  async remove(id: number) {
    const cliente = await this.findOne(id);
    return this.clienteRepository.remove(cliente);
  }
}
