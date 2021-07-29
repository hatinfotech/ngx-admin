import { WarehouseModel } from './../../models/warehouse.model';
import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { SalesComponent } from './sales.component';
import { SalesPriceReportListComponent } from './price-report/sales-price-report-list/sales-price-report-list.component';
import { SalesPriceReportFormComponent } from './price-report/sales-price-report-form/sales-price-report-form.component';
import { NbTabsetModule, NbCardModule, NbIconModule, NbInputModule, NbCheckboxModule, NbRouteTabsetModule, NbStepperModule, NbButtonModule, NbListModule, NbAccordionModule, NbUserModule, NbSelectModule, NbActionsModule, NbRadioModule, NbDatepickerModule, NbProgressBarModule, NbDialogModule, NbSpinnerModule } from '@nebular/theme';
import { SalesRoutingModule } from './sales-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CustomElementModule } from '../../lib/custom-element/custom-element.module';
// import { IvoipDashboardModule } from '../ivoip/dashboard/ivoip-dashboard.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '../dialog/dialog.module';
import { AgGridModule } from '@ag-grid-community/angular';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
// import { CKEditorModule } from 'ng2-ckeditor';
import { SortablejsModule } from 'ngx-sortablejs';
import { SalesPriceReportPrintComponent } from './price-report/sales-price-report-print/sales-price-report-print.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { TranslateModule } from '@ngx-translate/core';
import { SmartTableDateTimeComponent, SmartTableCurrencyEditableComponent, SmartTableButtonComponent } from '../../lib/custom-element/smart-table/smart-table.component';
import { SalesVoucherListComponent } from './sales-voucher/sales-voucher-list/sales-voucher-list.component';
import { SalesVoucherFormComponent } from './sales-voucher/sales-voucher-form/sales-voucher-form.component';
import { SalesVoucherPrintComponent } from './sales-voucher/sales-voucher-print/sales-voucher-print.component';
import { PriceTableListComponent } from './price-table/price-table-list/price-table-list.component';
import { PriceTableFormComponent } from './price-table/price-table-form/price-table-form.component';
import { PriceTablePrintComponent } from './price-table/price-table-print/price-table-print.component';
import { ProductListComponent } from '../admin-product/product/product-list/product-list.component';
import { AdminProductModule } from '../admin-product/admin-product.module';
import { PriceTablePrintAsListComponent } from './price-table/price-table-print-as-list/price-table-print-as-list.component';
import { SimpleSalesVoucherFormComponent } from './sales-voucher/simple-sales-voucher-form/simple-sales-voucher-form.component';
import { MasterPriceTableListComponent } from './master-price-table/master-price-table-list/master-price-table-list.component';
import { MasterPriceTableFormComponent } from './master-price-table/master-price-table-form/master-price-table-form.component';
import { MasterPriceTablePrintComponent } from './master-price-table/master-price-table-print/master-price-table-print.component';
import { ProductFormComponent } from '../admin-product/product/product-form/product-form.component';
import { NgxUploaderModule } from '../../../vendor/ngx-uploader/src/public_api';
import { ProcessMap } from '../../models/process-map.model';
import { WarehouseGoodsDeliveryNotePrintComponent } from '../warehouse/goods-delivery-note/warehouse-goods-delivery-note-print/warehouse-goods-delivery-note-print.component';
import { WarehouseGoodsDeliveryNoteListComponent } from '../warehouse/goods-delivery-note/warehouse-goods-delivery-note-list/warehouse-goods-delivery-note-list.component';
import { WarehouseModule } from '../warehouse/warehouse.module';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
  declarations: [SalesComponent, SalesPriceReportListComponent,
    SalesPriceReportFormComponent, SalesPriceReportPrintComponent, SalesVoucherListComponent,
    SalesVoucherFormComponent, SalesVoucherPrintComponent, PriceTableListComponent,
    PriceTableFormComponent, PriceTablePrintComponent, PriceTablePrintAsListComponent, SimpleSalesVoucherFormComponent, MasterPriceTableListComponent, MasterPriceTableFormComponent, MasterPriceTablePrintComponent],
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
    NbDialogModule.forChild(),
    SortablejsModule.forRoot({
      animation: 200,
    }),
    NgxMaskModule.forRoot(options),
    TranslateModule,
    AdminProductModule,
    NgxUploaderModule,
    NbSpinnerModule,
  ],
  entryComponents: [
    // SalesPriceReportFormComponent,
    // SalesPriceReportPrintComponent,
    SmartTableDateTimeComponent,
    // SalesPriceReportPrintComponent,
    // SalesVoucherFormComponent,
    // SalesVoucherPrintComponent,
    // PriceTableFormComponent,
    // PriceTablePrintComponent,
    // ProductListComponent,
    // PriceTablePrintAsListComponent,
    // SimpleSalesVoucherFormComponent,
    // MasterPriceTableFormComponent,
    // MasterPriceTablePrintComponent,
    SmartTableCurrencyEditableComponent,
    // ProductFormComponent,
    SmartTableButtonComponent,
  ],
  providers: [
    // { provide: LOCALE_ID, useValue: 'vi' },
    // {provide: OWL_DATE_TIME_LOCALE, useValue: 'vi'},
    { provide: CurrencyPipe, useValue: {} },
    { provide: DecimalPipe, useValue: {} },
  ],
  exports: [
    // SalesVoucherListComponent,
  ]
})
export class SalesModule {

  static processMaps: {
    salesVoucher?: {
      [key: string]: ProcessMap
    },
    priceReport?: {
      [key: string]: ProcessMap
    },
  } = {
      priceReport: {
        "APPROVE": {
          state: 'APPROVE',
          label: 'Common.approved',
          status: 'success',
          outline: false,
          nextState: 'COMPLETE',
          nextStateLabel: 'Common.complete',
          confirmText: 'Common.completeConfirm',
          responseTitle: 'Common.completed',
          restponseText: 'Common.completeSuccess',
          // nextState: 'DEPLOYMENT',
          // nextStateLabel: 'Common.deployment',
          // confirmText: 'Common.implementConfirm',
          // responseTitle: 'Common.deploymented',
          // restponseText: 'Common.deploymentSuccess',
        },
        "DEPLOYMENT": {
          state: 'DEPLOYMENT',
          label: 'Common.implement',
          status: 'warning',
          outline: false,
          nextState: 'ACCEPTANCE',
          nextStateLabel: 'Common.acceptance',
          confirmText: 'Common.acceptanceConfirm',
          responseTitle: 'Common.acceptanced',
          restponseText: 'Common.acceptanceSuccess',
        },
        "ACCEPTANCE": {
          state: 'ACCEPTANCE',
          label: 'Common.acceptance',
          status: 'info',
          outline: false,
          nextState: 'COMPLETE',
          nextStateLabel: 'Common.complete',
          confirmText: 'Common.completeConfirm',
          responseTitle: 'Common.completed',
          restponseText: 'Common.completeSuccess',
        },
        "COMPLETE": {
          state: 'COMPLETE',
          label: 'Common.completed',
          status: 'success',
          outline: true,
          nextState: '',
          nextStateLabel: 'Common.completed',
          confirmText: 'Common.completeConfirm',
          responseTitle: 'Common.completed',
          restponseText: 'Common.completeSuccess',
        },
        "": {
          state: 'NOTJUSTAPPROVE',
          label: 'Common.notJustApproved',
          status: 'danger',
          outline: false,
          nextState: 'APPROVE',
          nextStateLabel: 'Common.approve',
          confirmText: 'Common.approveConfirm',
          responseTitle: 'Common.approved',
          restponseText: 'Common.approveSuccess',
        },
      },
      salesVoucher: {
        "APPROVE": {
          state: 'APPROVE',
          label: 'Common.approved',
          status: 'success',
          outline: false,
          nextState: 'COMPLETE',
          nextStateLabel: 'Common.complete',
          confirmText: 'Common.completeConfirm',
          responseTitle: 'Common.completed',
          restponseText: 'Common.completeSuccess',
        },
        "COMPLETE": {
          state: 'COMPLETE',
          label: 'Common.completed',
          status: 'success',
          outline: true,
          nextState: 'UNBOOKKEEPING',
          nextStateLabel: 'Common.unbookkeeping',
          confirmText: 'Common.unbookkeepingConfirm',
          responseTitle: 'Common.unbookkeeping',
          restponseText: 'Common.unbookkeepingSuccess',
        },
        "UNBOOKKEEPING": {
          state: 'UNBOOKKEEPING',
          label: 'Common.unbookkeeped',
          status: 'warning',
          outline: true,
          nextState: 'APPROVE',
          nextStateLabel: 'Common.approve',
          confirmText: 'Common.approveConfirm',
          responseTitle: 'Common.approved',
          restponseText: 'Common.approveSuccess',
        },
        "": {
          state: 'NOTJUSTAPPROVE',
          label: 'Common.notJustApproved',
          status: 'danger',
          outline: false,
          nextState: 'APPROVE',
          nextStateLabel: 'Common.approve',
          confirmText: 'Common.approveConfirm',
          responseTitle: 'Common.approved',
          restponseText: 'Common.approveSuccess',
        },
      },
    };

}
