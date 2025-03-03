import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfesorService, CreateProfesorDto, UpdateProfesorDto } from '../../services/profesor.service';
import { DepartamentoService, Departamento } from '../../../departamento/services/departamento.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpErrorResponse } from '@angular/common/http';

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
            <ng-container *ngIf="!isEditing">
              <mat-form-field>
                <mat-label>ID</mat-label>
                <input matInput formControlName="id" required>
                <mat-error *ngIf="profesorForm.get('id')?.hasError('required')">
                  El ID es requerido
                </mat-error>
                <mat-error *ngIf="profesorForm.get('id')?.hasError('minlength') || profesorForm.get('id')?.hasError('maxlength')">
                  El ID debe tener entre 5 y 20 caracteres
                </mat-error>
              </mat-form-field>
            </ng-container>

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
  departamentos: Departamento[] = [];
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private profesorService: ProfesorService,
    private departamentoService: DepartamentoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.profesorForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
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
      // Eliminar el control de ID para edición
      this.profesorForm.removeControl('id');
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
            this.router.navigate(['/profesores']);
          },
          (error: HttpErrorResponse) => {
            console.error('Error al actualizar profesor:', error);
            this.errorMessage = error.error?.message || 'Error al actualizar el profesor. Por favor, intente de nuevo.';
          }
        );
      } else {
        this.profesorService.create(formData as CreateProfesorDto).subscribe(
          response => {
            console.log('Profesor creado:', response);
            this.router.navigate(['/profesores']);
          },
          (error: HttpErrorResponse) => {
            console.error('Error al crear profesor:', error);
            this.errorMessage = error.error?.message || 'Error al crear el profesor. Por favor, intente de nuevo.';
          }
        );
      }
    } else {
      this.errorMessage = 'Por favor, complete todos los campos requeridos correctamente.';
      console.error('Formulario inválido:', this.profesorForm.errors);
    }
  }

  onCancel(): void {
    this.router.navigate(['/profesores']);
  }
} 