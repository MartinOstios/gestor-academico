import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: string;
  username: string;
  rol: 'ADMIN' | 'PROFESOR' | 'ESTUDIANTE';
  referenciaId?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenKey = 'auth_token';
  private userKey = 'current_user';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const storedUser = localStorage.getItem(this.userKey);
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem(this.userKey, JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      })
    );
  }

  register(data: { username: string; password: string; role: string; referenciaId: string }): Observable<void> {
    const registerData = {
      username: data.username,
      password: data.password,
      rol: data.role,
      referenciaId: data.referenciaId
    };
    return this.http.post<void>(`${this.apiUrl}/register`, registerData);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserRole(): string {
    const user = this.getCurrentUser();
    return user ? user.rol : '';
  }
} 