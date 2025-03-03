import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatriculaListComponent } from './components/matricula-list/matricula-list.component';
import { MatriculaFormComponent } from './components/matricula-form/matricula-form.component';
import { MatriculaCalificarComponent } from './components/matricula-calificar/matricula-calificar.component';
import { AuthGuard } from '../../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MatriculaListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'nuevo',
    component: MatriculaFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'calificar/:id',
    component: MatriculaCalificarComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatriculaRoutingModule { } 