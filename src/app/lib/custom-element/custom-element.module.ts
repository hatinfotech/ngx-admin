import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Select2Component } from './select2/select2.component';
import { Select2Module } from 'ng2-select2';
import { SmartTableCheckboxComponent, SmartTableButtonComponent } from './smart-table/smart-table-checkbox.component';
import { NbCheckboxModule, NbSvgIcon, NbIconModule, NbButtonModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [Select2Component, SmartTableCheckboxComponent, SmartTableButtonComponent],
  imports: [
    CommonModule,
    Select2Module,
    NbCheckboxModule,
    NbIconModule,
    NbButtonModule,
    FormsModule,
  ],
  exports: [
    Select2Component,
    SmartTableCheckboxComponent,
    SmartTableButtonComponent,
  ],
})
export class CustomElementModule { }
