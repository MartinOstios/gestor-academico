import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curso } from '../entities/curso.entity';
import { Profesor } from '../entities/profesor.entity';
import { IdGeneratorContext } from '../strategies/id-generator.strategy';
import { CreateCursoDto, UpdateCursoDto } from '../dto/curso.dto';

@Injectable()
export class CursoService {
    constructor(
        @InjectRepository(Curso)
        private cursoRepository: Repository<Curso>,
        @InjectRepository(Profesor)
        private profesorRepository: Repository<Profesor>,
        private idGenerator: IdGeneratorContext
    ) {}

    async findAll(): Promise<Curso[]> {
        return this.cursoRepository.find({
            relations: ['profesor', 'prerrequisitos', 'evaluaciones']
        });
    }

    /**
     * Busca un curso por su código
     * @param codigo Código del curso
     * @param incluirPrerrequisitos Si es true, carga los prerrequisitos de los prerrequisitos (recursivamente)
     * @returns El curso encontrado
     */
    async findOne(codigo: string, incluirPrerrequisitos: boolean = false): Promise<Curso> {
        let relations = ['profesor', 'evaluaciones'];
        
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

    async create(createCursoDto: CreateCursoDto): Promise<Curso> {
        // Generar código automáticamente
        const codigo = await this.idGenerator.generateId('curso', this.cursoRepository);
        
        // Buscar el profesor
        const profesor = await this.profesorRepository.findOne({
            where: { id: createCursoDto.profesorId }
        });
        
        if (!profesor) {
            throw new NotFoundException(`Profesor con ID ${createCursoDto.profesorId} no encontrado`);
        }
        
        // Crear nueva instancia con el código generado
        const nuevoCurso = this.cursoRepository.create({
            codigo,
            nombre: createCursoDto.nombre,
            descripcion: createCursoDto.descripcion,
            horario: createCursoDto.horario,
            profesor
        });
        
        // Guardar el curso
        const cursoGuardado = await this.cursoRepository.save(nuevoCurso);
        
        // Agregar prerrequisitos si se proporcionan
        if (createCursoDto.prerrequisitoCodigos && createCursoDto.prerrequisitoCodigos.length > 0) {
            for (const codigoPrerrequisito of createCursoDto.prerrequisitoCodigos) {
                await this.addPrerrequisito(cursoGuardado.codigo, codigoPrerrequisito);
            }
            // Recargar el curso con los prerrequisitos
            return this.findOne(cursoGuardado.codigo);
        }
        
        return cursoGuardado;
    }

    async update(codigo: string, updateCursoDto: UpdateCursoDto): Promise<Curso> {
        const existingCurso = await this.findOne(codigo);
        if (!existingCurso) {
            throw new NotFoundException(`Curso con código ${codigo} no encontrado`);
        }
        
        // Actualizar propiedades básicas
        if (updateCursoDto.nombre) {
            existingCurso.nombre = updateCursoDto.nombre;
        }
        
        if (updateCursoDto.descripcion) {
            existingCurso.descripcion = updateCursoDto.descripcion;
        }
        
        if (updateCursoDto.horario) {
            existingCurso.horario = updateCursoDto.horario;
        }
        
        // Actualizar profesor si se proporciona
        if (updateCursoDto.profesorId) {
            const profesor = await this.profesorRepository.findOne({
                where: { id: updateCursoDto.profesorId }
            });
            
            if (!profesor) {
                throw new NotFoundException(`Profesor con ID ${updateCursoDto.profesorId} no encontrado`);
            }
            
            existingCurso.profesor = profesor;
        }
        
        // Guardar los cambios
        await this.cursoRepository.save(existingCurso);
        
        // Retornar el curso actualizado
        return this.findOne(codigo);
    }

    async delete(codigo: string): Promise<void> {
        const result = await this.cursoRepository.delete(codigo);
        if (result.affected === 0) {
            throw new NotFoundException(`Curso con código ${codigo} no encontrado`);
        }
    }

    async addPrerrequisito(codigoCurso: string, codigoPrerrequisito: string): Promise<void> {
        const curso = await this.findOne(codigoCurso);
        const prerrequisito = await this.findOne(codigoPrerrequisito);
        
        if (!curso.prerrequisitos) {
            curso.prerrequisitos = [];
        }
        
        // Verificar si ya existe el prerrequisito
        const yaExiste = curso.prerrequisitos.some(p => p.codigo === codigoPrerrequisito);
        if (!yaExiste) {
            curso.prerrequisitos.push(prerrequisito);
            await this.cursoRepository.save(curso);
        }
    }
} 