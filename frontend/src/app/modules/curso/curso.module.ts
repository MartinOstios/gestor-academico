import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CursoRoutingModule } from './curso-routing.module';
import { CursoListComponent } from './components/curso-list/curso-list.component';
import { CursoFormComponent } from './components/curso-form/curso-form.component';
import { CursoPrerrequisitosComponent } from './components/curso-prerrequisitos/curso-prerrequisitos.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    CursoRoutingModule,
    CursoListComponent,
    CursoFormComponent,
    CursoPrerrequisitosComponent
  ]
})
export class CursoModule { } 