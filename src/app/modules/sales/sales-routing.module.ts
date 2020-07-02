import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';
import { SalesPriceReportListComponent } from './price-report/sales-price-report-list/sales-price-report-list.component';
import { SalesPriceReportFormComponent } from './price-report/sales-price-report-form/sales-price-report-form.component';
import { SalesComponent } from './sales.component';
import { SalesVoucherListComponent } from './sales-voucher/sales-voucher-list/sales-voucher-list.component';
import { SalesVoucherFormComponent } from './sales-voucher/sales-voucher-form/sales-voucher-form.component';
import { PriceTableListComponent } from './price-table/price-table-list/price-table-list.component';
import { PriceTableFormComponent } from './price-table/price-table-form/price-table-form.component';
import { MasterPriceTableListComponent } from './master-price-table/master-price-table-list/master-price-table-list.component';
import { MasterPriceTableFormComponent } from './master-price-table/master-price-table-form/master-price-table-form.component';

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
    // Sales price table
    {
      path: 'price-table/list',
      canActivate: [AuthGuardService],
      component: PriceTableListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'price-table/form',
      canActivate: [AuthGuardService],
      component: PriceTableFormComponent,
    },
    {
      path: 'price-table/form/:id',
      canActivate: [AuthGuardService],
      component: PriceTableFormComponent,
    },
    // Master Sales price table
    {
      path: 'master-price-table/list',
      canActivate: [AuthGuardService],
      component: MasterPriceTableListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'master-price-table/form',
      canActivate: [AuthGuardService],
      component: MasterPriceTableFormComponent,
    },
    {
      path: 'master-price-table/form/:id',
      canActivate: [AuthGuardService],
      component: MasterPriceTableFormComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule {
}
