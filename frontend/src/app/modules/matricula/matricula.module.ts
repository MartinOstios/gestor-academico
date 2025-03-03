import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatriculaRoutingModule } from './matricula-routing.module';
import { MatriculaListComponent } from './components/matricula-list/matricula-list.component';
import { MatriculaFormComponent } from './components/matricula-form/matricula-form.component';
import { MatriculaCalificarComponent } from './components/matricula-calificar/matricula-calificar.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatriculaRoutingModule,
    MatriculaListComponent,
    MatriculaFormComponent,
    MatriculaCalificarComponent
  ]
})
export class MatriculaModule { } 