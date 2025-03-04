import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Profesor {
  id: string;
  nombre: string;
  fechaContratacion: Date;
  departamento?: {
    codigo: string;
    nombre: string;
  };
}

export interface CreateProfesorDto {
  id?: string;
  nombre: string;
  fechaContratacion: Date;
  departamentoCodigo: string;
}

export interface UpdateProfesorDto {
  nombre: string;
  fechaContratacion?: Date;
  departamentoCodigo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {
  private apiUrl = 'http://localhost:3000/profesores';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Profesor[]> {
    return this.http.get<Profesor[]>(this.apiUrl);
  }

  findOne(id: string): Observable<Profesor> {
    return this.http.get<Profesor>(`${this.apiUrl}/${id}`);
  }

  create(profesor: CreateProfesorDto): Observable<Profesor> {
    return this.http.post<Profesor>(this.apiUrl, profesor);
  }

  update(id: string, profesor: UpdateProfesorDto): Observable<Profesor> {
    return this.http.put<Profesor>(`${this.apiUrl}/${id}`, profesor);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 