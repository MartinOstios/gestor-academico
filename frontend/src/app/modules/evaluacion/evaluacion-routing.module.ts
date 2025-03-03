import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvaluacionListComponent } from './components/evaluacion-list/evaluacion-list.component';
import { EvaluacionFormComponent } from './components/evaluacion-form/evaluacion-form.component';
import { CalificacionListComponent } from './components/calificacion-list/calificacion-list.component';
import { CalificacionFormComponent } from './components/calificacion-form/calificacion-form.component';
import { AuthGuard } from '../../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: EvaluacionListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'nuevo',
    component: EvaluacionFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'editar/:id',
    component: EvaluacionFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':id/calificaciones',
    component: CalificacionListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':id/calificaciones/nuevo',
    component: CalificacionFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':id/calificaciones/editar/:calificacionId',
    component: CalificacionFormComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluacionRoutingModule { } 