import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode } from '@nestjs/common';
import { DepartamentoService } from '../services/departamento.service';
import { Departamento } from '../entities/departamento.entity';
import { CreateDepartamentoDto, UpdateDepartamentoDto } from '../dto/departamento.dto';

@Controller('departamentos')
export class DepartamentoController {
    constructor(private readonly departamentoService: DepartamentoService) {}

    @Get()
    async findAll(): Promise<Departamento[]> {
        return this.departamentoService.findAll();
    }

    @Get(':codigo')
    async findOne(@Param('codigo') codigo: string): Promise<Departamento> {
        return this.departamentoService.findOne(codigo);
    }

    @Post()
    async create(@Body() createDepartamentoDto: CreateDepartamentoDto): Promise<Departamento> {
        const departamento = new Departamento();
        departamento.codigo = createDepartamentoDto.codigo;
        departamento.nombre = createDepartamentoDto.nombre;
        return this.departamentoService.create(departamento);
    }

    @Put(':codigo')
    async update(
        @Param('codigo') codigo: string,
        @Body() updateDepartamentoDto: UpdateDepartamentoDto
    ): Promise<Departamento> {
        const departamento = new Departamento();
        departamento.nombre = updateDepartamentoDto.nombre;
        return this.departamentoService.update(codigo, departamento);
    }

    @Delete(':codigo')
    @HttpCode(204)
    async delete(@Param('codigo') codigo: string): Promise<void> {
        return this.departamentoService.delete(codigo);
    }
} 