import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Estudiante {
  id: string;
  nombre: string;
  fechaNacimiento: Date;
}

export interface CreateEstudianteDto {
  id?: string;
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
    return this.http.post<Estudiante>(this.apiUrl, estudiante);
  }

  update(id: string, estudiante: UpdateEstudianteDto): Observable<Estudiante> {
    return this.http.put<Estudiante>(`${this.apiUrl}/${id}`, estudiante);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Método para obtener las calificaciones de un estudiante
  findCalificaciones(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/calificaciones`);
  }
} 