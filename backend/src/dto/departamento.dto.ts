import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateDepartamentoDto {
    @IsString()
    @IsNotEmpty({ message: 'El código es requerido' })
    @Length(2, 10, { message: 'El código debe tener entre 2 y 10 caracteres' })
    codigo: string;

    @IsString()
    @IsNotEmpty({ message: 'El nombre es requerido' })
    @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
    nombre: string;
}

export class UpdateDepartamentoDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre es requerido' })
    @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
    nombre: string;
} 