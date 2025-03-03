import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/material.module';
import { DepartamentoRoutingModule } from './departamento-routing.module';
import { DepartamentoListComponent } from './components/departamento-list/departamento-list.component';
import { DepartamentoFormComponent } from './components/departamento-form/departamento-form.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    DepartamentoRoutingModule,
    DepartamentoListComponent,
    DepartamentoFormComponent
  ]
})
export class DepartamentoModule { } 