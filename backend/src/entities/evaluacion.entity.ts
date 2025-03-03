import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany } from 'typeorm';
import { Curso } from './curso.entity';
import { Calificacion } from './calificacion.entity';

@Entity()
export class Evaluacion {
    @PrimaryColumn()
    id: string;

    @Column()
    fechaRealizacion: Date;

    @ManyToOne(() => Curso, curso => curso.evaluaciones)
    curso: Curso;

    @OneToMany(() => Calificacion, calificacion => calificacion.evaluacion)
    calificaciones: Calificacion[];
} 