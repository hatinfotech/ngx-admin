import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';
import { PurchasePriceTableListComponent } from './price-table/purchase-price-table-list/purchase-price-table-list.component';
import { PurchasePriceTableFormComponent } from './price-table/purchase-price-table-form/purchase-price-table-form.component';
import { PurchaseComponent } from './purchase.component';

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
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchaseRoutingModule {
}
