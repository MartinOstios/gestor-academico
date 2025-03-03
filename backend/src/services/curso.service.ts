import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curso } from '../entities/curso.entity';

@Injectable()
export class CursoService {
    constructor(
        @InjectRepository(Curso)
        private cursoRepository: Repository<Curso>
    ) {}

    async findAll(): Promise<Curso[]> {
        return this.cursoRepository.find({
            relations: ['profesor', 'prerrequisitos', 'evaluaciones']
        });
    }

    /**
     * Busca un curso por su código
     * @param codigo Código del curso
     * @param incluirPrerrequisitos Si es true, carga los prerrequisitos de los prerrequisitos (recursivamente)
     * @returns El curso encontrado
     */
    async findOne(codigo: string, incluirPrerrequisitos: boolean = false): Promise<Curso> {
        let relations = ['profesor', 'evaluaciones'];
        
        if (incluirPrerrequisitos) {
            relations.push('prerrequisitos');
            relations.push('prerrequisitos.prerrequisitos');
        } else {
            relations.push('prerrequisitos');
        }
        
        const curso = await this.cursoRepository.findOne({
            where: { codigo },
            relations: relations
        });

        if (!curso) {
            throw new NotFoundException(`Curso con código ${codigo} no encontrado`);
        }

        return curso;
    }

    async create(curso: Curso): Promise<Curso> {
        return this.cursoRepository.save(curso);
    }

    async update(codigo: string, curso: Curso): Promise<Curso> {
        const existingCurso = await this.findOne(codigo);
        if (!existingCurso) {
            throw new NotFoundException(`Curso con código ${codigo} no encontrado`);
        }
        await this.cursoRepository.update(codigo, curso);
        return this.findOne(codigo);
    }

    async delete(codigo: string): Promise<void> {
        const result = await this.cursoRepository.delete(codigo);
        if (result.affected === 0) {
            throw new NotFoundException(`Curso con código ${codigo} no encontrado`);
        }
    }

    async addPrerrequisito(codigoCurso: string, codigoPrerrequisito: string): Promise<void> {
        const curso = await this.findOne(codigoCurso);
        const prerrequisito = await this.findOne(codigoPrerrequisito);
        
        if (!curso.prerrequisitos) {
            curso.prerrequisitos = [];
        }
        
        // Verificar si ya existe el prerrequisito
        const yaExiste = curso.prerrequisitos.some(p => p.codigo === codigoPrerrequisito);
        if (!yaExiste) {
            curso.prerrequisitos.push(prerrequisito);
            await this.cursoRepository.save(curso);
        }
    }
} 