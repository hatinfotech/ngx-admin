import { Routes, RouterModule } from '@angular/router';
import { WarehouseComponent } from './warehouse.component';
import { AuthGuardService } from '../../services/auth-guard.service';
import { NgModule } from '@angular/core';
import { WarehouseGoodsReceiptNoteListComponent } from './goods-receipt-note/warehouse-goods-receipt-note-list/warehouse-goods-receipt-note-list.component';
import { WarehouseGoodsReceiptNoteFormComponent } from './goods-receipt-note/warehouse-goods-receipt-note-form/warehouse-goods-receipt-note-form.component';
import { WarehouseGoodsDeliveryNoteListComponent } from './goods-delivery-note/warehouse-goods-delivery-note-list/warehouse-goods-delivery-note-list.component';
import { WarehouseGoodsDeliveryNoteFormComponent } from './goods-delivery-note/warehouse-goods-delivery-note-form/warehouse-goods-delivery-note-form.component';
import { WarehouseGoodsContainerFormComponent } from './goods-container/warehouse-goods-container-form/warehouse-goods-container-form.component';
import { WarehouseGoodsContainerListComponent } from './goods-container/warehouse-goods-container-list/warehouse-goods-container-list.component';
import { WarehouseListComponent } from './warehouse/warehouse-list/warehouse-list.component';
import { WarehouseFormComponent } from './warehouse/warehouse-form/warehouse-form.component';
import { WarehouseBookListComponent } from './book/warehouse-book-list/warehouse-book-list.component';
import { WarehouseBookFormComponent } from './book/warehouse-book-form/warehouse-book-form.component';
import { WarehouseGoodsListComponent } from './goods/warehouse-goods-list/warehouse-goods-list.component';
import { WarehouseGoodsFormComponent } from './goods/warehouse-goods-form/warehouse-goods-form.component';

const routes: Routes = [{
  path: '',
  component: WarehouseComponent,
  children: [
    // goods receipt note
    {
      path: 'goods-receipt-note/list',
      canActivate: [AuthGuardService],
      component: WarehouseGoodsReceiptNoteListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'goods-receipt-note/form',
      canActivate: [AuthGuardService],
      component: WarehouseGoodsReceiptNoteFormComponent,
    },
    {
      path: 'goods-receipt-note/form/:id',
      canActivate: [AuthGuardService],
      component: WarehouseGoodsReceiptNoteFormComponent,
    },
    // goods delivery note
    {
      path: 'goods-delivery-note/list',
      canActivate: [AuthGuardService],
      component: WarehouseGoodsDeliveryNoteListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'goods-delivery-note/form',
      canActivate: [AuthGuardService],
      component: WarehouseGoodsDeliveryNoteFormComponent,
    },
    {
      path: 'goods-delivery-note/form/:id',
      canActivate: [AuthGuardService],
      component: WarehouseGoodsDeliveryNoteFormComponent,
    },
    // goods container
    {
      path: 'goods-container/list',
      canActivate: [AuthGuardService],
      component: WarehouseGoodsContainerListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'goods-container/form',
      canActivate: [AuthGuardService],
      component: WarehouseGoodsContainerFormComponent,
    },
    {
      path: 'goods-container/form/:id',
      canActivate: [AuthGuardService],
      component: WarehouseGoodsContainerFormComponent,
    },
    // warehouse
    {
      path: 'warehouse/list',
      canActivate: [AuthGuardService],
      component: WarehouseListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'warehouse/form',
      canActivate: [AuthGuardService],
      component: WarehouseFormComponent,
    },
    {
      path: 'warehouse/form/:id',
      canActivate: [AuthGuardService],
      component: WarehouseFormComponent,
    },
    // warehouse book
    {
      path: 'book/list',
      canActivate: [AuthGuardService],
      component: WarehouseBookListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'book/form',
      canActivate: [AuthGuardService],
      component: WarehouseBookFormComponent,
    },
    {
      path: 'book/form/:id',
      canActivate: [AuthGuardService],
      component: WarehouseBookFormComponent,
    },
    // warehouse goods
    {
      path: 'goods/list',
      canActivate: [AuthGuardService],
      component: WarehouseGoodsListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'goods/form',
      canActivate: [AuthGuardService],
      component: WarehouseGoodsFormComponent,
    },
    {
      path: 'goods/form/:id',
      canActivate: [AuthGuardService],
      component: WarehouseGoodsFormComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WarehouseRoutingModule {
}
