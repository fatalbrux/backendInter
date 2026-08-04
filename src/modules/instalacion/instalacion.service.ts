import { Injectable } from '@nestjs/common';
import { CreateInstalacionDto } from './dto/create-instalacion.dto';
import { UpdateInstalacionDto } from './dto/update-instalacion.dto';

@Injectable()
export class InstalacionService {
  create(createInstalacionDto: CreateInstalacionDto) {
    return 'This action adds a new instalacion';
  }

  findAll() {
    return `This action returns all instalacion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} instalacion`;
  }

  update(id: number, updateInstalacionDto: UpdateInstalacionDto) {
    return `This action updates a #${id} instalacion`;
  }

  remove(id: number) {
    return `This action removes a #${id} instalacion`;
  }
}
