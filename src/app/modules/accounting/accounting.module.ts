import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { AccountingComponent } from './accounting.component';
import { CashPaymentVoucherListComponent } from './cash/payment/cash-payment-voucher-list/cash-payment-voucher-list.component';
import { CashPaymentVoucherFormComponent } from './cash/payment/cash-payment-voucher-form/cash-payment-voucher-form.component';
import { CashReceiptVoucherFormComponent } from './cash/receipt/cash-receipt-voucher-form/cash-receipt-voucher-form.component';
import { CashReceiptVoucherListComponent } from './cash/receipt/cash-receipt-voucher-list/cash-receipt-voucher-list.component';
import { AgGridModule } from '@ag-grid-community/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbTabsetModule, NbCardModule, NbIconModule, NbInputModule, NbCheckboxModule, NbRouteTabsetModule, NbStepperModule, NbButtonModule, NbListModule, NbAccordionModule, NbUserModule, NbSelectModule, NbActionsModule, NbRadioModule, NbDatepickerModule, NbProgressBarModule, NbDialogModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { CKEditorModule } from 'ng2-ckeditor';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SortablejsModule } from 'ngx-sortablejs';
import { NgxUploaderModule } from '../../../vendor/ngx-uploader/src/public_api';
import { CustomElementModule } from '../../lib/custom-element/custom-element.module';
import { DialogModule } from '../dialog/dialog.module';
import { IvoipDashboardModule } from '../ivoip/dashboard/ivoip-dashboard.module';
import { AccountingRoutingModule } from './accounting-routing.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { SmartTableCurrencyComponent, SmartTableCurrencyEditableComponent } from '../../lib/custom-element/smart-table/smart-table.component';
import { CashReceiptVoucherPrintComponent } from './cash/receipt/cash-receipt-voucher-print/cash-receipt-voucher-print.component';
import { CashPaymentVoucherPrintComponent } from './cash/payment/cash-payment-voucher-print/cash-payment-voucher-print.component';



@NgModule({
  declarations: [AccountingComponent, CashReceiptVoucherListComponent, CashReceiptVoucherFormComponent, CashPaymentVoucherListComponent, CashPaymentVoucherFormComponent, CashReceiptVoucherFormComponent, CashReceiptVoucherListComponent, CashReceiptVoucherPrintComponent, CashPaymentVoucherPrintComponent],
  imports: [
    CommonModule,
    NbTabsetModule,
    AccountingRoutingModule,
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
    // CurrencyMaskModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    NbProgressBarModule,
    AgGridModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    CKEditorModule,
    CurrencyMaskModule,
    NgxUploaderModule,
    TranslateModule,
    NbDialogModule.forChild(),
    SortablejsModule.forRoot({
      animation: 200,
    }),
  ],
  entryComponents: [
    SmartTableCurrencyEditableComponent,
    SmartTableCurrencyComponent,
  ],
  providers: [
    { provide: CurrencyPipe, useValue: {} },
    { provide: DecimalPipe, useValue: {} },
  ],
})
export class AccountingModule { }
