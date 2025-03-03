import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatriculaService, CreateMatriculaDto } from '../../services/matricula.service';
import { EstudianteService, Estudiante } from '../../../estudiante/services/estudiante.service';
import { CursoService, Curso } from '../../../curso/services/curso.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-matricula-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Nueva Matrícula</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Estudiante</mat-label>
                <mat-select formControlName="estudianteId">
                  <mat-option *ngFor="let estudiante of estudiantes" [value]="estudiante.id">
                    {{ estudiante.nombre }}
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="form.get('estudianteId')?.hasError('required')">
                  El estudiante es requerido
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Curso</mat-label>
                <mat-select formControlName="cursoCodigo">
                  <mat-option *ngFor="let curso of cursos" [value]="curso.codigo">
                    {{ curso.nombre }}
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="form.get('cursoCodigo')?.hasError('required')">
                  El curso es requerido
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Fecha de Inscripción</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="fechaInscripcion">
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
                <mat-error *ngIf="form.get('fechaInscripcion')?.hasError('required')">
                  La fecha de inscripción es requerida
                </mat-error>
              </mat-form-field>
            </div>

            <div class="actions">
              <button mat-button type="button" (click)="onCancel()">Cancelar</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || isSubmitting">
                Crear Matrícula
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
    .container {
      padding: 20px;
    }

    .form-row {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }

    mat-form-field {
      flex: 1;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }
    `
  ]
})
export class MatriculaFormComponent implements OnInit {
  form: FormGroup;
  estudiantes: Estudiante[] = [];
  cursos: Curso[] = [];
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private matriculaService: MatriculaService,
    private estudianteService: EstudianteService,
    private cursoService: CursoService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      estudianteId: ['', Validators.required],
      cursoCodigo: ['', Validators.required],
      fechaInscripcion: [new Date(), Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarEstudiantes();
    this.cargarCursos();
  }

  cargarEstudiantes(): void {
    this.estudianteService.findAll().subscribe(
      estudiantes => {
        this.estudiantes = estudiantes;
      },
      error => {
        console.error('Error al cargar estudiantes', error);
        this.mostrarError('Error al cargar estudiantes');
      }
    );
  }

  cargarCursos(): void {
    this.cursoService.findAll().subscribe(
      cursos => {
        this.cursos = cursos;
      },
      error => {
        console.error('Error al cargar cursos', error);
        this.mostrarError('Error al cargar cursos');
      }
    );
  }

  onSubmit(): void {
    if (this.form.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const matriculaData: CreateMatriculaDto = {
        estudianteId: this.form.value.estudianteId,
        cursoCodigo: this.form.value.cursoCodigo,
        fechaInscripcion: this.form.value.fechaInscripcion
      };
      
      this.matriculaService.create(matriculaData).subscribe(
        () => {
          this.snackBar.open('Matrícula creada con éxito', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          this.router.navigate(['/matriculas']);
        },
        error => {
          this.isSubmitting = false;
          console.error('Error al crear matrícula', error);
          
          // Verificar si el error es por prerrequisitos no cumplidos
          if (error.error && error.error.message && error.error.message.includes('prerrequisitos')) {
            this.mostrarError(error.error.message);
          } else {
            this.mostrarError('Error al crear la matrícula. Por favor, inténtelo de nuevo.');
          }
        }
      );
    }
  }

  mostrarError(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });
  }

  onCancel(): void {
    this.router.navigate(['/matriculas']);
  }
} 