import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profesor } from '../entities/profesor.entity';
import { ProfesorController } from '../controllers/profesor.controller';
import { ProfesorService } from '../services/profesor.service';
import { DepartamentoService } from '../services/departamento.service';
import { Departamento } from '../entities/departamento.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profesor, Departamento])
  ],
  controllers: [ProfesorController],
  providers: [ProfesorService, DepartamentoService],
  exports: [ProfesorService]
})
export class ProfesorModule {} 