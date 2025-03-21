import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateHorarioDto, Horario } from './horario.service';

export interface Curso {
  codigo: string;
  nombre: string;
  descripcion: string;
  profesor?: {
    id: string;
    nombre: string;
  };
  prerrequisitos?: Curso[];
  evaluaciones?: any[];
  horarios?: Horario[];
}

export interface CreateCursoDto {
  codigo?: string;
  nombre: string;
  descripcion: string;
  profesorId: string;
  prerrequisitoCodigos?: string[];
  horarios: CreateHorarioDto[];
}

export interface UpdateCursoDto {
  nombre?: string;
  descripcion?: string;
  profesorId?: string;
}

export interface AddPrerrequisitosDto {
  codigosPrerrequisitos: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private apiUrl = 'http://localhost:3000/cursos';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.apiUrl);
  }

  findOne(codigo: string): Observable<Curso> {
    return this.http.get<Curso>(`${this.apiUrl}/${codigo}`);
  }

  create(curso: CreateCursoDto): Observable<Curso> {
    console.log('Creando curso:', curso);
    return this.http.post<Curso>(this.apiUrl, curso);
  }

  update(codigo: string, curso: UpdateCursoDto): Observable<Curso> {
    console.log('Actualizando curso:', codigo, curso);
    return this.http.put<Curso>(`${this.apiUrl}/${codigo}`, curso);
  }

  delete(codigo: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${codigo}`);
  }

  addPrerrequisitos(codigo: string, prerrequisitos: AddPrerrequisitosDto): Observable<Curso> {
    return this.http.post<Curso>(`${this.apiUrl}/${codigo}/prerrequisitos`, prerrequisitos);
  }

  removePrerrequisito(codigo: string, codigoPrerrequisito: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${codigo}/prerrequisitos/${codigoPrerrequisito}`);
  }
} 