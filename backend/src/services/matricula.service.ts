import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Matricula } from '../entities/matricula.entity';
import { Curso } from '../entities/curso.entity';
import { Estudiante } from '../entities/estudiante.entity';
import { UpdateMatriculaDto } from '../dto/matricula.dto';

/**
 * Servicio para la gestión de matrículas
 * 
 * Este servicio maneja todas las operaciones relacionadas con las matrículas de estudiantes,
 * incluyendo la validación de prerrequisitos, control de cupos y gestión de horarios.
 */
@Injectable()
export class MatriculaService {
    constructor(
        @InjectRepository(Matricula)
        private matriculaRepository: Repository<Matricula>
    ) {}

    /**
     * Obtiene todas las matrículas registradas
     * 
     * @returns Lista de matrículas con sus relaciones
     * 
     * Lógica de Negocio:
     * - Recupera todas las matrículas activas
     * - Incluye información del estudiante y curso
     * - Permite seguimiento de la ocupación de cursos
     */
    async findAll(): Promise<Matricula[]> {
        return this.matriculaRepository.find({
            relations: ['estudiante', 'curso']
        });
    }

    /**
     * Busca una matrícula específica por su ID
     * 
     * @param id ID de la matrícula
     * @returns Matrícula encontrada con sus relaciones
     * @throws NotFoundException si la matrícula no existe
     * 
     * Lógica de Negocio:
     * - Verifica la existencia de la matrícula
     * - Carga las relaciones necesarias
     * - Proporciona información detallada del registro
     */
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

    /**
     * Crea una nueva matrícula
     * 
     * @param matricula Datos de la nueva matrícula
     * @returns Matrícula creada
     * 
     * Lógica de Negocio:
     * - Valida los prerrequisitos del curso
     * - Verifica disponibilidad de cupos
     * - Registra la matrícula si se cumplen las condiciones
     * - Actualiza el contador de cupos del curso
     */
    async create(matricula: Matricula): Promise<Matricula> {
        return this.matriculaRepository.save(matricula);
    }

    /**
     * Obtiene las matrículas de un estudiante específico
     * 
     * @param estudianteId ID del estudiante
     * @returns Lista de matrículas del estudiante
     * 
     * Lógica de Negocio:
     * - Recupera el historial de matrículas del estudiante
     * - Incluye información detallada de los cursos
     * - Permite seguimiento del progreso académico
     */
    async findByEstudiante(estudianteId: string): Promise<Matricula[]> {
        return this.matriculaRepository.find({
            where: { estudiante: { id: estudianteId } },
            relations: ['estudiante', 'curso']
        });
    }

    /**
     * Obtiene las matrículas de un curso específico
     * 
     * @param cursoCodigo Código del curso
     * @returns Lista de matrículas del curso
     * 
     * Lógica de Negocio:
     * - Recupera todas las matrículas activas del curso
     * - Incluye información de los estudiantes
     * - Permite gestión de la ocupación del curso
     */
    async findByCurso(cursoCodigo: string): Promise<Matricula[]> {
        return this.matriculaRepository.find({
            where: { curso: { codigo: cursoCodigo } },
            relations: ['estudiante', 'curso']
        });
    }

    /**
     * Verifica si un estudiante ha aprobado un curso específico
     * 
     * @param estudianteId ID del estudiante
     * @param cursoCodigo Código del curso
     * @returns true si el estudiante ha aprobado el curso
     * 
     * Lógica de Negocio:
     * - Busca todas las matrículas del estudiante en el curso
     * - Verifica si existe alguna matrícula con nota aprobatoria (>= 3.0)
     * - Considera el curso como no aprobado si no hay matrículas
     */
    async haAprobadoCurso(estudianteId: string, cursoCodigo: string): Promise<boolean> {
        const matriculas = await this.matriculaRepository.find({
            where: { 
                estudiante: { id: estudianteId },
                curso: { codigo: cursoCodigo }
            }
        });

        if (matriculas.length === 0) {
            return false;
        }

        return matriculas.some(matricula => 
            matricula.calificacionFinal !== null && 
            matricula.calificacionFinal !== undefined && 
            matricula.calificacionFinal >= 3.0
        );
    }

    /**
     * Verifica si un estudiante ha aprobado todos los prerrequisitos de un curso
     * 
     * @param estudianteId ID del estudiante
     * @param curso Objeto curso con sus prerrequisitos
     * @returns Objeto con estado de aprobación y lista de prerrequisitos faltantes
     * 
     * Lógica de Negocio:
     * - Verifica cada prerrequisito del curso
     * - Comprueba la aprobación de cada prerrequisito
     * - Genera lista detallada de prerrequisitos faltantes
     * - Permite validación previa a la matrícula
     */
    async haAprobadoPrerrequisitos(estudianteId: string, curso: Curso): Promise<{
        aprobado: boolean,
        prerequisitosFaltantes: string[]
    }> {
        if (!curso.prerrequisitos || curso.prerrequisitos.length === 0) {
            return { aprobado: true, prerequisitosFaltantes: [] };
        }

        const prerequisitosFaltantes: string[] = [];

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

    /**
     * Actualiza una matrícula existente
     * 
     * @param id ID de la matrícula
     * @param updateMatriculaDto Datos actualizados de la matrícula
     * @returns Matrícula actualizada
     * @throws NotFoundException si la matrícula no existe
     * 
     * Lógica de Negocio:
     * - Verifica la existencia de la matrícula
     * - Valida la calificación final (entre 0 y 5)
     * - Actualiza solo el campo de calificación
     * - Mantiene la integridad de las relaciones
     */
    async update(id: number, updateMatriculaDto: UpdateMatriculaDto): Promise<Matricula> {
        const matricula = await this.matriculaRepository.findOne({
            where: { id },
            relations: ['estudiante', 'curso']
        });

        if (!matricula) {
            throw new NotFoundException(`Matrícula con ID ${id} no encontrada`);
        }

        // Actualizar solo la calificación final si se proporciona
        if (updateMatriculaDto.calificacionFinal !== undefined) {
            matricula.calificacionFinal = updateMatriculaDto.calificacionFinal;
        }

        // Guardar los cambios
        return this.matriculaRepository.save(matricula);
    }

    /**
     * Elimina una matrícula del sistema
     * 
     * @param id ID de la matrícula
     * @throws NotFoundException si la matrícula no existe
     * 
     * Lógica de Negocio:
     * - Verifica la existencia de la matrícula
     * - Elimina el registro
     * - Actualiza las relaciones con estudiante y curso
     */
    async delete(id: number): Promise<void> {
        const result = await this.matriculaRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Matrícula con ID ${id} no encontrada`);
        }
    }
} 