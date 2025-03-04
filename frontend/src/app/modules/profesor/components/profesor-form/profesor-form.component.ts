import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfesorService, CreateProfesorDto, UpdateProfesorDto } from '../../services/profesor.service';
import { DepartamentoService, Departamento, DepartamentoResponse } from '../../../departamento/services/departamento.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profesor-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ isEditing ? 'Editar' : 'Crear' }} Profesor</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="profesorForm" (ngSubmit)="onSubmit()">
            <mat-form-field>
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="nombre" required>
              <mat-error *ngIf="profesorForm.get('nombre')?.hasError('required')">
                El nombre es requerido
              </mat-error>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Fecha de Contratación</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="fechaContratacion" required>
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error *ngIf="profesorForm.get('fechaContratacion')?.hasError('required')">
                La fecha de contratación es requerida
              </mat-error>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Departamento</mat-label>
              <mat-select formControlName="departamentoCodigo" required>
                <mat-option *ngFor="let departamento of departamentos" [value]="departamento.codigo">
                  {{departamento.nombre}}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="profesorForm.get('departamentoCodigo')?.hasError('required')">
                El departamento es requerido
              </mat-error>
            </mat-form-field>

            <div *ngIf="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>

            <div class="actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="profesorForm.invalid">
                {{ isEditing ? 'Actualizar' : 'Crear' }}
              </button>
              <button mat-button type="button" (click)="onCancel()">
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
      padding: 20px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }

    .error-message {
      background-color: #f8d7da;
      color: #721c24;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 15px;
    }
    `
  ]
})
export class ProfesorFormComponent implements OnInit {
  profesorForm: FormGroup;
  isEditing: boolean = false;
  departamentos: DepartamentoResponse[] = [];
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private profesorService: ProfesorService,
    private departamentoService: DepartamentoService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.profesorForm = this.fb.group({
      nombre: ['', Validators.required],
      fechaContratacion: [new Date(), Validators.required],
      departamentoCodigo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarDepartamentos();
    
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditing = true;
      this.loadProfesor(id);
    }
  }

  cargarDepartamentos(): void {
    this.departamentoService.findAll().subscribe(
      departamentos => {
        this.departamentos = departamentos;
        console.log('Departamentos cargados:', this.departamentos);
      },
      error => {
        console.error('Error al cargar departamentos:', error);
        this.errorMessage = 'Error al cargar los departamentos. Por favor, intente de nuevo.';
        this.snackBar.open('Error al cargar los departamentos', 'Cerrar', {
          duration: 3000
        });
      }
    );
  }

  loadProfesor(id: string): void {
    this.profesorService.findOne(id).subscribe(
      profesor => {
        console.log('Profesor cargado:', profesor);
        // Adaptar los datos del profesor al formato del formulario
        this.profesorForm.patchValue({
          nombre: profesor.nombre,
          fechaContratacion: profesor.fechaContratacion ? new Date(profesor.fechaContratacion) : null,
          departamentoCodigo: profesor.departamento?.codigo
        });
        console.log('Formulario actualizado:', this.profesorForm.value);
      },
      error => {
        console.error('Error al cargar profesor:', error);
        this.errorMessage = 'Error al cargar los datos del profesor. Por favor, intente de nuevo.';
        this.snackBar.open('Error al cargar los datos del profesor', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/profesores']);
      }
    );
  }

  onSubmit(): void {
    if (this.profesorForm.valid) {
      const formData = this.profesorForm.value;
      console.log('Datos del formulario a enviar:', formData);
      
      if (this.isEditing) {
        const id = this.route.snapshot.params['id'];
        this.profesorService.update(id, formData as UpdateProfesorDto).subscribe(
          response => {
            console.log('Profesor actualizado:', response);
            this.snackBar.open('Profesor actualizado con éxito', 'Cerrar', {
              duration: 3000
            });
            this.router.navigate(['/profesores']);
          },
          (error: HttpErrorResponse) => {
            console.error('Error al actualizar profesor:', error);
            this.errorMessage = error.error?.message || 'Error al actualizar el profesor. Por favor, intente de nuevo.';
            this.snackBar.open('Error al actualizar el profesor', 'Cerrar', {
              duration: 3000
            });
          }
        );
      } else {
        this.profesorService.create(formData as CreateProfesorDto).subscribe(
          response => {
            console.log('Profesor creado:', response);
            this.snackBar.open('Profesor creado con éxito', 'Cerrar', {
              duration: 3000
            });
            this.router.navigate(['/profesores']);
          },
          (error: HttpErrorResponse) => {
            console.error('Error al crear profesor:', error);
            this.errorMessage = error.error?.message || 'Error al crear el profesor. Por favor, intente de nuevo.';
            this.snackBar.open('Error al crear el profesor', 'Cerrar', {
              duration: 3000
            });
          }
        );
      }
    } else {
      this.errorMessage = 'Por favor, complete todos los campos requeridos correctamente.';
      this.snackBar.open('Por favor, complete todos los campos requeridos correctamente', 'Cerrar', {
        duration: 3000
      });
      console.error('Formulario inválido:', this.profesorForm.errors);
    }
  }

  onCancel(): void {
    this.router.navigate(['/profesores']);
  }
} 