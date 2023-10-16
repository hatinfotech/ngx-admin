import { Routes } from "@angular/router";
import { AuthGuardService } from "../../services/auth-guard.service";
import { MasterPriceTableQueueComponent } from "./master-price-table-queue/master-price-table-queue.component";
import { MasterPriceTableUpdateNoteListComponent } from "./master-price-table-update-note/master-price-table-update-note-list/master-price-table-update-note-list.component";
import { MasterPriceTableFormComponent } from "./master-price-table/master-price-table-form/master-price-table-form.component";
import { SalesMasterPriceTableComponent } from "./master-price-table/master-price-table/master-price-table.component";
import { SalesPriceReportFormComponent } from "./price-report/sales-price-report-form/sales-price-report-form.component";
import { SalesPriceReportListComponent } from "./price-report/sales-price-report-list/sales-price-report-list.component";
import { PriceTableFormComponent } from "./price-table/price-table-form/price-table-form.component";
import { PriceTableListComponent } from "./price-table/price-table-list/price-table-list.component";
import { SalesProductListComponent } from "./product/sales-product-list/sales-product-list.component";
import { SalesDashboardComponent } from "./sales-dashboard/sales-dashboard.component";
import { SaleProductListComponent } from "./sales-product/sales-product-list/sales-product-list.component";
import { SalesReturnsVoucherListComponent } from "./sales-returns-voucher/sales-returns-voucher-list/sales-returns-voucher-list.component";
import { SalesVoucherFormComponent } from "./sales-voucher/sales-voucher-form/sales-voucher-form.component";
import { SalesVoucherListComponent } from "./sales-voucher/sales-voucher-list/sales-voucher-list.component";
import { SalesB2bQuotationListComponent } from "./b2b-quotation/b2b-quotation-list/sales-b2b-quotation-list.component";
import { SalesDiscountTableComponent } from "./discount-table/discount-table/discount-table.component";
import { DiscountTableUpdateNoteListComponent } from "./discount-table-update-note/discount-table-update-note-list/discount-table-update-note-list.component";
import { SaleByCommissionVoucherListComponent } from "./sale-by-commission-voucher/sale-by-commission-voucher-list/sale-by-commission-voucher-list.component";

export const salesRoutes: Routes = [
  // Price report
  {
    path: 'sales/price-report/list',
    canActivate: [AuthGuardService],
    component: SalesPriceReportListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'sales/price-report/list/:mode',
    canActivate: [AuthGuardService],
    component: SalesPriceReportListComponent,
    data: {
      reuse: true,
      routeStaticParam1: '123'
    },
  },
  {
    path: 'sales/price-report/form',
    canActivate: [AuthGuardService],
    component: SalesPriceReportFormComponent,
  },
  {
    path: 'sales/price-report/form/:id',
    canActivate: [AuthGuardService],
    component: SalesPriceReportFormComponent,
  },
  // B2b Quatation
  {
    path: 'sales/b2b-quotation/list',
    canActivate: [AuthGuardService],
    component: SalesB2bQuotationListComponent,
    data: {
      reuse: true,
    },
  },
  // Sales voucher
  {
    path: 'sales/sales-voucher/list',
    canActivate: [AuthGuardService],
    component: SalesVoucherListComponent,
    data: {
      reuse: true,
    },
  },
  // Sales voucher
  {
    path: 'sales/sale-by-commission-voucher/list',
    canActivate: [AuthGuardService],
    component: SaleByCommissionVoucherListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'sales/sales-voucher/form',
    canActivate: [AuthGuardService],
    component: SalesVoucherFormComponent,
  },
  {
    path: 'sales/sales-voucher/form/:id',
    canActivate: [AuthGuardService],
    component: SalesVoucherFormComponent,
  },
  //Sales returns voucher
  {
    path: 'sales/returns-voucher/list',
    canActivate: [AuthGuardService],
    component: SalesReturnsVoucherListComponent,
    data: {
      reuse: true,
    },
  },
  // Sales price table
  {
    path: 'sales/price-table/list',
    canActivate: [AuthGuardService],
    component: PriceTableListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'sales/price-table/form',
    canActivate: [AuthGuardService],
    component: PriceTableFormComponent,
  },
  {
    path: 'sales/price-table/form/:id',
    canActivate: [AuthGuardService],
    component: PriceTableFormComponent,
  },
  // Master Sales price table
  {
    path: 'sales/master-price-table/list',
    canActivate: [AuthGuardService],
    component: SalesMasterPriceTableComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'sales/dashboard',
    canActivate: [AuthGuardService],
    component: SalesDashboardComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'sales/master-price-table/form',
    canActivate: [AuthGuardService],
    component: MasterPriceTableFormComponent,
  },
  {
    path: 'sales/master-price-table/form/:id',
    canActivate: [AuthGuardService],
    component: MasterPriceTableFormComponent,
  },
  {
    path: 'sales/product/list',
    canActivate: [AuthGuardService],
    component: SalesProductListComponent,
  },
  {
    path: 'sales/sales-product/list',
    canActivate: [AuthGuardService],
    component: SaleProductListComponent,
  },
  // Master Price Table Update Note
  {
    path: 'sales/master-price-table-update-note/list',
    canActivate: [AuthGuardService],
    component: MasterPriceTableUpdateNoteListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'sales/master-price-table-queue',
    canActivate: [AuthGuardService],
    component: MasterPriceTableQueueComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'sales/master-price-table-update-note/list',
    canActivate: [AuthGuardService],
    component: MasterPriceTableUpdateNoteListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'sales/discount-table',
    canActivate: [AuthGuardService],
    component: SalesDiscountTableComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'sales/discount-update-note/list',
    canActivate: [AuthGuardService],
    component: DiscountTableUpdateNoteListComponent,
    data: {
      reuse: true,
    },
  },
];