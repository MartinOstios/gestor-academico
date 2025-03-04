import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Evaluacion {
  id: string;
  fechaRealizacion: Date;
  curso: {
    codigo: string;
    nombre: string;
  };
  calificaciones?: any[];
}

export interface CreateEvaluacionDto {
  id?: string;
  fechaRealizacion: Date;
  cursoCodigo: string;
}

export interface UpdateEvaluacionDto {
  fechaRealizacion: Date;
}

@Injectable({
  providedIn: 'root'
})
export class EvaluacionService {
  private apiUrl = 'http://localhost:3000/evaluaciones';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Evaluacion[]> {
    return this.http.get<Evaluacion[]>(this.apiUrl);
  }

  findOne(id: string): Observable<Evaluacion> {
    return this.http.get<Evaluacion>(`${this.apiUrl}/${id}`);
  }

  findByCurso(cursoCodigo: string): Observable<Evaluacion[]> {
    return this.http.get<Evaluacion[]>(`${this.apiUrl}/curso/${cursoCodigo}`);
  }

  create(evaluacion: CreateEvaluacionDto): Observable<Evaluacion> {
    console.log('Creando evaluación:', evaluacion);
    return this.http.post<Evaluacion>(this.apiUrl, evaluacion);
  }

  update(id: string, evaluacion: UpdateEvaluacionDto): Observable<Evaluacion> {
    console.log('Actualizando evaluación:', id, evaluacion);
    return this.http.put<Evaluacion>(`${this.apiUrl}/${id}`, evaluacion);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 