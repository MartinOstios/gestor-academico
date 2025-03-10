import { IsString, IsNotEmpty, Length, IsOptional, IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateHorarioDto } from './horario.dto';

export class CreateCursoDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre es requerido' })
    @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
    nombre: string;

    @IsString()
    @IsNotEmpty({ message: 'La descripción es requerida' })
    descripcion: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateHorarioDto)
    @ArrayMinSize(1, { message: 'Debe proporcionar al menos un horario' })
    horarios: CreateHorarioDto[];

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
    profesorId?: string;
}

export class AddPrerrequisitosDto {
    @IsArray()
    @IsNotEmpty({ message: 'Debe proporcionar al menos un código de prerrequisito' })
    codigosPrerrequisitos: string[];
} 