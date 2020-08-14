import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Select2Component } from './select2/select2.component';
import { SmartTableCheckboxComponent, SmartTableButtonComponent, SmartTableIconComponent, SmartTableThumbnailComponent, SmartTableDateTimeComponent, SmartTableCurrencyEditableComponent, IconViewComponent } from './smart-table/smart-table.component';
import { NbCheckboxModule, NbIconModule, NbButtonModule, NbInputModule, NbSelectModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActionControlListComponent } from './action-control-list/action-control-list.component';
import { AgListComponent } from './ag-list/ag-list.component';
import { AgGridModule } from '@ag-grid-community/angular';
import { HeadTitlePipe } from '../pipes/head-title.pipe';
import { SmartTableDateTimeRangeFilterComponent, SmartTableClearingFilterComponent, SmartTableFilterComponent, SmartTableSelect2FilterComponent, SmartTableSelectFilterComponent } from './smart-table/smart-table.filter.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { TranslateModule } from '@ngx-translate/core';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { Select2Module } from '../../../vendor/ng2-select2/lib/ng2-select2';
import { CardHeaderComponent } from './card-header/card-header.component';
import { CardHeaderCustomComponent } from './card-header/card-header-custom.component';
import { DatetimPickerComponent } from './datetime-picker/datetime-picker.component';
import { TextNTagsComponent } from './textntags/textntags.component';
import { FormGroupComponent } from './form/form-group/form-group.component';

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
    CardHeaderComponent, CardHeaderCustomComponent, SmartTableSelectFilterComponent, IconViewComponent, DatetimPickerComponent, TextNTagsComponent, FormGroupComponent,
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
    NbSelectModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    TranslateModule,
    CurrencyMaskModule,
    FormsModule,
    ReactiveFormsModule,
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
    CardHeaderComponent, CardHeaderCustomComponent, SmartTableSelectFilterComponent, IconViewComponent, DatetimPickerComponent, TextNTagsComponent, FormGroupComponent,
  ],
})
export class CustomElementModule { }
