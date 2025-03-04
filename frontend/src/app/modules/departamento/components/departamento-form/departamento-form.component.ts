import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartamentoService, Departamento, DepartamentoResponse } from '../../services/departamento.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-departamento-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ isEditing ? 'Editar' : 'Crear' }} Departamento</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="departamentoForm" (ngSubmit)="onSubmit()">
            <mat-form-field>
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="nombre" required>
              <mat-error *ngIf="departamentoForm.get('nombre')?.hasError('required')">
                El nombre es requerido
              </mat-error>
            </mat-form-field>

            <div class="actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="departamentoForm.invalid">
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
    `
  ]
})
export class DepartamentoFormComponent implements OnInit {
  departamentoForm: FormGroup;
  isEditing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private departamentoService: DepartamentoService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.departamentoForm = this.fb.group({
      nombre: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const codigo = this.route.snapshot.params['id'];
    if (codigo) {
      this.isEditing = true;
      this.loadDepartamento(codigo);
    }
  }

  loadDepartamento(codigo: string): void {
    this.departamentoService.findOne(codigo).subscribe(
      (departamento: DepartamentoResponse) => {
        this.departamentoForm.patchValue({
          nombre: departamento.nombre
        });
      },
      (error) => {
        this.snackBar.open('Error al cargar el departamento', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/departamentos']);
      }
    );
  }

  onSubmit(): void {
    if (this.departamentoForm.valid) {
      const departamento: Departamento = {
        nombre: this.departamentoForm.value.nombre
      };
      
      if (this.isEditing) {
        const codigo = this.route.snapshot.params['id'];
        this.departamentoService.update(codigo, departamento).subscribe(
          () => {
            this.snackBar.open('Departamento actualizado con éxito', 'Cerrar', {
              duration: 3000
            });
            this.router.navigate(['/departamentos']);
          },
          (error) => {
            this.snackBar.open('Error al actualizar el departamento', 'Cerrar', {
              duration: 3000
            });
          }
        );
      } else {
        this.departamentoService.create(departamento).subscribe(
          () => {
            this.snackBar.open('Departamento creado con éxito', 'Cerrar', {
              duration: 3000
            });
            this.router.navigate(['/departamentos']);
          },
          (error) => {
            this.snackBar.open('Error al crear el departamento', 'Cerrar', {
              duration: 3000
            });
          }
        );
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/departamentos']);
  }
} 