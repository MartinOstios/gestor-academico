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
  selector: 'app-register',
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
          <mat-card-title>Registro de Usuario</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Usuario</mat-label>
              <input matInput formControlName="username" required>
              <mat-icon matSuffix aria-hidden="false" aria-label="Usuario">person</mat-icon>
              <mat-error *ngIf="registerForm.get('username')?.hasError('required')">
                El usuario es requerido
              </mat-error>
              <mat-error *ngIf="registerForm.get('username')?.hasError('minlength')">
                El usuario debe tener al menos 4 caracteres
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
              <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                La contraseña es requerida
              </mat-error>
              <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                La contraseña debe tener al menos 6 caracteres
              </mat-error>
            </mat-form-field>

            <div *ngIf="errorMessage" class="error-message">
              <mat-icon aria-hidden="false" aria-label="Error">error</mat-icon> {{errorMessage}}
            </div>

            <div class="actions">
              <button mat-button type="button" routerLink="/login">Ya tengo cuenta</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="registerForm.invalid || isLoading">
                <mat-icon *ngIf="!isLoading" aria-hidden="false" aria-label="Registrar">person_add</mat-icon>
                <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
                Registrarse
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string = '';
  hidePassword: boolean = true;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const registerData = {
        username: this.registerForm.value.username,
        password: this.registerForm.value.password,
        role: 'ADMIN',
        referenciaId: 'AUTO'
      };
      
      this.authService.register(registerData).subscribe({
        next: (response) => {
          console.log('Registro exitoso:', response);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          if (err.error && err.error.message) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'Error al registrar usuario. Por favor, intente nuevamente.';
          }
          console.error('Error de registro:', err);
          this.isLoading = false;
        }
      });
    }
  }
} 