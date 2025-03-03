import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Departamento } from '../entities/departamento.entity';

@Injectable()
export class DepartamentoService {
    constructor(
        @InjectRepository(Departamento)
        private departamentoRepository: Repository<Departamento>
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

    async create(departamento: Departamento): Promise<Departamento> {
        return this.departamentoRepository.save(departamento);
    }

    async update(codigo: string, departamento: Departamento): Promise<Departamento> {
        const existingDepartamento = await this.findOne(codigo);
        if (!existingDepartamento) {
            throw new NotFoundException(`Departamento con código ${codigo} no encontrado`);
        }
        await this.departamentoRepository.update(codigo, departamento);
        return this.findOne(codigo);
    }

    async delete(codigo: string): Promise<void> {
        const result = await this.departamentoRepository.delete(codigo);
        if (result.affected === 0) {
            throw new NotFoundException(`Departamento con código ${codigo} no encontrado`);
        }
    }
} 