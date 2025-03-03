import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Matricula } from '../entities/matricula.entity';
import { Curso } from '../entities/curso.entity';
import { Estudiante } from '../entities/estudiante.entity';

@Injectable()
export class MatriculaService {
    constructor(
        @InjectRepository(Matricula)
        private matriculaRepository: Repository<Matricula>
    ) {}

    async findAll(): Promise<Matricula[]> {
        return this.matriculaRepository.find({
            relations: ['estudiante', 'curso']
        });
    }

    async findOne(id: number): Promise<Matricula> {
        const matricula = await this.matriculaRepository.findOne({
            where: { id },
            relations: ['estudiante', 'curso']
        });

        if (!matricula) {
            throw new NotFoundException(`Matrícula con ID ${id} no encontrada`);
        }

        return matricula;
    }

    async create(matricula: Matricula): Promise<Matricula> {
        return this.matriculaRepository.save(matricula);
    }

    async update(id: number, matricula: Partial<Matricula>): Promise<Matricula> {
        const existingMatricula = await this.findOne(id);
        if (!existingMatricula) {
            throw new NotFoundException(`Matrícula con ID ${id} no encontrada`);
        }
        await this.matriculaRepository.update(id, matricula);
        return this.findOne(id);
    }

    async delete(id: number): Promise<void> {
        const result = await this.matriculaRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Matrícula con ID ${id} no encontrada`);
        }
    }

    async findByEstudiante(estudianteId: string): Promise<Matricula[]> {
        return this.matriculaRepository.find({
            where: { estudiante: { id: estudianteId } },
            relations: ['estudiante', 'curso']
        });
    }

    async findByCurso(cursoCodigo: string): Promise<Matricula[]> {
        return this.matriculaRepository.find({
            where: { curso: { codigo: cursoCodigo } },
            relations: ['estudiante', 'curso']
        });
    }

    /**
     * Verifica si un estudiante ha aprobado un curso específico
     * @param estudianteId ID del estudiante
     * @param cursoCodigo Código del curso
     * @returns true si el estudiante ha aprobado el curso, false en caso contrario
     */
    async haAprobadoCurso(estudianteId: string, cursoCodigo: string): Promise<boolean> {
        const matriculas = await this.matriculaRepository.find({
            where: { 
                estudiante: { id: estudianteId },
                curso: { codigo: cursoCodigo }
            }
        });

        // Si no hay matrículas, el estudiante no ha cursado la materia
        if (matriculas.length === 0) {
            return false;
        }

        // Verificar si alguna matrícula tiene calificación final >= 3.0
        return matriculas.some(matricula => 
            matricula.calificacionFinal !== null && 
            matricula.calificacionFinal !== undefined && 
            matricula.calificacionFinal >= 3.0
        );
    }

    /**
     * Verifica si un estudiante ha aprobado todos los prerrequisitos de un curso
     * @param estudianteId ID del estudiante
     * @param curso Objeto curso con sus prerrequisitos
     * @returns true si el estudiante ha aprobado todos los prerrequisitos, false en caso contrario
     */
    async haAprobadoPrerrequisitos(estudianteId: string, curso: Curso): Promise<{aprobado: boolean, prerequisitosFaltantes: string[]}> {
        // Si el curso no tiene prerrequisitos, se considera aprobado
        if (!curso.prerrequisitos || curso.prerrequisitos.length === 0) {
            return { aprobado: true, prerequisitosFaltantes: [] };
        }

        const prerequisitosFaltantes: string[] = [];

        // Verificar cada prerrequisito
        for (const prerrequisito of curso.prerrequisitos) {
            const aprobado = await this.haAprobadoCurso(estudianteId, prerrequisito.codigo);
            if (!aprobado) {
                prerequisitosFaltantes.push(prerrequisito.nombre);
            }
        }

        return { 
            aprobado: prerequisitosFaltantes.length === 0,
            prerequisitosFaltantes
        };
    }
} 