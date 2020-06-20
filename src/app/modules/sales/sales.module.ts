import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesComponent } from './sales.component';
import { SalesPriceReportListComponent } from './price-report/sales-price-report-list/sales-price-report-list.component';
import { SalesPriceReportFormComponent } from './price-report/sales-price-report-form/sales-price-report-form.component';
import { NbTabsetModule, NbCardModule, NbIconModule, NbInputModule, NbCheckboxModule, NbRouteTabsetModule, NbStepperModule, NbButtonModule, NbListModule, NbAccordionModule, NbUserModule, NbSelectModule, NbActionsModule, NbRadioModule, NbDatepickerModule, NbProgressBarModule, NbDialogModule } from '@nebular/theme';
import { SalesRoutingModule } from './sales-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CustomElementModule } from '../../lib/custom-element/custom-element.module';
import { IvoipDashboardModule } from '../ivoip/dashboard/ivoip-dashboard.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '../dialog/dialog.module';
import { AgGridModule } from '@ag-grid-community/angular';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { CKEditorModule } from 'ng2-ckeditor';
import { SortablejsModule } from 'ngx-sortablejs';
import { SalesPriceReportPrintComponent } from './price-report/sales-price-report-print/sales-price-report-print.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { TranslateModule } from '@ngx-translate/core';
import { SmartTableDateTimeComponent } from '../../lib/custom-element/smart-table/smart-table.component';
import { SalesVoucherListComponent } from './sales-voucher/sales-voucher-list/sales-voucher-list.component';
import { SalesVoucherFormComponent } from './sales-voucher/sales-voucher-form/sales-voucher-form.component';
import { SalesVoucherPrintComponent } from './sales-voucher/sales-voucher-print/sales-voucher-print.component';
import { PriceTableListComponent } from './price-table/price-table-list/price-table-list.component';
import { PriceTableFormComponent } from './price-table/price-table-form/price-table-form.component';
import { PriceTablePrintComponent } from './price-table/price-table-print/price-table-print.component';
import { SmartTableFilterComponent } from '../../lib/custom-element/smart-table/smart-table.filter.component';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;


@NgModule({
  declarations: [SalesComponent, SalesPriceReportListComponent, SalesPriceReportFormComponent, SalesPriceReportPrintComponent, SalesVoucherListComponent, SalesVoucherFormComponent, SalesVoucherPrintComponent, PriceTableListComponent, PriceTableFormComponent, PriceTablePrintComponent],
  imports: [
    CommonModule,
    NbTabsetModule,
    SalesRoutingModule,
    NbCardModule,
    Ng2SmartTableModule,
    CustomElementModule,
    NbIconModule,
    NbInputModule,
    NbCheckboxModule,
    IvoipDashboardModule,
    NbRouteTabsetModule,
    NbStepperModule,
    NbButtonModule,
    NbListModule,
    NbAccordionModule,
    NbUserModule,
    NbSelectModule,
    NbActionsModule,
    NbRadioModule,
    NbDatepickerModule,
    CurrencyMaskModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    NbProgressBarModule,
    AgGridModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    CKEditorModule,
    NbDialogModule.forChild(),
    SortablejsModule.forRoot({
      animation: 200,
    }),
    NgxMaskModule.forRoot(options),
    TranslateModule,
  ],
  entryComponents: [
    SalesPriceReportFormComponent,
    SalesPriceReportPrintComponent,
    SmartTableDateTimeComponent,
    SalesPriceReportPrintComponent,
    SalesVoucherFormComponent,
    SalesVoucherPrintComponent,
    PriceTableFormComponent,
    PriceTablePrintComponent,
    SmartTableFilterComponent,
  ],
  providers: [
    // { provide: LOCALE_ID, useValue: 'vi' },
    // {provide: OWL_DATE_TIME_LOCALE, useValue: 'vi'},
  ],
})
export class SalesModule { }
