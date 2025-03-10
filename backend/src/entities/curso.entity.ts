import { Entity, Column, PrimaryColumn, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Profesor } from './profesor.entity';
import { Evaluacion } from './evaluacion.entity';
import { Horario } from './horario.entity';

@Entity()
export class Curso {
    @PrimaryColumn()
    codigo: string;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @ManyToOne(() => Profesor, profesor => profesor.cursos)
    profesor: Profesor;

    @ManyToMany(() => Curso)
    @JoinTable()
    prerrequisitos: Curso[];

    @OneToMany(() => Evaluacion, evaluacion => evaluacion.curso)
    evaluaciones: Evaluacion[];
    
    @OneToMany(() => Horario, horario => horario.curso, { cascade: true })
    horarios: Horario[];
} 