import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EstudianteService, CreateEstudianteDto, UpdateEstudianteDto } from '../../services/estudiante.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-estudiante-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatIconModule
  ],
  template: `
    <div class="container">
      <mat-card class="mat-elevation-z4">
        <mat-card-header>
          <mat-card-title>{{ isEditing ? 'Editar' : 'Nuevo' }} Estudiante</mat-card-title>
          <mat-card-subtitle>{{ isEditing ? 'Actualiza los datos del estudiante' : 'Ingresa los datos del nuevo estudiante' }}</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="nombre" placeholder="Ingrese el nombre completo">
              <mat-icon matSuffix>person</mat-icon>
              <mat-error *ngIf="form.get('nombre')?.hasError('required')">
                El nombre es requerido
              </mat-error>
              <mat-error *ngIf="form.get('nombre')?.hasError('minlength') || form.get('nombre')?.hasError('maxlength')">
                El nombre debe tener entre 3 y 100 caracteres
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Fecha de Nacimiento</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="fechaNacimiento">
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error *ngIf="form.get('fechaNacimiento')?.hasError('required')">
                La fecha de nacimiento es requerida
              </mat-error>
            </mat-form-field>

            <div class="actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
                <mat-icon>{{ isEditing ? 'save' : 'add' }}</mat-icon>
                {{ isEditing ? 'Actualizar' : 'Crear' }}
              </button>
              <button mat-button type="button" (click)="onCancel()">
                <mat-icon>cancel</mat-icon>
                Cancelar
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
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }

    mat-card {
      border-radius: 8px;
      overflow: hidden;
    }

    mat-card-header {
      background-color: #f5f5f5;
      padding: 16px;
      margin-bottom: 16px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    }

    mat-card-title {
      color: #3f51b5;
      font-size: 24px;
      margin-bottom: 8px;
    }

    mat-card-subtitle {
      color: #616161;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 16px;
    }

    mat-form-field {
      width: 100%;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }

    button mat-icon {
      margin-right: 8px;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .container {
        padding: 16px;
      }
    }
    `
  ]
})
export class EstudianteFormComponent implements OnInit {
  form: FormGroup;
  isEditing = false;
  estudianteId: string = '';

  constructor(
    private fb: FormBuilder,
    private estudianteService: EstudianteService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      fechaNacimiento: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditing = true;
      this.estudianteId = id;
      this.loadEstudiante(id);
    }
  }

  loadEstudiante(id: string): void {
    this.estudianteService.findOne(id).subscribe(
      estudiante => {
        this.form.patchValue({
          nombre: estudiante.nombre,
          fechaNacimiento: new Date(estudiante.fechaNacimiento)
        });
      },
      error => {
        console.error('Error al cargar estudiante:', error);
        this.snackBar.open('Error al cargar los datos del estudiante', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/estudiantes']);
      }
    );
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.isEditing) {
        const updateData: UpdateEstudianteDto = {
          nombre: this.form.value.nombre,
          fechaNacimiento: this.form.value.fechaNacimiento
        };
        
        this.estudianteService.update(this.estudianteId, updateData).subscribe(
          () => {
            this.snackBar.open('Estudiante actualizado con éxito', 'Cerrar', {
              duration: 3000
            });
            this.router.navigate(['/estudiantes']);
          },
          error => {
            console.error('Error al actualizar estudiante:', error);
            this.snackBar.open('Error al actualizar el estudiante', 'Cerrar', {
              duration: 3000
            });
          }
        );
      } else {
        const createData: CreateEstudianteDto = {
          nombre: this.form.value.nombre,
          fechaNacimiento: this.form.value.fechaNacimiento
        };
        
        this.estudianteService.create(createData).subscribe(
          () => {
            this.snackBar.open('Estudiante creado con éxito', 'Cerrar', {
              duration: 3000
            });
            this.router.navigate(['/estudiantes']);
          },
          error => {
            console.error('Error al crear estudiante:', error);
            this.snackBar.open('Error al crear el estudiante', 'Cerrar', {
              duration: 3000
            });
          }
        );
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/estudiantes']);
  }
} 