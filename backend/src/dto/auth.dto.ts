import { IsString, IsNotEmpty, Length, IsIn, IsOptional } from 'class-validator';

export class LoginDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre de usuario es requerido' })
    username: string;

    @IsString()
    @IsNotEmpty({ message: 'La contraseña es requerida' })
    password: string;
}

export class RegisterDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre de usuario es requerido' })
    @Length(4, 20, { message: 'El nombre de usuario debe tener entre 4 y 20 caracteres' })
    username: string;

    @IsString()
    @IsNotEmpty({ message: 'La contraseña es requerida' })
    @Length(6, 20, { message: 'La contraseña debe tener entre 6 y 20 caracteres' })
    password: string;

    @IsString()
    @IsOptional()
    rol: string;

    @IsString()
    @IsOptional()
    referenciaId: string;
} 