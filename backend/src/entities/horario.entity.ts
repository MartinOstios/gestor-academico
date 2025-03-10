import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Curso } from './curso.entity';

@Entity()
export class Horario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    dia: string; // Lunes, Martes, Miércoles, etc.

    @Column({ type: 'time' })
    horaInicio: string; // Formato HH:MM

    @Column({ type: 'time' })
    horaFin: string; // Formato HH:MM

    @ManyToOne(() => Curso, curso => curso.horarios, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'cursoCodigo' })
    curso: Curso;

    @Column()
    cursoCodigo: string;
} 