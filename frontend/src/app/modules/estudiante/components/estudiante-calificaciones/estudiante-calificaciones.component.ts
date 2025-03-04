import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstudianteService } from '../../services/estudiante.service';

interface Calificacion {
  id: string;
  valor: number;
  evaluacion: {
    id: string;
    fechaRealizacion: Date;
  };
  curso: {
    codigo: string;
    nombre: string;
  };
}

@Component({
  selector: 'app-estudiante-calificaciones',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Calificaciones del Estudiante</mat-card-title>
          <mat-card-subtitle *ngIf="estudiante">{{ estudiante.nombre }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div *ngIf="isLoading" class="loading-container">
            <mat-spinner diameter="50"></mat-spinner>
          </div>

          <div *ngIf="!isLoading && calificaciones.length === 0" class="empty-state">
            <mat-icon>school</mat-icon>
            <p>No hay calificaciones disponibles para este estudiante</p>
          </div>

          <table mat-table [dataSource]="calificaciones" *ngIf="!isLoading && calificaciones.length > 0" class="mat-elevation-z2 full-width">
            <!-- Curso Column -->
            <ng-container matColumnDef="curso">
              <th mat-header-cell *matHeaderCellDef>Curso</th>
              <td mat-cell *matCellDef="let calificacion">{{ calificacion.curso.nombre }}</td>
            </ng-container>

            <!-- Evaluación Column -->
            <ng-container matColumnDef="evaluacion">
              <th mat-header-cell *matHeaderCellDef>Evaluación</th>
              <td mat-cell *matCellDef="let calificacion">{{ calificacion.evaluacion.id }}</td>
            </ng-container>

            <!-- Fecha Column -->
            <ng-container matColumnDef="fecha">
              <th mat-header-cell *matHeaderCellDef>Fecha</th>
              <td mat-cell *matCellDef="let calificacion">{{ calificacion.evaluacion.fechaRealizacion | date:'dd/MM/yyyy' }}</td>
            </ng-container>

            <!-- Calificación Column -->
            <ng-container matColumnDef="calificacion">
              <th mat-header-cell *matHeaderCellDef>Calificación</th>
              <td mat-cell *matCellDef="let calificacion" [ngClass]="{'aprobado': calificacion.valor >= 3, 'reprobado': calificacion.valor < 3}">
                {{ calificacion.valor.toFixed(1) }}
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
        <mat-card-actions>
          <button mat-button color="primary" routerLink="/estudiantes">
            <mat-icon>arrow_back</mat-icon> Volver
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    .full-width {
      width: 100%;
    }
    .loading-container {
      display: flex;
      justify-content: center;
      padding: 20px;
    }
    .empty-state {
      text-align: center;
      padding: 30px;
      color: #666;
    }
    .empty-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 10px;
    }
    .aprobado {
      color: green;
      font-weight: bold;
    }
    .reprobado {
      color: red;
      font-weight: bold;
    }
  `]
})
export class EstudianteCalificacionesComponent implements OnInit {
  estudiante: any = null;
  calificaciones: Calificacion[] = [];
  isLoading = true;
  displayedColumns: string[] = ['curso', 'evaluacion', 'fecha', 'calificacion'];

  constructor(
    private route: ActivatedRoute,
    private estudianteService: EstudianteService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarCalificaciones();
  }

  cargarCalificaciones(): void {
    const estudianteId = this.route.snapshot.paramMap.get('id');
    if (!estudianteId) {
      this.snackBar.open('ID de estudiante no proporcionado', 'Cerrar', { duration: 3000 });
      this.isLoading = false;
      return;
    }

    // Primero cargar los datos del estudiante
    this.estudianteService.findOne(estudianteId).subscribe({
      next: (estudiante) => {
        this.estudiante = estudiante;
        
        // Luego cargar las calificaciones
        this.estudianteService.findCalificaciones(estudianteId).subscribe({
          next: (calificaciones) => {
            this.calificaciones = calificaciones;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error al cargar calificaciones:', error);
            this.snackBar.open('Error al cargar las calificaciones', 'Cerrar', { duration: 3000 });
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error al cargar estudiante:', error);
        this.snackBar.open('Error al cargar los datos del estudiante', 'Cerrar', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }
} 