import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'tu_clave_secreta', // Deberías mover esto a variables de entorno
        });
    }

    async validate(payload: any) {
        return { 
            username: payload.username,
            rol: payload.rol
        };
    }
} 