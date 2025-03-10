import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from '../entities/estudiante.entity';
import { IdGeneratorContext } from '../strategies/id-generator.strategy';
import { CreateEstudianteDto, UpdateEstudianteDto } from '../dto/estudiante.dto';

/**
 * Servicio para la gestión de estudiantes
 * 
 * Este servicio maneja todas las operaciones relacionadas con los estudiantes,
 * incluyendo la gestión de matrículas, calificaciones y estado académico.
 */
@Injectable()
export class EstudianteService {
    constructor(
        @InjectRepository(Estudiante)
        private estudianteRepository: Repository<Estudiante>,
        private idGenerator: IdGeneratorContext
    ) {}

    /**
     * Obtiene todos los estudiantes con sus relaciones
     * 
     * @returns Lista de estudiantes con sus matrículas y calificaciones
     * 
     * Lógica de Negocio:
     * - Recupera la información completa de cada estudiante
     * - Incluye las matrículas activas
     * - Incluye el historial de calificaciones
     */
    async findAll(): Promise<Estudiante[]> {
        return this.estudianteRepository.find({
            relations: ['matriculas', 'calificaciones']
        });
    }

    /**
     * Busca un estudiante específico por su ID
     * 
     * @param id ID del estudiante
     * @returns Estudiante encontrado con sus relaciones
     * @throws NotFoundException si el estudiante no existe
     * 
     * Lógica de Negocio:
     * - Verifica la existencia del estudiante
     * - Carga las relaciones necesarias para operaciones académicas
     * - Proporciona información completa del estado académico
     */
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

    /**
     * Crea un nuevo registro de estudiante
     * 
     * @param createEstudianteDto Datos del nuevo estudiante
     * @returns Estudiante creado
     * 
     * Lógica de Negocio:
     * - Genera un ID único usando la estrategia definida
     * - Valida los datos del estudiante
     * - Crea el registro en la base de datos
     * - Inicializa las relaciones necesarias
     */
    async create(createEstudianteDto: CreateEstudianteDto): Promise<Estudiante> {
        const generatedId = await this.idGenerator.generateId('estudiante', this.estudianteRepository);
        
        const nuevoEstudiante = this.estudianteRepository.create({
            id: generatedId,
            ...createEstudianteDto
        });
        
        return this.estudianteRepository.save(nuevoEstudiante);
    }

    /**
     * Actualiza la información de un estudiante
     * 
     * @param id ID del estudiante
     * @param updateEstudianteDto Datos actualizados
     * @returns Estudiante actualizado
     * @throws NotFoundException si el estudiante no existe
     * 
     * Lógica de Negocio:
     * - Verifica la existencia del estudiante
     * - Valida los datos actualizados
     * - Mantiene la integridad de las relaciones
     * - Actualiza solo los campos permitidos
     */
    async update(id: string, updateEstudianteDto: UpdateEstudianteDto): Promise<Estudiante> {
        const estudiante = await this.findOne(id);
        
        // Actualizar los campos permitidos
        Object.assign(estudiante, updateEstudianteDto);
        
        return this.estudianteRepository.save(estudiante);
    }

    /**
     * Elimina un estudiante del sistema
     * 
     * @param id ID del estudiante
     * @throws NotFoundException si el estudiante no existe
     * 
     * Lógica de Negocio:
     * - Verifica la existencia del estudiante
     * - Maneja la eliminación de registros relacionados
     * - Mantiene la integridad referencial
     */
    async delete(id: string): Promise<void> {
        const result = await this.estudianteRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
        }
    }

    /**
     * Obtiene todas las calificaciones de un estudiante
     * 
     * @param id ID del estudiante
     * @returns Lista de calificaciones con información detallada
     * @throws NotFoundException si el estudiante no existe
     * 
     * Lógica de Negocio:
     * - Recupera el historial completo de calificaciones
     * - Incluye información de cursos y evaluaciones
     * - Organiza los datos para fácil visualización
     * - Permite seguimiento del progreso académico
     */
    async findCalificaciones(id: string): Promise<any[]> {
        const estudiante = await this.estudianteRepository.findOne({
            where: { id },
            relations: ['calificaciones', 'calificaciones.evaluacion', 'calificaciones.evaluacion.curso']
        });

        if (!estudiante) {
            throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
        }

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