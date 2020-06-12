import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';
import { SalesPriceReportListComponent } from './price-report/sales-price-report-list/sales-price-report-list.component';
import { SalesPriceReportFormComponent } from './price-report/sales-price-report-form/sales-price-report-form.component';
import { SalesComponent } from './sales.component';
import { SalesVoucherListComponent } from './sales-voucher/sales-voucher-list/sales-voucher-list.component';
import { SalesVoucherFormComponent } from './sales-voucher/sales-voucher-form/sales-voucher-form.component';

const routes: Routes = [{
  path: '',
  component: SalesComponent,
  children: [
    // Price report
    {
      path: 'price-report/list',
      canActivate: [AuthGuardService],
      component: SalesPriceReportListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'price-report/form',
      canActivate: [AuthGuardService],
      component: SalesPriceReportFormComponent,
    },
    {
      path: 'price-report/form/:id',
      canActivate: [AuthGuardService],
      component: SalesPriceReportFormComponent,
    },
    // Sales voucher
    {
      path: 'sales-voucher/list',
      canActivate: [AuthGuardService],
      component: SalesVoucherListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'sales-voucher/form',
      canActivate: [AuthGuardService],
      component: SalesVoucherFormComponent,
    },
    {
      path: 'sales-voucher/form/:id',
      canActivate: [AuthGuardService],
      component: SalesVoucherFormComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule {
}
