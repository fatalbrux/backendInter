import { Injectable } from '@nestjs/common';
import { CreateTipoEquipoDto } from './dto/create-tipo-equipo.dto';
import { UpdateTipoEquipoDto } from './dto/update-tipo-equipo.dto';

@Injectable()
export class TipoEquipoService {
  create(createTipoEquipoDto: CreateTipoEquipoDto) {
    return 'This action adds a new tipoEquipo';
  }

  findAll() {
    return `This action returns all tipoEquipo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tipoEquipo`;
  }

  update(id: number, updateTipoEquipoDto: UpdateTipoEquipoDto) {
    return `This action updates a #${id} tipoEquipo`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipoEquipo`;
  }
}
