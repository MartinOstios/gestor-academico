import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService, CreateCursoDto, UpdateCursoDto } from '../../services/curso.service';
import { ProfesorService, Profesor } from '../../../profesor/services/profesor.service';
import { HorarioService, Horario } from '../../services/horario.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { firstValueFrom } from 'rxjs';

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
    MatOptionModule,
    MatSnackBarModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    MatChipsModule,
    MatDividerModule,
    NgxMaterialTimepickerModule
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

            <h3>Horarios</h3>
            
            <!-- Previsualización de horarios -->
            <div class="horarios-preview" *ngIf="horariosArray.controls.length > 0">
              <h4>Horarios configurados:</h4>
              <div class="chips-container">
                <mat-chip-set>
                  <mat-chip *ngFor="let horarioForm of horariosArray.controls; let i = index" 
                          [matTooltip]="getHorarioTooltip(i)" 
                          class="horario-chip">
                    {{ getDiaValue(i) }} {{ getHoraInicioValue(i) }}-{{ getHoraFinValue(i) }}
                    <button matChipRemove (click)="eliminarHorario(i)">
                      <mat-icon>cancel</mat-icon>
                    </button>
                  </mat-chip>
                </mat-chip-set>
              </div>
              <mat-divider class="divider"></mat-divider>
            </div>
            
            <div formArrayName="horarios">
              <div class="horario-form" *ngFor="let horarioForm of horariosArray.controls; let i = index" [formGroupName]="i">
                <div class="horario-form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Día</mat-label>
                    <mat-select formControlName="dia">
                      <mat-option *ngFor="let dia of diasSemana" [value]="dia">
                        {{ dia }}
                      </mat-option>
                    </mat-select>
                    <mat-error *ngIf="horarioForm.get('dia')?.hasError('required')">
                      El día es requerido
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Hora Inicio</mat-label>
                    <input matInput [ngxTimepicker]="pickerInicio" formControlName="horaInicio" readonly>
                    <mat-icon matSuffix (click)="pickerInicio.open()">schedule</mat-icon>
                    <ngx-material-timepicker #pickerInicio [format]="24" (timeSet)="onTimeSet('horaInicio', i, $event)"></ngx-material-timepicker>
                    <mat-error *ngIf="horarioForm.get('horaInicio')?.hasError('required')">
                      La hora de inicio es requerida
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Hora Fin</mat-label>
                    <input matInput [ngxTimepicker]="pickerFin" formControlName="horaFin" readonly>
                    <mat-icon matSuffix (click)="pickerFin.open()">schedule</mat-icon>
                    <ngx-material-timepicker #pickerFin [format]="24" (timeSet)="onTimeSet('horaFin', i, $event)"></ngx-material-timepicker>
                    <mat-error *ngIf="horarioForm.get('horaFin')?.hasError('required')">
                      La hora de fin es requerida
                    </mat-error>
                  </mat-form-field>

                  <button mat-mini-fab color="warn" type="button" (click)="eliminarHorario(i)" matTooltip="Eliminar horario">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </div>

              <div class="no-horarios" *ngIf="horariosArray.controls.length === 0">
                <p>No hay horarios definidos</p>
              </div>

              <button mat-raised-button color="accent" type="button" (click)="agregarHorario()" class="add-button">
                <mat-icon>add</mat-icon> Agregar Horario
              </button>
            </div>

            <div class="actions">
              <button mat-button type="button" (click)="onCancel()">Cancelar</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="isSubmitting">
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
      max-width: 1000px;
      margin: 0 auto;
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
      margin-top: 20px;
      margin-bottom: 10px;
      color: #3f51b5;
      font-size: 18px;
    }

    h4 {
      margin-top: 10px;
      margin-bottom: 10px;
      color: #616161;
      font-size: 16px;
    }

    .horario-form {
      margin-bottom: 16px;
      padding: 16px;
      border-radius: 8px;
      background-color: #f5f5f5;
    }

    .horario-form-row {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .add-button {
      margin-bottom: 20px;
    }

    .no-horarios {
      padding: 20px;
      text-align: center;
      background-color: #f5f5f5;
      border-radius: 4px;
      margin-bottom: 20px;
    }

    .horarios-preview {
      margin-bottom: 20px;
    }

    .chips-container {
      margin-bottom: 16px;
    }

    .horario-chip {
      margin: 4px;
      background-color: #e0e0e0;
    }

    .divider {
      margin-bottom: 20px;
    }
    `
  ]
})
export class CursoFormComponent implements OnInit {
  form: FormGroup;
  isEditing = false;
  isSubmitting = false;
  cursoCodigo: string = '';
  profesores: Profesor[] = [];
  horarios: Horario[] = [];
  diasSemana: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  constructor(
    private fb: FormBuilder,
    private cursoService: CursoService,
    private profesorService: ProfesorService,
    private horarioService: HorarioService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      descripcion: ['', Validators.required],
      profesorId: ['', Validators.required],
      horarios: this.fb.array([])
    });
  }

  get horariosArray() {
    return this.form.get('horarios') as FormArray;
  }

  getDiaValue(index: number): string {
    const control = this.horariosArray.at(index).get('dia');
    return control ? control.value : '';
  }

  getHoraInicioValue(index: number): string {
    const control = this.horariosArray.at(index).get('horaInicio');
    return control ? control.value : '';
  }

  getHoraFinValue(index: number): string {
    const control = this.horariosArray.at(index).get('horaFin');
    return control ? control.value : '';
  }

  getHorarioTooltip(index: number): string {
    const dia = this.getDiaValue(index);
    const horaInicio = this.getHoraInicioValue(index);
    const horaFin = this.getHoraFinValue(index);
    return `${dia}: ${horaInicio} - ${horaFin}`;
  }

  // Método para formatear la hora al formato HH:MM
  formatTime(time: string): string {
    console.log('Formateando hora:', time);
    
    // Si ya está en formato HH:MM, devolverlo tal cual
    if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
      return time.padStart(5, '0').replace(/^(\d):/, '0$1:');
    }
    
    // Si está en formato de 12 horas (con AM/PM), convertirlo a 24 horas
    if (time.includes('AM') || time.includes('PM')) {
      const [timePart, period] = time.split(' ');
      let [hours, minutes] = timePart.split(':').map(Number);
      
      if (period === 'PM' && hours < 12) {
        hours += 12;
      } else if (period === 'AM' && hours === 12) {
        hours = 0;
      }
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    
    // Si solo tiene horas, añadir minutos
    if (!time.includes(':')) {
      return `${time.padStart(2, '0')}:00`;
    }
    
    // Si tiene formato HH:MM pero sin ceros a la izquierda
    const match = time.match(/^(\d{1,2}):(\d{2})$/);
    if (match) {
      const hours = match[1].padStart(2, '0');
      const minutes = match[2];
      return `${hours}:${minutes}`;
    }
    
    // Formato desconocido, devolver un valor por defecto
    console.error('Formato de hora no reconocido:', time);
    return '00:00';
  }

  // Método para manejar el evento de selección de hora
  onTimeSet(controlName: string, index: number, time: string): void {
    console.log('Hora seleccionada:', time);
    const formattedTime = this.formatTime(time);
    console.log('Hora formateada:', formattedTime);
    const control = this.horariosArray.at(index).get(controlName);
    if (control) {
      control.setValue(formattedTime);
    }
  }

  ngOnInit(): void {
    this.cargarProfesores();
    
    const codigo = this.route.snapshot.params['codigo'];
    if (codigo) {
      this.isEditing = true;
      this.cursoCodigo = codigo;
      this.cargarCurso(codigo);
    } else {
      // Agregar un horario por defecto para cursos nuevos
      this.agregarHorario();
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
          profesorId: curso.profesor?.id
        });

        // Limpiar horarios existentes
        while (this.horariosArray.length !== 0) {
          this.horariosArray.removeAt(0);
        }

        // Cargar horarios
        if (curso.horarios && curso.horarios.length > 0) {
          curso.horarios.forEach(horario => {
            this.agregarHorarioExistente(horario);
          });
        } else {
          // Si no hay horarios, agregar uno vacío
          this.agregarHorario();
        }
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

  agregarHorario(): void {
    const horarioForm = this.fb.group({
      dia: ['Lunes', Validators.required],
      horaInicio: ['08:00', Validators.required],
      horaFin: ['10:00', Validators.required]
    });
    
    this.horariosArray.push(horarioForm);
  }

  agregarHorarioExistente(horario: Horario): void {
    const horarioForm = this.fb.group({
      id: [horario.id],
      dia: [horario.dia, Validators.required],
      horaInicio: [horario.horaInicio, Validators.required],
      horaFin: [horario.horaFin, Validators.required]
    });
    
    this.horariosArray.push(horarioForm);
  }

  eliminarHorario(index: number): void {
    this.horariosArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isSubmitting = true;
      
      // Asegurarse de que todas las horas estén en formato HH:MM
      const horarios = this.horariosArray.controls.map(control => {
        const value = control.value;
        return {
          ...value,
          horaInicio: this.formatTime(value.horaInicio),
          horaFin: this.formatTime(value.horaFin)
        };
      });
      
      if (this.isEditing) {
        const updateData: UpdateCursoDto = {
          nombre: this.form.value.nombre,
          descripcion: this.form.value.descripcion,
          profesorId: this.form.value.profesorId
        };
        
        this.cursoService.update(this.cursoCodigo, updateData).subscribe(
          () => {
            // Actualizar horarios
            this.actualizarHorarios(horarios);
          },
          error => {
            console.error('Error al actualizar curso', error);
            this.snackBar.open('Error al actualizar el curso', 'Cerrar', {
              duration: 3000
            });
            this.isSubmitting = false;
          }
        );
      } else {
        // Validar que haya al menos un horario
        if (horarios.length === 0) {
          this.snackBar.open('Debe agregar al menos un horario', 'Cerrar', {
            duration: 3000
          });
          this.isSubmitting = false;
          return;
        }

        const createData: CreateCursoDto = {
          nombre: this.form.value.nombre,
          descripcion: this.form.value.descripcion,
          profesorId: this.form.value.profesorId,
          horarios: horarios
        };
        
        console.log('Datos a enviar:', createData);
        
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
            this.isSubmitting = false;
          }
        );
      }
    }
  }

  async actualizarHorarios(horarios: any[]): Promise<void> {
    try {
      // Primero, obtener los horarios actuales del curso
      const horariosActuales = await firstValueFrom(this.horarioService.findByCurso(this.cursoCodigo));
      
      // Crear un mapa de los horarios existentes por ID
      const horariosExistentes = new Map<number, Horario>();
      horariosActuales.forEach(h => horariosExistentes.set(h.id, h));
      
      // Procesar los horarios del formulario
      for (const horario of horarios) {
        if (horario.id) {
          // Actualizar horario existente
          const updateDto = {
            dia: horario.dia,
            horaInicio: horario.horaInicio,
            horaFin: horario.horaFin
          };
          
          console.log('Actualizando horario:', horario.id, updateDto);
          
          try {
            await firstValueFrom(this.horarioService.update(horario.id, updateDto));
            // Eliminar del mapa para saber cuáles eliminar después
            horariosExistentes.delete(horario.id);
          } catch (error) {
            console.error('Error al actualizar horario:', error);
            throw new Error('Error al actualizar horario');
          }
        } else {
          // Crear nuevo horario
          const createDto = {
            dia: horario.dia,
            horaInicio: horario.horaInicio,
            horaFin: horario.horaFin,
            cursoCodigo: this.cursoCodigo
          };
          
          console.log('Creando horario:', createDto);
          
          try {
            await firstValueFrom(this.horarioService.create(createDto));
          } catch (error) {
            console.error('Error al crear horario:', error);
            throw new Error('Error al crear horario');
          }
        }
      }
      
      // Eliminar horarios que ya no existen
      for (const [id, horario] of horariosExistentes.entries()) {
        console.log('Eliminando horario:', id);
        
        try {
          await firstValueFrom(this.horarioService.delete(id));
        } catch (error) {
          console.error('Error al eliminar horario:', error);
          throw new Error('Error al eliminar horario');
        }
      }
      
      this.snackBar.open('Curso actualizado con éxito', 'Cerrar', {
        duration: 3000
      });
      this.router.navigate(['/cursos']);
    } catch (error) {
      console.error('Error al actualizar horarios:', error);
      this.snackBar.open('Error al actualizar horarios', 'Cerrar', {
        duration: 3000
      });
      this.isSubmitting = false;
    }
  }

  onCancel(): void {
    this.router.navigate(['/cursos']);
  }
} 