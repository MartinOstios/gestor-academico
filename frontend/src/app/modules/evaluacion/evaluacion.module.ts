import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { EvaluacionRoutingModule } from './evaluacion-routing.module';
import { EvaluacionListComponent } from './components/evaluacion-list/evaluacion-list.component';
import { EvaluacionFormComponent } from './components/evaluacion-form/evaluacion-form.component';
import { CalificacionListComponent } from './components/calificacion-list/calificacion-list.component';
import { CalificacionFormComponent } from './components/calificacion-form/calificacion-form.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    EvaluacionRoutingModule,
    EvaluacionListComponent,
    EvaluacionFormComponent,
    CalificacionListComponent,
    CalificacionFormComponent
  ]
})
export class EvaluacionModule { } 