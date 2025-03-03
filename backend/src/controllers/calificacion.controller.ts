import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode } from '@nestjs/common';
import { CalificacionService } from '../services/calificacion.service';
import { Calificacion } from '../entities/calificacion.entity';
import { CreateCalificacionDto, UpdateCalificacionDto } from '../dto/calificacion.dto';
import { EstudianteService } from '../services/estudiante.service';
import { EvaluacionService } from '../services/evaluacion.service';

@Controller('calificaciones')
export class CalificacionController {
    constructor(
        private readonly calificacionService: CalificacionService,
        private readonly estudianteService: EstudianteService,
        private readonly evaluacionService: EvaluacionService
    ) {}

    @Get()
    async findAll(): Promise<Calificacion[]> {
        return this.calificacionService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Calificacion> {
        return this.calificacionService.findOne(id);
    }

    @Get('estudiante/:estudianteId')
    async findByEstudiante(@Param('estudianteId') estudianteId: string): Promise<Calificacion[]> {
        return this.calificacionService.findByEstudiante(estudianteId);
    }

    @Get('evaluacion/:evaluacionId')
    async findByEvaluacion(@Param('evaluacionId') evaluacionId: string): Promise<Calificacion[]> {
        return this.calificacionService.findByEvaluacion(evaluacionId);
    }

    @Post()
    async create(@Body() createCalificacionDto: CreateCalificacionDto): Promise<Calificacion> {
        const calificacion = new Calificacion();
        calificacion.valor = createCalificacionDto.valor;
        
        // Asignar el estudiante a la calificación
        const estudiante = await this.estudianteService.findOne(createCalificacionDto.estudianteId);
        calificacion.estudiante = estudiante;
        
        // Asignar la evaluación a la calificación
        const evaluacion = await this.evaluacionService.findOne(createCalificacionDto.evaluacionId);
        calificacion.evaluacion = evaluacion;
        
        return this.calificacionService.create(calificacion);
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() updateCalificacionDto: UpdateCalificacionDto
    ): Promise<Calificacion> {
        const calificacion = new Calificacion();
        calificacion.valor = updateCalificacionDto.valor;
        return this.calificacionService.update(id, calificacion);
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: number): Promise<void> {
        return this.calificacionService.delete(id);
    }
} 