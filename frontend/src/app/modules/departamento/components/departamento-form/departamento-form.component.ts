import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartamentoService, Departamento } from '../../services/departamento.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
            <mat-form-field *ngIf="!isEditing">
              <mat-label>Código</mat-label>
              <input matInput formControlName="codigo" required>
              <mat-error *ngIf="departamentoForm.get('codigo')?.hasError('required')">
                El código es requerido
              </mat-error>
            </mat-form-field>

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
    private route: ActivatedRoute
  ) {
    this.departamentoForm = this.fb.group({
      codigo: ['', [Validators.required]],
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
      (departamento: Departamento) => {
        this.departamentoForm.patchValue(departamento);
        this.departamentoForm.get('codigo')?.disable();
      }
    );
  }

  onSubmit(): void {
    if (this.departamentoForm.valid) {
      const departamento: Departamento = this.departamentoForm.value;
      
      if (this.isEditing) {
        const codigo = this.route.snapshot.params['id'];
        this.departamentoService.update(codigo, departamento).subscribe(
          () => this.router.navigate(['/departamentos'])
        );
      } else {
        this.departamentoService.create(departamento).subscribe(
          () => this.router.navigate(['/departamentos'])
        );
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/departamentos']);
  }
} 