import { IsString, IsNotEmpty, Length, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEvaluacionDto {
    @IsString()
    @IsOptional()
    @Length(5, 20, { message: 'El ID debe tener entre 5 y 20 caracteres' })
    id?: string;

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
    
    @IsString()
    @IsOptional()
    cursoCodigo?: string;
} 