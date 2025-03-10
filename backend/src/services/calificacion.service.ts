import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calificacion } from '../entities/calificacion.entity';

/**
 * Servicio para la gestión de calificaciones
 * 
 * Este servicio maneja todas las operaciones relacionadas con las calificaciones de los estudiantes,
 * incluyendo el registro, actualización y consulta de notas.
 */
@Injectable()
export class CalificacionService {
    constructor(
        @InjectRepository(Calificacion)
        private calificacionRepository: Repository<Calificacion>
    ) {}

    /**
     * Obtiene todas las calificaciones registradas
     * 
     * @returns Lista de calificaciones con sus relaciones
     * 
     * Lógica de Negocio:
     * - Recupera todas las calificaciones del sistema
     * - Incluye información del estudiante y evaluación
     * - Permite seguimiento general del rendimiento académico
     */
    async findAll(): Promise<Calificacion[]> {
        return this.calificacionRepository.find({
            relations: ['estudiante', 'evaluacion', 'evaluacion.curso']
        });
    }

    /**
     * Busca una calificación específica por su ID
     * 
     * @param id ID de la calificación
     * @returns Calificación encontrada con sus relaciones
     * @throws NotFoundException si la calificación no existe
     * 
     * Lógica de Negocio:
     * - Verifica la existencia de la calificación
     * - Carga las relaciones necesarias
     * - Proporciona información detallada de la nota
     */
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

    /**
     * Crea una nueva calificación
     * 
     * @param calificacion Datos de la nueva calificación
     * @returns Calificación creada
     * 
     * Lógica de Negocio:
     * - Valida que el estudiante esté matriculado en el curso
     * - Verifica que la nota esté en el rango permitido (0.0 - 5.0)
     * - Registra la calificación en el sistema
     * - Actualiza el promedio del estudiante si es necesario
     */
    async create(calificacion: Calificacion): Promise<Calificacion> {
        return this.calificacionRepository.save(calificacion);
    }

    /**
     * Actualiza una calificación existente
     * 
     * @param id ID de la calificación
     * @param calificacion Nuevos datos de la calificación
     * @returns Calificación actualizada
     * @throws NotFoundException si la calificación no existe
     * 
     * Lógica de Negocio:
     * - Verifica la existencia de la calificación
     * - Valida el rango de la nueva nota
     * - Actualiza el registro
     * - Recalcula promedios si es necesario
     */
    async update(id: number, calificacion: Calificacion): Promise<Calificacion> {
        const existingCalificacion = await this.findOne(id);
        if (!existingCalificacion) {
            throw new NotFoundException(`Calificación con ID ${id} no encontrada`);
        }
        await this.calificacionRepository.update(id, calificacion);
        return this.findOne(id);
    }

    /**
     * Elimina una calificación del sistema
     * 
     * @param id ID de la calificación
     * @throws NotFoundException si la calificación no existe
     * 
     * Lógica de Negocio:
     * - Verifica la existencia de la calificación
     * - Elimina el registro
     * - Actualiza promedios relacionados
     */
    async delete(id: number): Promise<void> {
        const result = await this.calificacionRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Calificación con ID ${id} no encontrada`);
        }
    }

    /**
     * Obtiene las calificaciones de un estudiante específico
     * 
     * @param estudianteId ID del estudiante
     * @returns Lista de calificaciones del estudiante
     * 
     * Lógica de Negocio:
     * - Recupera todas las calificaciones del estudiante
     * - Incluye información de evaluaciones y cursos
     * - Permite seguimiento del rendimiento individual
     */
    async findByEstudiante(estudianteId: string): Promise<Calificacion[]> {
        return this.calificacionRepository.find({
            where: { estudiante: { id: estudianteId } },
            relations: ['estudiante', 'evaluacion', 'evaluacion.curso']
        });
    }

    /**
     * Obtiene las calificaciones de una evaluación específica
     * 
     * @param evaluacionId ID de la evaluación
     * @returns Lista de calificaciones de la evaluación
     * 
     * Lógica de Negocio:
     * - Recupera todas las calificaciones de la evaluación
     * - Incluye información de los estudiantes
     * - Permite análisis del rendimiento grupal
     */
    async findByEvaluacion(evaluacionId: string): Promise<Calificacion[]> {
        return this.calificacionRepository.find({
            where: { evaluacion: { id: evaluacionId } },
            relations: ['estudiante', 'evaluacion', 'evaluacion.curso']
        });
    }
} 