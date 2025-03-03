import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfesorListComponent } from './components/profesor-list/profesor-list.component';
import { ProfesorFormComponent } from './components/profesor-form/profesor-form.component';

const routes: Routes = [
  { path: '', component: ProfesorListComponent },
  { path: 'nuevo', component: ProfesorFormComponent },
  { path: 'editar/:id', component: ProfesorFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfesorRoutingModule { } 