import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { EstudianteService, Estudiante } from '../../services/estudiante.service';

@Component({
  selector: 'app-estudiante-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    DatePipe
  ],
  template: `
    <div class="container">
      <mat-card class="mat-elevation-z4">
        <mat-card-header>
          <mat-card-title>Gestión de Estudiantes</mat-card-title>
          <mat-card-subtitle>Administra los estudiantes registrados en el sistema</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="actions">
            <button mat-raised-button color="primary" (click)="crearEstudiante()" class="action-button">
              <mat-icon aria-hidden="false" aria-label="Añadir">add</mat-icon>
              Nuevo Estudiante
            </button>
          </div>

          <mat-form-field appearance="outline">
            <mat-label>Filtrar estudiantes</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="Ej. María López" #input>
            <mat-icon matSuffix aria-hidden="false" aria-label="Buscar">search</mat-icon>
          </mat-form-field>

          <div *ngIf="isLoading" class="loading-container">
            <mat-spinner diameter="50"></mat-spinner>
          </div>

          <div *ngIf="!isLoading && dataSource.data.length === 0" class="empty-state">
            <mat-icon>school</mat-icon>
            <p>No hay estudiantes registrados</p>
          </div>

          <div class="table-container mat-elevation-z2" *ngIf="!isLoading && dataSource.data.length > 0">
            <table mat-table [dataSource]="dataSource" matSort class="mat-table-striped">
              <!-- ID Column -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
                <td mat-cell *matCellDef="let estudiante">{{ estudiante.id }}</td>
              </ng-container>

              <!-- Nombre Column -->
              <ng-container matColumnDef="nombre">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th>
                <td mat-cell *matCellDef="let estudiante">{{ estudiante.nombre }}</td>
              </ng-container>

              <!-- Fecha Nacimiento Column -->
              <ng-container matColumnDef="fechaNacimiento">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Fecha de Nacimiento</th>
                <td mat-cell *matCellDef="let estudiante">{{ estudiante.fechaNacimiento | date:'dd/MM/yyyy' }}</td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let estudiante">
                  <div class="action-buttons">
                    <button mat-mini-fab color="primary" (click)="editarEstudiante(estudiante.id)" matTooltip="Editar estudiante">
                      <mat-icon aria-hidden="false" aria-label="Editar">edit</mat-icon>
                    </button>
                    <button mat-mini-fab color="warn" (click)="eliminarEstudiante(estudiante.id)" matTooltip="Eliminar estudiante">
                      <mat-icon aria-hidden="false" aria-label="Eliminar">delete</mat-icon>
                    </button>
                    <button mat-mini-fab color="accent" (click)="verCalificaciones(estudiante.id)" matTooltip="Ver Calificaciones">
                      <mat-icon aria-hidden="false" aria-label="Ver Calificaciones">grade</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"></tr>

              <!-- Row shown when there is no matching data. -->
              <tr class="mat-row" *matNoDataRow>
                <td class="mat-cell no-data-cell" colspan="4">
                  <div class="no-data-message">
                    <mat-icon aria-hidden="false" aria-label="Sin resultados">search_off</mat-icon>
                    <p>No se encontraron datos que coincidan con el filtro "{{input.value}}"</p>
                  </div>
                </td>
              </tr>
            </table>

            <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Seleccionar página de estudiantes"></mat-paginator>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 24px;
      max-width: 1200px;
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

    .actions {
      margin-bottom: 24px;
      display: flex;
      justify-content: flex-end;
    }

    .action-button {
      padding: 0 24px;
      height: 48px;
      font-weight: 500;
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 24px;
    }

    .table-container {
      border-radius: 8px;
      overflow: hidden;
    }

    table {
      width: 100%;
    }

    .mat-table-striped .mat-row:nth-child(even) {
      background-color: #f9f9f9;
    }

    .table-row {
      transition: background-color 0.2s ease;
    }

    .table-row:hover {
      background-color: rgba(63, 81, 181, 0.04);
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .no-data-cell {
      padding: 48px 0;
    }

    .no-data-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #757575;
    }

    .no-data-message mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 40px;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: #757575;
    }

    .empty-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .container {
        padding: 16px;
      }
      
      .action-buttons {
        flex-direction: column;
        gap: 4px;
      }
    }
  `]
})
export class EstudianteListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'nombre', 'fechaNacimiento', 'acciones'];
  dataSource: MatTableDataSource<Estudiante>;
  isLoading = true;
  estudiantes: Estudiante[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private estudianteService: EstudianteService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Estudiante>();
  }

  ngOnInit(): void {
    this.cargarEstudiantes();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarEstudiantes(): void {
    this.isLoading = true;
    this.estudianteService.findAll().subscribe({
      next: (data) => {
        this.estudiantes = data;
        this.dataSource.data = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar estudiantes:', error);
        this.snackBar.open('Error al cargar los estudiantes', 'Cerrar', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  crearEstudiante(): void {
    this.router.navigate(['/estudiantes/nuevo']);
  }

  editarEstudiante(id: string): void {
    this.router.navigate(['/estudiantes/editar', id]);
  }

  eliminarEstudiante(id: string): void {
    if (confirm('¿Está seguro que desea eliminar este estudiante?')) {
      this.isLoading = true;
      this.estudianteService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Estudiante eliminado con éxito', 'Cerrar', { duration: 3000 });
          this.cargarEstudiantes();
        },
        error: (error) => {
          console.error('Error al eliminar estudiante:', error);
          this.snackBar.open('Error al eliminar el estudiante', 'Cerrar', { duration: 3000 });
          this.isLoading = false;
        }
      });
    }
  }

  verCalificaciones(id: string): void {
    this.router.navigate(['/estudiantes', id, 'calificaciones']);
  }
} 