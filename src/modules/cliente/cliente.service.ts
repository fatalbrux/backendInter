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
  const codigo = createClienteDto.codigo?.trim() || (await this.generarCodigoCliente());

  const existe = await this.clienteRepository.findOne({ where: { codigo } });
  if (existe) {
    throw new ConflictException(`Ya existe un cliente con el código ${codigo}`);
  }

  const cliente = this.clienteRepository.create({
    ...createClienteDto,
    codigo,
    nombres: createClienteDto.nombres?.toUpperCase(),
    apellidos: createClienteDto.apellidos?.toUpperCase(),
    usuario: createClienteDto.usuario ? createClienteDto.usuario.toLowerCase() : createClienteDto.usuario,
    zona: createClienteDto.zonaId ? ({ id: createClienteDto.zonaId } as any) : null,
    plan: createClienteDto.planId ? ({ id: createClienteDto.planId } as any) : null,
  });

  return this.clienteRepository.save(cliente);
}

private async generarCodigoCliente(): Promise<string> {
  // Busca el número más alto entre los códigos existentes con formato CLI-#### y le suma 1.
  // Uso MAX en vez de contar filas, para que no se repita un código aunque se hayan borrado clientes.
  const resultado = await this.clienteRepository
    .createQueryBuilder('c')
    .select(`MAX(CAST(SUBSTRING(c.codigo FROM 'CLI-([0-9]+)') AS INTEGER))`, 'maximo')
    .where(`c.codigo ~ '^CLI-[0-9]+$'`)
    .getRawOne();

  const siguiente = (resultado?.maximo ?? 0) + 1;
  return `CLI-${String(siguiente).padStart(4, '0')}`;
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
      ...(updateClienteDto.nombres !== undefined && { nombres: updateClienteDto.nombres.toUpperCase() }),
    ...(updateClienteDto.apellidos !== undefined && { apellidos: updateClienteDto.apellidos.toUpperCase() }),
    ...(updateClienteDto.usuario !== undefined && { usuario: updateClienteDto.usuario?.toLowerCase() }),
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
