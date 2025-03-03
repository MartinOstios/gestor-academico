import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatriculaService, Matricula, UpdateMatriculaDto } from '../../services/matricula.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-matricula-calificar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Calificar Matrícula</mat-card-title>
          <mat-card-subtitle *ngIf="matricula">
            Estudiante: {{ matricula.estudiante.nombre }} - Curso: {{ matricula.curso.nombre }}
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div *ngIf="matricula; else loading">
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Calificación Final</mat-label>
                  <input matInput type="number" formControlName="calificacionFinal" min="0" max="5" step="0.1">
                  <mat-error *ngIf="form.get('calificacionFinal')?.hasError('required')">
                    La calificación es requerida
                  </mat-error>
                  <mat-error *ngIf="form.get('calificacionFinal')?.hasError('min')">
                    La calificación no puede ser menor a 0
                  </mat-error>
                  <mat-error *ngIf="form.get('calificacionFinal')?.hasError('max')">
                    La calificación no puede ser mayor a 5
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="actions">
                <button mat-button type="button" (click)="onCancel()">Cancelar</button>
                <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
                  Guardar Calificación
                </button>
              </div>
            </form>
          </div>
          
          <ng-template #loading>
            <div class="loading">
              <p>Cargando información de la matrícula...</p>
            </div>
          </ng-template>
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

    .loading {
      display: flex;
      justify-content: center;
      padding: 20px;
    }
    `
  ]
})
export class MatriculaCalificarComponent implements OnInit {
  form: FormGroup;
  matriculaId: number = 0;
  matricula: Matricula | null = null;

  constructor(
    private fb: FormBuilder,
    private matriculaService: MatriculaService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      calificacionFinal: ['', [Validators.required, Validators.min(0), Validators.max(5)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.matriculaId = +id;
      this.cargarMatricula();
    } else {
      this.router.navigate(['/matriculas']);
    }
  }

  cargarMatricula(): void {
    this.matriculaService.findOne(this.matriculaId).subscribe(
      matricula => {
        this.matricula = matricula;
        if (matricula.calificacionFinal !== null && matricula.calificacionFinal !== undefined) {
          this.form.patchValue({
            calificacionFinal: matricula.calificacionFinal
          });
        }
      },
      error => {
        console.error('Error al cargar matrícula', error);
        this.router.navigate(['/matriculas']);
      }
    );
  }

  onSubmit(): void {
    if (this.form.valid) {
      const updateData: UpdateMatriculaDto = {
        calificacionFinal: this.form.value.calificacionFinal
      };
      
      this.matriculaService.update(this.matriculaId, updateData).subscribe(
        () => {
          this.router.navigate(['/matriculas']);
        },
        error => {
          console.error('Error al actualizar calificación', error);
        }
      );
    }
  }

  onCancel(): void {
    this.router.navigate(['/matriculas']);
  }
} 