import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Estudiante } from './estudiante.entity';
import { Evaluacion } from './evaluacion.entity';

@Entity()
export class Calificacion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('float')
    valor: number;

    @ManyToOne(() => Estudiante, estudiante => estudiante.calificaciones)
    estudiante: Estudiante;

    @ManyToOne(() => Evaluacion, evaluacion => evaluacion.calificaciones)
    evaluacion: Evaluacion;
} 