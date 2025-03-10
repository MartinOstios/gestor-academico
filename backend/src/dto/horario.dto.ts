import { IsString, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class CreateHorarioDto {
    @IsString()
    @IsNotEmpty({ message: 'El día es requerido' })
    dia: string;

    @IsString()
    @IsNotEmpty({ message: 'La hora de inicio es requerida' })
    @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Formato de hora inválido. Use HH:MM' })
    horaInicio: string;

    @IsString()
    @IsNotEmpty({ message: 'La hora de fin es requerida' })
    @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Formato de hora inválido. Use HH:MM' })
    horaFin: string;

    @IsString()
    @IsOptional()
    cursoCodigo?: string;
}

export class UpdateHorarioDto {
    @IsString()
    @IsOptional()
    dia?: string;

    @IsString()
    @IsOptional()
    @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Formato de hora inválido. Use HH:MM' })
    horaInicio?: string;

    @IsString()
    @IsOptional()
    @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Formato de hora inválido. Use HH:MM' })
    horaFin?: string;
} 