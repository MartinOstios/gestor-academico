import { IsString, IsNotEmpty, Length, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEvaluacionDto {
    @IsString()
    @IsNotEmpty({ message: 'El ID es requerido' })
    @Length(5, 20, { message: 'El ID debe tener entre 5 y 20 caracteres' })
    id: string;

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty({ message: 'La fecha de realización es requerida' })
    fechaRealizacion: Date;

    @IsString()
    @IsNotEmpty({ message: 'El código del curso es requerido' })
    cursoCodigo: string;
}

export class UpdateEvaluacionDto {
    @Type(() => Date)
    @IsDate()
    @IsNotEmpty({ message: 'La fecha de realización es requerida' })
    fechaRealizacion: Date;
} 