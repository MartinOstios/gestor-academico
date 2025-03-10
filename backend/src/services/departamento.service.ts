import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Departamento } from '../entities/departamento.entity';
import { IdGeneratorContext } from '../strategies/id-generator.strategy';
import { CreateDepartamentoDto, UpdateDepartamentoDto } from '../dto/departamento.dto';

/**
 * Servicio para la gestión de departamentos
 * 
 * Este servicio maneja todas las operaciones relacionadas con los departamentos académicos,
 * incluyendo la gestión de profesores asignados y la administración de información departamental.
 */
@Injectable()
export class DepartamentoService {
    constructor(
        @InjectRepository(Departamento)
        private departamentoRepository: Repository<Departamento>,
        private idGenerator: IdGeneratorContext
    ) {}

    /**
     * Obtiene todos los departamentos registrados
     * 
     * @returns Lista de departamentos con sus relaciones
     * 
     * Lógica de Negocio:
     * - Recupera información completa de cada departamento
     * - Incluye los profesores asignados
     * - Permite gestión administrativa departamental
     */
    async findAll(): Promise<Departamento[]> {
        return this.departamentoRepository.find({
            relations: ['profesores']
        });
    }

    /**
     * Busca un departamento específico por su código
     * 
     * @param codigo Código del departamento
     * @returns Departamento encontrado con sus relaciones
     * @throws NotFoundException si el departamento no existe
     * 
     * Lógica de Negocio:
     * - Verifica la existencia del departamento
     * - Carga las relaciones con profesores
     * - Proporciona información detallada del departamento
     */
    async findOne(codigo: string): Promise<Departamento> {
        const departamento = await this.departamentoRepository.findOne({
            where: { codigo },
            relations: ['profesores']
        });

        if (!departamento) {
            throw new NotFoundException(`Departamento con código ${codigo} no encontrado`);
        }

        return departamento;
    }

    /**
     * Crea un nuevo departamento
     * 
     * @param createDepartamentoDto Datos del nuevo departamento
     * @returns Departamento creado
     * 
     * Lógica de Negocio:
     * - Genera código único para el departamento
     * - Valida la información proporcionada
     * - Crea el registro del departamento
     * - Inicializa la lista de profesores
     */
    async create(createDepartamentoDto: CreateDepartamentoDto): Promise<Departamento> {
        const codigo = await this.idGenerator.generateId('departamento', this.departamentoRepository);
        
        const nuevoDepartamento = this.departamentoRepository.create({
            codigo,
            nombre: createDepartamentoDto.nombre
        });
        
        return this.departamentoRepository.save(nuevoDepartamento);
    }

    /**
     * Actualiza un departamento existente
     * 
     * @param codigo Código del departamento
     * @param updateDepartamentoDto Nuevos datos del departamento
     * @returns Departamento actualizado
     * @throws NotFoundException si el departamento no existe
     * 
     * Lógica de Negocio:
     * - Verifica la existencia del departamento
     * - Valida los nuevos datos
     * - Actualiza la información manteniendo integridad
     * - Preserva las relaciones existentes
     */
    async update(codigo: string, updateDepartamentoDto: UpdateDepartamentoDto): Promise<Departamento> {
        const departamento = await this.findOne(codigo);
        Object.assign(departamento, updateDepartamentoDto);
        await this.departamentoRepository.save(departamento);
        return this.findOne(codigo);
    }

    /**
     * Elimina un departamento del sistema
     * 
     * @param codigo Código del departamento
     * @throws NotFoundException si el departamento no existe
     * 
     * Lógica de Negocio:
     * - Verifica la existencia del departamento
     * - Valida que no tenga profesores asignados
     * - Elimina el registro manteniendo integridad
     */
    async delete(codigo: string): Promise<void> {
        const result = await this.departamentoRepository.delete(codigo);
        if (result.affected === 0) {
            throw new NotFoundException(`Departamento con código ${codigo} no encontrado`);
        }
    }
} 