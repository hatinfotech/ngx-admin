import { Routes } from "@angular/router";
import { AuthGuardService } from "../../services/auth-guard.service";
import { PurchaseGoodsListComponent } from "./goods/purchase-goods-list/purchase-goods-list.component";
import { PurchaseOrderVoucherFormComponent } from "./order/purchase-order-voucher-form/purchase-order-voucher-form.component";
import { PurchaseOrderVoucherListComponent } from "./order/purchase-order-voucher-list/purchase-order-voucher-list.component";
import { PurchasePriceTableFormComponent } from "./price-table/purchase-price-table-form/purchase-price-table-form.component";
import { PurchasePriceTableListComponent } from "./price-table/purchase-price-table-list/purchase-price-table-list.component";
import { PurchaseProductListComponent } from "./product/purchase-product-list/purchase-product-list.component";
import { PurchaseDashboardComponent } from "./purchase-dashboard/purchase-dashboard.component";
import { PurchaseVoucherFormComponent } from "./voucher/purchase-voucher-form/purchase-voucher-form.component";
import { PurchaseVoucherListComponent } from "./voucher/purchase-voucher-list/purchase-voucher-list.component";
import { MultifunctionalPurchaseListComponent } from "./multifunctional-purchase/multifunctional-purchase-list/multifunctional-purchase-list.component";

export const purchaseRoutes: Routes = [
  // Purchase routes
  // Sales price table
  {
    path: 'purchase/price-table/list',
    canActivate: [AuthGuardService],
    component: PurchasePriceTableListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'purchase/price-table/form',
    canActivate: [AuthGuardService],
    component: PurchasePriceTableFormComponent,
  },
  {
    path: 'purchase/price-table/form/:id',
    canActivate: [AuthGuardService],
    component: PurchasePriceTableFormComponent,
  },
  // Purchase voucher
  {
    path: 'purchase/voucher/list',
    canActivate: [AuthGuardService],
    component: PurchaseVoucherListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'purchase/voucher/form',
    canActivate: [AuthGuardService],
    component: PurchaseVoucherFormComponent,
  },
  {
    path: 'purchase/voucher/form/:id',
    canActivate: [AuthGuardService],
    component: PurchaseVoucherFormComponent,
  },
  // Purchase Order voucher
  {
    path: 'purchase/order-voucher/list',
    canActivate: [AuthGuardService],
    component: PurchaseOrderVoucherListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'purchase/order-voucher/form',
    canActivate: [AuthGuardService],
    component: PurchaseOrderVoucherFormComponent,
  },
  {
    path: 'purchase/order-voucher/form/:id',
    canActivate: [AuthGuardService],
    component: PurchaseOrderVoucherFormComponent,
  },
  // Goods list
  {
    path: 'purchase/goods/list',
    canActivate: [AuthGuardService],
    component: PurchaseGoodsListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'purchase/products/list',
    canActivate: [AuthGuardService],
    component: PurchaseProductListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'purchase/dashboard',
    canActivate: [AuthGuardService],
    component: PurchaseDashboardComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'purchase/multifunctional-purchase/list',
    canActivate: [AuthGuardService],
    component: MultifunctionalPurchaseListComponent,
    data: {
      reuse: true,
    },
  },
];