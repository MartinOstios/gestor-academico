import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profesor } from '../entities/profesor.entity';
import { IdGeneratorContext } from '../strategies/id-generator.strategy';
import { CreateProfesorDto, UpdateProfesorDto } from '../dto/profesor.dto';
import { Departamento } from '../entities/departamento.entity';

@Injectable()
export class ProfesorService {
    constructor(
        @InjectRepository(Profesor)
        private profesorRepository: Repository<Profesor>,
        @InjectRepository(Departamento)
        private departamentoRepository: Repository<Departamento>,
        private idGenerator: IdGeneratorContext
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

    async create(createProfesorDto: CreateProfesorDto): Promise<Profesor> {
        // Generar ID automáticamente usando la estrategia
        const generatedId = await this.idGenerator.generateId('profesor', this.profesorRepository);
        
        // Crear nueva instancia con el ID generado
        const nuevoProfesor = this.profesorRepository.create({
            id: generatedId,
            nombre: createProfesorDto.nombre,
            fechaContratacion: createProfesorDto.fechaContratacion
        });
        
        // Asignar departamento si se proporciona el código
        if (createProfesorDto.departamentoCodigo) {
            const departamento = await this.departamentoRepository.findOne({
                where: { codigo: createProfesorDto.departamentoCodigo }
            });
            
            if (!departamento) {
                throw new NotFoundException(`Departamento con código ${createProfesorDto.departamentoCodigo} no encontrado`);
            }
            
            nuevoProfesor.departamento = departamento;
        }
        
        // Guardar el profesor
        const savedProfesor = await this.profesorRepository.save(nuevoProfesor);
        
        // Retornar el profesor con sus relaciones cargadas
        return this.findOne(savedProfesor.id);
    }

    async update(id: string, updateProfesorDto: UpdateProfesorDto): Promise<Profesor> {
        const existingProfesor = await this.findOne(id);
        if (!existingProfesor) {
            throw new NotFoundException(`Profesor con ID ${id} no encontrado`);
        }
        
        // Actualizar propiedades básicas
        if (updateProfesorDto.nombre) {
            existingProfesor.nombre = updateProfesorDto.nombre;
        }
        
        if (updateProfesorDto.fechaContratacion) {
            existingProfesor.fechaContratacion = updateProfesorDto.fechaContratacion;
        }
        
        // Actualizar departamento si se proporciona el código
        if (updateProfesorDto.departamentoCodigo) {
            const departamento = await this.departamentoRepository.findOne({
                where: { codigo: updateProfesorDto.departamentoCodigo }
            });
            
            if (!departamento) {
                throw new NotFoundException(`Departamento con código ${updateProfesorDto.departamentoCodigo} no encontrado`);
            }
            
            existingProfesor.departamento = departamento;
        }
        
        // Guardar los cambios
        await this.profesorRepository.save(existingProfesor);
        
        // Retornar el profesor actualizado con sus relaciones
        return this.findOne(id);
    }

    async delete(id: string): Promise<void> {
        const result = await this.profesorRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Profesor con ID ${id} no encontrado`);
        }
    }
} 