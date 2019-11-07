import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Select2Component } from './select2/select2.component';
import { Select2Module } from 'ng2-select2';

@NgModule({
  declarations: [Select2Component],
  imports: [
    CommonModule,
    Select2Module,
  ],
  exports: [
    Select2Component,
  ],
})
export class CustomElementModule { }
