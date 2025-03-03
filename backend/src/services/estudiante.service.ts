import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from '../entities/estudiante.entity';

@Injectable()
export class EstudianteService {
    constructor(
        @InjectRepository(Estudiante)
        private estudianteRepository: Repository<Estudiante>
    ) {}

    async findAll(): Promise<Estudiante[]> {
        return this.estudianteRepository.find({
            relations: ['matriculas', 'calificaciones']
        });
    }

    async findOne(id: string): Promise<Estudiante> {
        const estudiante = await this.estudianteRepository.findOne({
            where: { id },
            relations: ['matriculas', 'calificaciones']
        });

        if (!estudiante) {
            throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
        }

        return estudiante;
    }

    async create(estudiante: Estudiante): Promise<Estudiante> {
        return this.estudianteRepository.save(estudiante);
    }

    async update(id: string, estudiante: Estudiante): Promise<Estudiante> {
        const existingEstudiante = await this.findOne(id);
        if (!existingEstudiante) {
            throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
        }
        await this.estudianteRepository.update(id, estudiante);
        return this.findOne(id);
    }

    async delete(id: string): Promise<void> {
        const result = await this.estudianteRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
        }
    }
} 