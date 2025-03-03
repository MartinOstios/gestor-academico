import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DepartamentoService, Departamento } from '../../services/departamento.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-departamento-list',
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
    MatSortModule
  ],
  template: `
    <div class="container">
      <mat-card class="mat-elevation-z4">
        <mat-card-header>
          <mat-card-title>Gestión de Departamentos</mat-card-title>
          <mat-card-subtitle>Administra los departamentos académicos</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="actions">
            <button mat-raised-button color="primary" (click)="crearDepartamento()" class="action-button">
              <mat-icon aria-hidden="false" aria-label="Añadir">add</mat-icon>
              Nuevo Departamento
            </button>
          </div>

          <mat-form-field appearance="outline">
            <mat-label>Filtrar departamentos</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="Ej. Ingeniería" #input>
            <mat-icon matSuffix aria-hidden="false" aria-label="Buscar">search</mat-icon>
          </mat-form-field>

          <div class="table-container mat-elevation-z2">
            <table mat-table [dataSource]="dataSource" matSort class="mat-table-striped">
              <!-- Código Column -->
              <ng-container matColumnDef="codigo">
                <th mat-header-cell *matHeaderCellDef mat-sort-header> Código </th>
                <td mat-cell *matCellDef="let row"> {{row.codigo}} </td>
              </ng-container>

              <!-- Nombre Column -->
              <ng-container matColumnDef="nombre">
                <th mat-header-cell *matHeaderCellDef mat-sort-header> Nombre </th>
                <td mat-cell *matCellDef="let row"> {{row.nombre}} </td>
              </ng-container>

              <!-- Acciones Column -->
              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef> Acciones </th>
                <td mat-cell *matCellDef="let row">
                  <div class="action-buttons">
                    <button mat-mini-fab color="primary" (click)="editarDepartamento(row.codigo)" matTooltip="Editar departamento">
                      <mat-icon aria-hidden="false" aria-label="Editar">edit</mat-icon>
                    </button>
                    <button mat-mini-fab color="warn" (click)="eliminarDepartamento(row.codigo)" matTooltip="Eliminar departamento">
                      <mat-icon aria-hidden="false" aria-label="Eliminar">delete</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"></tr>

              <!-- Row shown when there is no matching data. -->
              <tr class="mat-row" *matNoDataRow>
                <td class="mat-cell no-data-cell" colspan="3">
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
export class DepartamentoListComponent implements OnInit {
  displayedColumns: string[] = ['codigo', 'nombre', 'acciones'];
  dataSource: MatTableDataSource<Departamento>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private departamentoService: DepartamentoService,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource<Departamento>();
  }

  ngOnInit(): void {
    this.cargarDepartamentos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarDepartamentos(): void {
    this.departamentoService.findAll().subscribe(
      departamentos => {
        this.dataSource.data = departamentos;
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  crearDepartamento(): void {
    this.router.navigate(['/departamentos/nuevo']);
  }

  editarDepartamento(codigo: string): void {
    this.router.navigate(['/departamentos/editar', codigo]);
  }

  eliminarDepartamento(codigo: string): void {
    if (confirm('¿Está seguro de que desea eliminar este departamento?')) {
      this.departamentoService.delete(codigo).subscribe(
        () => {
          this.cargarDepartamentos();
        }
      );
    }
  }
} 