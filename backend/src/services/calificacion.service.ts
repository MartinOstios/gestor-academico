import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calificacion } from '../entities/calificacion.entity';

@Injectable()
export class CalificacionService {
    constructor(
        @InjectRepository(Calificacion)
        private calificacionRepository: Repository<Calificacion>
    ) {}

    async findAll(): Promise<Calificacion[]> {
        return this.calificacionRepository.find({
            relations: ['estudiante', 'evaluacion', 'evaluacion.curso']
        });
    }

    async findOne(id: number): Promise<Calificacion> {
        const calificacion = await this.calificacionRepository.findOne({
            where: { id },
            relations: ['estudiante', 'evaluacion', 'evaluacion.curso']
        });

        if (!calificacion) {
            throw new NotFoundException(`Calificación con ID ${id} no encontrada`);
        }

        return calificacion;
    }

    async create(calificacion: Calificacion): Promise<Calificacion> {
        return this.calificacionRepository.save(calificacion);
    }

    async update(id: number, calificacion: Calificacion): Promise<Calificacion> {
        const existingCalificacion = await this.findOne(id);
        if (!existingCalificacion) {
            throw new NotFoundException(`Calificación con ID ${id} no encontrada`);
        }
        await this.calificacionRepository.update(id, calificacion);
        return this.findOne(id);
    }

    async delete(id: number): Promise<void> {
        const result = await this.calificacionRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Calificación con ID ${id} no encontrada`);
        }
    }

    async findByEstudiante(estudianteId: string): Promise<Calificacion[]> {
        return this.calificacionRepository.find({
            where: { estudiante: { id: estudianteId } },
            relations: ['estudiante', 'evaluacion', 'evaluacion.curso']
        });
    }

    async findByEvaluacion(evaluacionId: string): Promise<Calificacion[]> {
        return this.calificacionRepository.find({
            where: { evaluacion: { id: evaluacionId } },
            relations: ['estudiante', 'evaluacion', 'evaluacion.curso']
        });
    }
} 