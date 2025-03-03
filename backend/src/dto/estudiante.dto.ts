import { IsString, IsNotEmpty, Length, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEstudianteDto {
    @IsString()
    @IsNotEmpty({ message: 'El ID es requerido' })
    @Length(5, 20, { message: 'El ID debe tener entre 5 y 20 caracteres' })
    id: string;

    @IsString()
    @IsNotEmpty({ message: 'El nombre es requerido' })
    @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
    nombre: string;

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty({ message: 'La fecha de nacimiento es requerida' })
    fechaNacimiento: Date;
}

export class UpdateEstudianteDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre es requerido' })
    @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
    nombre: string;

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty({ message: 'La fecha de nacimiento es requerida' })
    fechaNacimiento: Date;
} 