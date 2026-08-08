import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const existe = await this.usuarioRepository.findOne({
      where: { usuario: createUsuarioDto.usuario },
    });
    if (existe) {
      throw new ConflictException('El nombre de usuario ya existe');
    }

    const password = await bcrypt.hash(createUsuarioDto.password, 10);

    const usuario = this.usuarioRepository.create({
      nombreCompleto: createUsuarioDto.nombreCompleto,
      usuario: createUsuarioDto.usuario,
      password,
      email: createUsuarioDto.email,
      rol: createUsuarioDto.rol,
      estado: createUsuarioDto.estado,
    });

    return this.usuarioRepository.save(usuario);
  }

  findAll() {
    return this.usuarioRepository.find();
  }

  async findOne(id: number) {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario #${id} no encontrado`);
    }
    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.findOne(id);
    Object.assign(usuario, updateUsuarioDto);
    return this.usuarioRepository.save(usuario);
  }

  async remove(id: number) {
    const usuario = await this.findOne(id);
    return this.usuarioRepository.remove(usuario);
  }

  //para el login, busqueda por email
  async findOneByEmail(email: string) {
  const usuario = await this.usuarioRepository
    .createQueryBuilder('usuario')
    .addSelect('usuario.password')
    .where('usuario.email = :email', { email })
    .getOne();

  if (!usuario) {
    throw new NotFoundException(`Usuario con email ${email} no encontrado`);
  }
  return usuario;
}

}
