import { SalesVoucherListComponent } from './modules/sales/sales-voucher/sales-voucher-list/sales-voucher-list.component';
// import { SalesModule } from './modules/sales/sales.module';
import { ServiceWorkerModule } from '@angular/service-worker';
/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule, RoutingResolve } from './app-routing.module';
import { environment } from './../environments/environment';
import {
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
  NbCardModule,
  NbLayoutModule,
  NbDialogRef,
  NbAccordionModule,
  NbActionsModule,
  NbButtonModule,
  NbCheckboxModule,
  NbIconModule,
  NbInputModule,
  NbListModule,
  NbProgressBarModule,
  NbRadioModule,
  NbRouteTabsetModule,
  NbSelectModule,
  NbSpinnerModule,
  NbStepperModule,
  NbTabsetModule,
  NbUserModule,
} from '@nebular/theme';
import { NbAuthModule, NbPasswordAuthStrategy, NbAuthOAuth2JWTToken } from '@nebular/auth';
import { AuthModule } from './modules/auth/auth.module';
import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from './custom-route-reuse-stratery';
import { ECommerceModule } from './modules/e-commerce/e-commerce.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { DialogModule } from './modules/dialog/dialog.module';
import { ShowcaseDialogComponent } from './modules/dialog/showcase-dialog/showcase-dialog.component';
import { TreeModule } from 'angular-tree-component';
import { PlayerDialogComponent } from './modules/dialog/player-dialog/player-dialog.component';
import { IvoipModule } from './modules/ivoip/ivoip.module';
import { NotificationModule } from './modules/notification/notification.module';
import { DialogFormComponent } from './modules/dialog/dialog-form/dialog-form.component';
import { CookieService } from 'ngx-cookie-service';
import { MobileAppModule } from './modules/mobile-app/mobile-app.module';
import { ApiInterceptor } from './services/api.service';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { registerLocaleData, CurrencyPipe, DecimalPipe, CommonModule } from '@angular/common';
import localeVi from '@angular/common/locales/vi';
import localeViExtra from '@angular/common/locales/extra/vi';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireModule } from '@angular/fire';
// import { options } from './modules/purchase/purchase.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { WarehouseGoodsDeliveryNotePrintComponent } from './modules/warehouse/goods-delivery-note/warehouse-goods-delivery-note-print/warehouse-goods-delivery-note-print.component';
import { MasterPriceTableFormComponent } from './modules/sales/master-price-table/master-price-table-form/master-price-table-form.component';
import { MasterPriceTableListComponent } from './modules/sales/master-price-table/master-price-table-list/master-price-table-list.component';
import { MasterPriceTablePrintComponent } from './modules/sales/master-price-table/master-price-table-print/master-price-table-print.component';
import { SalesPriceReportFormComponent } from './modules/sales/price-report/sales-price-report-form/sales-price-report-form.component';
import { SalesPriceReportListComponent } from './modules/sales/price-report/sales-price-report-list/sales-price-report-list.component';
import { SalesPriceReportPrintComponent } from './modules/sales/price-report/sales-price-report-print/sales-price-report-print.component';
import { PriceTableFormComponent } from './modules/sales/price-table/price-table-form/price-table-form.component';
import { PriceTableListComponent } from './modules/sales/price-table/price-table-list/price-table-list.component';
import { PriceTablePrintAsListComponent } from './modules/sales/price-table/price-table-print-as-list/price-table-print-as-list.component';
import { PriceTablePrintComponent } from './modules/sales/price-table/price-table-print/price-table-print.component';
import { SalesVoucherFormComponent } from './modules/sales/sales-voucher/sales-voucher-form/sales-voucher-form.component';
import { SalesVoucherPrintComponent } from './modules/sales/sales-voucher/sales-voucher-print/sales-voucher-print.component';
import { SimpleSalesVoucherFormComponent } from './modules/sales/sales-voucher/simple-sales-voucher-form/simple-sales-voucher-form.component';
// import { SalesComponent } from './modules/sales/sales.component';
import { AgGridModule } from '@ag-grid-community/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { SortablejsModule } from 'ngx-sortablejs';
import { NgxUploaderModule } from '../vendor/ngx-uploader/src/public_api';
import { CustomElementModule } from './lib/custom-element/custom-element.module';
import { AdminProductModule } from './modules/admin-product/admin-product.module';
import { PurchaseOrderVoucherFormComponent } from './modules/purchase/order/purchase-order-voucher-form/purchase-order-voucher-form.component';
import { PurchaseOrderVoucherListComponent } from './modules/purchase/order/purchase-order-voucher-list/purchase-order-voucher-list.component';
import { PurchaseOrderVoucherPrintComponent } from './modules/purchase/order/purchase-order-voucher-print/purchase-order-voucher-print.component';
import { PurchasePriceTableFormComponent } from './modules/purchase/price-table/purchase-price-table-form/purchase-price-table-form.component';
import { PurchasePriceTableImportComponent } from './modules/purchase/price-table/purchase-price-table-import/purchase-price-table-import.component';
import { PurchasePriceTableListComponent } from './modules/purchase/price-table/purchase-price-table-list/purchase-price-table-list.component';
import { PurchasePriceTablePrintComponent } from './modules/purchase/price-table/purchase-price-table-print/purchase-price-table-print.component';
// import { PurchaseComponent } from './modules/purchase/purchase.component';
import { PurchaseSimpleVoucherFormComponent } from './modules/purchase/voucher/purchase-simple-voucher-form/purchase-simple-voucher-form.component';
import { PurchaseVoucherFormComponent } from './modules/purchase/voucher/purchase-voucher-form/purchase-voucher-form.component';
import { PurchaseVoucherListComponent } from './modules/purchase/voucher/purchase-voucher-list/purchase-voucher-list.component';
import { PurchaseVoucherPrintComponent } from './modules/purchase/voucher/purchase-voucher-print/purchase-voucher-print.component';
import { WarehouseBookCommitComponent } from './modules/warehouse/book/warehouse-book-commit/warehouse-book-commit.component';
import { WarehouseBookFormComponent } from './modules/warehouse/book/warehouse-book-form/warehouse-book-form.component';
import { WarehouseBookListComponent } from './modules/warehouse/book/warehouse-book-list/warehouse-book-list.component';
import { WarehouseBookPrintComponent } from './modules/warehouse/book/warehouse-book-print/warehouse-book-print.component';
import { WarehouseGoodsContainerFormComponent } from './modules/warehouse/goods-container/warehouse-goods-container-form/warehouse-goods-container-form.component';
import { WarehouseGoodsContainerListComponent } from './modules/warehouse/goods-container/warehouse-goods-container-list/warehouse-goods-container-list.component';
import { WarehouseGoodsContainerPrintComponent } from './modules/warehouse/goods-container/warehouse-goods-container-print/warehouse-goods-container-print.component';
import { WarehouseGoodsDeliveryNoteFormComponent } from './modules/warehouse/goods-delivery-note/warehouse-goods-delivery-note-form/warehouse-goods-delivery-note-form.component';
import { WarehouseGoodsDeliveryNoteListComponent } from './modules/warehouse/goods-delivery-note/warehouse-goods-delivery-note-list/warehouse-goods-delivery-note-list.component';
import { WarehouseGoodsReceiptNoteFormComponent } from './modules/warehouse/goods-receipt-note/warehouse-goods-receipt-note-form/warehouse-goods-receipt-note-form.component';
import { WarehouseGoodsReceiptNoteListComponent } from './modules/warehouse/goods-receipt-note/warehouse-goods-receipt-note-list/warehouse-goods-receipt-note-list.component';
import { WarehouseGoodsReceiptNotePrintComponent } from './modules/warehouse/goods-receipt-note/warehouse-goods-receipt-note-print/warehouse-goods-receipt-note-print.component';
import { AssignContainerFormComponent } from './modules/warehouse/goods/assign-containers-form/assign-containers-form.component';
import { WarehouseGoodsFormComponent } from './modules/warehouse/goods/warehouse-goods-form/warehouse-goods-form.component';
import { WarehouseGoodsListComponent } from './modules/warehouse/goods/warehouse-goods-list/warehouse-goods-list.component';
import { WarehouseGoodsPrintComponent } from './modules/warehouse/goods/warehouse-goods-print/warehouse-goods-print.component';
// import { WarehouseComponent } from './modules/warehouse/warehouse.component';
import { WarehouseFormComponent } from './modules/warehouse/warehouse/warehouse-form/warehouse-form.component';
import { WarehouseListComponent } from './modules/warehouse/warehouse/warehouse-list/warehouse-list.component';
import { WarehousePrintComponent } from './modules/warehouse/warehouse/warehouse-print/warehouse-print.component';
import { AccBusinessListComponent } from './modules/accounting/acc-business/acc-business-list/acc-business-list.component';
import { AccAccountFormComponent } from './modules/accounting/acc-account/acc-account-form/acc-account-form.component';
import { AccAccountListComponent } from './modules/accounting/acc-account/acc-account-list/acc-account-list.component';
import { AccBusinessFormComponent } from './modules/accounting/acc-business/acc-business-form/acc-business-form.component';
// import { AccountingComponent } from './modules/accounting/accounting.component';
import { CashPaymentVoucherFormComponent } from './modules/accounting/cash/payment/cash-payment-voucher-form/cash-payment-voucher-form.component';
import { CashPaymentVoucherListComponent } from './modules/accounting/cash/payment/cash-payment-voucher-list/cash-payment-voucher-list.component';
import { CashPaymentVoucherPrintComponent } from './modules/accounting/cash/payment/cash-payment-voucher-print/cash-payment-voucher-print.component';
import { CashReceiptVoucherFormComponent } from './modules/accounting/cash/receipt/cash-receipt-voucher-form/cash-receipt-voucher-form.component';
import { CashReceiptVoucherListComponent } from './modules/accounting/cash/receipt/cash-receipt-voucher-list/cash-receipt-voucher-list.component';
import { CashReceiptVoucherPrintComponent } from './modules/accounting/cash/receipt/cash-receipt-voucher-print/cash-receipt-voucher-print.component';
import { ProcessMap } from './models/process-map.model';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;
registerLocaleData(localeVi, 'vi', localeViExtra);

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

export class DynamicLocaleId extends String {
  constructor(public translate: TranslateService) {
    super();
  }

  toString() {
    return this.translate.currentLang;
  }
}

@NgModule({
  declarations: [
    AppComponent,

    // Sales components
    // SalesComponent,
    SalesPriceReportListComponent,
    SalesPriceReportFormComponent,
    SalesPriceReportPrintComponent,
    SalesVoucherListComponent,
    SalesVoucherFormComponent,
    SalesVoucherPrintComponent,
    PriceTableListComponent,
    PriceTableFormComponent,
    PriceTablePrintComponent,
    PriceTablePrintAsListComponent,
    SimpleSalesVoucherFormComponent,
    MasterPriceTableListComponent,
    MasterPriceTableFormComponent,
    MasterPriceTablePrintComponent,

    // Purchase components
    PurchasePriceTableListComponent,
    PurchasePriceTableFormComponent,
    PurchasePriceTablePrintComponent,
    // PurchaseComponent,
    PurchasePriceTableImportComponent,
    PurchaseVoucherListComponent,
    PurchaseVoucherFormComponent,
    PurchaseVoucherPrintComponent,
    PurchaseSimpleVoucherFormComponent,
    PurchaseOrderVoucherListComponent,
    PurchaseOrderVoucherFormComponent,
    PurchaseOrderVoucherPrintComponent,

    // Warehouse components
    // WarehouseComponent,
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


    // Accounting components
    // AccountingComponent,
    CashReceiptVoucherListComponent,
    CashReceiptVoucherFormComponent,
    CashPaymentVoucherListComponent,
    CashPaymentVoucherFormComponent,
    CashReceiptVoucherFormComponent,
    CashReceiptVoucherListComponent,
    CashReceiptVoucherPrintComponent,
    CashPaymentVoucherPrintComponent,
    AccAccountListComponent,
    AccAccountFormComponent,
    AccBusinessListComponent,
    AccBusinessFormComponent,
  ],
  imports: [

    // Form List Form Components
    CommonModule,
    NbTabsetModule,
    Ng2SmartTableModule,
    CustomElementModule,
    NbIconModule,
    NbInputModule,
    NbCheckboxModule,
    NbRouteTabsetModule,
    NbStepperModule,
    NbButtonModule,
    NbListModule,
    NbAccordionModule,
    NbUserModule,
    NbSelectModule,
    NbActionsModule,
    NbRadioModule,
    CurrencyMaskModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    NbProgressBarModule,
    AgGridModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NbDialogModule.forChild(),
    SortablejsModule.forRoot({
      animation: 200,
    }),
    NgxMaskModule.forRoot(options),
    TranslateModule,
    // AdminProductModule,
    NgxUploaderModule,
    NbSpinnerModule,


    NotificationModule,
    NbLayoutModule,
    ECommerceModule,
    DashboardModule,
    MobileAppModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NbCardModule,
    DialogModule,
    // IvoipModule,
    // SalesModule,
    // WarehouseModule,
    // PurchaseModule,
    HttpClientModule,
    AuthModule,
    CurrencyMaskModule,
    CKEditorModule,
    TreeModule.forRoot(),
    ThemeModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),
    CoreModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    NbAuthModule.forRoot({
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: 'email',
          token: {
            // class: NbAuthJWTToken,
            class: NbAuthOAuth2JWTToken,
            key: 'token', // this parameter tells where to look for the token
          },
          baseEndpoint: environment.api.baseUrl,
          login: {
            // ...
            endpoint: '/user/login',
            redirect: {
              success: null,
              failure: null, // stay on the same page
            },
          },
          refreshToken: {
            method: 'post',
            endpoint: '/user/login/refresh',
            requireValidToken: false,
            redirect: {
              success: null,
              failure: null,
            },
          }
          ,
          logout: {
            // ...
            // endpoint: '/user/logout',
            endpoint: '',
            redirect: {
              success: '/auth/logout',
              // success: null,
              failure: null, // stay on the same page
            },
            requireValidToken: true,
          },
          register: {
            // ...
            endpoint: '/user/register',
            redirect: {
              success: '/',
              failure: null, // stay on the same page
            },
          },
        }),
      ],
      forms: {},
    }),
    // ServiceWorkerModule.register('/probox-core/firebase-messaging-sw.js', { enabled: true || environment.production, registrationStrategy: 'registerImmediately' }),
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase),
  ],
  entryComponents: [
    ShowcaseDialogComponent,
    PlayerDialogComponent,
    // PbxFormComponent,
    DialogFormComponent,
    // WarehouseGoodsDeliveryNotePrintComponent,
    // SalesVoucherListComponent,
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: CustomRouteReuseStrategy,
    },
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
    },
    {
      provide: LOCALE_ID,
      useClass: DynamicLocaleId,
      deps: [TranslateService],
    },
    {
      provide: OWL_DATE_TIME_LOCALE,
      useClass: DynamicLocaleId,
      deps: [TranslateService],
    },
    { provide: NbDialogRef, useValue: {} },
    { provide: CurrencyPipe, useValue: {} },
    { provide: DecimalPipe, useValue: {} },
    RoutingResolve,
  ],
})
export class AppModule {
  static processMaps =  {
      priceReport: {
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
          // nextState: 'DEPLOYMENT',
          // nextStateLabel: 'Common.deployment',
          // confirmText: 'Common.implementConfirm',
          // responseTitle: 'Common.deploymented',
          // restponseText: 'Common.deploymentSuccess',
        },
        "DEPLOYMENT": {
          state: 'DEPLOYMENT',
          label: 'Common.implement',
          status: 'warning',
          outline: false,
          nextState: 'ACCEPTANCE',
          nextStateLabel: 'Common.acceptance',
          confirmText: 'Common.acceptanceConfirm',
          responseTitle: 'Common.acceptanced',
          restponseText: 'Common.acceptanceSuccess',
        },
        "ACCEPTANCE": {
          state: 'ACCEPTANCE',
          label: 'Common.acceptance',
          status: 'info',
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
          nextStateLabel: 'Common.completed',
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
      salesVoucher: {
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
          nextState: 'UNBOOKKEEPING',
          nextStateLabel: 'Common.unbookkeeping',
          confirmText: 'Common.unbookkeepingConfirm',
          responseTitle: 'Common.unbookkeeping',
          restponseText: 'Common.unbookkeepingSuccess',
        },
        "UNBOOKKEEPING": {
          state: 'UNBOOKKEEPING',
          label: 'Common.unbookkeeped',
          status: 'warning',
          outline: true,
          nextState: 'APPROVE',
          nextStateLabel: 'Common.approve',
          confirmText: 'Common.approveConfirm',
          responseTitle: 'Common.approved',
          restponseText: 'Common.approveSuccess',
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
          nextState: 'UNBOOKKEEPING',
          nextStateLabel: 'Common.unbookkeeping',
          confirmText: 'Common.unbookkeepingConfirm',
          responseTitle: 'Common.unbookkeeping',
          restponseText: 'Common.unbookkeepingSuccess',
        },
        "UNBOOKKEEPING": {
          state: 'UNBOOKKEEPING',
          label: 'Common.unbookkeeped',
          status: 'warning',
          outline: true,
          nextState: 'APPROVE',
          nextStateLabel: 'Common.approve',
          confirmText: 'Common.approveConfirm',
          responseTitle: 'Common.approved',
          restponseText: 'Common.approveSuccess',
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
      },warehouseReceiptGoodsNote: {
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
      },cashVoucher: {
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
          nextState: 'UNBOOKKEEPING',
          nextStateLabel: 'Common.unbookkeeping',
          confirmText: 'Common.unbookkeepingConfirm',
          responseTitle: 'Common.unbookkeeping',
          restponseText: 'Common.unbookkeepingSuccess',
        },
        "UNBOOKKEEPING": {
          state: 'UNBOOKKEEPING',
          label: 'Common.unbookkeeped',
          status: 'warning',
          outline: true,
          nextState: 'APPROVE',
          nextStateLabel: 'Common.approve',
          confirmText: 'Common.approveConfirm',
          responseTitle: 'Common.approved',
          restponseText: 'Common.approveSuccess',
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
      // purchaseOrder: {
      //   "APPROVE": {
      //     state: 'APPROVE',
      //     label: 'Common.approved',
      //     status: 'success',
      //     outline: false,
      //     nextState: 'COMPLETE',
      //     nextStateLabel: 'Common.complete',
      //     confirmText: 'Common.completeConfirm',
      //     responseTitle: 'Common.completed',
      //     restponseText: 'Common.completeSuccess',
      //   },
      //   "COMPLETE": {
      //     state: 'COMPLETE',
      //     label: 'Common.completed',
      //     status: 'success',
      //     outline: true,
      //     nextState: '',
      //     nextStateLabel: '',
      //     confirmText: 'Common.completeConfirm',
      //     responseTitle: 'Common.completed',
      //     restponseText: 'Common.completeSuccess',
      //   },
      //   "": {
      //     state: 'NOTJUSTAPPROVE',
      //     label: 'Common.notJustApproved',
      //     status: 'danger',
      //     outline: false,
      //     nextState: 'APPROVE',
      //     nextStateLabel: 'Common.approve',
      //     confirmText: 'Common.approveConfirm',
      //     responseTitle: 'Common.approved',
      //     restponseText: 'Common.approveSuccess',
      //   },
      // },
    };
}
