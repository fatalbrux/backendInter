import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago } from './entities/pago.entity';
import { Cliente, EstadoCliente } from '../cliente/entities/cliente.entity';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';

@Injectable()
export class PagoService {
  constructor(
    @InjectRepository(Pago)
    private readonly pagoRepository: Repository<Pago>,
  @InjectRepository(Cliente)
  private readonly clienteRepository: Repository<Cliente>,

  ) {}

  async create(createPagoDto: CreatePagoDto) {
    const nroRecibo = createPagoDto.nroRecibo ?? (await this.generarNroRecibo());

    const pago = this.pagoRepository.create({
      ...createPagoDto,
      nroRecibo,
      cliente: { id: createPagoDto.clienteId } as any,
      usuario: createPagoDto.usuarioId ? ({ id: createPagoDto.usuarioId } as any) : null,
    });

    // TODO: aquí es donde se debería actualizar cliente.estado y
    // cliente.proximo_vencimiento (ClienteService), y opcionalmente
    // disparar la reactivación PPPoE en el router si el cliente tenía corte.
    const pagoGuardado = await this.pagoRepository.save(pago);

if (createPagoDto.nuevoVencimiento) {
  await this.clienteRepository.update(createPagoDto.clienteId, {
    proximoVencimiento: createPagoDto.nuevoVencimiento,
    estado: EstadoCliente.ACTIVO,
  });
}

return pagoGuardado;
  
  
  }

  findAll() {
    return this.pagoRepository.find({ relations: { cliente: true, usuario: true } });
  }

  async findOne(id: number) {
    const pago = await this.pagoRepository.findOne({
      where: { id },
      relations: { cliente: true, usuario: true },
    });
    if (!pago) {
      throw new NotFoundException(`Pago #${id} no encontrado`);
    }
    return pago;
  }

  async update(id: number, updatePagoDto: UpdatePagoDto) {
    const pago = await this.findOne(id);
    Object.assign(pago, updatePagoDto);
    return this.pagoRepository.save(pago);
  }

  async remove(id: number) {
    const pago = await this.findOne(id);
    return this.pagoRepository.remove(pago);
  }

  private async generarNroRecibo(): Promise<string> {
    const ultimo = await this.pagoRepository.count();
    return `REC-${String(ultimo + 1).padStart(4, '0')}`;
  }
}
