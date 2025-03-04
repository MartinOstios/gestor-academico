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
      <mat-card>
        <mat-card-header>
          <mat-card-title>Estudiantes</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>Filtrar</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="Buscar estudiante" #input>
            <mat-icon matSuffix aria-hidden="false" aria-label="Buscar">search</mat-icon>
          </mat-form-field>

          <div *ngIf="isLoading" class="loading-container">
            <mat-spinner diameter="50"></mat-spinner>
          </div>

          <div *ngIf="!isLoading && dataSource.data.length === 0" class="empty-state">
            <mat-icon>school</mat-icon>
            <p>No hay estudiantes registrados</p>
          </div>

          <div class="table-container mat-elevation-z2">
            <table mat-table [dataSource]="dataSource" matSort>
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
                  <button mat-icon-button color="primary" (click)="editarEstudiante(estudiante.id)" matTooltip="Editar">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="eliminarEstudiante(estudiante.id)" matTooltip="Eliminar">
                    <mat-icon>delete</mat-icon>
                  </button>
                  <button mat-icon-button color="accent" (click)="verCalificaciones(estudiante.id)" matTooltip="Ver Calificaciones">
                    <mat-icon>grade</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

              <!-- Row shown when there is no matching data. -->
              <tr class="mat-row" *matNoDataRow>
                <td class="mat-cell" colspan="4">No se encontraron estudiantes con el filtro "{{input.value}}"</td>
              </tr>
            </table>

            <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Seleccionar página de estudiantes"></mat-paginator>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="crearEstudiante()">
            <mat-icon>add</mat-icon> Nuevo Estudiante
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
      .container {
        padding: 20px;
      }
      .filter-field {
        width: 100%;
        margin-bottom: 20px;
      }
      .table-container {
        position: relative;
        min-height: 200px;
        max-height: 600px;
        overflow: auto;
      }
      table {
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
      `
    ]
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