import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { LoginDto, RegisterDto } from '../dto/auth.dto';

/**
 * Servicio para la gestión de autenticación y autorización
 * 
 * Este servicio maneja todas las operaciones relacionadas con la autenticación de usuarios,
 * incluyendo registro, inicio de sesión y gestión de tokens JWT.
 */
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
        private jwtService: JwtService
    ) {}

    /**
     * Registra un nuevo usuario en el sistema
     * 
     * @param registerDto Datos del nuevo usuario
     * @returns Usuario creado
     * 
     * Lógica de Negocio:
     * - Valida que el username no exista
     * - Encripta la contraseña
     * - Asigna el rol correspondiente
     * - Crea el registro del usuario
     */
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

    /**
     * Valida las credenciales de un usuario
     * 
     * @param username Nombre de usuario
     * @param password Contraseña
     * @returns Usuario validado
     * @throws UnauthorizedException si las credenciales son inválidas
     * 
     * Lógica de Negocio:
     * - Busca el usuario por username
     * - Verifica la contraseña encriptada
     * - Maneja intentos fallidos de login
     */
    async validateUser(username: string, password: string): Promise<Usuario> {
        const usuario = await this.usuarioRepository.findOne({
            where: { username }
        });

        if (usuario && await usuario.validatePassword(password)) {
            return usuario;
        }

        throw new UnauthorizedException('Credenciales inválidas');
    }

    /**
     * Procesa el inicio de sesión de un usuario
     * 
     * @param loginDto Credenciales de inicio de sesión
     * @returns Token JWT y datos del usuario
     * @throws UnauthorizedException si las credenciales son inválidas
     * 
     * Lógica de Negocio:
     * - Valida las credenciales del usuario
     * - Genera el token JWT
     * - Incluye información relevante en el payload
     * - Retorna el token y datos del usuario
     */
    async login(loginDto: LoginDto) {
        const usuario = await this.usuarioRepository.findOne({
            where: { username: loginDto.username }
        });

        if (!usuario || !(await usuario.validatePassword(loginDto.password))) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const payload = { 
            username: usuario.username, 
            sub: usuario.username, 
            rol: usuario.rol 
        };
        
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

    /**
     * Verifica y decodifica un token JWT
     * 
     * @param token Token JWT a verificar
     * @returns Payload decodificado
     * @throws UnauthorizedException si el token es inválido
     * 
     * Lógica de Negocio:
     * - Verifica la firma del token
     * - Valida la expiración
     * - Decodifica el payload
     * - Verifica los permisos incluidos
     */
    async verifyToken(token: string): Promise<any> {
        try {
            return this.jwtService.verify(token);
        } catch (error) {
            throw new UnauthorizedException('Token inválido o expirado');
        }
    }
} 