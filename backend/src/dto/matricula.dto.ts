import { IsString, IsNotEmpty, IsDate, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMatriculaDto {
    @Type(() => Date)
    @IsDate()
    @IsNotEmpty({ message: 'La fecha de inscripción es requerida' })
    fechaInscripcion: Date;

    @IsString()
    @IsNotEmpty({ message: 'El ID del estudiante es requerido' })
    estudianteId: string;

    @IsString()
    @IsNotEmpty({ message: 'El código del curso es requerido' })
    cursoCodigo: string;
}

export class UpdateMatriculaDto {
    @IsNumber()
    @IsOptional()
    @Min(0, { message: 'La calificación final no puede ser menor a 0' })
    @Max(5, { message: 'La calificación final no puede ser mayor a 5' })
    calificacionFinal?: number;
} 