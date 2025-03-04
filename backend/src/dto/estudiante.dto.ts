import { IsString, IsNotEmpty, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEstudianteDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre es requerido' })
    nombre: string;

    @IsOptional()
    @Type(() => Date)
    fechaNacimiento?: Date;
}

export class UpdateEstudianteDto {
    @IsString()
    @IsOptional()
    nombre?: string;

    @IsOptional()
    @Type(() => Date)
    fechaNacimiento?: Date;
} 