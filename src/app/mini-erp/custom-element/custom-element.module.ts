import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Select2Component } from './select2/select2.component';
import { Select2Module } from 'ng2-select2';
import { SmartTableCheckboxComponent } from './smart-table/smart-table-checkbox.component';
import { NbCheckboxModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [Select2Component, SmartTableCheckboxComponent],
  imports: [
    CommonModule,
    Select2Module,
    NbCheckboxModule,
    FormsModule,
  ],
  exports: [
    Select2Component,
    SmartTableCheckboxComponent,
  ],
})
export class CustomElementModule { }
