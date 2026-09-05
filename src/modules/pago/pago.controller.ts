import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import * as path from 'path';
import type { Response } from 'express';
import { PagoService } from './pago.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('pago')
export class PagoController {
  constructor(private readonly pagoService: PagoService) {}

  @Post()
  create(@Body() createPagoDto: CreatePagoDto, @Req() req) {
    return this.pagoService.create(createPagoDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.pagoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePagoDto: UpdatePagoDto) {
    return this.pagoService.update(+id, updatePagoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pagoService.remove(+id);
  }

  /**
   * Sube la imagen del comprobante (foto de WhatsApp, captura, etc.) y la
   * asocia al pago indicado. Se llama DESPUÉS de crear el pago, una vez que
   * ya tienes el id (createPagoDto no lleva la imagen).
   */
  @Post(':id/comprobante')
  @UseInterceptors(FileInterceptor('archivo', { storage: memoryStorage() }))
  async subirComprobante(
    @Param('id') id: string,
    @UploadedFile() archivo: Express.Multer.File,
  ) {
    if (!archivo) {
      throw new BadRequestException('Debes subir una imagen de comprobante');
    }
    const extension = path.extname(archivo.originalname) || '.jpg';
    const pago = await this.pagoService.guardarComprobante(+id, archivo.buffer, extension);
    return { mensaje: 'Comprobante guardado correctamente', comprobanteUrl: pago.comprobanteUrl };
  }

  /**
   * Devuelve la imagen del comprobante. Como este controller tiene
   * @UseGuards(JwtAuthGuard) a nivel de clase, esta ruta también exige el
   * token — un <img src="..."> normal del navegador NO lo manda, así que
   * en el frontend hay que pedir esta imagen con HttpClient (blob), no con
   * una URL directa en el <img>.
   */
  @Get(':id/comprobante')
  async verComprobante(@Param('id') id: string, @Res() res: Response) {
    const pago = await this.pagoService.findOne(+id);
    if (!pago.comprobanteUrl) {
      throw new NotFoundException('Este pago no tiene comprobante registrado');
    }
    const ruta = this.pagoService.obtenerRutaComprobante(pago.comprobanteUrl);
    res.sendFile(ruta);
  }
}