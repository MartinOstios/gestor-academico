import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode } from '@nestjs/common';
import { EvaluacionService } from '../services/evaluacion.service';
import { Evaluacion } from '../entities/evaluacion.entity';
import { CreateEvaluacionDto, UpdateEvaluacionDto } from '../dto/evaluacion.dto';
import { CursoService } from '../services/curso.service';

@Controller('evaluaciones')
export class EvaluacionController {
    constructor(
        private readonly evaluacionService: EvaluacionService,
        private readonly cursoService: CursoService
    ) {}

    @Get()
    async findAll(): Promise<Evaluacion[]> {
        return this.evaluacionService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Evaluacion> {
        return this.evaluacionService.findOne(id);
    }

    @Get('curso/:codigoCurso')
    async findByCurso(@Param('codigoCurso') codigoCurso: string): Promise<Evaluacion[]> {
        return this.evaluacionService.findByCurso(codigoCurso);
    }

    @Post()
    async create(@Body() createEvaluacionDto: CreateEvaluacionDto): Promise<Evaluacion> {
        const evaluacion = new Evaluacion();
        evaluacion.id = createEvaluacionDto.id;
        evaluacion.fechaRealizacion = createEvaluacionDto.fechaRealizacion;
        
        // Asignar el curso a la evaluación
        const curso = await this.cursoService.findOne(createEvaluacionDto.cursoCodigo);
        evaluacion.curso = curso;
        
        return this.evaluacionService.create(evaluacion);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateEvaluacionDto: UpdateEvaluacionDto
    ): Promise<Evaluacion> {
        const evaluacion = new Evaluacion();
        evaluacion.fechaRealizacion = updateEvaluacionDto.fechaRealizacion;
        return this.evaluacionService.update(id, evaluacion);
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string): Promise<void> {
        return this.evaluacionService.delete(id);
    }
} 