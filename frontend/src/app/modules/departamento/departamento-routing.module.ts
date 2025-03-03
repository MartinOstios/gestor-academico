import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartamentoListComponent } from './components/departamento-list/departamento-list.component';
import { DepartamentoFormComponent } from './components/departamento-form/departamento-form.component';

const routes: Routes = [
  { path: '', component: DepartamentoListComponent },
  { path: 'nuevo', component: DepartamentoFormComponent },
  { path: 'editar/:id', component: DepartamentoFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartamentoRoutingModule { } 