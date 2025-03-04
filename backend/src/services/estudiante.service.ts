import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from '../entities/estudiante.entity';
import { IdGeneratorContext } from '../strategies/id-generator.strategy';
import { CreateEstudianteDto, UpdateEstudianteDto } from '../dto/estudiante.dto';

@Injectable()
export class EstudianteService {
    constructor(
        @InjectRepository(Estudiante)
        private estudianteRepository: Repository<Estudiante>,
        private idGenerator: IdGeneratorContext
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

    async create(createEstudianteDto: CreateEstudianteDto): Promise<Estudiante> {
        // Generar ID automáticamente usando la estrategia
        const generatedId = await this.idGenerator.generateId('estudiante', this.estudianteRepository);
        
        // Crear nueva instancia con el ID generado
        const nuevoEstudiante = this.estudianteRepository.create({
            id: generatedId,
            ...createEstudianteDto
        });
        
        return this.estudianteRepository.save(nuevoEstudiante);
    }

    async update(id: string, updateEstudianteDto: UpdateEstudianteDto): Promise<Estudiante> {
        const existingEstudiante = await this.findOne(id);
        if (!existingEstudiante) {
            throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
        }
        
        // Actualizar solo los campos proporcionados
        Object.assign(existingEstudiante, updateEstudianteDto);
        
        await this.estudianteRepository.save(existingEstudiante);
        return this.findOne(id);
    }

    async delete(id: string): Promise<void> {
        const result = await this.estudianteRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
        }
    }
    
    // Método para obtener todas las calificaciones de un estudiante
    async findCalificaciones(id: string): Promise<any[]> {
        const estudiante = await this.estudianteRepository.findOne({
            where: { id },
            relations: ['calificaciones', 'calificaciones.evaluacion', 'calificaciones.evaluacion.curso']
        });

        if (!estudiante) {
            throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
        }

        // Transformar los datos para mostrar información más completa
        return estudiante.calificaciones.map(calificacion => ({
            id: calificacion.id,
            valor: calificacion.valor,
            evaluacion: {
                id: calificacion.evaluacion.id,
                fechaRealizacion: calificacion.evaluacion.fechaRealizacion
            },
            curso: {
                codigo: calificacion.evaluacion.curso.codigo,
                nombre: calificacion.evaluacion.curso.nombre
            }
        }));
    }
} 