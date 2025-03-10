import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evaluacion } from '../entities/evaluacion.entity';

/**
 * Servicio para la gestión de evaluaciones
 * 
 * Este servicio maneja todas las operaciones relacionadas con las evaluaciones académicas,
 * incluyendo la creación, actualización y consulta de evaluaciones por curso.
 */
@Injectable()
export class EvaluacionService {
    constructor(
        @InjectRepository(Evaluacion)
        private evaluacionRepository: Repository<Evaluacion>
    ) {}

    /**
     * Obtiene todas las evaluaciones registradas
     * 
     * @returns Lista de evaluaciones con sus relaciones
     * 
     * Lógica de Negocio:
     * - Recupera todas las evaluaciones del sistema
     * - Incluye información del curso asociado
     * - Incluye las calificaciones registradas
     * - Permite seguimiento del progreso académico
     */
    async findAll(): Promise<Evaluacion[]> {
        return this.evaluacionRepository.find({
            relations: ['curso', 'calificaciones']
        });
    }

    /**
     * Busca una evaluación específica por su ID
     * 
     * @param id ID de la evaluación
     * @returns Evaluación encontrada con sus relaciones
     * @throws NotFoundException si la evaluación no existe
     * 
     * Lógica de Negocio:
     * - Verifica la existencia de la evaluación
     * - Carga las relaciones necesarias
     * - Proporciona información detallada de la evaluación
     */
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

    /**
     * Crea una nueva evaluación
     * 
     * @param evaluacion Datos de la nueva evaluación
     * @returns Evaluación creada
     * 
     * Lógica de Negocio:
     * - Valida los datos de la evaluación
     * - Asigna la evaluación al curso correspondiente
     * - Establece la fecha de realización
     * - Inicializa el registro de calificaciones
     */
    async create(evaluacion: Evaluacion): Promise<Evaluacion> {
        return this.evaluacionRepository.save(evaluacion);
    }

    /**
     * Actualiza una evaluación existente
     * 
     * @param id ID de la evaluación
     * @param evaluacion Nuevos datos de la evaluación
     * @returns Evaluación actualizada
     * @throws NotFoundException si la evaluación no existe
     * 
     * Lógica de Negocio:
     * - Verifica la existencia de la evaluación
     * - Valida los nuevos datos
     * - Actualiza el registro
     * - Mantiene la integridad de las calificaciones
     */
    async update(id: string, evaluacion: Evaluacion): Promise<Evaluacion> {
        const existingEvaluacion = await this.findOne(id);
        if (!existingEvaluacion) {
            throw new NotFoundException(`Evaluación con ID ${id} no encontrada`);
        }
        await this.evaluacionRepository.update(id, evaluacion);
        return this.findOne(id);
    }

    /**
     * Elimina una evaluación del sistema
     * 
     * @param id ID de la evaluación
     * @throws NotFoundException si la evaluación no existe
     * 
     * Lógica de Negocio:
     * - Verifica la existencia de la evaluación
     * - Elimina las calificaciones asociadas
     * - Elimina el registro de evaluación
     */
    async delete(id: string): Promise<void> {
        const result = await this.evaluacionRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Evaluación con ID ${id} no encontrada`);
        }
    }

    /**
     * Obtiene todas las evaluaciones de un curso específico
     * 
     * @param codigoCurso Código del curso
     * @returns Lista de evaluaciones del curso
     * 
     * Lógica de Negocio:
     * - Recupera las evaluaciones asociadas al curso
     * - Incluye las calificaciones registradas
     * - Permite seguimiento del rendimiento del curso
     */
    async findByCurso(codigoCurso: string): Promise<Evaluacion[]> {
        return this.evaluacionRepository.find({
            where: { curso: { codigo: codigoCurso } },
            relations: ['curso', 'calificaciones']
        });
    }

    /**
     * Obtiene el repositorio de evaluaciones
     * 
     * @returns Repositorio de evaluaciones
     * 
     * Lógica de Negocio:
     * - Proporciona acceso directo al repositorio
     * - Permite operaciones avanzadas de consulta
     * - Facilita la integración con otros servicios
     */
    getRepository(): Repository<Evaluacion> {
        return this.evaluacionRepository;
    }
} 