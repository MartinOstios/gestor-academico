import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CalificacionService, CreateCalificacionDto, UpdateCalificacionDto } from '../../services/calificacion.service';
import { EstudianteService, Estudiante } from '../../../estudiante/services/estudiante.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EvaluacionService } from '../../services/evaluacion.service';
import { MatriculaService } from '../../../matricula/services/matricula.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-calificacion-form',
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
    MatSliderModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ isEditing ? 'Editar' : 'Nueva' }} Calificación</mat-card-title>
          <mat-card-subtitle *ngIf="evaluacionId">Evaluación ID: {{evaluacionId}}</mat-card-subtitle>
          <mat-card-subtitle *ngIf="cursoNombre">Curso: {{cursoNombre}}</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="form-row" *ngIf="!isEditing">
              <mat-form-field appearance="outline">
                <mat-label>Estudiante</mat-label>
                <mat-select formControlName="estudianteId">
                  <mat-option *ngFor="let estudiante of estudiantesMatriculados" [value]="estudiante.id">
                    {{ estudiante.nombre }}
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="form.get('estudianteId')?.hasError('required')">
                  El estudiante es requerido
                </mat-error>
                <mat-hint *ngIf="estudiantesMatriculados.length === 0">
                  No hay estudiantes matriculados sin calificación final
                </mat-hint>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Valor</mat-label>
                <input matInput type="number" formControlName="valor" min="0" max="5" step="0.1">
                <mat-error *ngIf="form.get('valor')?.hasError('required')">
                  El valor es requerido
                </mat-error>
                <mat-error *ngIf="form.get('valor')?.hasError('min')">
                  El valor no puede ser menor a 0
                </mat-error>
                <mat-error *ngIf="form.get('valor')?.hasError('max')">
                  El valor no puede ser mayor a 5
                </mat-error>
              </mat-form-field>
            </div>

            <div class="actions">
              <button mat-button type="button" (click)="onCancel()">Cancelar</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
                {{ isEditing ? 'Actualizar' : 'Crear' }}
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
export class CalificacionFormComponent implements OnInit {
  form: FormGroup;
  isEditing = false;
  calificacionId: number = 0;
  evaluacionId: string | null = null;
  estudiantes: Estudiante[] = [];
  estudiantesMatriculados: Estudiante[] = [];
  cursoNombre: string = '';
  cursoCodigo: string = '';

  constructor(
    private fb: FormBuilder,
    private calificacionService: CalificacionService,
    private estudianteService: EstudianteService,
    private evaluacionService: EvaluacionService,
    private matriculaService: MatriculaService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      estudianteId: ['', Validators.required],
      valor: ['', [Validators.required, Validators.min(0), Validators.max(5)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.evaluacionId = params['id'];
      
      if (!this.evaluacionId) {
        this.router.navigate(['/evaluaciones']);
        return;
      }
      
      // Cargar la evaluación para obtener el curso
      this.cargarEvaluacion();
      
      if (params['calificacionId']) {
        this.isEditing = true;
        this.calificacionId = +params['calificacionId'];
        this.form.removeControl('estudianteId'); // Eliminar el control de estudiante en modo edición
        this.cargarCalificacion(this.calificacionId);
      }
    });
  }

  cargarEvaluacion(): void {
    if (this.evaluacionId) {
      this.evaluacionService.findOne(this.evaluacionId).subscribe(
        evaluacion => {
          this.cursoCodigo = evaluacion.curso.codigo;
          this.cursoNombre = evaluacion.curso.nombre;
          this.cargarEstudiantesMatriculados();
        },
        error => {
          console.error('Error al cargar evaluación', error);
          this.snackBar.open('Error al cargar evaluación', 'Cerrar', {
            duration: 3000,
          });
        }
      );
    }
  }

  cargarEstudiantes(): void {
    this.estudianteService.findAll().subscribe(
      estudiantes => {
        this.estudiantes = estudiantes;
      },
      error => {
        console.error('Error al cargar estudiantes', error);
        this.snackBar.open('Error al cargar estudiantes', 'Cerrar', {
          duration: 3000,
        });
      }
    );
  }

  cargarEstudiantesMatriculados(): void {
    if (this.cursoCodigo) {
      // Obtener todas las matrículas del curso
      this.matriculaService.findByCurso(this.cursoCodigo).subscribe(
        matriculas => {
          // Filtrar solo las matrículas sin calificación final
          const matriculasSinCalificacion = matriculas.filter(m => m.calificacionFinal === null || m.calificacionFinal === undefined);
          
          // Obtener los IDs de estudiantes de estas matrículas
          const estudianteIds = matriculasSinCalificacion.map(m => m.estudiante.id);
          
          // Cargar todos los estudiantes y filtrar solo los que están en la lista de IDs
          this.estudianteService.findAll().subscribe(
            estudiantes => {
              this.estudiantesMatriculados = estudiantes.filter(e => estudianteIds.includes(e.id));
            },
            error => {
              console.error('Error al cargar estudiantes', error);
              this.snackBar.open('Error al cargar estudiantes', 'Cerrar', {
                duration: 3000,
              });
            }
          );
        },
        error => {
          console.error('Error al cargar matrículas', error);
          this.snackBar.open('Error al cargar matrículas', 'Cerrar', {
            duration: 3000,
          });
        }
      );
    }
  }

  cargarCalificacion(id: number): void {
    this.calificacionService.findOne(id).subscribe(
      calificacion => {
        this.form.patchValue({
          valor: calificacion.valor
        });
      },
      error => {
        console.error('Error al cargar calificación', error);
        this.snackBar.open('Error al cargar calificación', 'Cerrar', {
          duration: 3000,
        });
        this.volverACalificaciones();
      }
    );
  }

  onSubmit(): void {
    if (this.form.valid && this.evaluacionId) {
      if (this.isEditing) {
        const updateData: UpdateCalificacionDto = {
          valor: this.form.value.valor
        };
        
        this.calificacionService.update(this.calificacionId, updateData).subscribe(
          () => {
            this.snackBar.open('Calificación actualizada con éxito', 'Cerrar', {
              duration: 3000,
            });
            this.volverACalificaciones();
          },
          error => {
            console.error('Error al actualizar calificación', error);
            this.snackBar.open('Error al actualizar calificación', 'Cerrar', {
              duration: 3000,
            });
          }
        );
      } else {
        const createData: CreateCalificacionDto = {
          valor: this.form.value.valor,
          estudianteId: this.form.value.estudianteId,
          evaluacionId: this.evaluacionId
        };
        
        this.calificacionService.create(createData).subscribe(
          () => {
            this.snackBar.open('Calificación creada con éxito', 'Cerrar', {
              duration: 3000,
            });
            this.volverACalificaciones();
          },
          error => {
            console.error('Error al crear calificación', error);
            this.snackBar.open('Error al crear calificación', 'Cerrar', {
              duration: 3000,
            });
          }
        );
      }
    }
  }

  onCancel(): void {
    this.volverACalificaciones();
  }

  volverACalificaciones(): void {
    if (this.evaluacionId) {
      this.router.navigate(['/evaluaciones', this.evaluacionId, 'calificaciones']);
    } else {
      this.router.navigate(['/evaluaciones']);
    }
  }
} 