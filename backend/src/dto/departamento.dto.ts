import { IsString, IsNotEmpty, Length, IsOptional } from 'class-validator';

export class CreateDepartamentoDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre es requerido' })
    @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
    nombre: string;
}

export class UpdateDepartamentoDto {
    @IsString()
    @IsOptional()
    @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
    nombre?: string;
} 