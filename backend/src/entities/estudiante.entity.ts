import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Matricula } from './matricula.entity';
import { Calificacion } from './calificacion.entity';

@Entity()
export class Estudiante {
    @PrimaryColumn()
    id: string;

    @Column()
    nombre: string;

    @Column()
    fechaNacimiento: Date;

    @OneToMany(() => Matricula, matricula => matricula.estudiante)
    matriculas: Matricula[];

    @OneToMany(() => Calificacion, calificacion => calificacion.estudiante)
    calificaciones: Calificacion[];
} 