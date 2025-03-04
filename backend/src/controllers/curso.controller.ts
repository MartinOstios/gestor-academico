import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, Query } from '@nestjs/common';
import { CursoService } from '../services/curso.service';
import { Curso } from '../entities/curso.entity';
import { CreateCursoDto, UpdateCursoDto, AddPrerrequisitosDto } from '../dto/curso.dto';

@Controller('cursos')
export class CursoController {
    constructor(
        private readonly cursoService: CursoService
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
        return this.cursoService.create(createCursoDto);
    }

    @Put(':codigo')
    async update(
        @Param('codigo') codigo: string,
        @Body() updateCursoDto: UpdateCursoDto
    ): Promise<Curso> {
        return this.cursoService.update(codigo, updateCursoDto);
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