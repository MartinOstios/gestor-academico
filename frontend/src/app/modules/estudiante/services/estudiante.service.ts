import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Estudiante {
  id: string;
  nombre: string;
  fechaNacimiento: Date;
}

export interface CreateEstudianteDto {
  id: string;
  nombre: string;
  fechaNacimiento: Date;
}

export interface UpdateEstudianteDto {
  nombre: string;
  fechaNacimiento: Date;
}

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private apiUrl = 'http://localhost:3000/estudiantes';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(this.apiUrl);
  }

  findOne(id: string): Observable<Estudiante> {
    return this.http.get<Estudiante>(`${this.apiUrl}/${id}`);
  }

  create(estudiante: CreateEstudianteDto): Observable<Estudiante> {
    console.log('Creando estudiante:', estudiante);
    return this.http.post<Estudiante>(this.apiUrl, estudiante);
  }

  update(id: string, estudiante: UpdateEstudianteDto): Observable<Estudiante> {
    console.log('Actualizando estudiante:', id, estudiante);
    return this.http.put<Estudiante>(`${this.apiUrl}/${id}`, estudiante);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 