import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Select2Component } from './select2/select2.component';
import { Select2Module } from 'ng2-select2';
import { SmartTableCheckboxComponent, SmartTableButtonComponent, SmartTableIconComponent, SmartTableThumbnailComponent, SmartTableDateTimeComponent } from './smart-table/smart-table.component';
import { NbCheckboxModule, NbIconModule, NbButtonModule, NbInputModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { ActionControlListComponent } from './action-control-list/action-control-list.component';
import { AgListComponent } from './ag-list/ag-list.component';
import { AgGridModule } from '@ag-grid-community/angular';
import { HeadTitlePipe } from '../pipes/head-title.pipe';

@NgModule({
  declarations: [
    Select2Component,
    SmartTableCheckboxComponent,
    SmartTableButtonComponent,
    SmartTableIconComponent,
    SmartTableThumbnailComponent,
    ActionControlListComponent,
    AgListComponent,
    HeadTitlePipe,
    SmartTableDateTimeComponent,
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
    SmartTableThumbnailComponent,
    ActionControlListComponent,
    AgListComponent,
    HeadTitlePipe,
    SmartTableDateTimeComponent,
  ],
})
export class CustomElementModule { }
