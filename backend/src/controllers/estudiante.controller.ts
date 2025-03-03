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

    @Post()
    async create(@Body() createEstudianteDto: CreateEstudianteDto): Promise<Estudiante> {
        const estudiante = new Estudiante();
        estudiante.id = createEstudianteDto.id;
        estudiante.nombre = createEstudianteDto.nombre;
        estudiante.fechaNacimiento = createEstudianteDto.fechaNacimiento;
        return this.estudianteService.create(estudiante);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateEstudianteDto: UpdateEstudianteDto
    ): Promise<Estudiante> {
        const estudiante = new Estudiante();
        estudiante.nombre = updateEstudianteDto.nombre;
        estudiante.fechaNacimiento = updateEstudianteDto.fechaNacimiento;
        return this.estudianteService.update(id, estudiante);
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string): Promise<void> {
        return this.estudianteService.delete(id);
    }
} 