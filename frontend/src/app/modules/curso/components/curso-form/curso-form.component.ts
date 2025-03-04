import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService, CreateCursoDto, UpdateCursoDto } from '../../services/curso.service';
import { ProfesorService, Profesor } from '../../../profesor/services/profesor.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-curso-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ isEditing ? 'Editar' : 'Nuevo' }} Curso</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Nombre</mat-label>
                <input matInput formControlName="nombre" placeholder="Ej. Matemáticas Básicas">
                <mat-error *ngIf="form.get('nombre')?.hasError('required')">
                  El nombre es requerido
                </mat-error>
                <mat-error *ngIf="form.get('nombre')?.hasError('minlength') || form.get('nombre')?.hasError('maxlength')">
                  El nombre debe tener entre 3 y 100 caracteres
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Descripción</mat-label>
                <textarea matInput formControlName="descripcion" placeholder="Descripción del curso" rows="4"></textarea>
                <mat-error *ngIf="form.get('descripcion')?.hasError('required')">
                  La descripción es requerida
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Horario</mat-label>
                <input matInput formControlName="horario" placeholder="Ej. Lunes y Miércoles 8:00-10:00">
                <mat-error *ngIf="form.get('horario')?.hasError('required')">
                  El horario es requerido
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Profesor</mat-label>
                <mat-select formControlName="profesorId">
                  <mat-option *ngFor="let profesor of profesores" [value]="profesor.id">
                    {{ profesor.nombre }}
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="form.get('profesorId')?.hasError('required')">
                  El profesor es requerido
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
export class CursoFormComponent implements OnInit {
  form: FormGroup;
  isEditing = false;
  cursoCodigo: string = '';
  profesores: Profesor[] = [];

  constructor(
    private fb: FormBuilder,
    private cursoService: CursoService,
    private profesorService: ProfesorService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      descripcion: ['', Validators.required],
      horario: ['', Validators.required],
      profesorId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarProfesores();
    
    const codigo = this.route.snapshot.params['codigo'];
    if (codigo) {
      this.isEditing = true;
      this.cursoCodigo = codigo;
      this.cargarCurso(codigo);
    }
  }

  cargarProfesores(): void {
    this.profesorService.findAll().subscribe(
      profesores => {
        this.profesores = profesores;
      },
      error => {
        console.error('Error al cargar profesores', error);
        this.snackBar.open('Error al cargar profesores', 'Cerrar', {
          duration: 3000
        });
      }
    );
  }

  cargarCurso(codigo: string): void {
    this.cursoService.findOne(codigo).subscribe(
      curso => {
        this.form.patchValue({
          nombre: curso.nombre,
          descripcion: curso.descripcion,
          horario: curso.horario,
          profesorId: curso.profesor?.id
        });
      },
      error => {
        console.error('Error al cargar curso', error);
        this.snackBar.open('Error al cargar el curso', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/cursos']);
      }
    );
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.isEditing) {
        const updateData: UpdateCursoDto = {
          nombre: this.form.value.nombre,
          descripcion: this.form.value.descripcion,
          horario: this.form.value.horario,
          profesorId: this.form.value.profesorId
        };
        
        this.cursoService.update(this.cursoCodigo, updateData).subscribe(
          () => {
            this.snackBar.open('Curso actualizado con éxito', 'Cerrar', {
              duration: 3000
            });
            this.router.navigate(['/cursos']);
          },
          error => {
            console.error('Error al actualizar curso', error);
            this.snackBar.open('Error al actualizar el curso', 'Cerrar', {
              duration: 3000
            });
          }
        );
      } else {
        const createData: CreateCursoDto = {
          nombre: this.form.value.nombre,
          descripcion: this.form.value.descripcion,
          horario: this.form.value.horario,
          profesorId: this.form.value.profesorId
        };
        
        this.cursoService.create(createData).subscribe(
          () => {
            this.snackBar.open('Curso creado con éxito', 'Cerrar', {
              duration: 3000
            });
            this.router.navigate(['/cursos']);
          },
          error => {
            console.error('Error al crear curso', error);
            this.snackBar.open('Error al crear el curso', 'Cerrar', {
              duration: 3000
            });
          }
        );
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/cursos']);
  }
} 