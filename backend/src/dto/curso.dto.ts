import { IsString, IsNotEmpty, Length, IsOptional, IsArray } from 'class-validator';

export class CreateCursoDto {
    @IsString()
    @IsNotEmpty({ message: 'El código es requerido' })
    @Length(3, 10, { message: 'El código debe tener entre 3 y 10 caracteres' })
    codigo: string;

    @IsString()
    @IsNotEmpty({ message: 'El nombre es requerido' })
    @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
    nombre: string;

    @IsString()
    @IsNotEmpty({ message: 'La descripción es requerida' })
    descripcion: string;

    @IsString()
    @IsNotEmpty({ message: 'El horario es requerido' })
    horario: string;

    @IsString()
    @IsNotEmpty({ message: 'El ID del profesor es requerido' })
    profesorId: string;

    @IsArray()
    @IsOptional()
    prerrequisitoCodigos?: string[];
}

export class UpdateCursoDto {
    @IsString()
    @IsOptional()
    @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
    nombre?: string;

    @IsString()
    @IsOptional()
    descripcion?: string;

    @IsString()
    @IsOptional()
    horario?: string;

    @IsString()
    @IsOptional()
    profesorId?: string;
}

export class AddPrerrequisitosDto {
    @IsArray()
    @IsNotEmpty({ message: 'Debe proporcionar al menos un código de prerrequisito' })
    codigosPrerrequisitos: string[];
} 