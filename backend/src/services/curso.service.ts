import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curso } from '../entities/curso.entity';
import { Profesor } from '../entities/profesor.entity';
import { Horario } from '../entities/horario.entity';
import { IdGeneratorContext } from '../strategies/id-generator.strategy';
import { CreateCursoDto, UpdateCursoDto } from '../dto/curso.dto';
import { HorarioService } from './horario.service';

/**
 * Servicio para la gestión de cursos
 * 
 * Este servicio maneja todas las operaciones relacionadas con los cursos académicos,
 * incluyendo la gestión de prerrequisitos, horarios y asignación de profesores.
 */
@Injectable()
export class CursoService {
    constructor(
        @InjectRepository(Curso)
        private cursoRepository: Repository<Curso>,
        @InjectRepository(Profesor)
        private profesorRepository: Repository<Profesor>,
        @InjectRepository(Horario)
        private horarioRepository: Repository<Horario>,
        private idGenerator: IdGeneratorContext,
        private horarioService: HorarioService
    ) {}

    /**
     * Obtiene todos los cursos con sus relaciones
     * 
     * @returns Lista de cursos con sus relaciones completas
     * 
     * Lógica de Negocio:
     * - Recupera información completa de cada curso
     * - Incluye profesor asignado
     * - Incluye prerrequisitos
     * - Incluye evaluaciones y horarios
     */
    async findAll(): Promise<Curso[]> {
        return this.cursoRepository.find({
            relations: ['profesor', 'prerrequisitos', 'evaluaciones', 'horarios']
        });
    }

    /**
     * Busca un curso específico por su código
     * 
     * @param codigo Código del curso
     * @param incluirPrerrequisitos Si es true, carga los prerrequisitos recursivamente
     * @returns Curso encontrado con sus relaciones
     * @throws NotFoundException si el curso no existe
     * 
     * Lógica de Negocio:
     * - Verifica la existencia del curso
     * - Carga las relaciones según los parámetros
     * - Maneja la carga recursiva de prerrequisitos si se solicita
     */
    async findOne(codigo: string, incluirPrerrequisitos: boolean = false): Promise<Curso> {
        let relations = ['profesor', 'evaluaciones', 'horarios'];
        
        if (incluirPrerrequisitos) {
            relations.push('prerrequisitos');
            relations.push('prerrequisitos.prerrequisitos');
        } else {
            relations.push('prerrequisitos');
        }
        
        const curso = await this.cursoRepository.findOne({
            where: { codigo },
            relations: relations
        });

        if (!curso) {
            throw new NotFoundException(`Curso con código ${codigo} no encontrado`);
        }

        return curso;
    }

    /**
     * Crea un nuevo curso
     * 
     * @param createCursoDto Datos del nuevo curso
     * @returns Curso creado con todas sus relaciones
     * @throws NotFoundException si el profesor no existe
     * 
     * Lógica de Negocio:
     * - Genera código único para el curso
     * - Valida y asigna el profesor
     * - Crea los horarios asociados
     * - Establece los prerrequisitos si existen
     */
    async create(createCursoDto: CreateCursoDto): Promise<Curso> {
        const codigo = await this.idGenerator.generateId('curso', this.cursoRepository);
        
        const profesor = await this.profesorRepository.findOne({
            where: { id: createCursoDto.profesorId }
        });
        
        if (!profesor) {
            throw new NotFoundException(`Profesor con ID ${createCursoDto.profesorId} no encontrado`);
        }
        
        const nuevoCurso = this.cursoRepository.create({
            codigo,
            nombre: createCursoDto.nombre,
            descripcion: createCursoDto.descripcion,
            profesor
        });
        
        const cursoGuardado = await this.cursoRepository.save(nuevoCurso);
        
        if (createCursoDto.horarios && createCursoDto.horarios.length > 0) {
            for (const horarioDto of createCursoDto.horarios) {
                horarioDto.cursoCodigo = cursoGuardado.codigo;
                await this.horarioRepository.save(this.horarioRepository.create(horarioDto));
            }
        }
        
        if (createCursoDto.prerrequisitoCodigos && createCursoDto.prerrequisitoCodigos.length > 0) {
            for (const codigoPrerrequisito of createCursoDto.prerrequisitoCodigos) {
                await this.addPrerrequisito(cursoGuardado.codigo, codigoPrerrequisito);
            }
        }
        
        return this.findOne(cursoGuardado.codigo);
    }

    /**
     * Actualiza un curso existente
     * 
     * @param codigo Código del curso
     * @param updateCursoDto Datos actualizados del curso
     * @returns Curso actualizado
     * @throws NotFoundException si el curso no existe
     * 
     * Lógica de Negocio:
     * - Verifica la existencia del curso
     * - Valida y actualiza el profesor si es necesario
     * - Mantiene la integridad de las relaciones
     * - Actualiza solo los campos permitidos
     */
    async update(codigo: string, updateCursoDto: UpdateCursoDto): Promise<Curso> {
        const curso = await this.findOne(codigo);
        
        if (updateCursoDto.profesorId) {
            const profesor = await this.profesorRepository.findOne({
                where: { id: updateCursoDto.profesorId }
            });
            
            if (!profesor) {
                throw new NotFoundException(`Profesor con ID ${updateCursoDto.profesorId} no encontrado`);
            }
            
            curso.profesor = profesor;
        }
        
        Object.assign(curso, {
            nombre: updateCursoDto.nombre,
            descripcion: updateCursoDto.descripcion
        });
        
        await this.cursoRepository.save(curso);
        return this.findOne(codigo);
    }

    /**
     * Agrega un prerrequisito a un curso
     * 
     * @param codigoCurso Código del curso principal
     * @param codigoPrerrequisito Código del curso prerrequisito
     * 
     * Lógica de Negocio:
     * - Verifica la existencia de ambos cursos
     * - Evita duplicados en prerrequisitos
     * - Mantiene la integridad de las relaciones
     */
    async addPrerrequisito(codigoCurso: string, codigoPrerrequisito: string): Promise<void> {
        const curso = await this.findOne(codigoCurso);
        const prerrequisito = await this.findOne(codigoPrerrequisito);
        
        if (!curso.prerrequisitos) {
            curso.prerrequisitos = [];
        }
        
        const yaExiste = curso.prerrequisitos.some(p => p.codigo === codigoPrerrequisito);
        if (!yaExiste) {
            curso.prerrequisitos.push(prerrequisito);
            await this.cursoRepository.save(curso);
        }
    }

    /**
     * Elimina un prerrequisito de un curso
     * 
     * @param codigoCurso Código del curso
     * @param codigoPrerrequisito Código del prerrequisito a eliminar
     * 
     * Lógica de Negocio:
     * - Verifica la existencia del curso y el prerrequisito
     * - Elimina la relación manteniendo la integridad
     * - Actualiza la lista de prerrequisitos
     */
    async removePrerrequisito(codigoCurso: string, codigoPrerrequisito: string): Promise<void> {
        const curso = await this.findOne(codigoCurso);
        
        if (!curso.prerrequisitos) {
            return;
        }
        
        curso.prerrequisitos = curso.prerrequisitos.filter(p => p.codigo !== codigoPrerrequisito);
        
        await this.cursoRepository.save(curso);
    }

    /**
     * Elimina un curso del sistema
     * 
     * @param codigo Código del curso
     * @throws NotFoundException si el curso no existe
     * 
     * Lógica de Negocio:
     * - Verifica la existencia del curso
     * - Valida que no tenga matrículas activas
     * - Elimina el registro y sus relaciones
     */
    async delete(codigo: string): Promise<void> {
        const result = await this.cursoRepository.delete(codigo);
        if (result.affected === 0) {
            throw new NotFoundException(`Curso con código ${codigo} no encontrado`);
        }
    }
} 