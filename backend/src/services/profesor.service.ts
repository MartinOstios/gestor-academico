import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profesor } from '../entities/profesor.entity';

@Injectable()
export class ProfesorService {
    constructor(
        @InjectRepository(Profesor)
        private profesorRepository: Repository<Profesor>
    ) {}

    async findAll(): Promise<Profesor[]> {
        return this.profesorRepository.find({
            relations: ['departamento', 'cursos']
        });
    }

    async findOne(id: string): Promise<Profesor> {
        const profesor = await this.profesorRepository.findOne({
            where: { id },
            relations: ['departamento', 'cursos']
        });

        if (!profesor) {
            throw new NotFoundException(`Profesor con ID ${id} no encontrado`);
        }

        return profesor;
    }

    async create(profesor: Profesor): Promise<Profesor> {
        console.log('Creando profesor con datos:', JSON.stringify(profesor, null, 2));
        
        // Guardar el profesor con sus relaciones
        const savedProfesor = await this.profesorRepository.save(profesor);
        console.log('Profesor guardado en BD:', JSON.stringify(savedProfesor, null, 2));
        
        // Retornar el profesor con sus relaciones cargadas
        return this.findOne(savedProfesor.id);
    }

    async update(id: string, profesor: Profesor): Promise<Profesor> {
        console.log('Actualizando profesor con ID:', id);
        console.log('Datos de actualización:', JSON.stringify(profesor, null, 2));
        
        const existingProfesor = await this.findOne(id);
        if (!existingProfesor) {
            throw new NotFoundException(`Profesor con ID ${id} no encontrado`);
        }
        
        // Mantener las relaciones existentes si no se proporcionan nuevas
        if (!profesor.departamento && existingProfesor.departamento) {
            profesor.departamento = existingProfesor.departamento;
        }
        
        // Actualizar el profesor manteniendo el ID
        profesor.id = id;
        await this.profesorRepository.save(profesor);
        
        const updatedProfesor = await this.findOne(id);
        console.log('Profesor actualizado en BD:', JSON.stringify(updatedProfesor, null, 2));
        
        return updatedProfesor;
    }

    async delete(id: string): Promise<void> {
        const result = await this.profesorRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Profesor con ID ${id} no encontrado`);
        }
    }
} 