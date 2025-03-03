import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, BadRequestException } from '@nestjs/common';
import { MatriculaService } from '../services/matricula.service';
import { Matricula } from '../entities/matricula.entity';
import { CreateMatriculaDto, UpdateMatriculaDto } from '../dto/matricula.dto';
import { EstudianteService } from '../services/estudiante.service';
import { CursoService } from '../services/curso.service';

@Controller('matriculas')
export class MatriculaController {
    constructor(
        private readonly matriculaService: MatriculaService,
        private readonly estudianteService: EstudianteService,
        private readonly cursoService: CursoService
    ) {}

    @Get()
    async findAll(): Promise<Matricula[]> {
        return this.matriculaService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Matricula> {
        return this.matriculaService.findOne(id);
    }

    @Get('estudiante/:estudianteId')
    async findByEstudiante(@Param('estudianteId') estudianteId: string): Promise<Matricula[]> {
        return this.matriculaService.findByEstudiante(estudianteId);
    }

    @Get('curso/:codigoCurso')
    async findByCurso(@Param('codigoCurso') codigoCurso: string): Promise<Matricula[]> {
        return this.matriculaService.findByCurso(codigoCurso);
    }

    @Post()
    async create(@Body() createMatriculaDto: CreateMatriculaDto): Promise<Matricula> {
        // Obtener el estudiante
        const estudiante = await this.estudianteService.findOne(createMatriculaDto.estudianteId);
        
        // Obtener el curso con sus prerrequisitos
        const curso = await this.cursoService.findOne(createMatriculaDto.cursoCodigo, true);
        
        // Verificar si el estudiante ha aprobado los prerrequisitos
        const verificacionPrerrequisitos = await this.matriculaService.haAprobadoPrerrequisitos(
            createMatriculaDto.estudianteId, 
            curso
        );
        
        // Si no ha aprobado todos los prerrequisitos, lanzar una excepción
        if (!verificacionPrerrequisitos.aprobado) {
            throw new BadRequestException(
                `El estudiante no cumple con los prerrequisitos del curso. Prerrequisitos faltantes: ${verificacionPrerrequisitos.prerequisitosFaltantes.join(', ')}`
            );
        }
        
        // Crear la matrícula
        const matricula = new Matricula();
        matricula.fechaInscripcion = createMatriculaDto.fechaInscripcion;
        matricula.estudiante = estudiante;
        matricula.curso = curso;
        
        return this.matriculaService.create(matricula);
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() updateMatriculaDto: UpdateMatriculaDto
    ): Promise<Matricula> {
        return this.matriculaService.update(id, updateMatriculaDto);
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: number): Promise<void> {
        return this.matriculaService.delete(id);
    }
} 