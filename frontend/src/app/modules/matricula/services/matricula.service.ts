import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Matricula {
  id: number;
  fechaInscripcion: Date;
  calificacionFinal?: number;
  estudiante: {
    id: string;
    nombre: string;
  };
  curso: {
    codigo: string;
    nombre: string;
  };
}

export interface CreateMatriculaDto {
  fechaInscripcion: Date;
  estudianteId: string;
  cursoCodigo: string;
}

export interface UpdateMatriculaDto {
  calificacionFinal?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {
  private apiUrl = 'http://localhost:3000/matriculas';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Matricula[]> {
    return this.http.get<Matricula[]>(this.apiUrl);
  }

  findOne(id: number): Observable<Matricula> {
    return this.http.get<Matricula>(`${this.apiUrl}/${id}`);
  }

  findByEstudiante(estudianteId: string): Observable<Matricula[]> {
    return this.http.get<Matricula[]>(`${this.apiUrl}/estudiante/${estudianteId}`);
  }

  findByCurso(cursoCodigo: string): Observable<Matricula[]> {
    return this.http.get<Matricula[]>(`${this.apiUrl}/curso/${cursoCodigo}`);
  }

  create(matricula: CreateMatriculaDto): Observable<Matricula> {
    console.log('Creando matrícula:', matricula);
    return this.http.post<Matricula>(this.apiUrl, matricula);
  }

  update(id: number, matricula: UpdateMatriculaDto): Observable<Matricula> {
    console.log('Actualizando matrícula:', id, matricula);
    return this.http.put<Matricula>(`${this.apiUrl}/${id}`, matricula);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 