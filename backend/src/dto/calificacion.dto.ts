import { IsNumber, IsNotEmpty, Min, Max, IsString } from 'class-validator';

export class CreateCalificacionDto {
    @IsNumber()
    @IsNotEmpty({ message: 'El valor de la calificación es requerido' })
    @Min(0, { message: 'La calificación no puede ser menor a 0' })
    @Max(5, { message: 'La calificación no puede ser mayor a 5' })
    valor: number;

    @IsString()
    @IsNotEmpty({ message: 'El ID del estudiante es requerido' })
    estudianteId: string;

    @IsString()
    @IsNotEmpty({ message: 'El ID de la evaluación es requerido' })
    evaluacionId: string;
}

export class UpdateCalificacionDto {
    @IsNumber()
    @IsNotEmpty({ message: 'El valor de la calificación es requerido' })
    @Min(0, { message: 'La calificación no puede ser menor a 0' })
    @Max(5, { message: 'La calificación no puede ser mayor a 5' })
    valor: number;
} 