import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Iniciar Sesión</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Usuario</mat-label>
              <input matInput formControlName="username" required>
              <mat-icon matSuffix aria-hidden="false" aria-label="Usuario">person</mat-icon>
              <mat-error *ngIf="loginForm.get('username')?.hasError('required')">
                El usuario es requerido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Contraseña</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" required>
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                <mat-icon aria-hidden="false" aria-label="Mostrar contraseña">
                  {{hidePassword ? 'visibility_off' : 'visibility'}}
                </mat-icon>
              </button>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                La contraseña es requerida
              </mat-error>
            </mat-form-field>

            <div *ngIf="errorMessage" class="error-message">
              <mat-icon aria-hidden="false" aria-label="Error">error</mat-icon> {{errorMessage}}
            </div>

            <div class="actions">
              <button mat-button type="button" routerLink="/register">Registrarse</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="loginForm.invalid || isLoading">
                <mat-icon *ngIf="!isLoading" aria-hidden="false" aria-label="Ingresar">login</mat-icon>
                <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
                Ingresar
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  hidePassword: boolean = true;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      this.authService.login(
        this.loginForm.value.username,
        this.loginForm.value.password
      ).subscribe({
        next: (response) => {
          console.log('Login exitoso:', response);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          if (err.error && err.error.message) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'Error al iniciar sesión. Por favor, intente nuevamente.';
          }
          console.error('Error de login:', err);
          this.isLoading = false;
        }
      });
    }
  }
} 