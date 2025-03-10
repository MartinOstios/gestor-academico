import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, Query } from '@nestjs/common';
import { HorarioService } from '../services/horario.service';
import { Horario } from '../entities/horario.entity';
import { CreateHorarioDto, UpdateHorarioDto } from '../dto/horario.dto';

@Controller('horarios')
export class HorarioController {
    constructor(
        private readonly horarioService: HorarioService
    ) {}

    @Get()
    async findAll(): Promise<Horario[]> {
        return this.horarioService.findAll();
    }

    @Get('curso/:cursoCodigo')
    async findByCurso(@Param('cursoCodigo') cursoCodigo: string): Promise<Horario[]> {
        return this.horarioService.findByCurso(cursoCodigo);
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Horario> {
        return this.horarioService.findOne(id);
    }

    @Post()
    async create(@Body() createHorarioDto: CreateHorarioDto): Promise<Horario> {
        return this.horarioService.create(createHorarioDto);
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() updateHorarioDto: UpdateHorarioDto
    ): Promise<Horario> {
        return this.horarioService.update(id, updateHorarioDto);
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: number): Promise<void> {
        return this.horarioService.delete(id);
    }
} 