import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';
import { PurchasePriceTableListComponent } from './price-table/purchase-price-table-list/purchase-price-table-list.component';
import { PurchasePriceTableFormComponent } from './price-table/purchase-price-table-form/purchase-price-table-form.component';
import { PurchaseComponent } from './purchase.component';
import { PurchaseVoucherListComponent } from './voucher/purchase-voucher-list/purchase-voucher-list.component';
import { PurchaseVoucherFormComponent } from './voucher/purchase-voucher-form/purchase-voucher-form.component';
import { PurchaseOrderVoucherListComponent } from './order/purchase-order-voucher-list/purchase-order-voucher-list.component';
import { PurchaseOrderVoucherFormComponent } from './order/purchase-order-voucher-form/purchase-order-voucher-form.component';

const routes: Routes = [{
  path: '',
  component: PurchaseComponent,
  children: [
    // Sales price table
    {
      path: 'price-table/list',
      canActivate: [AuthGuardService],
      component: PurchasePriceTableListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'price-table/form',
      canActivate: [AuthGuardService],
      component: PurchasePriceTableFormComponent,
    },
    {
      path: 'price-table/form/:id',
      canActivate: [AuthGuardService],
      component: PurchasePriceTableFormComponent,
    },
    // Purchase voucher
    {
      path: 'voucher/list',
      canActivate: [AuthGuardService],
      component: PurchaseVoucherListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'voucher/form',
      canActivate: [AuthGuardService],
      component: PurchaseVoucherFormComponent,
    },
    {
      path: 'voucher/form/:id',
      canActivate: [AuthGuardService],
      component: PurchaseVoucherFormComponent,
    },
    // Purchase Order voucher
    {
      path: 'order-voucher/list',
      canActivate: [AuthGuardService],
      component: PurchaseOrderVoucherListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'order-voucher/form',
      canActivate: [AuthGuardService],
      component: PurchaseOrderVoucherFormComponent,
    },
    {
      path: 'order-voucher/form/:id',
      canActivate: [AuthGuardService],
      component: PurchaseOrderVoucherFormComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchaseRoutingModule {
}
