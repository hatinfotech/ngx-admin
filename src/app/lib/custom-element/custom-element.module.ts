import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Select2Component } from './select2/select2.component';
import { Select2Module } from 'ng2-select2';
import { SmartTableCheckboxComponent, SmartTableButtonComponent, SmartTableIconComponent } from './smart-table/smart-table-checkbox.component';
import { NbCheckboxModule, NbIconModule, NbButtonModule, NbInputModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { ActionControlListComponent } from './action-control-list/action-control-list.component';
import { AgListComponent } from './ag-list/ag-list.component';
import { AgGridModule } from '@ag-grid-community/angular';

@NgModule({
  declarations: [
    Select2Component,
    SmartTableCheckboxComponent,
    SmartTableButtonComponent,
    SmartTableIconComponent,
    ActionControlListComponent,
    AgListComponent,
  ],
  imports: [
    CommonModule,
    Select2Module,
    NbCheckboxModule,
    NbIconModule,
    NbButtonModule,
    FormsModule,
    NbInputModule,
    AgGridModule,
  ],
  exports: [
    Select2Component,
    SmartTableCheckboxComponent,
    SmartTableButtonComponent,
    SmartTableIconComponent,
    ActionControlListComponent,
    AgListComponent,
  ],
})
export class CustomElementModule { }
