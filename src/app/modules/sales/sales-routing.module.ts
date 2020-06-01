import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';
import { SalesPriceReportListComponent } from './price-report/sales-price-report-list/sales-price-report-list.component';
import { SalesPriceReportFormComponent } from './price-report/sales-price-report-form/sales-price-report-form.component';
import { SalesComponent } from './sales.component';

const routes: Routes = [{
  path: '',
  component: SalesComponent,
  children: [
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
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule {
}
