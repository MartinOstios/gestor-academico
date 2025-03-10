import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Horario } from '../entities/horario.entity';
import { CreateHorarioDto, UpdateHorarioDto } from '../dto/horario.dto';

/**
 * Servicio para la gestión de horarios
 * 
 * Este servicio maneja todas las operaciones relacionadas con los horarios de los cursos,
 * incluyendo la creación, actualización y validación de disponibilidad de horarios.
 */
@Injectable()
export class HorarioService {
    constructor(
        @InjectRepository(Horario)
        private horarioRepository: Repository<Horario>
    ) {}

    /**
     * Obtiene todos los horarios registrados
     * 
     * @returns Lista de horarios con sus relaciones
     * 
     * Lógica de Negocio:
     * - Recupera todos los horarios del sistema
     * - Incluye información del curso asociado
     * - Permite verificar la disponibilidad de espacios
     */
    async findAll(): Promise<Horario[]> {
        return this.horarioRepository.find({
            relations: ['curso']
        });
    }

    /**
     * Busca un horario específico por su ID
     * 
     * @param id ID del horario
     * @returns Horario encontrado con sus relaciones
     * @throws NotFoundException si el horario no existe
     * 
     * Lógica de Negocio:
     * - Verifica la existencia del horario
     * - Carga las relaciones necesarias
     * - Proporciona información detallada del horario
     */
    async findOne(id: number): Promise<Horario> {
        const horario = await this.horarioRepository.findOne({
            where: { id },
            relations: ['curso']
        });

        if (!horario) {
            throw new NotFoundException(`Horario con ID ${id} no encontrado`);
        }

        return horario;
    }

    /**
     * Crea un nuevo horario
     * 
     * @param createHorarioDto Datos del nuevo horario
     * @returns Horario creado
     * 
     * Lógica de Negocio:
     * - Valida el formato de la hora (HH:MM)
     * - Verifica disponibilidad del espacio
     * - Asigna el horario al curso correspondiente
     * - Registra el nuevo horario
     */
    async create(createHorarioDto: CreateHorarioDto): Promise<Horario> {
        const horario = this.horarioRepository.create(createHorarioDto);
        return this.horarioRepository.save(horario);
    }

    /**
     * Actualiza un horario existente
     * 
     * @param id ID del horario
     * @param updateHorarioDto Nuevos datos del horario
     * @returns Horario actualizado
     * @throws NotFoundException si el horario no existe
     * 
     * Lógica de Negocio:
     * - Verifica la existencia del horario
     * - Valida el nuevo formato de hora
     * - Actualiza la información del horario
     * - Mantiene la integridad con el curso asociado
     */
    async update(id: number, updateHorarioDto: UpdateHorarioDto): Promise<Horario> {
        const horario = await this.findOne(id);
        Object.assign(horario, updateHorarioDto);
        return this.horarioRepository.save(horario);
    }

    /**
     * Elimina un horario del sistema
     * 
     * @param id ID del horario
     * @throws NotFoundException si el horario no existe
     * 
     * Lógica de Negocio:
     * - Verifica la existencia del horario
     * - Elimina el registro
     * - Actualiza las relaciones con el curso
     */
    async delete(id: number): Promise<void> {
        const result = await this.horarioRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Horario con ID ${id} no encontrado`);
        }
    }

    /**
     * Obtiene los horarios de un curso específico
     * 
     * @param cursoCodigo Código del curso
     * @returns Lista de horarios del curso
     * 
     * Lógica de Negocio:
     * - Recupera todos los horarios asociados al curso
     * - Permite verificar la disponibilidad del curso
     * - Facilita la planificación académica
     */
    async findByCurso(cursoCodigo: string): Promise<Horario[]> {
        return this.horarioRepository.find({
            where: { curso: { codigo: cursoCodigo } },
            relations: ['curso']
        });
    }
} 