import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { PurchasePriceTableListComponent } from './price-table/purchase-price-table-list/purchase-price-table-list.component';
import { PurchasePriceTableFormComponent } from './price-table/purchase-price-table-form/purchase-price-table-form.component';
import { PurchasePriceTablePrintComponent } from './price-table/purchase-price-table-print/purchase-price-table-print.component';
import { NbTabsetModule, NbCardModule, NbIconModule, NbInputModule, NbCheckboxModule, NbRouteTabsetModule, NbStepperModule, NbButtonModule, NbListModule, NbAccordionModule, NbUserModule, NbSelectModule, NbActionsModule, NbRadioModule, NbDatepickerModule, NbProgressBarModule, NbDialogModule } from '@nebular/theme';
import { PurchaseRoutingModule } from './purchase-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CustomElementModule } from '../../lib/custom-element/custom-element.module';
import { IvoipDashboardModule } from '../ivoip/dashboard/ivoip-dashboard.module';
// import { CurrencyMaskModule } from 'ng2-currency-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '../dialog/dialog.module';
import { AgGridModule } from '@ag-grid-community/angular';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { CKEditorModule } from 'ng2-ckeditor';
import { SortablejsModule } from 'ngx-sortablejs';
import { NgxMaskModule } from 'ngx-mask';
import { options } from '../sales/sales.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PurchaseComponent } from './purchase.component';
import { PurchasePriceTableImportComponent } from './price-table/purchase-price-table-import/purchase-price-table-import.component';
import { SmartTableFilterComponent } from '../../lib/custom-element/smart-table/smart-table.filter.component';
import { PurchaseVoucherListComponent } from './voucher/purchase-voucher-list/purchase-voucher-list.component';
import { PurchaseVoucherFormComponent } from './voucher/purchase-voucher-form/purchase-voucher-form.component';
import { PurchaseVoucherPrintComponent } from './voucher/purchase-voucher-print/purchase-voucher-print.component';
import { PurchaseSimpleVoucherFormComponent } from './voucher/purchase-simple-voucher-form/purchase-simple-voucher-form.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { PurchaseOrderVoucherListComponent } from './order/purchase-order-voucher-list/purchase-order-voucher-list.component';
import { PurchaseOrderVoucherFormComponent } from './order/purchase-order-voucher-form/purchase-order-voucher-form.component';
import { PurchaseOrderVoucherPrintComponent } from './order/purchase-order-voucher-print/purchase-order-voucher-print.component';


export class DynamicLocaleId extends String {
  constructor(public translate: TranslateService) {
    super();
  }

  toString() {
    return this.translate.currentLang;
  }
}
export const MY_MOMENT_FORMATS = {
    parseInput: 'l LT',
    fullPickerInput: 'l LT',
    datePickerInput: 'l',
    timePickerInput: 'LT',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
};
@NgModule({
  declarations: [
    PurchasePriceTableListComponent,
    PurchasePriceTableFormComponent,
    PurchasePriceTablePrintComponent,
    PurchaseComponent,
    PurchasePriceTableImportComponent,
    PurchaseVoucherListComponent,
    PurchaseVoucherFormComponent,
    PurchaseVoucherPrintComponent,
    PurchaseSimpleVoucherFormComponent,
    PurchaseOrderVoucherListComponent,
    PurchaseOrderVoucherFormComponent,
    PurchaseOrderVoucherPrintComponent,
  ],
  imports: [
    CommonModule,
    NbTabsetModule,
    PurchaseRoutingModule,
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
    PurchasePriceTableFormComponent,
    PurchasePriceTablePrintComponent,
    PurchasePriceTableImportComponent,
    SmartTableFilterComponent,
    PurchaseVoucherFormComponent,
    PurchaseSimpleVoucherFormComponent,
    PurchaseVoucherPrintComponent,
  ],
  providers: [
    CurrencyPipe,
    // {
    //   provide: OWL_DATE_TIME_LOCALE,
    //   useClass: DynamicLocaleId,
    //   deps: [TranslateService],

    // },
    // {provide: OWL_DATE_TIME_LOCALE, useValue: 'vi'},
    // {provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS},
  ],
})
export class PurchaseModule { }
