import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CalificacionService, Calificacion } from '../../services/calificacion.service';
import { EvaluacionService } from '../../services/evaluacion.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-calificacion-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container">
      <mat-card class="mat-elevation-z4">
        <mat-card-header>
          <mat-card-title>Calificaciones de la Evaluación</mat-card-title>
          <mat-card-subtitle *ngIf="evaluacionId">ID: {{evaluacionId}}</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="actions">
            <button mat-button color="primary" (click)="volverAEvaluaciones()" class="back-button">
              <mat-icon aria-hidden="false" aria-label="Volver">arrow_back</mat-icon>
              Volver a Evaluaciones
            </button>
            <button mat-raised-button color="primary" (click)="agregarCalificacion()" class="action-button">
              <mat-icon aria-hidden="false" aria-label="Añadir">add</mat-icon>
              Nueva Calificación
            </button>
          </div>

          <mat-form-field appearance="outline">
            <mat-label>Filtrar calificaciones</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="Ej. Juan" #input>
            <mat-icon matSuffix aria-hidden="false" aria-label="Buscar">search</mat-icon>
          </mat-form-field>

          <div class="table-container mat-elevation-z2">
            <table mat-table [dataSource]="dataSource" matSort class="mat-table-striped">
              <!-- ID Column -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef mat-sort-header> ID </th>
                <td mat-cell *matCellDef="let row"> {{row.id}} </td>
              </ng-container>

              <!-- Estudiante Column -->
              <ng-container matColumnDef="estudiante">
                <th mat-header-cell *matHeaderCellDef mat-sort-header> Estudiante </th>
                <td mat-cell *matCellDef="let row"> {{row.estudiante?.nombre || 'No asignado'}} </td>
              </ng-container>

              <!-- Valor Column -->
              <ng-container matColumnDef="valor">
                <th mat-header-cell *matHeaderCellDef mat-sort-header> Valor </th>
                <td mat-cell *matCellDef="let row" [ngClass]="getCalificacionClass(row.valor)"> 
                  {{row.valor}} 
                </td>
              </ng-container>

              <!-- Acciones Column -->
              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef> Acciones </th>
                <td mat-cell *matCellDef="let row">
                  <div class="action-buttons">
                    <button mat-mini-fab color="primary" (click)="editarCalificacion(row.id)" matTooltip="Editar calificación">
                      <mat-icon aria-hidden="false" aria-label="Editar">edit</mat-icon>
                    </button>
                    <button mat-mini-fab color="warn" (click)="eliminarCalificacion(row.id)" matTooltip="Eliminar calificación">
                      <mat-icon aria-hidden="false" aria-label="Eliminar">delete</mat-icon>
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

            <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Seleccionar página"></mat-paginator>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
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
      justify-content: space-between;
      align-items: center;
    }

    .back-button {
      display: flex;
      align-items: center;
      gap: 8px;
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

    .calificacion-aprobada {
      color: #4caf50;
      font-weight: bold;
    }

    .calificacion-reprobada {
      color: #f44336;
      font-weight: bold;
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
    `
  ]
})
export class CalificacionListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'estudiante', 'valor', 'acciones'];
  dataSource: MatTableDataSource<Calificacion>;
  evaluacionId: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private calificacionService: CalificacionService,
    private evaluacionService: EvaluacionService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Calificacion>();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.evaluacionId = params['id'];
        this.cargarCalificaciones();
      } else {
        this.router.navigate(['/evaluaciones']);
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarCalificaciones(): void {
    if (this.evaluacionId) {
      this.calificacionService.findByEvaluacion(this.evaluacionId).subscribe(
        calificaciones => {
          this.dataSource.data = calificaciones;
        },
        error => {
          console.error('Error al cargar calificaciones', error);
          this.snackBar.open('Error al cargar calificaciones', 'Cerrar', {
            duration: 3000,
          });
        }
      );
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  volverAEvaluaciones(): void {
    this.router.navigate(['/evaluaciones']);
  }

  agregarCalificacion(): void {
    if (this.evaluacionId) {
      this.router.navigate(['/evaluaciones', this.evaluacionId, 'calificaciones', 'nuevo']);
    }
  }

  editarCalificacion(id: number): void {
    if (this.evaluacionId) {
      this.router.navigate(['/evaluaciones', this.evaluacionId, 'calificaciones', 'editar', id]);
    }
  }

  eliminarCalificacion(id: number): void {
    if (confirm('¿Está seguro que desea eliminar esta calificación?')) {
      this.calificacionService.delete(id).subscribe(
        () => {
          this.cargarCalificaciones();
          this.snackBar.open('Calificación eliminada con éxito', 'Cerrar', {
            duration: 3000,
          });
        },
        error => {
          console.error('Error al eliminar calificación', error);
          this.snackBar.open('Error al eliminar calificación', 'Cerrar', {
            duration: 3000,
          });
        }
      );
    }
  }

  getCalificacionClass(valor: number): string {
    if (valor >= 3) {
      return 'calificacion-aprobada';
    } else {
      return 'calificacion-reprobada';
    }
  }
} 