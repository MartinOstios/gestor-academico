import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profesor } from '../entities/profesor.entity';
import { IdGeneratorContext } from '../strategies/id-generator.strategy';
import { CreateProfesorDto, UpdateProfesorDto } from '../dto/profesor.dto';
import { Departamento } from '../entities/departamento.entity';

/**
 * Servicio para la gestión de profesores
 * 
 * Este servicio maneja todas las operaciones relacionadas con los profesores,
 * incluyendo la asignación a departamentos, gestión de cursos y datos personales.
 */
@Injectable()
export class ProfesorService {
    constructor(
        @InjectRepository(Profesor)
        private profesorRepository: Repository<Profesor>,
        @InjectRepository(Departamento)
        private departamentoRepository: Repository<Departamento>,
        private idGenerator: IdGeneratorContext
    ) {}

    /**
     * Obtiene todos los profesores registrados
     * 
     * @returns Lista de profesores con sus relaciones
     * 
     * Lógica de Negocio:
     * - Recupera información completa de cada profesor
     * - Incluye departamento asignado
     * - Incluye cursos que imparte
     * - Permite gestión de carga académica
     */
    async findAll(): Promise<Profesor[]> {
        return this.profesorRepository.find({
            relations: ['departamento', 'cursos']
        });
    }

    /**
     * Busca un profesor específico por su ID
     * 
     * @param id ID del profesor
     * @returns Profesor encontrado con sus relaciones
     * @throws NotFoundException si el profesor no existe
     * 
     * Lógica de Negocio:
     * - Verifica la existencia del profesor
     * - Carga las relaciones necesarias
     * - Proporciona información detallada del profesor
     */
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

    /**
     * Crea un nuevo profesor
     * 
     * @param createProfesorDto Datos del nuevo profesor
     * @returns Profesor creado
     * 
     * Lógica de Negocio:
     * - Genera ID único para el profesor
     * - Valida y asigna el departamento
     * - Verifica la disponibilidad del profesor
     * - Registra el nuevo profesor en el sistema
     */
    async create(createProfesorDto: CreateProfesorDto): Promise<Profesor> {
        const id = await this.idGenerator.generateId('profesor', this.profesorRepository);
        
        const departamento = await this.departamentoRepository.findOne({
            where: { codigo: createProfesorDto.departamentoCodigo }
        });

        if (!departamento) {
            throw new NotFoundException(`Departamento con código ${createProfesorDto.departamentoCodigo} no encontrado`);
        }

        const profesor = this.profesorRepository.create({
            id,
            ...createProfesorDto,
            departamento
        });

        return this.profesorRepository.save(profesor);
    }

    /**
     * Actualiza un profesor existente
     * 
     * @param id ID del profesor
     * @param updateProfesorDto Nuevos datos del profesor
     * @returns Profesor actualizado
     * @throws NotFoundException si el profesor no existe
     * 
     * Lógica de Negocio:
     * - Verifica la existencia del profesor
     * - Valida cambios en el departamento
     * - Actualiza la información personal
     * - Mantiene la integridad de las relaciones
     */
    async update(id: string, updateProfesorDto: UpdateProfesorDto): Promise<Profesor> {
        const profesor = await this.findOne(id);

        if (updateProfesorDto.departamentoCodigo) {
            const departamento = await this.departamentoRepository.findOne({
                where: { codigo: updateProfesorDto.departamentoCodigo }
            });

            if (!departamento) {
                throw new NotFoundException(`Departamento con código ${updateProfesorDto.departamentoCodigo} no encontrado`);
            }

            profesor.departamento = departamento;
        }

        Object.assign(profesor, updateProfesorDto);
        await this.profesorRepository.save(profesor);
        return this.findOne(id);
    }

    /**
     * Elimina un profesor del sistema
     * 
     * @param id ID del profesor
     * @throws NotFoundException si el profesor no existe
     * 
     * Lógica de Negocio:
     * - Verifica la existencia del profesor
     * - Valida que no tenga cursos asignados
     * - Elimina el registro manteniendo integridad
     */
    async delete(id: string): Promise<void> {
        const result = await this.profesorRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Profesor con ID ${id} no encontrado`);
        }
    }

    /**
     * Obtiene los cursos asignados a un profesor
     * 
     * @param id ID del profesor
     * @returns Lista de cursos del profesor
     * @throws NotFoundException si el profesor no existe
     * 
     * Lógica de Negocio:
     * - Recupera todos los cursos del profesor
     * - Incluye información detallada de cada curso
     * - Permite gestión de carga académica
     */
    async findCursos(id: string): Promise<any[]> {
        const profesor = await this.profesorRepository.findOne({
            where: { id },
            relations: ['cursos']
        });

        if (!profesor) {
            throw new NotFoundException(`Profesor con ID ${id} no encontrado`);
        }

        return profesor.cursos;
    }
} 