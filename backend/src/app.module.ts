import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Entidades
import { Departamento } from './entities/departamento.entity';
import { Profesor } from './entities/profesor.entity';
import { Curso } from './entities/curso.entity';
import { Estudiante } from './entities/estudiante.entity';
import { Matricula } from './entities/matricula.entity';
import { Evaluacion } from './entities/evaluacion.entity';
import { Calificacion } from './entities/calificacion.entity';
import { Usuario } from './entities/usuario.entity';

// Servicios
import { DepartamentoService } from './services/departamento.service';
import { ProfesorService } from './services/profesor.service';
import { CursoService } from './services/curso.service';
import { EstudianteService } from './services/estudiante.service';
import { MatriculaService } from './services/matricula.service';
import { EvaluacionService } from './services/evaluacion.service';
import { CalificacionService } from './services/calificacion.service';

// Controladores
import { DepartamentoController } from './controllers/departamento.controller';
import { ProfesorController } from './controllers/profesor.controller';
import { CursoController } from './controllers/curso.controller';
import { EstudianteController } from './controllers/estudiante.controller';
import { MatriculaController } from './controllers/matricula.controller';
import { EvaluacionController } from './controllers/evaluacion.controller';
import { CalificacionController } from './controllers/calificacion.controller';

// Módulos
import { AuthModule } from './modules/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'sistema_academico',
      entities: [
        Departamento,
        Profesor,
        Curso,
        Estudiante,
        Matricula,
        Evaluacion,
        Calificacion,
        Usuario
      ],
      synchronize: true, // Solo usar en desarrollo
    }),
    TypeOrmModule.forFeature([
      Departamento,
      Profesor,
      Curso,
      Estudiante,
      Matricula,
      Evaluacion,
      Calificacion
    ]),
    AuthModule
  ],
  controllers: [
    AppController,
    DepartamentoController,
    ProfesorController,
    CursoController,
    EstudianteController,
    MatriculaController,
    EvaluacionController,
    CalificacionController
  ],
  providers: [
    AppService,
    DepartamentoService,
    ProfesorService,
    CursoService,
    EstudianteService,
    MatriculaService,
    EvaluacionService,
    CalificacionService
  ],
})
export class AppModule {}
