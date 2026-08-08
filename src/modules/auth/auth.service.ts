import { HttpException, Injectable } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usuarioService: UsuarioService, 
        private jwtService: JwtService){}


    async login(credenciales: LoginAuthDto){
        const { email, password } = credenciales;

        //buscar usuario por email
        const usuario = await this.usuarioService.findOneByEmail(email);

        if(!usuario){
            throw new HttpException("Usuario no encontrado",404);
        }

        //verificar contraseña
        const verificarPass = await compare(password, usuario.password);
        if(!verificarPass){
                throw new HttpException('contraseña incorrecta',401);
        }

        //generar JWT

        const payload = {email: email, id:usuario.id};
        const token = await this.jwtService.sign(payload);

        const { password: _, ...usuarioSinPassword } = usuario;
        return { access_token: token, usuario: usuarioSinPassword };
    }

}
