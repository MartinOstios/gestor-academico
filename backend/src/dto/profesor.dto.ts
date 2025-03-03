import { IsString, IsNotEmpty, Length, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProfesorDto {
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
    @IsNotEmpty({ message: 'La fecha de contratación es requerida' })
    fechaContratacion: Date;

    @IsString()
    @IsNotEmpty({ message: 'El código del departamento es requerido' })
    departamentoCodigo: string;
}

export class UpdateProfesorDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre es requerido' })
    @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
    nombre: string;

    @Type(() => Date)
    @IsDate()
    @IsOptional()
    fechaContratacion?: Date;

    @IsString()
    @IsOptional()
    departamentoCodigo?: string;
} 