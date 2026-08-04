import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InstalacionService } from './instalacion.service';
import { CreateInstalacionDto } from './dto/create-instalacion.dto';
import { UpdateInstalacionDto } from './dto/update-instalacion.dto';

@Controller('instalacion')
export class InstalacionController {
  constructor(private readonly instalacionService: InstalacionService) {}

  @Post()
  create(@Body() createInstalacionDto: CreateInstalacionDto) {
    return this.instalacionService.create(createInstalacionDto);
  }

  @Get()
  findAll() {
    return this.instalacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.instalacionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInstalacionDto: UpdateInstalacionDto) {
    return this.instalacionService.update(+id, updateInstalacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.instalacionService.remove(+id);
  }
}
