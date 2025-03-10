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
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';

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
    MatSortModule,
    MatTooltipModule,
    MatListModule
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
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
            <table mat-table [dataSource]="dataSource" matSort class="mat-table-striped"
                   multiTemplateDataRows>
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

              <!-- Profesores Count Column -->
              <ng-container matColumnDef="profesoresCount">
                <th mat-header-cell *matHeaderCellDef> Profesores </th>
                <td mat-cell *matCellDef="let row">
                  <button mat-button color="primary" (click)="expandRow(row)" [matTooltip]="'Ver profesores'">
                    {{ row.profesores?.length || 0 }} 
                    <mat-icon>{{ expandedElement === row ? 'expand_less' : 'expand_more' }}</mat-icon>
                  </button>
                </td>
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

              <!-- Expanded Content Column -->
              <ng-container matColumnDef="expandedDetail">
                <td mat-cell *matCellDef="let row" [attr.colspan]="displayedColumns.length">
                  <div class="row-detail" [@detailExpand]="row === expandedElement ? 'expanded' : 'collapsed'">
                    <div class="profesores-list" *ngIf="row.profesores?.length; else noProfesores">
                      <h3>Profesores del Departamento</h3>
                      <mat-list>
                        <mat-list-item *ngFor="let profesor of row.profesores">
                          <mat-icon matListItemIcon>person</mat-icon>
                          <div matListItemTitle>{{profesor.nombre}}</div>
                          <div matListItemLine>{{profesor.email}}</div>
                        </mat-list-item>
                      </mat-list>
                    </div>
                    <ng-template #noProfesores>
                      <div class="no-profesores">
                        <mat-icon>person_off</mat-icon>
                        <p>No hay profesores asignados a este departamento</p>
                      </div>
                    </ng-template>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"
                  class="table-row"
                  [class.expanded-row]="expandedElement === row"></tr>
              <tr mat-row *matRowDef="let row; columns: ['expandedDetail']"
                  class="detail-row"></tr>

              <!-- Row shown when there is no matching data. -->
              <tr class="mat-row" *matNoDataRow>
                <td class="mat-cell no-data-cell" [attr.colspan]="displayedColumns.length">
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

    .mat-table-striped .mat-row:nth-child(even):not(.detail-row) {
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

    tr.detail-row {
      height: 0;
    }

    .row-detail {
      overflow: hidden;
    }

    .profesores-list {
      padding: 16px;
    }

    .profesores-list h3 {
      color: #3f51b5;
      margin-bottom: 16px;
    }

    .no-profesores {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px;
      color: #757575;
    }

    .no-profesores mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: 16px;
    }

    tr.expanded-row {
      background: #f5f5f5;
    }

    tr.expanded-row:hover {
      background: #efefef;
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
  displayedColumns: string[] = ['codigo', 'nombre', 'profesoresCount', 'acciones'];
  dataSource: MatTableDataSource<Departamento>;
  expandedElement: Departamento | null = null;

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

  expandRow(row: Departamento): void {
    this.expandedElement = this.expandedElement === row ? null : row;
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