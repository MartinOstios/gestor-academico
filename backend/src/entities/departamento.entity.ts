import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Profesor } from './profesor.entity';

@Entity()
export class Departamento {
    @PrimaryColumn()
    codigo: string;

    @Column()
    nombre: string;

    @OneToMany(() => Profesor, profesor => profesor.departamento)
    profesores: Profesor[];
} 