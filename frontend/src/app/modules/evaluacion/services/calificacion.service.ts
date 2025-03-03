import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Calificacion {
  id: number;
  valor: number;
  estudiante: {
    id: string;
    nombre: string;
  };
  evaluacion: {
    id: string;
    fechaRealizacion: Date;
  };
}

export interface CreateCalificacionDto {
  valor: number;
  estudianteId: string;
  evaluacionId: string;
}

export interface UpdateCalificacionDto {
  valor: number;
}

@Injectable({
  providedIn: 'root'
})
export class CalificacionService {
  private apiUrl = 'http://localhost:3000/calificaciones';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Calificacion[]> {
    return this.http.get<Calificacion[]>(this.apiUrl);
  }

  findOne(id: number): Observable<Calificacion> {
    return this.http.get<Calificacion>(`${this.apiUrl}/${id}`);
  }

  findByEstudiante(estudianteId: string): Observable<Calificacion[]> {
    return this.http.get<Calificacion[]>(`${this.apiUrl}/estudiante/${estudianteId}`);
  }

  findByEvaluacion(evaluacionId: string): Observable<Calificacion[]> {
    return this.http.get<Calificacion[]>(`${this.apiUrl}/evaluacion/${evaluacionId}`);
  }

  create(calificacion: CreateCalificacionDto): Observable<Calificacion> {
    console.log('Creando calificación:', calificacion);
    return this.http.post<Calificacion>(this.apiUrl, calificacion);
  }

  update(id: number, calificacion: UpdateCalificacionDto): Observable<Calificacion> {
    console.log('Actualizando calificación:', id, calificacion);
    return this.http.put<Calificacion>(`${this.apiUrl}/${id}`, calificacion);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 