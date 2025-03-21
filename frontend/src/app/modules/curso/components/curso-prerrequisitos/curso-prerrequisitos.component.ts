import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService, Curso, AddPrerrequisitosDto } from '../../services/curso.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-curso-prerrequisitos',
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
    MatChipsModule,
    MatIconModule,
    MatListModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDividerModule
  ],
  template: `
    <div class="container">
      <mat-card class="mat-elevation-z4">
        <mat-card-header>
          <mat-card-title>Gestionar Prerrequisitos</mat-card-title>
          <mat-card-subtitle *ngIf="curso">{{ curso.nombre }} ({{ curso.codigo }})</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div *ngIf="curso">
            <h3>Prerrequisitos Actuales</h3>
            <div *ngIf="curso.prerrequisitos && curso.prerrequisitos.length > 0; else noPrerrequisitos">
              <mat-list>
                <mat-list-item *ngFor="let prerrequisito of curso.prerrequisitos">
                  <div class="prerrequisito-item">
                    <div>
                      <span matListItemTitle>{{ prerrequisito.nombre }}</span>
                      <span matListItemLine>{{ prerrequisito.codigo }}</span>
                    </div>
                    <button mat-icon-button color="warn" (click)="eliminarPrerrequisito(prerrequisito.codigo)" 
                            matTooltip="Eliminar prerrequisito">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </mat-list-item>
              </mat-list>
            </div>
            <ng-template #noPrerrequisitos>
              <p>Este curso no tiene prerrequisitos.</p>
            </ng-template>

            <h3>Agregar Prerrequisitos</h3>
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Seleccionar Cursos</mat-label>
                  <mat-select formControlName="prerrequisitoCodigos" multiple>
                    <mat-option *ngFor="let curso of cursos" [value]="curso.codigo" [disabled]="esPrerrequisito(curso.codigo) || curso.codigo === cursoCodigo">
                      {{ curso.nombre }} ({{ curso.codigo }})
                    </mat-option>
                  </mat-select>
                  <mat-error *ngIf="form.get('prerrequisitoCodigos')?.hasError('required')">
                    Debe seleccionar al menos un curso
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="actions">
                <button mat-button type="button" (click)="onCancel()">Cancelar</button>
                <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
                  Agregar Prerrequisitos
                </button>
              </div>
            </form>
          </div>
          
          <div *ngIf="!curso" class="loading">
            <p>Cargando información del curso...</p>
          </div>
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

    h3 {
      margin-top: 24px;
      margin-bottom: 16px;
      color: #3f51b5;
    }

    .loading {
      display: flex;
      justify-content: center;
      padding: 20px;
    }

    .prerrequisito-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    `
  ]
})
export class CursoPrerrequisitosComponent implements OnInit {
  form: FormGroup;
  cursoCodigo: string = '';
  curso: Curso | null = null;
  cursos: Curso[] = [];

  constructor(
    private fb: FormBuilder,
    private cursoService: CursoService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      prerrequisitoCodigos: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.cursoCodigo = this.route.snapshot.params['codigo'];
    if (this.cursoCodigo) {
      this.cargarCurso();
      this.cargarCursos();
    } else {
      this.router.navigate(['/cursos']);
    }
  }

  cargarCurso(): void {
    this.cursoService.findOne(this.cursoCodigo).subscribe(
      curso => {
        this.curso = curso;
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

  cargarCursos(): void {
    this.cursoService.findAll().subscribe(
      cursos => {
        this.cursos = cursos;
      },
      error => {
        console.error('Error al cargar cursos', error);
        this.snackBar.open('Error al cargar los cursos', 'Cerrar', {
          duration: 3000
        });
      }
    );
  }

  esPrerrequisito(codigo: string): boolean {
    if (!this.curso || !this.curso.prerrequisitos) return false;
    return this.curso.prerrequisitos.some(p => p.codigo === codigo);
  }

  onSubmit(): void {
    if (this.form.valid) {
      const prerrequisitos: AddPrerrequisitosDto = {
        codigosPrerrequisitos: this.form.value.prerrequisitoCodigos
      };
      
      this.cursoService.addPrerrequisitos(this.cursoCodigo, prerrequisitos).subscribe(
        () => {
          this.snackBar.open('Prerrequisitos agregados con éxito', 'Cerrar', {
            duration: 3000
          });
          this.cargarCurso(); // Recargar el curso para mostrar los nuevos prerrequisitos
          this.form.reset({
            prerrequisitoCodigos: []
          });
        },
        error => {
          console.error('Error al agregar prerrequisitos', error);
          this.snackBar.open('Error al agregar prerrequisitos', 'Cerrar', {
            duration: 3000
          });
        }
      );
    }
  }

  eliminarPrerrequisito(codigoPrerrequisito: string): void {
    if (confirm('¿Está seguro que desea eliminar este prerrequisito?')) {
      this.cursoService.removePrerrequisito(this.cursoCodigo, codigoPrerrequisito).subscribe(
        () => {
          this.snackBar.open('Prerrequisito eliminado con éxito', 'Cerrar', {
            duration: 3000
          });
          this.cargarCurso(); // Recargar el curso para actualizar la lista de prerrequisitos
        },
        error => {
          console.error('Error al eliminar prerrequisito', error);
          this.snackBar.open('Error al eliminar prerrequisito', 'Cerrar', {
            duration: 3000
          });
        }
      );
    }
  }

  onCancel(): void {
    this.router.navigate(['/cursos']);
  }
} 