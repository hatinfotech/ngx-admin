import { SaleProductListComponent } from './modules/sales/sales-product/sales-product-list/sales-product-list.component';
import { WordpressOrderListComponent } from './modules/wordpress/order/order-list/order-list.component';
import { ProductObjectReferenceListComponent } from './modules/admin-product/product-object-reference/product-object-reference-list/product-object-reference-list.component';
import { WarehouseDashboardComponent } from './modules/warehouse/warehouse-dashboard/warehouse-dashboard.component';
import { SalesProductListComponent } from './modules/sales/product/sales-product-list/sales-product-list.component';
import { CommercePosOrderListComponent } from './modules/commerce-pos/commerce-pos-order/commerce-pos-order-list/commerce-pos-order-list.component';
import { CommercePosGuiComponent } from './modules/commerce-pos/gui/commerce-pos-gui/commerce-pos-gui.component';
import { CollaboratorEducationArticleListComponent } from './modules/collaborator/education-article/education-article-list/collaborator-education-article-list.component';
import { CollaboratorCommissionListComponent } from './modules/collaborator/commission/collaborator-commission-list/collaborator-commission-list.component';
import { CollaboratorPublisherComponent } from './modules/collaborator/collaborator-publisher/collaborator-publisher.component';
import { CollaboratorOrderListComponent } from './modules/collaborator/order/collaborator-order-list/collaborator-order-list.component';
import { CollaboratorPublisherReportComponent } from './modules/collaborator/collaborator-publisher-report/collaborator-publisher-report.component';
import { CollaboratorPublisherSummaryComponent } from './modules/collaborator/collaborator-publisher-summary/collaborator-publisher-summary.component';
import { CollaboratorPageReportComponent } from './modules/collaborator/collaborator-page-report/collaborator-page-report.component';
import { CollaboratorPageDashboardComponent } from './modules/collaborator/collaborator-page-dashboard/collaborator-page-dashboard.component';
import { CollaboratorProductListComponent } from './modules/collaborator/product/collaborator-product-list/collaborator-product-list.component';
import { CollaboratorPublisherListComponent } from './modules/collaborator/publisher/collaborator-publisher-list/collaborator-publisher-list.component';
import { CollaboratorPageListComponent } from './modules/collaborator/page/collaborator-page-list/collaborator-page-list.component';
import { ContactCustomerListComponent } from './modules/contact/contact-customer-list/contact-customer-list.component';
import { ContactRemovedListComponent } from './modules/contact/contact-removed-list/contact-removed-list.component';
import { ContactEmployeeListComponent } from './modules/contact/contact-employee-list/contact-employee-list.component';
import { ContactSupplierListComponent } from './modules/contact/contact-supplier-list/contact-supplier-list.component';
import { ContactAllListComponent } from './modules/contact/contact-all-list/contact-all-list.component';
import { CommerceServiceByCycleListComponent } from './modules/commerce-service-by-cycle/service-by-cycle/commerce-service-by-cycle-list/commerce-service-by-cycle-list.component';
import { AccountingBankAccountFormComponent } from './modules/accounting/bank-account/accounting-bank-account-form/accounting-bank-account-form.component';
import { AccountingBankAccountListComponent } from './modules/accounting/bank-account/accounting-bank-account-list/accounting-bank-account-list.component';
import { AccountingBankFormComponent } from './modules/accounting/bank/accounting-bank-form/accounting-bank-form.component';
import { AccountingBankListComponent } from './modules/accounting/bank/accounting-bank-list/accounting-bank-list.component';
import { AccountingOtherBusinessVoucherListComponent } from './modules/accounting/other-business-voucher/accounting-other-business-voucher-list/accounting-other-business-voucher-list.component';
import { PurchaseGoodsListComponent } from './modules/purchase/goods/purchase-goods-list/purchase-goods-list.component';
import { ExtraOptions, RouterModule, Routes, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { NgModule, Injectable } from '@angular/core';
import {
  NbAuthComponent,
  NbLoginComponent,
} from '@nebular/auth';
import { AuthGuardService } from './services/auth-guard.service';
// import { ECommerceComponent } from './modules/e-commerce/e-commerce.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { NotificationComponent } from './modules/notification/notification.component';
import { MobileAppComponent } from './modules/mobile-app/mobile-app.component';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from './services/common.service';
import { WarehouseBookFormComponent } from './modules/warehouse/book/warehouse-book-form/warehouse-book-form.component';
import { WarehouseBookListComponent } from './modules/warehouse/book/warehouse-book-list/warehouse-book-list.component';
import { WarehouseGoodsContainerFormComponent } from './modules/warehouse/goods-container/warehouse-goods-container-form/warehouse-goods-container-form.component';
import { WarehouseGoodsContainerListComponent } from './modules/warehouse/goods-container/warehouse-goods-container-list/warehouse-goods-container-list.component';
import { WarehouseGoodsDeliveryNoteFormComponent } from './modules/warehouse/goods-delivery-note/warehouse-goods-delivery-note-form/warehouse-goods-delivery-note-form.component';
import { WarehouseGoodsDeliveryNoteListComponent } from './modules/warehouse/goods-delivery-note/warehouse-goods-delivery-note-list/warehouse-goods-delivery-note-list.component';
import { WarehouseGoodsReceiptNoteFormComponent } from './modules/warehouse/goods-receipt-note/warehouse-goods-receipt-note-form/warehouse-goods-receipt-note-form.component';
import { WarehouseGoodsReceiptNoteListComponent } from './modules/warehouse/goods-receipt-note/warehouse-goods-receipt-note-list/warehouse-goods-receipt-note-list.component';
import { WarehouseGoodsFormComponent } from './modules/warehouse/goods/warehouse-goods-form/warehouse-goods-form.component';
import { WarehouseGoodsListComponent } from './modules/warehouse/goods/warehouse-goods-list/warehouse-goods-list.component';
import { WarehouseFormComponent } from './modules/warehouse/warehouse/warehouse-form/warehouse-form.component';
import { WarehouseListComponent } from './modules/warehouse/warehouse/warehouse-list/warehouse-list.component';
import { MasterPriceTableFormComponent } from './modules/sales/master-price-table/master-price-table-form/master-price-table-form.component';
import { MasterPriceTableListComponent } from './modules/sales/master-price-table/master-price-table-list/master-price-table-list.component';
import { SalesPriceReportFormComponent } from './modules/sales/price-report/sales-price-report-form/sales-price-report-form.component';
import { SalesPriceReportListComponent } from './modules/sales/price-report/sales-price-report-list/sales-price-report-list.component';
import { PriceTableFormComponent } from './modules/sales/price-table/price-table-form/price-table-form.component';
import { PriceTableListComponent } from './modules/sales/price-table/price-table-list/price-table-list.component';
import { SalesVoucherFormComponent } from './modules/sales/sales-voucher/sales-voucher-form/sales-voucher-form.component';
import { SalesVoucherListComponent } from './modules/sales/sales-voucher/sales-voucher-list/sales-voucher-list.component';
import { PurchaseOrderVoucherFormComponent } from './modules/purchase/order/purchase-order-voucher-form/purchase-order-voucher-form.component';
import { PurchaseOrderVoucherListComponent } from './modules/purchase/order/purchase-order-voucher-list/purchase-order-voucher-list.component';
import { PurchasePriceTableFormComponent } from './modules/purchase/price-table/purchase-price-table-form/purchase-price-table-form.component';
import { PurchasePriceTableListComponent } from './modules/purchase/price-table/purchase-price-table-list/purchase-price-table-list.component';
import { PurchaseVoucherFormComponent } from './modules/purchase/voucher/purchase-voucher-form/purchase-voucher-form.component';
import { PurchaseVoucherListComponent } from './modules/purchase/voucher/purchase-voucher-list/purchase-voucher-list.component';
import { AccAccountFormComponent } from './modules/accounting/acc-account/acc-account-form/acc-account-form.component';
import { AccAccountListComponent } from './modules/accounting/acc-account/acc-account-list/acc-account-list.component';
import { AccBusinessFormComponent } from './modules/accounting/acc-business/acc-business-form/acc-business-form.component';
import { AccBusinessListComponent } from './modules/accounting/acc-business/acc-business-list/acc-business-list.component';
import { CashPaymentVoucherFormComponent } from './modules/accounting/cash/payment/cash-payment-voucher-form/cash-payment-voucher-form.component';
import { CashPaymentVoucherListComponent } from './modules/accounting/cash/payment/cash-payment-voucher-list/cash-payment-voucher-list.component';
import { CashReceiptVoucherFormComponent } from './modules/accounting/cash/receipt/cash-receipt-voucher-form/cash-receipt-voucher-form.component';
import { CashReceiptVoucherListComponent } from './modules/accounting/cash/receipt/cash-receipt-voucher-list/cash-receipt-voucher-list.component';
import { DeploymentVoucherListComponent } from './modules/deployment/deployment-voucher/deployment-voucher-list/deployment-voucher-list.component';
import { DeploymentVoucherFormComponent } from './modules/deployment/deployment-voucher/deployment-voucher-form/deployment-voucher-form.component';
import { ProductCategoryFormComponent } from './modules/admin-product/category/product-category-form/product-category-form.component';
import { ProductCategoryListComponent } from './modules/admin-product/category/product-category-list/product-category-list.component';
import { ProductGroupFormComponent } from './modules/admin-product/product-group/product-group-form/product-group-form.component';
import { ProductGroupListComponent } from './modules/admin-product/product-group/product-group-list/product-group-list.component';
import { ProductFormComponent } from './modules/admin-product/product/product-form/product-form.component';
import { ProductListComponent } from './modules/admin-product/product/product-list/product-list.component';
import { ProductUnitFormComponent } from './modules/admin-product/unit/product-unit-form/product-unit-form.component';
import { ProductUnitListComponent } from './modules/admin-product/unit/product-unit-list/product-unit-list.component';
import { AccountingReportComponent } from './modules/accounting/reports/accounting-report.component';
import { AccountingLiabilitiesReportComponent } from './modules/accounting/reports/accounting-liabilities-report/accounting-liabilities-report.component';
import { AccountingReceivablesReportComponent } from './modules/accounting/reports/accounting-receivables-report/accounting-receivables-report.component';
import { AccountingSummaryReportComponent } from './modules/accounting/reports/summary-report/accounting-summary-report.component';
import { AccountingReceivablesFromEmployeeReportComponent } from './modules/accounting/reports/accounting-receivables-from-employee-report/accounting-receivables-from-employee-report.component';
import { AccountingReceivablesFromCustomersReportComponent } from './modules/accounting/reports/accounting-receivables-from-customers-report/accounting-receivables-from-customers-report.component';
import { AccountingProfitReportComponent } from './modules/accounting/reports/accounting-profit-report/accounting-profit-report.component';
import { AccountingDetailByObjectReportComponent } from './modules/accounting/reports/accounting-detail-by-object-report/accounting-detail-by-object-report.component';
import { AccMasterBookListComponent } from './modules/accounting/master-book/acc-master-book-list/acc-master-book-list.component';
import { ContactListComponent } from './modules/contact/contact/contact-list/contact-list.component';
import { ClusterAuthorizedKeyListComponent } from './modules/cluster/authorized-key/cluster-authorized-key-list/cluster-authorized-key-list.component';
import { CollaboratorPageComponent } from './modules/collaborator/collaborator-page/collaborator-page.component';
import { CollaboratorSubscriptionProductComponent } from './modules/collaborator/product/collaborator-subscription-product/collaborator-subscription-product.component';
import { ECommerceComponent } from './modules/e-commerce/e-commerce.component';
import { CollaboratorPublisherDashboardComponent } from './modules/collaborator/collaborator-publisher-dashboard/collaborator-publisher-dashboard.component';
import { CollaboratorSubscriptionPageListComponent } from './modules/collaborator/page/collaborator-subscription-page-list/collaborator-subscription-page-list.component';
import { PageFormComponent } from './modules/page/page-form/page-form.component';
import { PageListComponent } from './modules/page/page-list/page-list.component';
import { CollaboratorCommissionPaymentListComponent } from './modules/collaborator/commission-payment/collaborator-commission-payment-list/collaborator-commission-payment-list.component';
import { CollaboratorAwardListComponent } from './modules/collaborator/award/collaborator-award-list/collaborator-award-list.component';
import { AccountingCashFlowReportComponent } from './modules/accounting/reports/accounting-cash-flow-report/accounting-cash-flow-report.component';
import { AccountingDashboardComponent } from './modules/accounting/accounting-dashboard/accounting-dashboard.component';
import { WarehouseInventoryAdjustNoteListComponent } from './modules/warehouse/inventory-adjust-note/inventory-adjust-note-list/inventory-adjust-note-list.component';
import { SalesReturnsVoucherListComponent } from './modules/sales/sales-returns-voucher/sales-returns-voucher-list/sales-returns-voucher-list.component';
import { CommercePosReturnPrintComponent } from './modules/commerce-pos/commerce-pos-return/commerce-pos-return-print/commerce-pos-return-print.component';
import { CommercePosReturnListComponent } from './modules/commerce-pos/commerce-pos-return/commerce-pos-return-list/commerce-pos-return-list.component';
import { CommercePosDashboardComponent } from './modules/commerce-pos/commerce-pos-dashboard/commerce-pos-dashboard.component';
import { PurchaseDashboardComponent } from './modules/purchase/purchase-dashboard/purchase-dashboard.component';
import { SalesDashboardComponent } from './modules/sales/sales-dashboard/sales-dashboard.component';
import { CoreConnectionListComponent } from './modules/core-connection/core-connection-list/core-connection-list.component';
import { CollaboratorBasicStrategyListComponent } from './modules/collaborator/basic-strategy/basic-strategy-list/collaborator-basic-strategy-list.component';
import { CollaboratorAdvanceStrategyListComponent } from './modules/collaborator/advance-strategy/advance-strategy-list/collaborator-advance-strategy-list.component';
import { CollaboratorAddonStrategyListComponent } from './modules/collaborator/addon-strategy/addon-strategy-list/collaborator-addon-strategy-list.component';
import { CollaboratorRebuyStrategyListComponent } from './modules/collaborator/rebuy-strategy/rebuy-strategy-list/collaborator-rebuy-strategy-list.component';
import { CollaboratorOrderFormComponent } from './modules/collaborator/order/collaborator-order-form/collaborator-order-form.component';
import { AccountingContributedCapitalReportComponent } from './modules/accounting/reports/accounting-contributed-capital-report/accounting-contributed-capital-report.component';
import { ProductBrandListComponent } from './modules/admin-product/brand/product-brand-list/product-brand-list.component';
import { ProductPropertyListComponent } from './modules/admin-product/property/product-property-list/product-property-list.component';
import { AccountingContraAccountReportComponent } from './modules/accounting/reports/contra-account-report/accounting-contra-account-report.component';
import { ProductKeywordListComponent } from './modules/admin-product/keyword/product-keyword-list/product-keyword-list.component';
import { PurchaseProductListComponent } from './modules/purchase/product/purchase-product-list/purchase-product-list.component';
import { WordpressSyncProfileListComponent } from './modules/wordpress/sync-profile/sync-profile-list/sync-profile-list.component';
import { WordpressProductListComponent } from './modules/wordpress/product/product-list/product-list.component';
import { WordpressOrderFormComponent } from './modules/wordpress/order/order-form/order-form.component';
import { MasterPriceTableUpdateNoteListComponent } from './modules/sales/master-price-table-update-note/master-price-table-update-note-list/master-price-table-update-note-list.component';
import { MasterPriceTableQueueComponent } from './modules/sales/master-price-table-queue/master-price-table-queue.component';
import { SalesMasterPriceTableComponent } from './modules/sales/master-price-table/master-price-table/master-price-table.component';
import { WarehouseSummaryReportComponent } from './modules/warehouse/reports/summary-report/warehouse-summary-report.component';
import { WarehouseReportComponent } from './modules/warehouse/reports/warehouse-report.component';

@Injectable()
export class RoutingResolve implements Resolve<any> {

  constructor(public translate: TranslateService, public cms: CommonService) { }

  resolve(route: ActivatedRouteSnapshot): Promise<any> {
    const $this = this;
    return new Promise<any>(resolve => {
      (function checkLocalStorageOnline() {
        if (localStorage && $this.translate) {
          let locale = localStorage.getItem('configuration.locale');
          if (!locale) {
            const browserLangCode = $this.translate.getBrowserLang();
            locale = browserLangCode.match(/en|vi/) ? browserLangCode : 'en-US';
          }
          // $this.locale$.next({locale: locale, skipUpdate: true});
          $this.translate.use(locale).subscribe(res => {
            resolve(locale);
            if (!$this.cms.configReady$.value) {
              $this.cms.configReady$.next(true);
            }
          });

        } else {
          setTimeout(() => {
            checkLocalStorageOnline();
          }, 100);
        }
      })();
    });
  }
}

const routes: Routes = [
  // {
  //   path: '',
  //   canActivate: [AuthGuardService],
  //   loadChildren: () => import('./modules/mini-erp.module')
  //     .then(m => m.MiniErpModule),
  // },
  // {
  //   path: 'auth',
  //   component: NbAuthComponent,
  //   children: [
  //     {
  //       path: '',
  //       component: NbLoginComponent,
  //     },
  //     // {
  //     //   path: 'login',
  //     //   component: NbLoginComponent,
  //     //   // component: LoginComponent,
  //     // },
  //     // {
  //     //   path: 'register',
  //     //   component: NbRegisterComponent,
  //     // },
  //     // {
  //     //   path: 'logout',
  //     //   component: NbLogoutComponent,
  //     // },
  //     // {
  //     //   path: 'request-password',
  //     //   component: NbRequestPasswordComponent,
  //     // },
  //     // {
  //     //   path: 'reset-password',
  //     //   component: NbResetPasswordComponent,
  //     // },
  //   ],
  // },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
    resolve: {
      configuration: RoutingResolve,
    },
    // component: ECommerceComponent,
    // canActivate: [AuthGuardService],
    // resolve: {
    //   configuration: RoutingResolve,
    // },
    // data: {
    //   reuse: true,
    // },
  },
  // {
  //   path: '',
  //   component: ECommerceComponent,
  //   canActivate: [AuthGuardService],
  //   resolve: {
  //     configuration: RoutingResolve,
  //   },
  //   data: {
  //     reuse: true,
  //   },
  // },
  {
    path: 'dashboard',
    component: ECommerceComponent,
    canActivate: [AuthGuardService],
    resolve: {
      configuration: RoutingResolve,
    },
    data: {
      reuse: true,
    },
  },
  {
    path: 'mobile-app',
    component: MobileAppComponent,
    // canActivate: [AuthGuardService],
    resolve: {
      configuration: RoutingResolve,
    },
    data: {
      reuse: true,
    },
  },
  {
    path: 'iot-dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuardService],
    resolve: {
      configuration: RoutingResolve,
    },
    data: {
      reuse: true,
    },
  },
  {
    path: 'notification',
    resolve: {
      configuration: RoutingResolve,
    },
    component: NotificationComponent,
  },

  // Warehouse components
  {
    path: 'warehouse/goods-receipt-note/list',
    canActivate: [AuthGuardService],
    component: WarehouseGoodsReceiptNoteListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'warehouse/goods-receipt-note/form',
    canActivate: [AuthGuardService],
    component: WarehouseGoodsReceiptNoteFormComponent,
  },
  {
    path: 'warehouse/goods-receipt-note/form/:id',
    canActivate: [AuthGuardService],
    component: WarehouseGoodsReceiptNoteFormComponent,
  },
  // goods delivery note
  {
    path: 'warehouse/goods-delivery-note/list',
    canActivate: [AuthGuardService],
    component: WarehouseGoodsDeliveryNoteListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'warehouse/goods-delivery-note/form',
    canActivate: [AuthGuardService],
    component: WarehouseGoodsDeliveryNoteFormComponent,
  },
  {
    path: 'warehouse/goods-delivery-note/form/:id',
    canActivate: [AuthGuardService],
    component: WarehouseGoodsDeliveryNoteFormComponent,
  },
  // goods delivery note
  {
    path: 'warehouse/inventory-adjust-note/list',
    canActivate: [AuthGuardService],
    component: WarehouseInventoryAdjustNoteListComponent,
    data: {
      reuse: true,
    },
  },
  // goods container
  {
    path: 'warehouse/goods-container/list',
    canActivate: [AuthGuardService],
    component: WarehouseGoodsContainerListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'warehouse/goods-container/form',
    canActivate: [AuthGuardService],
    component: WarehouseGoodsContainerFormComponent,
  },
  {
    path: 'warehouse/goods-container/form/:id',
    canActivate: [AuthGuardService],
    component: WarehouseGoodsContainerFormComponent,
  },
  // warehouse
  {
    path: 'warehouse/warehouse/list',
    canActivate: [AuthGuardService],
    component: WarehouseListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'warehouse/warehouse/form',
    canActivate: [AuthGuardService],
    component: WarehouseFormComponent,
  },
  {
    path: 'warehouse/warehouse/form/:id',
    canActivate: [AuthGuardService],
    component: WarehouseFormComponent,
  },
  // warehouse book
  {
    path: 'warehouse/book/list',
    canActivate: [AuthGuardService],
    component: WarehouseBookListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'warehouse/book/form',
    canActivate: [AuthGuardService],
    component: WarehouseBookFormComponent,
  },
  {
    path: 'warehouse/book/form/:id',
    canActivate: [AuthGuardService],
    component: WarehouseBookFormComponent,
  },
  // warehouse goods
  {
    path: 'warehouse/goods/list',
    canActivate: [AuthGuardService],
    component: WarehouseGoodsListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'warehouse/goods/form',
    canActivate: [AuthGuardService],
    component: WarehouseGoodsFormComponent,
  },
  {
    path: 'warehouse/goods/form/:id',
    canActivate: [AuthGuardService],
    component: WarehouseGoodsFormComponent,
  },
  {
    path: 'warehouse/dashboard',
    canActivate: [AuthGuardService],
    component: WarehouseDashboardComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'warehouse/report',
    canActivate: [AuthGuardService],
    component: WarehouseReportComponent,
    children: [
      {
        path: '',
        redirectTo: 'summary',
        pathMatch: 'full',
      },
      {
        path: 'summary',
        component: WarehouseSummaryReportComponent,
        data: {
          reuse: true,
        },
      },
    ],
  },


  // Sales routes
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
  // Sales voucher
  {
    path: 'sales/sales-voucher/list',
    canActivate: [AuthGuardService],
    component: SalesVoucherListComponent,
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

  // Accounting routes
  {
    path: 'accounting/cash-receipt-voucher/list',
    canActivate: [AuthGuardService],
    component: CashReceiptVoucherListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'accounting/dashboard',
    canActivate: [AuthGuardService],
    component: AccountingDashboardComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'accounting/cash-receipt-voucher/form',
    canActivate: [AuthGuardService],
    component: CashReceiptVoucherFormComponent,
  },
  {
    path: 'accounting/cash-receipt-voucher/form/:id',
    canActivate: [AuthGuardService],
    component: CashReceiptVoucherFormComponent,
  },
  // Cash payment voucher
  {
    path: 'accounting/cash-payment-voucher/list',
    canActivate: [AuthGuardService],
    component: CashPaymentVoucherListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'accounting/cash-payment-voucher/form',
    canActivate: [AuthGuardService],
    component: CashPaymentVoucherFormComponent,
  },
  {
    path: 'cash-payment-voucher/form/:id',
    canActivate: [AuthGuardService],
    component: CashPaymentVoucherFormComponent,
  },
  // account
  {
    path: 'accounting/account/list',
    canActivate: [AuthGuardService],
    component: AccAccountListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'accounting/account/form',
    canActivate: [AuthGuardService],
    component: AccAccountFormComponent,
  },
  {
    path: 'accounting/account/form/:id',
    canActivate: [AuthGuardService],
    component: AccAccountFormComponent,
  },
  // accounting business
  {
    path: 'accounting/business/list',
    canActivate: [AuthGuardService],
    component: AccBusinessListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'accounting/business/form',
    canActivate: [AuthGuardService],
    component: AccBusinessFormComponent,
  },
  {
    path: 'accounting/report',
    canActivate: [AuthGuardService],
    component: AccountingReportComponent,
    children: [
      {
        path: '',
        redirectTo: 'summary',
        pathMatch: 'full',
      },
      {
        path: 'summary',
        component: AccountingSummaryReportComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'contra-account',
        component: AccountingContraAccountReportComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'cash-flow',
        component: AccountingCashFlowReportComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'liabilities',
        component: AccountingLiabilitiesReportComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'receivables',
        component: AccountingReceivablesReportComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'receivables-from-employee-report',
        component: AccountingReceivablesFromEmployeeReportComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'receivables-from-customers-report',
        component: AccountingReceivablesFromCustomersReportComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'profit-report',
        component: AccountingProfitReportComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'contributed-capital-report',
        component: AccountingContributedCapitalReportComponent,
        data: {
          reuse: true,
        },
      },
    ],
  },
  {
    path: 'accounting/reports/detail-by-object-report',
    component: AccountingDetailByObjectReportComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'accounting/other-business-voucher/list',
    component: AccountingOtherBusinessVoucherListComponent,
    data: {
      reuse: true,
    },
  },
  // accounting bank
  {
    path: 'accounting/bank/list',
    canActivate: [AuthGuardService],
    component: AccountingBankListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'accounting/bank/form',
    canActivate: [AuthGuardService],
    component: AccountingBankFormComponent,
  },
  // accounting bank account
  {
    path: 'accounting/bank-account/list',
    canActivate: [AuthGuardService],
    component: AccountingBankAccountListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'accounting/bank-account/form',
    canActivate: [AuthGuardService],
    component: AccountingBankAccountFormComponent,
  },
  {
    path: 'accounting/master-book/list',
    canActivate: [AuthGuardService],
    component: AccMasterBookListComponent,
    data: {
      reuse: true,
    },
  },






  // Deployment routes
  {
    path: 'deployment/voucher/list',
    canActivate: [AuthGuardService],
    component: DeploymentVoucherListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'deployment/voucher/form',
    canActivate: [AuthGuardService],
    component: DeploymentVoucherFormComponent,
  },
  {
    path: 'deployment/voucher/form/:id',
    canActivate: [AuthGuardService],
    component: DeploymentVoucherFormComponent,
  },

  // Page routes
  {
    path: 'page/page/list',
    canActivate: [AuthGuardService],
    component: PageListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'page/page/form',
    canActivate: [AuthGuardService],
    component: PageFormComponent,
  },
  {
    path: 'page/page/form/:id',
    canActivate: [AuthGuardService],
    component: PageFormComponent,
  },


  // Admin Product routes
  {
    path: 'admin-product/product/list',
    canActivate: [AuthGuardService],
    component: ProductListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'admin-product/product/form',
    canActivate: [AuthGuardService],
    component: ProductFormComponent,
  },
  {
    path: 'admin-product/product/form/:id',
    canActivate: [AuthGuardService],
    component: ProductFormComponent,
  },
  {
    path: 'admin-product/category/list',
    canActivate: [AuthGuardService],
    component: ProductCategoryListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'admin-product/brand/list',
    canActivate: [AuthGuardService],
    component: ProductBrandListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'admin-product/property/list',
    canActivate: [AuthGuardService],
    component: ProductPropertyListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'admin-product/product-object-reference/list',
    canActivate: [AuthGuardService],
    component: ProductObjectReferenceListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'admin-product/product-keywords/list',
    canActivate: [AuthGuardService],
    component: ProductKeywordListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'admin-product/category/form',
    canActivate: [AuthGuardService],
    component: ProductCategoryFormComponent,
  },
  {
    path: 'admin-product/category/form/:id',
    canActivate: [AuthGuardService],
    component: ProductCategoryFormComponent,
  },
  {
    path: 'admin-product/unit/list',
    canActivate: [AuthGuardService],
    component: ProductUnitListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'admin-product/unit/form',
    canActivate: [AuthGuardService],
    component: ProductUnitFormComponent,
  },
  {
    path: 'admin-product/unit/form/:id',
    canActivate: [AuthGuardService],
    component: ProductUnitFormComponent,
  },
  // Product group

  {
    path: 'admin-product/group/list',
    canActivate: [AuthGuardService],
    component: ProductGroupListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'admin-product/group/form',
    canActivate: [AuthGuardService],
    component: ProductGroupFormComponent,
  },
  {
    path: 'admin-product/group/form/:id',
    canActivate: [AuthGuardService],
    component: ProductGroupFormComponent,
  },

  // Commmerce service by cycle routes
  {
    path: 'commerce-service-by-cycle/service-by-cycle/list',
    canActivate: [AuthGuardService],
    component: CommerceServiceByCycleListComponent,
    data: {
      reuse: true,
    },
  },

  // Cluster routes
  {
    path: 'cluster/authorized-key/list',
    canActivate: [AuthGuardService],
    component: ClusterAuthorizedKeyListComponent,
    data: {
      reuse: true,
    },
  },

  // Collaborator routes
  {
    path: 'collaborator/page/list',
    canActivate: [AuthGuardService],
    component: CollaboratorPageListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'collaborator/publisher/list',
    canActivate: [AuthGuardService],
    component: CollaboratorPublisherListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'collaborator/product/list',
    canActivate: [AuthGuardService],
    component: CollaboratorProductListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'collaborator/page/dashboard',
    canActivate: [AuthGuardService],
    component: CollaboratorPageDashboardComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'core-connection/list',
    canActivate: [AuthGuardService],
    component: CoreConnectionListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'collaborator/page',
    canActivate: [AuthGuardService],
    component: CollaboratorPageComponent,
    children: [
      // {
      //   path: '',
      //   redirectTo: 'summary',
      //   pathMatch: 'full',
      // },
      // {
      //   path: 'summary',
      //   component: CollaboratorPageDashboardComponent,
      //   data: {
      //     reuse: true,
      //   },
      // },
      {
        path: 'report',
        component: CollaboratorPageReportComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'publisher/list',
        component: CollaboratorPublisherListComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'page-list',
        component: CollaboratorPageListComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'order/list',
        component: CollaboratorOrderListComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'order/form',
        component: CollaboratorOrderFormComponent,
      },
      {
        path: 'order/form/:id',
        component: CollaboratorOrderFormComponent,
      },
      {
        path: 'product/list',
        component: CollaboratorProductListComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'commission-payment/list',
        component: CollaboratorCommissionPaymentListComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'commission/list',
        component: CollaboratorCommissionListComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'award/list',
        component: CollaboratorAwardListComponent,
        data: {
          reuse: true,
        },
      },
    ]
  },
  {
    path: 'collaborator/education/article/list',
    canActivate: [AuthGuardService],
    component: CollaboratorEducationArticleListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'collaborator/publisher/dashboard',
    canActivate: [AuthGuardService],
    component: CollaboratorPublisherDashboardComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'collaborator/publisher',
    canActivate: [AuthGuardService],
    component: CollaboratorPublisherComponent,
    children: [
      {
        path: '',
        redirectTo: 'summary',
        pathMatch: 'full',
      },
      {
        path: 'summary',
        component: CollaboratorPublisherSummaryComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'report',
        component: CollaboratorPublisherReportComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'subscription-page/list',
        component: CollaboratorSubscriptionPageListComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'order/list',
        component: CollaboratorOrderListComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'product/list',
        component: CollaboratorSubscriptionProductComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'commission-payment/list',
        component: CollaboratorCommissionPaymentListComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'commission/list',
        component: CollaboratorCommissionListComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'award/list',
        component: CollaboratorAwardListComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'award/list',
        component: CollaboratorAwardListComponent,
        data: {
          reuse: true,
        },
      },
    ]
  },
  {
    path: 'collaborator/page-report',
    canActivate: [AuthGuardService],
    component: CollaboratorPageReportComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'collaborator/publisher-summary',
    canActivate: [AuthGuardService],
    component: CollaboratorPublisherSummaryComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'collaborator/publisher-report',
    canActivate: [AuthGuardService],
    component: CollaboratorPublisherReportComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'collaborator/order/list',
    canActivate: [AuthGuardService],
    component: CollaboratorOrderListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'collaborator/basic-strategy/list',
    canActivate: [AuthGuardService],
    component: CollaboratorBasicStrategyListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'collaborator/advance-strategy/list',
    canActivate: [AuthGuardService],
    component: CollaboratorAdvanceStrategyListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'collaborator/add-on-strategy/list',
    canActivate: [AuthGuardService],
    component: CollaboratorAddonStrategyListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'collaborator/rebuy-strategy/list',
    canActivate: [AuthGuardService],
    component: CollaboratorRebuyStrategyListComponent,
    data: {
      reuse: true,
    },
  },


  // Contact routes
  {
    path: 'contact',
    canActivate: [AuthGuardService],
    component: ContactListComponent,
    // data: {
    //   reuse: true,
    // },
    children: [
      {
        path: '',
        redirectTo: 'all',
        pathMatch: 'full',
      },
      {
        path: 'all',
        component: ContactAllListComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'customer',
        component: ContactCustomerListComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'supplier',
        component: ContactSupplierListComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'employee',
        component: ContactEmployeeListComponent,
        data: {
          reuse: true,
        },
      },
      {
        path: 'removed',
        component: ContactRemovedListComponent,
        data: {
          reuse: true,
        },
      },
    ],
  },
  // {
  //   path: 'contact/form',
  //   canActivate: [AuthGuardService],
  //   component: ContactFormComponent,
  // },
  // {
  //   path: 'contact/form/:id',
  //   canActivate: [AuthGuardService],
  //   component: ContactFormComponent,
  // },



  // Commerce POS route
  {
    path: 'commerce-pos/dashboard',
    canActivate: [AuthGuardService],
    component: CommercePosDashboardComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'commerce-pos/gui',
    canActivate: [AuthGuardService],
    component: CommercePosGuiComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'commerce-pos/order/list',
    canActivate: [AuthGuardService],
    component: CommercePosOrderListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'commerce-pos/return/list',
    canActivate: [AuthGuardService],
    component: CommercePosReturnListComponent,
    data: {
      reuse: true,
    },
  },
  //Wordpress

  {
    path: 'wordpress/sync-profile/list',
    canActivate: [AuthGuardService],
    component: WordpressSyncProfileListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'wordpress/product/list',
    canActivate: [AuthGuardService],
    component: WordpressProductListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'wordpress/order/list',
    canActivate: [AuthGuardService],
    component: WordpressOrderListComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'wordpress/order/form',
    canActivate: [AuthGuardService],
    component: WordpressOrderFormComponent,
  },
  {
    path: 'wordpress/order/form/:id',
    canActivate: [AuthGuardService],
    component: WordpressOrderFormComponent,
  },




  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module')
      .then(m => m.AuthModule),
  },
  {
    path: 'human-resource',
    // canActivate: [AuthGuardService],
    resolve: {
      configuration: RoutingResolve,
    },
    loadChildren: () => import('./modules/human-resource/human-resource.module')
      .then(m => m.HumanResourceModule),
  },
  // Sales
  // {
  //   path: 'sales',
  //   resolve: {
  //     configuration: RoutingResolve,
  //   },
  //   // canActivate: [AuthGuardService],
  //   loadChildren: () => import('./modules/sales/sales.module')
  //     .then(m => m.SalesModule),
  // },
  // Deployment
  // {
  //   path: 'deployment',
  //   resolve: {
  //     configuration: RoutingResolve,
  //   },
  //   // canActivate: [AuthGuardService],
  //   loadChildren: () => import('./modules/deployment/deployment.module')
  //     .then(m => m.DeploymentModule),
  // },
  // Purchase
  // {
  //   path: 'purchase',
  //   resolve: {
  //     configuration: RoutingResolve,
  //   },
  //   // canActivate: [AuthGuardService],
  //   loadChildren: () => import('./modules/purchase/purchase.module')
  //     .then(m => m.PurchaseModule),
  // },
  {
    path: 'ivoip',
    resolve: {
      configuration: RoutingResolve,
    },
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/ivoip/ivoip.module')
      .then(m => m.IvoipModule),
  },
  {
    path: 'web-hosting',
    resolve: {
      configuration: RoutingResolve,
    },
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/web-hosting/web-hosting.module')
      .then(m => m.WebHostingModule),
  },
  {
    path: 'users',
    resolve: {
      configuration: RoutingResolve,
    },
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/users/users.module')
      .then(m => m.UsersModule),
  },
  {
    path: 'modules',
    resolve: {
      configuration: RoutingResolve,
    },
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/modules/modules.module')
      .then(m => m.ModulesModule),
  },
  {
    path: 'menu',
    resolve: {
      configuration: RoutingResolve,
    },
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/menu/menu.module')
      .then(m => m.MenuModule),
  },
  {
    path: 'minierp',
    resolve: {
      configuration: RoutingResolve,
    },
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/minierp/minierp.module')
      .then(m => m.MinierpModule),
  },
  // {
  //   path: 'contact',
  //   resolve: {
  //     configuration: RoutingResolve,
  //   },
  //   // canActivate: [AuthGuardService],
  //   loadChildren: () => import('./modules/contact/contact.module')
  //     .then(m => m.ContactModule),
  // },
  {
    path: 'helpdesk',
    resolve: {
      configuration: RoutingResolve,
    },
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/helpdesk/helpdesk.module')
      .then(m => m.HelpdeskModule),
  },
  {
    path: 'sms',
    resolve: {
      configuration: RoutingResolve,
    },
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/sms/sms.module')
      .then(m => m.SmsModule),
  },
  {
    path: 'email-marketing',
    resolve: {
      configuration: RoutingResolve,
    },
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/email-marketing/email-marketing.module')
      .then(m => m.EmailMarketingModule),
  },
  {
    path: 'crawl',
    resolve: {
      configuration: RoutingResolve,
    },
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/crawl/crawl.module')
      .then(m => m.CrawlModule),
  },
  {
    path: 'wordpress',
    resolve: {
      configuration: RoutingResolve,
    },
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/wordpress/wordpress.module')
      .then(m => m.WordpressModule),
  },
  {
    path: 'network',
    resolve: {
      configuration: RoutingResolve,
    },
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/network/network.module')
      .then(m => m.NetworkModule),
  },
  {
    path: 'ads',
    resolve: {
      configuration: RoutingResolve,
    },
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/ads/ads.module')
      .then(m => m.AdsModule),
  },
  {
    path: 'short-link',
    resolve: {
      configuration: RoutingResolve,
    },
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/short-link/short-link.module')
      .then(m => m.ShortLinkModule),
  },
  {
    path: 'promotion',
    resolve: {
      configuration: RoutingResolve,
    },
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/promotion/promotion.module')
      .then(m => m.PromotionModule),
  },
  // {
  //   path: 'admin-product',
  //   resolve: {
  //     configuration: RoutingResolve,
  //   },
  //   // canActivate: [AuthGuardService],
  //   loadChildren: () => import('./modules/admin-product/admin-product.module')
  //     .then(m => m.AdminProductModule),
  // },
  {
    path: 'file',
    resolve: {
      configuration: RoutingResolve,
    },
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/file/file.module')
      .then(m => m.FileModule),
  },
  {
    path: 'system',
    resolve: {
      configuration: RoutingResolve,
    },
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/system/system.module')
      .then(m => m.SystemModule),
  },
  {
    path: 'virtual-phone',
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/virtual-phone/virtual-phone.module')
      .then(m => m.VirtualPhoneModule),
  },
  // Warehouse
  // {
  //   path: 'warehouse',
  //   resolve: {
  //     configuration: RoutingResolve,
  //   },
  //   // canActivate: [AuthGuardService],
  //   loadChildren: () => import('./modules/warehouse/warehouse.module')
  //     .then(m => m.WarehouseModule),
  // },
  // Zalo OA
  {
    path: 'zalo-oa',
    resolve: {
      configuration: RoutingResolve,
    },
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/zalo-oa/zalo-oa.module')
      .then(m => m.ZaloOaModule),
  },
  // Accounting
  // {
  //   path: 'accounting',
  //   resolve: {
  //     configuration: RoutingResolve,
  //   },
  //   // canActivate: [AuthGuardService],
  //   loadChildren: () => import('./modules/accounting/accounting.module')
  //     .then(m => m.AccountingModule),
  // },
  { path: '', redirectTo: 'mini-erp', pathMatch: 'full' },
  { path: '**', redirectTo: 'mini-erp' },
];
// .map(route => {
//   route['resolve'] = {
//     configuration: RoutingResolve,
//   };
//   return route;
// });

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
