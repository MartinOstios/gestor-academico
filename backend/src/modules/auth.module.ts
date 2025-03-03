import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { Usuario } from '../entities/usuario.entity';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
    imports: [
        TypeOrmModule.forFeature([Usuario]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'tu_clave_secreta',
            signOptions: { expiresIn: '24h' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {} 