import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evaluacion } from '../entities/evaluacion.entity';

@Injectable()
export class EvaluacionService {
    constructor(
        @InjectRepository(Evaluacion)
        private evaluacionRepository: Repository<Evaluacion>
    ) {}

    async findAll(): Promise<Evaluacion[]> {
        return this.evaluacionRepository.find({
            relations: ['curso', 'calificaciones']
        });
    }

    async findOne(id: string): Promise<Evaluacion> {
        const evaluacion = await this.evaluacionRepository.findOne({
            where: { id },
            relations: ['curso', 'calificaciones']
        });

        if (!evaluacion) {
            throw new NotFoundException(`Evaluación con ID ${id} no encontrada`);
        }

        return evaluacion;
    }

    async create(evaluacion: Evaluacion): Promise<Evaluacion> {
        return this.evaluacionRepository.save(evaluacion);
    }

    async update(id: string, evaluacion: Evaluacion): Promise<Evaluacion> {
        const existingEvaluacion = await this.findOne(id);
        if (!existingEvaluacion) {
            throw new NotFoundException(`Evaluación con ID ${id} no encontrada`);
        }
        await this.evaluacionRepository.update(id, evaluacion);
        return this.findOne(id);
    }

    async delete(id: string): Promise<void> {
        const result = await this.evaluacionRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Evaluación con ID ${id} no encontrada`);
        }
    }

    async findByCurso(codigoCurso: string): Promise<Evaluacion[]> {
        return this.evaluacionRepository.find({
            where: { curso: { codigo: codigoCurso } },
            relations: ['curso', 'calificaciones']
        });
    }
} 