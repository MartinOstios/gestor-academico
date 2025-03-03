import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, Query } from '@nestjs/common';
import { CursoService } from '../services/curso.service';
import { Curso } from '../entities/curso.entity';
import { CreateCursoDto, UpdateCursoDto, AddPrerrequisitosDto } from '../dto/curso.dto';
import { ProfesorService } from '../services/profesor.service';

@Controller('cursos')
export class CursoController {
    constructor(
        private readonly cursoService: CursoService,
        private readonly profesorService: ProfesorService
    ) {}

    @Get()
    async findAll(): Promise<Curso[]> {
        return this.cursoService.findAll();
    }

    @Get(':codigo')
    async findOne(
        @Param('codigo') codigo: string,
        @Query('incluirPrerrequisitos') incluirPrerrequisitos?: string
    ): Promise<Curso> {
        const incluir = incluirPrerrequisitos === 'true';
        return this.cursoService.findOne(codigo, incluir);
    }

    @Post()
    async create(@Body() createCursoDto: CreateCursoDto): Promise<Curso> {
        const curso = new Curso();
        curso.codigo = createCursoDto.codigo;
        curso.nombre = createCursoDto.nombre;
        curso.descripcion = createCursoDto.descripcion;
        curso.horario = createCursoDto.horario;
        
        // Asignar el profesor al curso
        const profesor = await this.profesorService.findOne(createCursoDto.profesorId);
        curso.profesor = profesor;
        
        // Crear el curso
        const nuevoCurso = await this.cursoService.create(curso);
        
        // Agregar prerrequisitos si existen
        if (createCursoDto.prerrequisitoCodigos && createCursoDto.prerrequisitoCodigos.length > 0) {
            for (const codigoPrerrequisito of createCursoDto.prerrequisitoCodigos) {
                await this.cursoService.addPrerrequisito(nuevoCurso.codigo, codigoPrerrequisito);
            }
            // Recargar el curso con los prerrequisitos
            return this.cursoService.findOne(nuevoCurso.codigo);
        }
        
        return nuevoCurso;
    }

    @Put(':codigo')
    async update(
        @Param('codigo') codigo: string,
        @Body() updateCursoDto: UpdateCursoDto
    ): Promise<Curso> {
        const curso = new Curso();
        if (updateCursoDto.nombre) curso.nombre = updateCursoDto.nombre;
        if (updateCursoDto.descripcion) curso.descripcion = updateCursoDto.descripcion;
        if (updateCursoDto.horario) curso.horario = updateCursoDto.horario;
        
        // Actualizar el profesor si se proporciona
        if (updateCursoDto.profesorId) {
            const profesor = await this.profesorService.findOne(updateCursoDto.profesorId);
            curso.profesor = profesor;
        }
        
        return this.cursoService.update(codigo, curso);
    }

    @Delete(':codigo')
    @HttpCode(204)
    async delete(@Param('codigo') codigo: string): Promise<void> {
        return this.cursoService.delete(codigo);
    }

    @Post(':codigo/prerrequisitos')
    async addPrerrequisitos(
        @Param('codigo') codigo: string,
        @Body() addPrerrequisitosDto: AddPrerrequisitosDto
    ): Promise<Curso> {
        const curso = await this.cursoService.findOne(codigo);
        for (const codigoPrerrequisito of addPrerrequisitosDto.codigosPrerrequisitos) {
            await this.cursoService.addPrerrequisito(codigo, codigoPrerrequisito);
        }
        return this.cursoService.findOne(codigo);
    }
} 