import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchasesComponent } from './purchases.component';
import { PurchasePriceReportListComponent } from './price-reports/purchase-price-report-list/purchase-price-report-list.component';
import { PurchasePriceReportFormComponent } from './price-reports/purchase-price-report-form/purchase-price-report-form.component';
import { PurchasePriceReportViewComponent } from './price-reports/purchase-price-report-view/purchase-price-report-view.component';
import { PurchaseOrderListComponent } from './orders/purchase-order-list/purchase-order-list.component';
import { PurchaseOrderFormComponent } from './orders/purchase-order-form/purchase-order-form.component';
import { PurchaseOrderViewComponent } from './orders/purchase-order-view/purchase-order-view.component';
import { PurchaseVoucherListComponent } from './vouchers/purchase-voucher-list/purchase-voucher-list.component';
import { PurchaseVoucherFormComponent } from './vouchers/purchase-voucher-form/purchase-voucher-form.component';
import { PurchaseVoucherViewComponent } from './vouchers/purchase-voucher-view/purchase-voucher-view.component';
import { PurchaseReportListComponent } from './reports/purchase-report-list/purchase-report-list.component';
import { PurchaseReportFormComponent } from './reports/purchase-report-form/purchase-report-form.component';
import { PurchaseReportViewComponent } from './reports/purchase-report-view/purchase-report-view.component';

@NgModule({
  declarations: [PurchasesComponent, PurchasePriceReportListComponent, PurchasePriceReportFormComponent, PurchasePriceReportViewComponent, PurchaseOrderListComponent, PurchaseOrderFormComponent, PurchaseOrderViewComponent, PurchaseVoucherListComponent, PurchaseVoucherFormComponent, PurchaseVoucherViewComponent, PurchaseReportListComponent, PurchaseReportFormComponent, PurchaseReportViewComponent],
  imports: [
    CommonModule
  ]
})
export class PurchasesModule { }
