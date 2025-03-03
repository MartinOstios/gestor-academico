import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany } from 'typeorm';
import { Departamento } from './departamento.entity';
import { Curso } from './curso.entity';

@Entity()
export class Profesor {
    @PrimaryColumn()
    id: string;

    @Column()
    nombre: string;

    @Column()
    fechaContratacion: Date;

    @ManyToOne(() => Departamento, departamento => departamento.profesores)
    departamento: Departamento;

    @OneToMany(() => Curso, curso => curso.profesor)
    cursos: Curso[];
} 