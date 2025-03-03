import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/material.module';
import { ProfesorRoutingModule } from './profesor-routing.module';
import { ProfesorListComponent } from './components/profesor-list/profesor-list.component';
import { ProfesorFormComponent } from './components/profesor-form/profesor-form.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    ProfesorRoutingModule,
    ProfesorListComponent,
    ProfesorFormComponent
  ]
})
export class ProfesorModule { } 