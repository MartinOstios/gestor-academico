import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as nodeCrypto from 'crypto';
import { getTypeOrmConfig } from './config/typeorm.config';

// Entidades
import { Departamento } from './entities/departamento.entity';
import { Profesor } from './entities/profesor.entity';
import { Curso } from './entities/curso.entity';
import { Estudiante } from './entities/estudiante.entity';
import { Matricula } from './entities/matricula.entity';
import { Evaluacion } from './entities/evaluacion.entity';
import { Calificacion } from './entities/calificacion.entity';
import { Usuario } from './entities/usuario.entity';
import { Horario } from './entities/horario.entity';

// Servicios
import { DepartamentoService } from './services/departamento.service';
import { ProfesorService } from './services/profesor.service';
import { CursoService } from './services/curso.service';
import { EstudianteService } from './services/estudiante.service';
import { MatriculaService } from './services/matricula.service';
import { EvaluacionService } from './services/evaluacion.service';
import { CalificacionService } from './services/calificacion.service';
import { HorarioService } from './services/horario.service';

// Controladores
import { DepartamentoController } from './controllers/departamento.controller';
import { ProfesorController } from './controllers/profesor.controller';
import { CursoController } from './controllers/curso.controller';
import { EstudianteController } from './controllers/estudiante.controller';
import { MatriculaController } from './controllers/matricula.controller';
import { EvaluacionController } from './controllers/evaluacion.controller';
import { CalificacionController } from './controllers/calificacion.controller';
import { HorarioController } from './controllers/horario.controller';

// Módulos
import { AuthModule } from './modules/auth.module';
import { IdGeneratorModule } from './strategies/id-generator.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getTypeOrmConfig,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      Departamento,
      Profesor,
      Curso,
      Estudiante,
      Matricula,
      Evaluacion,
      Calificacion,
      Horario
    ]),
    AuthModule,
    IdGeneratorModule
  ],
  controllers: [
    AppController,
    DepartamentoController,
    ProfesorController,
    CursoController,
    EstudianteController,
    MatriculaController,
    EvaluacionController,
    CalificacionController,
    HorarioController
  ],
  providers: [
    AppService,
    DepartamentoService,
    ProfesorService,
    CursoService,
    EstudianteService,
    MatriculaService,
    EvaluacionService,
    CalificacionService,
    HorarioService
  ],
})
export class AppModule {}
