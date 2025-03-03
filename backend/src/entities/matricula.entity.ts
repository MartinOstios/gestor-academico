import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Estudiante } from './estudiante.entity';
import { Curso } from './curso.entity';

@Entity()
export class Matricula {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fechaInscripcion: Date;

    @Column('float', { nullable: true })
    calificacionFinal: number;

    @ManyToOne(() => Estudiante, estudiante => estudiante.matriculas)
    estudiante: Estudiante;

    @ManyToOne(() => Curso)
    curso: Curso;
} 