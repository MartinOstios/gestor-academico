import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Departamento {
  codigo?: string;
  nombre: string;
  profesores?: any[];
}

export interface DepartamentoResponse {
  codigo: string;
  nombre: string;
  profesores?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  private apiUrl = 'http://localhost:3000/departamentos';

  constructor(private http: HttpClient) {}

  findAll(): Observable<DepartamentoResponse[]> {
    return this.http.get<DepartamentoResponse[]>(this.apiUrl);
  }

  findOne(codigo: string): Observable<DepartamentoResponse> {
    return this.http.get<DepartamentoResponse>(`${this.apiUrl}/${codigo}`);
  }

  create(departamento: Departamento): Observable<DepartamentoResponse> {
    return this.http.post<DepartamentoResponse>(this.apiUrl, departamento);
  }

  update(codigo: string, departamento: Departamento): Observable<DepartamentoResponse> {
    return this.http.put<DepartamentoResponse>(`${this.apiUrl}/${codigo}`, departamento);
  }

  delete(codigo: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${codigo}`);
  }
} 