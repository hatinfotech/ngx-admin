import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesComponent } from './sales.component';
import { SalesRoutingModule } from './sales-routing.module';
import { SalesVoucherListComponent } from './vouchers/sales-voucher-list/sales-voucher-list.component';
import { SalesVoucherFormComponent } from './vouchers/sales-voucher-form/sales-voucher-form.component';
import { SalesVoucherViewComponent } from './vouchers/sales-voucher-view/sales-voucher-view.component';
import { PriceTableListComponent } from './price-tables/price-table-list/price-table-list.component';
import { PriceTableFormComponent } from './price-tables/price-table-form/price-table-form.component';
import { PriceTableViewComponent } from './price-tables/price-table-view/price-table-view.component';
import { SalesReportProfitComponent } from './reports/sales-report-profit/sales-report-profit.component';
import { SalesReportRevenueComponent } from './reports/sales-report-revenue/sales-report-revenue.component';

@NgModule({
  declarations: [
    SalesComponent,
    SalesVoucherListComponent,
    SalesVoucherFormComponent,
    SalesVoucherViewComponent,
    PriceTableListComponent,
    PriceTableFormComponent,
    PriceTableViewComponent,
    SalesReportProfitComponent,
    SalesReportRevenueComponent,
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
  ],
})
export class SalesModule { }
