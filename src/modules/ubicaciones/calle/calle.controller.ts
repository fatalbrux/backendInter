import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CalleService } from './calle.service';
import { CreateCalleDto } from './dto/create-calle.dto';
import { UpdateCalleDto } from './dto/update-calle.dto';

@Controller('calle')
export class CalleController {
  constructor(private readonly calleService: CalleService) {}

  @Post()
  create(@Body() createCalleDto: CreateCalleDto) {
    return this.calleService.create(createCalleDto);
  }

  @Get()
  findAll() {
    return this.calleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.calleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCalleDto: UpdateCalleDto) {
    return this.calleService.update(+id, updateCalleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.calleService.remove(+id);
  }
}
