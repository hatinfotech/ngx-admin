import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Select2Component } from './select2/select2.component';
import { SmartTableCheckboxComponent, SmartTableButtonComponent, SmartTableIconComponent, SmartTableThumbnailComponent, SmartTableDateTimeComponent, SmartTableCurrencyEditableComponent } from './smart-table/smart-table.component';
import { NbCheckboxModule, NbIconModule, NbButtonModule, NbInputModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActionControlListComponent } from './action-control-list/action-control-list.component';
import { AgListComponent } from './ag-list/ag-list.component';
import { AgGridModule } from '@ag-grid-community/angular';
import { HeadTitlePipe } from '../pipes/head-title.pipe';
import { SmartTableDateTimeRangeFilterComponent, SmartTableClearingFilterComponent, SmartTableFilterComponent, SmartTableSelect2FilterComponent } from './smart-table/smart-table.filter.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { TranslateModule } from '@ngx-translate/core';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { Select2Module } from '../../../vendor/ng2-select2/lib/ng2-select2';

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
    SmartTableDateTimeRangeFilterComponent,
    SmartTableClearingFilterComponent,
    SmartTableFilterComponent,
    SmartTableSelect2FilterComponent,
    SmartTableCurrencyEditableComponent,
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
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    TranslateModule,
    CurrencyMaskModule,
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
    SmartTableDateTimeRangeFilterComponent,
    SmartTableClearingFilterComponent,
    SmartTableFilterComponent,
    SmartTableSelect2FilterComponent,
    SmartTableCurrencyEditableComponent,
  ],
})
export class CustomElementModule { }
