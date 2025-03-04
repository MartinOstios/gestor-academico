import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode } from '@nestjs/common';
import { EstudianteService } from '../services/estudiante.service';
import { Estudiante } from '../entities/estudiante.entity';
import { CreateEstudianteDto, UpdateEstudianteDto } from '../dto/estudiante.dto';

@Controller('estudiantes')
export class EstudianteController {
    constructor(private readonly estudianteService: EstudianteService) {}

    @Get()
    async findAll(): Promise<Estudiante[]> {
        return this.estudianteService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Estudiante> {
        return this.estudianteService.findOne(id);
    }

    @Get(':id/calificaciones')
    async findCalificaciones(@Param('id') id: string): Promise<any[]> {
        return this.estudianteService.findCalificaciones(id);
    }

    @Post()
    async create(@Body() createEstudianteDto: CreateEstudianteDto): Promise<Estudiante> {
        return this.estudianteService.create(createEstudianteDto);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateEstudianteDto: UpdateEstudianteDto
    ): Promise<Estudiante> {
        return this.estudianteService.update(id, updateEstudianteDto);
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string): Promise<void> {
        return this.estudianteService.delete(id);
    }
} 