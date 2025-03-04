import { IsString, IsNotEmpty, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProfesorDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre es requerido' })
    nombre: string;

    @IsOptional()
    @Type(() => Date)
    fechaContratacion?: Date;

    @IsString()
    @IsOptional()
    departamentoCodigo?: string;
}

export class UpdateProfesorDto {
    @IsString()
    @IsOptional()
    nombre?: string;

    @IsOptional()
    @Type(() => Date)
    fechaContratacion?: Date;

    @IsString()
    @IsOptional()
    departamentoCodigo?: string;
} 