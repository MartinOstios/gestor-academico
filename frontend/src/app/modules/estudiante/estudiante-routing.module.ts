import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstudianteListComponent } from './components/estudiante-list/estudiante-list.component';
import { EstudianteFormComponent } from './components/estudiante-form/estudiante-form.component';
import { EstudianteCalificacionesComponent } from './components/estudiante-calificaciones/estudiante-calificaciones.component';

const routes: Routes = [
  { path: '', component: EstudianteListComponent },
  { path: 'nuevo', component: EstudianteFormComponent },
  { path: 'editar/:id', component: EstudianteFormComponent },
  { path: ':id/calificaciones', component: EstudianteCalificacionesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstudianteRoutingModule { } 