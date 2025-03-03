import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode } from '@nestjs/common';
import { ProfesorService } from '../services/profesor.service';
import { Profesor } from '../entities/profesor.entity';
import { CreateProfesorDto, UpdateProfesorDto } from '../dto/profesor.dto';
import { DepartamentoService } from '../services/departamento.service';

@Controller('profesores')
export class ProfesorController {
    constructor(
        private readonly profesorService: ProfesorService,
        private readonly departamentoService: DepartamentoService
    ) {}

    @Get()
    async findAll(): Promise<Profesor[]> {
        return this.profesorService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Profesor> {
        return this.profesorService.findOne(id);
    }

    @Post()
    async create(@Body() createProfesorDto: CreateProfesorDto): Promise<Profesor> {
        console.log('DTO recibido:', createProfesorDto);
        
        const profesor = new Profesor();
        profesor.id = createProfesorDto.id;
        profesor.nombre = createProfesorDto.nombre;
        profesor.fechaContratacion = createProfesorDto.fechaContratacion;
        
        // Buscar y asignar el departamento
        if (createProfesorDto.departamentoCodigo) {
            console.log('Buscando departamento con código:', createProfesorDto.departamentoCodigo);
            const departamento = await this.departamentoService.findOne(createProfesorDto.departamentoCodigo);
            console.log('Departamento encontrado:', departamento);
            profesor.departamento = departamento;
        }
        
        const result = await this.profesorService.create(profesor);
        console.log('Profesor creado:', result);
        return result;
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateProfesorDto: UpdateProfesorDto
    ): Promise<Profesor> {
        console.log('DTO de actualización recibido:', updateProfesorDto);
        
        const profesor = new Profesor();
        profesor.nombre = updateProfesorDto.nombre;
        if (updateProfesorDto.fechaContratacion) {
            profesor.fechaContratacion = updateProfesorDto.fechaContratacion;
        }
        
        // Actualizar el departamento si se proporciona
        if (updateProfesorDto.departamentoCodigo) {
            console.log('Buscando departamento con código:', updateProfesorDto.departamentoCodigo);
            const departamento = await this.departamentoService.findOne(updateProfesorDto.departamentoCodigo);
            console.log('Departamento encontrado:', departamento);
            profesor.departamento = departamento;
        }
        
        const result = await this.profesorService.update(id, profesor);
        console.log('Profesor actualizado:', result);
        return result;
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string): Promise<void> {
        return this.profesorService.delete(id);
    }
} 