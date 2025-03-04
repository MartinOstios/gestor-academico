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
        
        return this.profesorService.create(createProfesorDto);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateProfesorDto: UpdateProfesorDto
    ): Promise<Profesor> {
        console.log('DTO de actualización recibido:', updateProfesorDto);
        
        return this.profesorService.update(id, updateProfesorDto);
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string): Promise<void> {
        return this.profesorService.delete(id);
    }
} 