import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Departamento } from '../entities/departamento.entity';
import { IdGeneratorContext } from '../strategies/id-generator.strategy';
import { CreateDepartamentoDto, UpdateDepartamentoDto } from '../dto/departamento.dto';

@Injectable()
export class DepartamentoService {
    constructor(
        @InjectRepository(Departamento)
        private departamentoRepository: Repository<Departamento>,
        private idGenerator: IdGeneratorContext
    ) {}

    async findAll(): Promise<Departamento[]> {
        return this.departamentoRepository.find({
            relations: ['profesores']
        });
    }

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

    async create(createDepartamentoDto: CreateDepartamentoDto): Promise<Departamento> {
        // Generar código automáticamente
        const codigo = await this.idGenerator.generateId('departamento', this.departamentoRepository);
        
        // Crear nueva instancia con el código generado
        const nuevoDepartamento = this.departamentoRepository.create({
            codigo,
            nombre: createDepartamentoDto.nombre
        });
        
        return this.departamentoRepository.save(nuevoDepartamento);
    }

    async update(codigo: string, updateDepartamentoDto: UpdateDepartamentoDto): Promise<Departamento> {
        const existingDepartamento = await this.findOne(codigo);
        if (!existingDepartamento) {
            throw new NotFoundException(`Departamento con código ${codigo} no encontrado`);
        }
        
        // Actualizar solo los campos proporcionados
        if (updateDepartamentoDto.nombre) {
            existingDepartamento.nombre = updateDepartamentoDto.nombre;
        }
        
        await this.departamentoRepository.save(existingDepartamento);
        return this.findOne(codigo);
    }

    async delete(codigo: string): Promise<void> {
        const result = await this.departamentoRepository.delete(codigo);
        if (result.affected === 0) {
            throw new NotFoundException(`Departamento con código ${codigo} no encontrado`);
        }
    }
} 