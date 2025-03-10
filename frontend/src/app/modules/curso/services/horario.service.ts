import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Horario {
  id: number;
  dia: string;
  horaInicio: string;
  horaFin: string;
  cursoCodigo: string;
  curso?: any;
}

export interface CreateHorarioDto {
  dia: string;
  horaInicio: string;
  horaFin: string;
  cursoCodigo?: string;
}

export interface UpdateHorarioDto {
  dia?: string;
  horaInicio?: string;
  horaFin?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HorarioService {
  private apiUrl = 'http://localhost:3000/horarios';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Horario[]> {
    return this.http.get<Horario[]>(this.apiUrl);
  }

  findOne(id: number): Observable<Horario> {
    return this.http.get<Horario>(`${this.apiUrl}/${id}`);
  }

  findByCurso(cursoCodigo: string): Observable<Horario[]> {
    return this.http.get<Horario[]>(`${this.apiUrl}/curso/${cursoCodigo}`);
  }

  create(horario: CreateHorarioDto): Observable<Horario> {
    return this.http.post<Horario>(this.apiUrl, horario);
  }

  update(id: number, horario: UpdateHorarioDto): Observable<Horario> {
    return this.http.put<Horario>(`${this.apiUrl}/${id}`, horario);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 