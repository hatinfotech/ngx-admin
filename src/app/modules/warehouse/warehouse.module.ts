import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { WarehouseComponent } from './warehouse.component';
import { NbTabsetModule, NbCardModule, NbIconModule, NbInputModule, NbCheckboxModule, NbRouteTabsetModule, NbStepperModule, NbButtonModule, NbListModule, NbAccordionModule, NbUserModule, NbSelectModule, NbActionsModule, NbRadioModule, NbDatepickerModule, NbProgressBarModule, NbDialogModule } from '@nebular/theme';
import { WarehouseRoutingModule } from './warehouse-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CustomElementModule } from '../../lib/custom-element/custom-element.module';
import { IvoipDashboardModule } from '../ivoip/dashboard/ivoip-dashboard.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '../dialog/dialog.module';
import { AgGridModule } from '@ag-grid-community/angular';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
// import { CKEditorModule } from 'ng2-ckeditor';
import { SortablejsModule } from 'ngx-sortablejs';
import { NgxMaskModule } from 'ngx-mask';
import { options } from '../sales/sales.module';
import { TranslateModule } from '@ngx-translate/core';
import { WarehouseGoodsReceiptNoteListComponent } from './goods-receipt-note/warehouse-goods-receipt-note-list/warehouse-goods-receipt-note-list.component';
import { WarehouseGoodsReceiptNoteFormComponent } from './goods-receipt-note/warehouse-goods-receipt-note-form/warehouse-goods-receipt-note-form.component';
import { WarehouseGoodsReceiptNotePrintComponent } from './goods-receipt-note/warehouse-goods-receipt-note-print/warehouse-goods-receipt-note-print.component';
import { WarehouseGoodsDeliveryNoteListComponent } from './goods-delivery-note/warehouse-goods-delivery-note-list/warehouse-goods-delivery-note-list.component';
import { WarehouseGoodsDeliveryNoteFormComponent } from './goods-delivery-note/warehouse-goods-delivery-note-form/warehouse-goods-delivery-note-form.component';
import { WarehouseGoodsDeliveryNotePrintComponent } from './goods-delivery-note/warehouse-goods-delivery-note-print/warehouse-goods-delivery-note-print.component';
import { WarehouseSimpleGoodsReceiptNoteFormComponent } from './goods-receipt-note/warehouse-simple-goods-receipt-note-form/warehouse-simple-goods-receipt-note-form.component';
import { WarehouseGoodsContainerListComponent } from './goods-container/warehouse-goods-container-list/warehouse-goods-container-list.component';
import { WarehouseGoodsContainerFormComponent } from './goods-container/warehouse-goods-container-form/warehouse-goods-container-form.component';
import { WarehouseGoodsContainerPrintComponent } from './goods-container/warehouse-goods-container-print/warehouse-goods-container-print.component';
import { WarehouseListComponent } from './warehouse/warehouse-list/warehouse-list.component';
import { WarehouseFormComponent } from './warehouse/warehouse-form/warehouse-form.component';
import { WarehousePrintComponent } from './warehouse/warehouse-print/warehouse-print.component';
import { WarehouseBookListComponent } from './book/warehouse-book-list/warehouse-book-list.component';
import { WarehouseBookFormComponent } from './book/warehouse-book-form/warehouse-book-form.component';
import { WarehouseBookPrintComponent } from './book/warehouse-book-print/warehouse-book-print.component';
import { WarehouseGoodsListComponent } from './goods/warehouse-goods-list/warehouse-goods-list.component';
import { WarehouseGoodsFormComponent } from './goods/warehouse-goods-form/warehouse-goods-form.component';
import { WarehouseGoodsPrintComponent } from './goods/warehouse-goods-print/warehouse-goods-print.component';
import { NgxUploaderModule } from '../../../vendor/ngx-uploader/src/public_api';
import { AssignContainerFormComponent } from './goods/assign-containers-form/assign-containers-form.component';
import { WarehouseSimpleGoodsDeliveryNoteFormComponent } from './goods-delivery-note/warehouse-simple-goods-delivery-note-form/warehouse-simple-goods-delivery-note-form.component';
import { WarehouseBookCommitComponent } from './book/warehouse-book-commit/warehouse-book-commit.component';
import { ProcessMap } from '../../models/process-map.model';
import { PurchaseVoucherListComponent } from '../purchase/voucher/purchase-voucher-list/purchase-voucher-list.component';
import { PurchaseVoucherPrintComponent } from '../purchase/voucher/purchase-voucher-print/purchase-voucher-print.component';



@NgModule({
  declarations: [
    WarehouseComponent,
    WarehouseGoodsReceiptNoteListComponent,
    WarehouseGoodsReceiptNoteFormComponent,
    WarehouseGoodsReceiptNotePrintComponent,
    WarehouseGoodsDeliveryNoteListComponent,
    WarehouseGoodsDeliveryNoteFormComponent,
    WarehouseGoodsDeliveryNotePrintComponent,
    WarehouseSimpleGoodsReceiptNoteFormComponent,
    WarehouseGoodsContainerListComponent,
    WarehouseGoodsContainerFormComponent,
    WarehouseGoodsContainerPrintComponent,
    WarehouseListComponent,
    WarehouseFormComponent,
    WarehousePrintComponent,
    WarehouseBookListComponent,
    WarehouseBookFormComponent,
    WarehouseBookPrintComponent,
    WarehouseGoodsListComponent,
    WarehouseGoodsFormComponent,
    WarehouseGoodsPrintComponent,
    AssignContainerFormComponent,
    WarehouseSimpleGoodsDeliveryNoteFormComponent,
    WarehouseBookCommitComponent,
  ],
  imports: [
    CommonModule,
    NbTabsetModule,
    WarehouseRoutingModule,
    NbCardModule,
    Ng2SmartTableModule,
    CustomElementModule,
    NbIconModule,
    NbInputModule,
    NbCheckboxModule,
    IvoipDashboardModule,
    NbRouteTabsetModule,
    NbStepperModule,
    NbButtonModule,
    NbListModule,
    NbAccordionModule,
    NbUserModule,
    NbSelectModule,
    NbActionsModule,
    NbRadioModule,
    NbDatepickerModule,
    CurrencyMaskModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    NbProgressBarModule,
    AgGridModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    // CKEditorModule,
    NgxUploaderModule,
    NbDialogModule.forChild(),
    SortablejsModule.forRoot({
      animation: 200,
    }),
    NgxMaskModule.forRoot(options),
    TranslateModule,
  ],
  entryComponents: [
    WarehouseSimpleGoodsReceiptNoteFormComponent,
    WarehouseGoodsContainerFormComponent,
    WarehouseBookFormComponent,
    WarehouseGoodsFormComponent,
    AssignContainerFormComponent,
    WarehouseSimpleGoodsDeliveryNoteFormComponent,
    WarehouseGoodsDeliveryNotePrintComponent,
    WarehouseBookCommitComponent,
    WarehouseGoodsDeliveryNoteFormComponent,
    WarehouseGoodsReceiptNoteFormComponent,
    PurchaseVoucherListComponent,
    PurchaseVoucherPrintComponent,
  ],
  providers: [
    CurrencyPipe,
  ],
})
export class WarehouseModule { static processMaps: {
  
  purchaseVoucher?: {
    [key: string]: ProcessMap
  },
  purchaseOrder?: {
    [key: string]: ProcessMap
  },
} = {
    purchaseVoucher: {
      "APPROVE": {
        state: 'APPROVE',
        label: 'Common.approved',
        status: 'success',
        outline: false,
        nextState: 'COMPLETE',
        nextStateLabel: 'Common.complete',
        confirmText: 'Common.completeConfirm',
        responseTitle: 'Common.completed',
        restponseText: 'Common.completeSuccess',
      },
      "COMPLETE": {
        state: 'COMPLETE',
        label: 'Common.completed',
        status: 'success',
        outline: true,
        nextState: '',
        nextStateLabel: '',
        confirmText: 'Common.completeConfirm',
        responseTitle: 'Common.completed',
        restponseText: 'Common.completeSuccess',
      },
      "": {
        state: 'NOTJUSTAPPROVE',
        label: 'Common.notJustApproved',
        status: 'danger',
        outline: false,
        nextState: 'APPROVE',
        nextStateLabel: 'Common.approve',
        confirmText: 'Common.approveConfirm',
        responseTitle: 'Common.approved',
        restponseText: 'Common.approveSuccess',
      },
    },
    purchaseOrder: {
      "APPROVE": {
        state: 'APPROVE',
        label: 'Common.approved',
        status: 'success',
        outline: false,
        nextState: 'COMPLETE',
        nextStateLabel: 'Common.complete',
        confirmText: 'Common.completeConfirm',
        responseTitle: 'Common.completed',
        restponseText: 'Common.completeSuccess',
      },
      "COMPLETE": {
        state: 'COMPLETE',
        label: 'Common.completed',
        status: 'success',
        outline: true,
        nextState: '',
        nextStateLabel: '',
        confirmText: 'Common.completeConfirm',
        responseTitle: 'Common.completed',
        restponseText: 'Common.completeSuccess',
      },
      "": {
        state: 'NOTJUSTAPPROVE',
        label: 'Common.notJustApproved',
        status: 'danger',
        outline: false,
        nextState: 'APPROVE',
        nextStateLabel: 'Common.approve',
        confirmText: 'Common.approveConfirm',
        responseTitle: 'Common.approved',
        restponseText: 'Common.approveSuccess',
      },
    },
  };

}
