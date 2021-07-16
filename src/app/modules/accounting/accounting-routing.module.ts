import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';
import { AccAccountFormComponent } from './acc-account/acc-account-form/acc-account-form.component';
import { AccAccountListComponent } from './acc-account/acc-account-list/acc-account-list.component';
import { AccBusinessFormComponent } from './acc-business/acc-business-form/acc-business-form.component';
import { AccBusinessListComponent } from './acc-business/acc-business-list/acc-business-list.component';
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
    // Cash payment voucher
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
    // account
    {
      path: 'account/list',
      canActivate: [AuthGuardService],
      component: AccAccountListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'account/form',
      canActivate: [AuthGuardService],
      component: AccAccountFormComponent,
    },
    {
      path: 'account/form/:id',
      canActivate: [AuthGuardService],
      component: AccAccountFormComponent,
    },
    // accounting business
    {
      path: 'business/list',
      canActivate: [AuthGuardService],
      component: AccBusinessListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'business/form',
      canActivate: [AuthGuardService],
      component: AccBusinessFormComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountingRoutingModule {
}
