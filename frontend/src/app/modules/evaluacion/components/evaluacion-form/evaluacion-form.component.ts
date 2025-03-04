import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluacionService, CreateEvaluacionDto, UpdateEvaluacionDto } from '../../services/evaluacion.service';
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
  selector: 'app-evaluacion-form',
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
          <mat-card-title>{{ isEditing ? 'Editar' : 'Nueva' }} Evaluación</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
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
                <mat-label>Fecha de Realización</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="fechaRealizacion">
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
                <mat-error *ngIf="form.get('fechaRealizacion')?.hasError('required')">
                  La fecha de realización es requerida
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
export class EvaluacionFormComponent implements OnInit {
  form: FormGroup;
  isEditing = false;
  evaluacionId: string = '';
  cursos: Curso[] = [];

  constructor(
    private fb: FormBuilder,
    private evaluacionService: EvaluacionService,
    private cursoService: CursoService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      cursoCodigo: ['', Validators.required],
      fechaRealizacion: [new Date(), Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarCursos();
    
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditing = true;
      this.evaluacionId = id;
      this.cargarEvaluacion(id);
    }
  }

  cargarCursos(): void {
    this.cursoService.findAll().subscribe(
      cursos => {
        this.cursos = cursos;
      },
      error => {
        console.error('Error al cargar cursos', error);
        this.snackBar.open('Error al cargar cursos', 'Cerrar', {
          duration: 3000,
        });
      }
    );
  }

  cargarEvaluacion(id: string): void {
    this.evaluacionService.findOne(id).subscribe(
      evaluacion => {
        this.form.patchValue({
          cursoCodigo: evaluacion.curso?.codigo,
          fechaRealizacion: new Date(evaluacion.fechaRealizacion)
        });
      },
      error => {
        console.error('Error al cargar evaluación', error);
        this.snackBar.open('Error al cargar evaluación', 'Cerrar', {
          duration: 3000,
        });
        this.router.navigate(['/evaluaciones']);
      }
    );
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.isEditing) {
        const updateData: UpdateEvaluacionDto = {
          fechaRealizacion: this.form.value.fechaRealizacion
        };
        
        this.evaluacionService.update(this.evaluacionId, updateData).subscribe(
          () => {
            this.snackBar.open('Evaluación actualizada con éxito', 'Cerrar', {
              duration: 3000,
            });
            this.router.navigate(['/evaluaciones']);
          },
          error => {
            console.error('Error al actualizar evaluación', error);
            this.snackBar.open('Error al actualizar evaluación', 'Cerrar', {
              duration: 3000,
            });
          }
        );
      } else {
        const createData: CreateEvaluacionDto = {
          fechaRealizacion: this.form.value.fechaRealizacion,
          cursoCodigo: this.form.value.cursoCodigo
        };
        
        this.evaluacionService.create(createData).subscribe(
          () => {
            this.snackBar.open('Evaluación creada con éxito', 'Cerrar', {
              duration: 3000,
            });
            this.router.navigate(['/evaluaciones']);
          },
          error => {
            console.error('Error al crear evaluación', error);
            this.snackBar.open('Error al crear evaluación', 'Cerrar', {
              duration: 3000,
            });
          }
        );
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/evaluaciones']);
  }
} 