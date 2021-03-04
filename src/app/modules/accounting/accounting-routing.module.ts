import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';
import { AccountingComponent } from './accounting.component';
import { CashPaymentVoucherFormComponent } from './cash/payment/cash-payment-voucher-form/cash-payment-voucher-form.component';
import { CashPaymentVoucherListComponent } from './cash/payment/cash-payment-voucher-list/cash-payment-voucher-list.component';
import { CashReceiptVoucherFormComponent } from './cash/receipt/cash-receipt-voucher-form/cash-receipt-voucher-form.component';
import { CashReceiptVoucherListComponent } from './cash/receipt/cash-receipt-voucher-list/cash-receipt-voucher-list.component';

const routes: Routes = [{
  path: '',
  component: AccountingComponent,
  children: [
    {
      path: 'cash-receipt-voucher/list',
      canActivate: [AuthGuardService],
      component: CashReceiptVoucherListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'cash-receipt-voucher/form',
      canActivate: [AuthGuardService],
      component: CashReceiptVoucherFormComponent,
    },
    {
      path: 'cash-receipt-voucher/form/:id',
      canActivate: [AuthGuardService],
      component: CashReceiptVoucherFormComponent,
    },
    {
      path: 'cash-payment-voucher/list',
      canActivate: [AuthGuardService],
      component: CashPaymentVoucherListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'cash-payment-voucher/form',
      canActivate: [AuthGuardService],
      component: CashPaymentVoucherFormComponent,
    },
    {
      path: 'cash-payment-voucher/form/:id',
      canActivate: [AuthGuardService],
      component: CashPaymentVoucherFormComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountingRoutingModule {
}
