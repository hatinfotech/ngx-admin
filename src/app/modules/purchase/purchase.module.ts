import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { PurchasePriceTableListComponent } from './price-table/purchase-price-table-list/purchase-price-table-list.component';
import { PurchasePriceTableFormComponent } from './price-table/purchase-price-table-form/purchase-price-table-form.component';
import { PurchasePriceTablePrintComponent } from './price-table/purchase-price-table-print/purchase-price-table-print.component';
import { NbTabsetModule, NbCardModule, NbIconModule, NbInputModule, NbCheckboxModule, NbRouteTabsetModule, NbStepperModule, NbButtonModule, NbListModule, NbAccordionModule, NbUserModule, NbSelectModule, NbActionsModule, NbRadioModule, NbDatepickerModule, NbProgressBarModule, NbDialogModule } from '@nebular/theme';
import { PurchaseRoutingModule } from './purchase-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CustomElementModule } from '../../lib/custom-element/custom-element.module';
import { IvoipDashboardModule } from '../ivoip/dashboard/ivoip-dashboard.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '../dialog/dialog.module';
import { AgGridModule } from '@ag-grid-community/angular';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { CKEditorModule } from 'ng2-ckeditor';
import { SortablejsModule } from 'ngx-sortablejs';
import { NgxMaskModule } from 'ngx-mask';
import { options } from '../sales/sales.module';
import { TranslateModule } from '@ngx-translate/core';
import { PurchaseComponent } from './purchase.component';
import { PurchasePriceTableImportComponent } from './price-table/purchase-price-table-import/purchase-price-table-import.component';



@NgModule({
  declarations: [
    PurchasePriceTableListComponent,
    PurchasePriceTableFormComponent,
    PurchasePriceTablePrintComponent,
    PurchaseComponent,
    PurchasePriceTableImportComponent,
  ],
  imports: [
    CommonModule,
    NbTabsetModule,
    PurchaseRoutingModule,
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
    CKEditorModule,
    NbDialogModule.forChild(),
    SortablejsModule.forRoot({
      animation: 200,
    }),
    NgxMaskModule.forRoot(options),
    TranslateModule,
  ],
  entryComponents: [
    PurchasePriceTableFormComponent,
    PurchasePriceTablePrintComponent,
    PurchasePriceTableImportComponent,
  ],
  providers: [
    CurrencyPipe,
  ],
})
export class PurchaseModule { }
