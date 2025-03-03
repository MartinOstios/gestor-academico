import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/material.module';
import { EstudianteRoutingModule } from './estudiante-routing.module';
import { EstudianteListComponent } from './components/estudiante-list/estudiante-list.component';
import { EstudianteFormComponent } from './components/estudiante-form/estudiante-form.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    EstudianteRoutingModule,
    EstudianteListComponent,
    EstudianteFormComponent
  ]
})
export class EstudianteModule { } 