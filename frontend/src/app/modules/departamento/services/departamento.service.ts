import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Departamento {
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

  findAll(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(this.apiUrl);
  }

  findOne(codigo: string): Observable<Departamento> {
    return this.http.get<Departamento>(`${this.apiUrl}/${codigo}`);
  }

  create(departamento: Departamento): Observable<Departamento> {
    return this.http.post<Departamento>(this.apiUrl, departamento);
  }

  update(codigo: string, departamento: Departamento): Observable<Departamento> {
    return this.http.put<Departamento>(`${this.apiUrl}/${codigo}`, departamento);
  }

  delete(codigo: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${codigo}`);
  }
} 