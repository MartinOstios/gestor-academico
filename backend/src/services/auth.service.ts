import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { LoginDto, RegisterDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
        private jwtService: JwtService
    ) {}

    async register(registerDto: RegisterDto) {
        const usuarioExistente = await this.usuarioRepository.findOne({
            where: { username: registerDto.username }
        });

        if (usuarioExistente) {
            throw new UnauthorizedException('El nombre de usuario ya existe');
        }

        // Asignar siempre el rol de administrador
        registerDto.rol = 'ADMIN';

        // Generar ID incremental si se recibe 'AUTO'
        if (registerDto.referenciaId === 'AUTO') {
            // Buscar el último usuario para obtener el ID más alto
            const ultimoUsuario = await this.usuarioRepository
                .createQueryBuilder('usuario')
                .orderBy('CAST(usuario.referenciaId AS INTEGER)', 'DESC')
                .getOne();

            // Iniciar en 1 o incrementar el último ID
            let nuevoId = 1;
            if (ultimoUsuario && !isNaN(parseInt(ultimoUsuario.referenciaId))) {
                nuevoId = parseInt(ultimoUsuario.referenciaId) + 1;
            }
            
            registerDto.referenciaId = nuevoId.toString();
        }

        const usuario = this.usuarioRepository.create(registerDto);
        await this.usuarioRepository.save(usuario);

        const payload = { username: usuario.username, sub: usuario.username, rol: usuario.rol };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async login(loginDto: LoginDto) {
        const usuario = await this.usuarioRepository.findOne({
            where: { username: loginDto.username }
        });

        if (!usuario || !(await usuario.validatePassword(loginDto.password))) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const payload = { username: usuario.username, sub: usuario.username, rol: usuario.rol };
        return {
            token: this.jwtService.sign(payload),
            user: {
                id: usuario.username,
                username: usuario.username,
                rol: usuario.rol,
                referenciaId: usuario.referenciaId
            }
        };
    }
} 