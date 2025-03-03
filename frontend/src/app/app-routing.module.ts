import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { LayoutComponent } from './components/layout/layout.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { 
        path: 'dashboard', 
        component: DashboardComponent
      },
      { 
        path: 'departamentos',
        loadChildren: () => import('./modules/departamento/departamento.module').then(m => m.DepartamentoModule)
      },
      { 
        path: 'profesores',
        loadChildren: () => import('./modules/profesor/profesor.module').then(m => m.ProfesorModule)
      },
      { 
        path: 'estudiantes',
        loadChildren: () => import('./modules/estudiante/estudiante.module').then(m => m.EstudianteModule)
      },
      { 
        path: 'cursos',
        loadChildren: () => import('./modules/curso/curso.module').then(m => m.CursoModule)
      },
      { 
        path: 'matriculas',
        loadChildren: () => import('./modules/matricula/matricula.module').then(m => m.MatriculaModule)
      },
      { 
        path: 'evaluaciones',
        loadChildren: () => import('./modules/evaluacion/evaluacion.module').then(m => m.EvaluacionModule)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 