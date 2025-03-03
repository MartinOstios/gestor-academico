import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CursoListComponent } from './components/curso-list/curso-list.component';
import { CursoFormComponent } from './components/curso-form/curso-form.component';
import { CursoPrerrequisitosComponent } from './components/curso-prerrequisitos/curso-prerrequisitos.component';
import { AuthGuard } from '../../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: CursoListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'nuevo',
    component: CursoFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'editar/:codigo',
    component: CursoFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'prerrequisitos/:codigo',
    component: CursoPrerrequisitosComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CursoRoutingModule { } 