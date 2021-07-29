import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { WarehouseComponent } from './warehouse.component';
import { NbTabsetModule, NbCardModule, NbIconModule, NbInputModule, NbCheckboxModule, NbRouteTabsetModule, NbStepperModule, NbButtonModule, NbListModule, NbAccordionModule, NbUserModule, NbSelectModule, NbActionsModule, NbRadioModule, NbDatepickerModule, NbProgressBarModule, NbDialogModule } from '@nebular/theme';
import { WarehouseRoutingModule } from './warehouse-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CustomElementModule } from '../../lib/custom-element/custom-element.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '../dialog/dialog.module';
import { AgGridModule } from '@ag-grid-community/angular';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { SortablejsModule } from 'ngx-sortablejs';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { TranslateModule } from '@ngx-translate/core';
import { WarehouseGoodsReceiptNoteListComponent } from './goods-receipt-note/warehouse-goods-receipt-note-list/warehouse-goods-receipt-note-list.component';
import { WarehouseGoodsReceiptNoteFormComponent } from './goods-receipt-note/warehouse-goods-receipt-note-form/warehouse-goods-receipt-note-form.component';
import { WarehouseGoodsReceiptNotePrintComponent } from './goods-receipt-note/warehouse-goods-receipt-note-print/warehouse-goods-receipt-note-print.component';
import { WarehouseGoodsDeliveryNoteListComponent } from './goods-delivery-note/warehouse-goods-delivery-note-list/warehouse-goods-delivery-note-list.component';
import { WarehouseGoodsDeliveryNoteFormComponent } from './goods-delivery-note/warehouse-goods-delivery-note-form/warehouse-goods-delivery-note-form.component';
import { WarehouseGoodsDeliveryNotePrintComponent } from './goods-delivery-note/warehouse-goods-delivery-note-print/warehouse-goods-delivery-note-print.component';
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
import { WarehouseBookCommitComponent } from './book/warehouse-book-commit/warehouse-book-commit.component';
import { ProcessMap } from '../../models/process-map.model';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
  declarations: [
    WarehouseComponent,
    WarehouseGoodsReceiptNoteListComponent,
    WarehouseGoodsReceiptNoteFormComponent,
    WarehouseGoodsReceiptNotePrintComponent,
    WarehouseGoodsDeliveryNoteListComponent,
    WarehouseGoodsDeliveryNoteFormComponent,
    WarehouseGoodsDeliveryNotePrintComponent,
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
    // IvoipDashboardModule,
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
    WarehouseGoodsContainerFormComponent,
    WarehouseBookFormComponent,
    WarehouseGoodsFormComponent,
    // AssignContainerFormComponent,
    WarehouseGoodsDeliveryNotePrintComponent,
    WarehouseBookCommitComponent,
    WarehouseGoodsDeliveryNoteFormComponent,
    WarehouseGoodsReceiptNoteFormComponent,
    // PurchaseVoucherListComponent,
    // PurchaseVoucherPrintComponent,
  ],
  providers: [
    CurrencyPipe,
  ],
})
export class WarehouseModule {
    static processMaps: {

      warehouseReceiptGoodsNote?: {
        [key: string]: ProcessMap
      },
      warehouseDeliveryGoodsNote?: {
        [key: string]: ProcessMap
      },
    } = {
        warehouseReceiptGoodsNote: {
          "BOOKKEEPING": {
            state: 'BOOKKEEPING',
            label: 'Common.bookkeeped',
            status: 'success',
            outline: true,
            nextState: 'UNBOOKKEEPING',
            nextStateLabel: 'Common.unbookkeeping',
            confirmText: 'Common.unbookkeepingConfirm',
            responseTitle: 'Common.unbookkeeped',
            restponseText: 'Common.unbookkeepingSuccess',
          },
          "UNBOOKKEEPING": {
            state: 'UNBOOKKEEPING',
            label: 'Common.notJustBookkeeping',
            status: 'danger',
            outline: false,
            nextState: 'BOOKKEEPING',
            nextStateLabel: 'Common.bookkeeping',
            confirmText: 'Common.bookkeepingConfirm',
            responseTitle: 'Common.bookkeeping',
            restponseText: 'Common.bookkeepingSuccess',
          },
          "": {
            state: 'NOTJUSTBOOKKEEPING',
            label: 'Common.notJustBookkeeping',
            status: 'danger',
            outline: false,
            nextState: 'BOOKKEEPING',
            nextStateLabel: 'Common.bookkeeping',
            confirmText: 'Common.bookkeepingConfirm',
            responseTitle: 'Common.bookkeeping',
            restponseText: 'Common.bookkeepingSuccess',
          },
        },
        warehouseDeliveryGoodsNote: {
          "BOOKKEEPING": {
            state: 'BOOKKEEPING',
            label: 'Common.bookkeeped',
            status: 'success',
            outline: true,
            nextState: 'UNBOOKKEEPING',
            nextStateLabel: 'Common.unbookkeeping',
            confirmText: 'Common.unbookkeepingConfirm',
            responseTitle: 'Common.unbookkeeped',
            restponseText: 'Common.unbookkeepingSuccess',
          },
          "UNBOOKKEEPING": {
            state: 'UNBOOKKEEPING',
            label: 'Common.notJustBookkeeping',
            status: 'danger',
            outline: false,
            nextState: 'BOOKKEEPING',
            nextStateLabel: 'Common.bookkeeping',
            confirmText: 'Common.bookkeepingConfirm',
            responseTitle: 'Common.bookkeeping',
            restponseText: 'Common.bookkeepingSuccess',
          },
          "": {
            state: 'NOTJUSTBOOKKEEPING',
            label: 'Common.notJustBookkeeping',
            status: 'danger',
            outline: false,
            nextState: 'BOOKKEEPING',
            nextStateLabel: 'Common.bookkeeping',
            confirmText: 'Common.bookkeepingConfirm',
            responseTitle: 'Common.bookkeeping',
            restponseText: 'Common.bookkeepingSuccess',
          },
        },
      };

}
