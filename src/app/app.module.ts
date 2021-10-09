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
// import { ECommerceModule } from './modules/e-commerce/e-commerce.module';
// import { DashboardModule } from './modules/dashboard/dashboard.module';
// import { DialogModule } from './modules/dialog/dialog.module';
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
// import { AdminProductModule } from './modules/admin-product/admin-product.module';
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
// import { ProcessMap } from './models/process-map.model';
import { PurchaseGoodsFormComponent } from './modules/purchase/goods/purchase-goods-form/warehouse-goods-form.component';
import { PurchaseGoodsListComponent } from './modules/purchase/goods/purchase-goods-list/purchase-goods-list.component';
import { PurchaseGoodsPrintComponent } from './modules/purchase/goods/purchase-goods-print/purchase-goods-print.component';
import { ReferenceChoosingDialogComponent } from './modules/dialog/reference-choosing-dialog/reference-choosing-dialog.component';
import { DeploymentVoucherFormComponent } from './modules/deployment/deployment-voucher/deployment-voucher-form/deployment-voucher-form.component';
import { DeploymentVoucherListComponent } from './modules/deployment/deployment-voucher/deployment-voucher-list/deployment-voucher-list.component';
import { DeploymentVoucherPrintComponent } from './modules/deployment/deployment-voucher/deployment-voucher-print/deployment-voucher-print.component';
import { ProductCategoryFormComponent } from './modules/admin-product/category/product-category-form/product-category-form.component';
import { ProductCategoryListComponent } from './modules/admin-product/category/product-category-list/product-category-list.component';
import { ProductGroupFormComponent } from './modules/admin-product/product-group/product-group-form/product-group-form.component';
import { ProductGroupListComponent } from './modules/admin-product/product-group/product-group-list/product-group-list.component';
import { AssignCategoriesFormComponent } from './modules/admin-product/product/assign-categories-form/assign-categories-form.component';
import { ProductFormComponent } from './modules/admin-product/product/product-form/product-form.component';
import { ProductListComponent } from './modules/admin-product/product/product-list/product-list.component';
import { ProductUnitFormComponent } from './modules/admin-product/unit/product-unit-form/product-unit-form.component';
import { ProductUnitListComponent } from './modules/admin-product/unit/product-unit-list/product-unit-list.component';
import { AccountingLiabilitiesReportComponent } from './modules/accounting/reports/accounting-liabilities-report/accounting-liabilities-report.component';
import { AccountingReceivablesReportComponent } from './modules/accounting/reports/accounting-receivables-report/accounting-receivables-report.component';
import { AccountingReportComponent } from './modules/accounting/reports/accounting-report.component';
import { AccountingSummaryReportComponent } from './modules/accounting/reports/summary-report/accounting-summary-report.component';
import { ModulesComponent } from './modules/modules.component';
import { AccoungtingReceivablesFromCustomersReportComponent } from './modules/accounting/reports/accoungting-receivables-from-customers-report/accoungting-receivables-from-customers-report.component';
import { AccoungtingReceivablesFromEmployeeReportComponent } from './modules/accounting/reports/accoungting-receivables-from-employee-report/accoungting-receivables-from-employee-report.component';
import { AccoungtingProfitReportComponent } from './modules/accounting/reports/accoungting-profit-report/accoungting-profit-report.component';
import { AccoungtingDetailByObjectReportComponent } from './modules/accounting/reports/accoungting-detail-by-object-report/accoungting-detail-by-object-report.component';
import { AccountingOtherBusinessVoucherListComponent } from './modules/accounting/other-business-voucher/accounting-other-business-voucher-list/accounting-other-business-voucher-list.component';
import { AccountingOtherBusinessVoucherFormComponent } from './modules/accounting/other-business-voucher/accounting-other-business-voucher-form/accounting-other-business-voucher-form.component';
import { AccountingOtherBusinessVoucherPrintComponent } from './modules/accounting/other-business-voucher/accounting-other-business-voucher-print/accounting-other-business-voucher-print.component';
import { AccountingBankListComponent } from './modules/accounting/bank/accounting-bank-list/accounting-bank-list.component';
import { AccountingBankFormComponent } from './modules/accounting/bank/accounting-bank-form/accounting-bank-form.component';
import { AccountingBankAccountListComponent } from './modules/accounting/bank-account/accounting-bank-account-list/accounting-bank-account-list.component';
import { AccountingBankAccountFormComponent } from './modules/accounting/bank-account/accounting-bank-account-form/accounting-bank-account-form.component';
import { AccMasterBookListComponent } from './modules/accounting/master-book/acc-master-book-list/acc-master-book-list.component';
import { AccMasterBookFormComponent } from './modules/accounting/master-book/acc-master-book-form/acc-master-book-form.component';
import { AccMasterBookHeadAmountComponent } from './modules/accounting/master-book/acc-master-book-head-amount/acc-master-book-head-amount.component';
import { AccMasterBookHeadObjectAmountComponent } from './modules/accounting/master-book/acc-master-book-head-object-amount/acc-master-book-head-object-amount.component';
import { AccMasterBookHeadBankAccountAmountComponent } from './modules/accounting/master-book/acc-master-book-head-bank-account-amount/acc-master-book-head-bank-account-amount.component';
import { CommerceServiceByCycleListComponent } from './modules/commerce-service-by-cycle/service-by-cycle/commerce-service-by-cycle-list/commerce-service-by-cycle-list.component';
import { CommerceServiceByCycleFormComponent } from './modules/commerce-service-by-cycle/service-by-cycle/commerce-service-by-cycle-form/commerce-service-by-cycle-form.component';
import { ContactAllListComponent } from './modules/contact/contact-all-list/contact-all-list.component';
import { ContactRemovedListComponent } from './modules/contact/contact-removed-list/contact-removed-list.component';
import { ContactFormComponent } from './modules/contact/contact/contact-form/contact-form.component';
import { ContactListComponent } from './modules/contact/contact/contact-list/contact-list.component';
import { ContactCustomerListComponent } from './modules/contact/contact-customer-list/contact-customer-list.component';
import { ContactEmployeeListComponent } from './modules/contact/contact-employee-list/contact-employee-list.component';
import { ContactSupplierListComponent } from './modules/contact/contact-supplier-list/contact-supplier-list.component';
import { ClusterAuthorizedKeyListComponent } from './modules/cluster/authorized-key/cluster-authorized-key-list/cluster-authorized-key-list.component';
import { ClusterAuthorizedKeyFormComponent } from './modules/cluster/authorized-key/cluster-authorized-key-form/cluster-authorized-key-form.component';
import { CollaboratorPageListComponent } from './modules/collaborator/page/collaborator-page-list/collaborator-page-list.component';
import { CollaboratorPageFormComponent } from './modules/collaborator/page/collaborator-page-form/collaborator-page-form.component';
import { CollaboratorPublisherListComponent } from './modules/collaborator/publisher/collaborator-publisher-list/collaborator-publisher-list.component';
import { CollaboratorProductListComponent } from './modules/collaborator/product/collaborator-product-list/collaborator-product-list.component';
import { CollaboratorProductFormComponent } from './modules/collaborator/product/collaborator-product-form/collaborator-product-form.component';
import { CollaboratorProductCategoryListComponent } from './modules/collaborator/product-category/collaborator-product-category-list/collaborator-product-category-list.component';
import { CollaboratorProductCategoryFormComponent } from './modules/collaborator/product-category/collaborator-product-category-form/collaborator-product-category-form.component';
import { CollaboratorUnitListComponent } from './modules/collaborator/unit/collaborator-unit-list/collaborator-unit-list.component';
import { CollaboratorUnitFormComponent } from './modules/collaborator/unit/collaborator-unit-form/collaborator-unit-form.component';
import { CollaboratorOrderListComponent } from './modules/collaborator/order/collaborator-order-list/collaborator-order-list.component';
import { CollaboratorOrderFormComponent } from './modules/collaborator/order/collaborator-order-form/collaborator-order-form.component';
import { CollaboratorOrderPrintComponent } from './modules/collaborator/order/collaborator-order-print/collaborator-order-print.component';
import { CollaboratorPageReportComponent } from './modules/collaborator/collaborator-page-report/collaborator-page-report.component';
import { CollaboratorPublisherReportComponent } from './modules/collaborator/collaborator-publisher-report/collaborator-publisher-report.component';
import { CollaboratorPublisherSummaryComponent } from './modules/collaborator/collaborator-publisher-summary/collaborator-publisher-summary.component';
import { CollaboratorPageDashboardComponent } from './modules/collaborator/collaborator-page-dashboard/collaborator-page-dashboard.component';
import { CollaboratorPageComponent } from './modules/collaborator/collaborator-page/collaborator-page.component';
import { CollaboratorPublisherComponent } from './modules/collaborator/collaborator-publisher/collaborator-publisher.component';
// import { CollaboratorPagePreviewListComponent } from './modules/collaborator/page/collaborator-page-preview-list/collaborator-page-preview-list.component';
import { CollaboratorProductPreviewListComponent } from './modules/collaborator/product/collaborator-product-preview-list/collaborator-product-preview-list.component';
import { CollaboratorSubscriptionProductComponent } from './modules/collaborator/product/collaborator-subscription-product/collaborator-subscription-product.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { ContactsComponent } from './modules/dashboard/contacts/contacts.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { ElectricityChartComponent } from './modules/dashboard/electricity/electricity-chart/electricity-chart.component';
import { ElectricityComponent } from './modules/dashboard/electricity/electricity.component';
import { KittenComponent } from './modules/dashboard/kitten/kitten.component';
import { RoomSelectorComponent } from './modules/dashboard/rooms/room-selector/room-selector.component';
import { RoomsComponent } from './modules/dashboard/rooms/rooms.component';
import { SecurityCamerasComponent } from './modules/dashboard/security-cameras/security-cameras.component';
import { SolarComponent } from './modules/dashboard/solar/solar.component';
import { StatusCardComponent } from './modules/dashboard/status-card/status-card.component';
import { TemperatureDraggerComponent } from './modules/dashboard/temperature/temperature-dragger/temperature-dragger.component';
import { TemperatureComponent } from './modules/dashboard/temperature/temperature.component';
import { TrafficChartComponent } from './modules/dashboard/traffic/traffic-chart.component';
import { TrafficComponent } from './modules/dashboard/traffic/traffic.component';
import { WeatherComponent } from './modules/dashboard/weather/weather.component';
import { PlayerComponent } from './modules/dashboard/rooms/player/player.component';
import { TimingPipe } from './@theme/pipes';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartModule } from 'angular2-chartjs';
import { ChartPanelHeaderComponent } from './modules/e-commerce/charts-panel/chart-panel-header/chart-panel-header.component';
import { ChartPanelSummaryComponent } from './modules/e-commerce/charts-panel/chart-panel-summary/chart-panel-summary.component';
import { ECommerceChartsPanelComponent } from './modules/e-commerce/charts-panel/charts-panel.component';
import { ProfitChartComponent } from './modules/e-commerce/charts-panel/charts/profit-chart.component';
import { CountryOrdersChartComponent } from './modules/e-commerce/country-orders/chart/country-orders-chart.component';
import { CountryOrdersComponent } from './modules/e-commerce/country-orders/country-orders.component';
import { CountryOrdersMapComponent } from './modules/e-commerce/country-orders/map/country-orders-map.component';
import { EarningCardBackComponent } from './modules/e-commerce/earning-card/back-side/earning-card-back.component';
import { EarningPieChartComponent } from './modules/e-commerce/earning-card/back-side/earning-pie-chart.component';
import { EarningCardComponent } from './modules/e-commerce/earning-card/earning-card.component';
import { EarningCardFrontComponent } from './modules/e-commerce/earning-card/front-side/earning-card-front.component';
import { EarningLiveUpdateChartComponent } from './modules/e-commerce/earning-card/front-side/earning-live-update-chart.component';
import { ECommerceLegendChartComponent } from './modules/e-commerce/legend-chart/legend-chart.component';
import { ECommerceProgressSectionComponent } from './modules/e-commerce/progress-section/progress-section.component';
import { SlideOutComponent } from './modules/e-commerce/slide-out/slide-out.component';
import { TrafficBackCardComponent } from './modules/e-commerce/traffic-reveal-card/back-side/traffic-back-card.component';
import { TrafficBarChartComponent } from './modules/e-commerce/traffic-reveal-card/back-side/traffic-bar-chart.component';
import { TrafficBarComponent } from './modules/e-commerce/traffic-reveal-card/front-side/traffic-bar/traffic-bar.component';
import { TrafficFrontCardComponent } from './modules/e-commerce/traffic-reveal-card/front-side/traffic-front-card.component';
import { TrafficCardsHeaderComponent } from './modules/e-commerce/traffic-reveal-card/traffic-cards-header/traffic-cards-header.component';
import { TrafficRevealCardComponent } from './modules/e-commerce/traffic-reveal-card/traffic-reveal-card.component';
import { ECommerceUserActivityComponent } from './modules/e-commerce/user-activity/user-activity.component';
import { ECommerceVisitorsAnalyticsChartComponent } from './modules/e-commerce/visitors-analytics/visitors-analytics-chart/visitors-analytics-chart.component';
import { ECommerceVisitorsAnalyticsComponent } from './modules/e-commerce/visitors-analytics/visitors-analytics.component';
import { ECommerceVisitorsStatisticsComponent } from './modules/e-commerce/visitors-analytics/visitors-statistics/visitors-statistics.component';
import { StatsCardFrontComponent } from './modules/e-commerce/profit-card/front-side/stats-card-front.component';
import { StatsAreaChartComponent } from './modules/e-commerce/profit-card/back-side/stats-area-chart.component';
import { StatsBarAnimationChartComponent } from './modules/e-commerce/profit-card/front-side/stats-bar-animation-chart.component';
import { ProfitCardComponent } from './modules/e-commerce/profit-card/profit-card.component';
import { OrdersChartComponent } from './modules/e-commerce/charts-panel/charts/orders-chart.component';
import { StatsCardBackComponent } from './modules/e-commerce/profit-card/back-side/stats-card-back.component';
import { ECommerceComponent } from './modules/e-commerce/e-commerce.component';
import { SmartBotModule } from './modules/smart-bot/smart-bot.module';
import { ChartjsRadarComponent } from './modules/collaborator/collaborator-page-dashboard/chartjs-radar.component';
import { ChartjsBarHorizontalComponent } from './modules/collaborator/collaborator-page-dashboard/chartjs-bar-horizontal.component';
import { ChartjsBarComponent } from './modules/collaborator/collaborator-page-dashboard/chartjs-bar.component';
import { ChartjsLineComponent } from './modules/collaborator/collaborator-page-dashboard/chartjs-line.component';
import { ChartjsMultipleXaxisComponent } from './modules/collaborator/collaborator-page-dashboard/chartjs-multiple-xaxis.component';
import { ChartjsPieComponent } from './modules/collaborator/collaborator-page-dashboard/chartjs-pie.component';
import { MostActivePublishersComponent } from './modules/collaborator/collaborator-page-dashboard/most-active-publishers/most-active-publishers.component';
import { CollaboratorPublisherDashboardComponent } from './modules/collaborator/collaborator-publisher-dashboard/collaborator-publisher-dashboard.component';
import { MostActiveProductsComponent } from './modules/collaborator/collaborator-publisher-dashboard/most-active-products/most-active-products.component';
import { CollaboratorSubscriptionPageListComponent } from './modules/collaborator/page/collaborator-subscription-page-list/collaborator-subscription-page-list.component';
import { PublisherCommissionStatisticsComponent } from './modules/collaborator/collaborator-publisher-dashboard/publisher-commission-statistics.component';
import { PageCommissionStatisticsComponent } from './modules/collaborator/collaborator-page-dashboard/page-commission-statistics.component';
import { PageListComponent } from './modules/page/page-list/page-list.component';
import { PageFormComponent } from './modules/page/page-form/page-form.component';
import { CollaboratorCommissionListComponent } from './modules/collaborator/commission/collaborator-commission-list/collaborator-commission-list.component';
import { CollaboratorCommissionPrintComponent } from './modules/collaborator/commission/collaborator-commission-print/collaborator-commission-print.component';
import { CollaboratorCommissionPaymentListComponent } from './modules/collaborator/commission-payment/collaborator-commission-payment-list/collaborator-commission-payment-list.component';
import { CollaboratorCommissionPaymentFormComponent } from './modules/collaborator/commission-payment/collaborator-commission-payment-form/collaborator-commission-payment-form.component';
import { CollaboratorCommissionPaymentPrintComponent } from './modules/collaborator/commission-payment/collaborator-commission-payment-print/collaborator-commission-payment-print.component';
import { CollaboratorCommissionFormComponent } from './modules/collaborator/commission/collaborator-commission-form/collaborator-commission-form.component';
import { CollaboartorCommissionDetailComponent } from './modules/collaborator/commission/collaborator-commission-form/collaboartor-commission-detail/collaboartor-commission-detail.component';
import { CollaboratorPublisherFormComponent } from './modules/collaborator/publisher/collaborator-publisher-form/collaborator-publisher-form.component';
import { InputMaskModule } from '@ngneat/input-mask';
import { CollaboartorAwardDetailComponent } from './modules/collaborator/award/collaborator-award-form/collaboartor-award-detail/collaboartor-award-detail.component';
import { CollaboratorAwardFormComponent } from './modules/collaborator/award/collaborator-award-form/collaborator-award-form.component';
import { CollaboratorAwardListComponent } from './modules/collaborator/award/collaborator-award-list/collaborator-award-list.component';
import { CollaboratorAwardPrintComponent } from './modules/collaborator/award/collaborator-award-print/collaborator-award-print.component';
import { CollaboratorAwardDetailPrintComponent } from './modules/collaborator/award/collaborator-award-detail-print/collaborator-award-detail-print.component';
// import { InputMaskModule } from '@ngneat/input-mask';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;
registerLocaleData(localeVi, 'vi-VN', localeViExtra);

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

export class DynamicLocaleId extends String {
  constructor(
    public translate: TranslateService) {
    super();
  }

  toString() {
    return this.translate.currentLang;
  }
}

@NgModule({
  declarations: [
    AppComponent,

    // Dialog components
    ShowcaseDialogComponent,
    PlayerDialogComponent,
    DialogFormComponent,
    ReferenceChoosingDialogComponent,

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
    PurchaseGoodsFormComponent,
    PurchaseGoodsListComponent,
    PurchaseGoodsPrintComponent,

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
    AccountingReportComponent,
    AccountingLiabilitiesReportComponent,
    AccountingReceivablesReportComponent,
    AccountingSummaryReportComponent,
    AccoungtingReceivablesFromCustomersReportComponent,
    AccoungtingReceivablesFromEmployeeReportComponent,
    AccoungtingProfitReportComponent,
    AccoungtingDetailByObjectReportComponent,
    AccountingOtherBusinessVoucherListComponent,
    AccountingOtherBusinessVoucherFormComponent,
    AccountingOtherBusinessVoucherPrintComponent,
    AccountingBankListComponent,
    AccountingBankFormComponent,
    AccountingBankAccountListComponent,
    AccountingBankAccountFormComponent,
    AccMasterBookListComponent,
    AccMasterBookFormComponent,
    AccMasterBookHeadAmountComponent,
    AccMasterBookHeadObjectAmountComponent,
    AccMasterBookHeadBankAccountAmountComponent,


    // Deployment components
    DeploymentVoucherListComponent,
    DeploymentVoucherFormComponent,
    DeploymentVoucherPrintComponent,

    // Admin product components
    ProductListComponent,
    ProductFormComponent,
    ProductCategoryListComponent,
    ProductCategoryFormComponent,
    ProductUnitListComponent,
    ProductUnitFormComponent,
    AssignCategoriesFormComponent,
    ProductGroupListComponent,
    ProductGroupFormComponent,
    ModulesComponent,

    // Commerce service by cycle components
    CommerceServiceByCycleListComponent,
    CommerceServiceByCycleFormComponent,

    // Contact components

    ContactFormComponent,
    ContactListComponent,
    ContactSupplierListComponent,
    ContactCustomerListComponent,
    ContactEmployeeListComponent,
    ContactRemovedListComponent,
    ContactAllListComponent,
    ClusterAuthorizedKeyListComponent,
    ClusterAuthorizedKeyFormComponent,
    CollaboratorPageListComponent,
    CollaboratorPageFormComponent,
    CollaboratorPublisherListComponent,
    CollaboratorProductListComponent,
    CollaboratorProductFormComponent,
    CollaboratorProductCategoryListComponent,
    CollaboratorProductCategoryFormComponent,
    CollaboratorUnitListComponent,
    CollaboratorUnitFormComponent,
    CollaboratorOrderListComponent,
    CollaboratorOrderFormComponent,
    CollaboratorOrderPrintComponent,
    CollaboratorPageReportComponent,
    CollaboratorPublisherReportComponent,
    CollaboratorPublisherSummaryComponent,
    CollaboratorPageDashboardComponent,
    CollaboratorPageComponent,
    CollaboratorPublisherComponent,
    CollaboratorProductPreviewListComponent,
    CollaboratorSubscriptionProductComponent,


    DashboardComponent,
    StatusCardComponent,
    TemperatureDraggerComponent,
    ContactsComponent,
    RoomSelectorComponent,
    TemperatureComponent,
    RoomsComponent,
    KittenComponent,
    SecurityCamerasComponent,
    ElectricityComponent,
    ElectricityChartComponent,
    WeatherComponent,
    PlayerComponent,
    SolarComponent,
    TrafficComponent,
    TrafficChartComponent,

    ECommerceComponent,
    StatsCardFrontComponent,
    StatsAreaChartComponent,
    StatsBarAnimationChartComponent,
    ProfitCardComponent,
    ECommerceChartsPanelComponent,
    ChartPanelHeaderComponent,
    ChartPanelSummaryComponent,
    OrdersChartComponent,
    ProfitChartComponent,
    StatsCardBackComponent,
    TrafficRevealCardComponent,
    TrafficBarChartComponent,
    TrafficFrontCardComponent,
    TrafficBackCardComponent,
    TrafficBarComponent,
    TrafficCardsHeaderComponent,
    CountryOrdersComponent,
    CountryOrdersMapComponent,
    CountryOrdersChartComponent,
    ECommerceVisitorsAnalyticsComponent,
    ECommerceVisitorsAnalyticsChartComponent,
    ECommerceVisitorsStatisticsComponent,
    ECommerceLegendChartComponent,
    ECommerceUserActivityComponent,
    ECommerceProgressSectionComponent,
    SlideOutComponent,
    EarningCardComponent,
    EarningCardFrontComponent,
    EarningCardBackComponent,
    EarningPieChartComponent,
    EarningLiveUpdateChartComponent,

    ChartjsBarHorizontalComponent,
    ChartjsBarComponent,
    ChartjsLineComponent,
    ChartjsMultipleXaxisComponent,
    ChartjsPieComponent,
    ChartjsRadarComponent,
    MostActivePublishersComponent,

    CollaboratorPublisherDashboardComponent,
    MostActiveProductsComponent,

    CollaboratorSubscriptionPageListComponent,
    PublisherCommissionStatisticsComponent,
    PageCommissionStatisticsComponent,
    PageListComponent,
    PageFormComponent,
    CollaboratorCommissionListComponent,
    CollaboratorCommissionFormComponent,
    CollaboratorCommissionPrintComponent,
    CollaboratorCommissionPaymentListComponent,
    CollaboratorCommissionPaymentFormComponent,
    CollaboratorCommissionPaymentPrintComponent,
    CollaboartorCommissionDetailComponent,
    CollaboratorPublisherFormComponent,

    CollaboratorAwardListComponent,
    CollaboratorAwardFormComponent,
    CollaboratorAwardPrintComponent,
    CollaboartorAwardDetailComponent,
    CollaboratorAwardDetailPrintComponent,


  ],
  imports: [

    InputMaskModule,
    NgxEchartsModule,
    ChartModule,
    NgxChartsModule,
    LeafletModule,
    SmartBotModule,

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
    // CurrencyMaskModule,
    FormsModule,
    ReactiveFormsModule,
    // DialogModule,
    NbProgressBarModule,
    AgGridModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NbDialogModule.forChild(),
    SortablejsModule.forRoot({
      animation: 200,
    }),
    NgxMaskModule.forRoot(options),
    // TranslateModule,
    // AdminProductModule,
    NgxUploaderModule,
    NbSpinnerModule,


    NotificationModule,
    NbLayoutModule,
    // ECommerceModule,
    // DashboardModule,
    MobileAppModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NbCardModule,
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
    DialogFormComponent,
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
    // {
    //   provide: OWL_DATE_TIME_LOCALE,
    //   // useClass: DynamicLocaleId,
    //   // deps: [TranslateService],
    //   useValue: 'en-US'
    // },
    { provide: NbDialogRef, useValue: {} },
    { provide: CurrencyPipe, useValue: {} },
    { provide: DecimalPipe, useValue: {} },
    { provide: TimingPipe, useValue: {} },
    RoutingResolve,
  ],
})
export class AppModule {
  static processMaps = {
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
        confirmText: 'Common.approvedConfirm',
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
        confirmText: 'Common.approvedConfirm',
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
        confirmText: 'Common.approvedConfirm',
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
        confirmText: 'Common.approvedConfirm',
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
        confirmText: 'Common.approvedConfirm',
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
        confirmText: 'Common.approvedConfirm',
        responseTitle: 'Common.approved',
        restponseText: 'Common.approveSuccess',
      },
    },
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
    cashVoucher: {
      "APPROVED": {
        state: 'APPROVED',
        label: 'Common.approved',
        status: 'success',
        outline: true,
        nextState: 'UNRECORDED',
        nextStateLabel: 'Common.unbookkeeping',
        confirmText: 'Common.unbookkeepingConfirm',
        responseTitle: 'Common.unbookkeeping',
        restponseText: 'Common.unbookkeepingSuccess',
      },
      "APPROVALREQUESTED": {
        state: 'APPROVALREQUESTED',
        label: 'Common.approvedRequest',
        status: 'warning',
        outline: false,
        nextState: 'APPROVED',
        nextStateLabel: 'Common.approve',
        confirmText: 'Common.approvedConfirm',
        responseTitle: 'Common.approved',
        restponseText: 'Common.approveSuccess',
      },
      // "COMPLETE": {
      //   state: 'COMPLETE',
      //   label: 'Common.completed',
      //   status: 'success',
      //   outline: true,
      //   nextState: 'UNBOOKKEEPING',
      //   nextStateLabel: 'Common.unbookkeeping',
      //   confirmText: 'Common.unbookkeepingConfirm',
      //   responseTitle: 'Common.unbookkeeping',
      //   restponseText: 'Common.unbookkeepingSuccess',
      // },
      "UNRECORDED": {
        state: 'UNRECORDED',
        label: 'Common.unbookkeeped',
        status: 'warning',
        outline: true,
        nextState: 'APPROVED',
        nextStateLabel: 'Common.approve',
        confirmText: 'Common.approvedConfirm',
        responseTitle: 'Common.approved',
        restponseText: 'Common.approveSuccess',
      },
      "NOTJUSTAPPROVED": {
        state: 'NOTJUSTAPPROVED',
        label: 'Common.notJustApproved',
        status: 'danger',
        outline: false,
        nextState: 'APPROVED',
        nextStateLabel: 'Common.approve',
        confirmText: 'Common.approvedConfirm',
        responseTitle: 'Common.approved',
        restponseText: 'Common.approveSuccess',
      },
      "": {
        state: 'NOTJUSTAPPROVED',
        label: 'Common.notJustApproved',
        status: 'danger',
        outline: false,
        nextState: 'APPROVED',
        nextStateLabel: 'Common.approve',
        confirmText: 'Common.approvedConfirm',
        responseTitle: 'Common.approved',
        restponseText: 'Common.approveSuccess',
      },
    },
    commissionPaymentVoucher: {
      "APPROVALREQUESTED": {
        state: 'APPROVALREQUESTED',
        label: 'Common.approvedRequest',
        status: 'success',
        outline: false,
        nextState: '',
        nextStateLabel: 'Common.approvedRequest',
        confirmText: 'Common.approvedRequest',
        responseTitle: 'Common.approvedRequest',
        restponseText: 'Common.approvedRequest',
      },
      "APPROVED": {
        state: 'APPROVED',
        label: 'Common.approved',
        status: 'success',
        outline: true,
        nextState: 'UNRECORDED',
        nextStateLabel: 'Common.complete',
        confirmText: 'Common.completeConfirm',
        responseTitle: 'Common.completed',
        restponseText: 'Common.completeSuccess',
      },
      // "COMPLETE": {
      //   state: 'COMPLETE',
      //   label: 'Common.completed',
      //   status: 'success',
      //   outline: true,
      //   nextState: 'UNBOOKKEEPING',
      //   nextStateLabel: 'Common.unbookkeeping',
      //   confirmText: 'Common.unbookkeepingConfirm',
      //   responseTitle: 'Common.unbookkeeping',
      //   restponseText: 'Common.unbookkeepingSuccess',
      // },
      "UNRECORDED": {
        state: 'UNRECORDED',
        label: 'Common.unbookkeeped',
        status: 'warning',
        outline: true,
        nextState: 'APPROVALREQUESTED',
        nextStateLabel: 'Common.approvedRequest',
        confirmText: 'Common.approvedRequestConfirm',
        responseTitle: 'Common.approvedRequest',
        restponseText: 'Common.approvedRequestSuccess',
      },
      "NOTJUSTAPPROVED": {
        state: 'NOTJUSTAPPROVED',
        label: 'Common.notJustApproved',
        status: 'danger',
        outline: false,
        nextState: 'APPROVALREQUESTED',
        nextStateLabel: 'Common.approvedRequest',
        confirmText: 'Common.approvedRequestConfirm',
        responseTitle: 'Common.approvedRequest',
        restponseText: 'Common.approvedRequestSuccess',
      },
      "": {
        state: 'NOTJUSTAPPROVED',
        label: 'Common.notJustApproved',
        status: 'danger',
        outline: false,
        nextState: 'APPROVALREQUESTED',
        nextStateLabel: 'Common.approvedRequest',
        confirmText: 'Common.approvedRequestConfirm',
        responseTitle: 'Common.approvedRequest',
        restponseText: 'Common.approvedRequestSuccess',
      },
    },
    deploymentVoucher: {
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
        confirmText: 'Common.approvedConfirm',
        responseTitle: 'Common.approved',
        restponseText: 'Common.approveSuccess',
      },
    },
    accMasterBook: {
      "OPEN": {
        state: 'OPEN',
        label: 'Accounting.MasterBook.openLabel',
        status: 'success',
        outline: false,
        nextState: 'COMPLETE',
        nextStateLabel: 'Common.complete',
        confirmText: 'Accounting.MasterBook.State.OPEN.confirm',
        responseTitle: 'Common.completed',
        restponseText: 'Common.completeSuccess',
      },
      "LOCK": {
        state: 'LOCK',
        label: 'Accounting.MasterBook.lockLabel',
        status: 'success',
        outline: true,
        nextState: 'UNBOOKKEEPING',
        nextStateLabel: 'Common.unbookkeeping',
        confirmText: 'Accounting.MasterBook.State.LOCK.confirm',
        responseTitle: 'Common.unbookkeeping',
        restponseText: 'Common.unbookkeepingSuccess',
      },
      "CLOSE": {
        state: 'UNBOOKKEEPING',
        label: 'Accounting.MasterBook.closeLabel',
        status: 'warning',
        outline: true,
        nextState: 'APPROVE',
        nextStateLabel: 'Common.approve',
        confirmText: 'Accounting.MasterBook.State.CLOSE.confirm',
        responseTitle: 'Common.approved',
        restponseText: 'Common.approveSuccess',
      },
      "": {
        state: 'NOTJUSTOPEN',
        label: 'Accounting.MasterBook.notJustOpenLabel',
        status: 'danger',
        outline: false,
        nextState: 'APPROVE',
        nextStateLabel: 'Accounting.MasterBook.State.OPEN.label',
        confirmText: 'Accounting.MasterBook.State.OPEN.confirm',
        responseTitle: 'Common.approved',
        restponseText: 'Common.approveSuccess',
      },
    },
    commerceServiceByCycle: {
      "ACTIVE": {
        state: 'ACTIVE',
        label: 'Common.active',
        status: 'success',
        outline: false,
        nextState: 'INACTIVE',
        nextStateLabel: 'Common.inactive',
        confirmText: 'Common.inactiveConfirm',
        responseTitle: 'Common.inactivated',
        restponseText: 'Common.inactiveSuccess',
      },
      "EXPIRED": {
        state: 'EXPIRED',
        label: 'Common.expired',
        status: 'warning',
        outline: false,
        nextState: 'ACTIVE',
        nextStateLabel: 'Common.active',
        confirmText: 'Common.activeConfirm',
        responseTitle: 'Common.activated',
        restponseText: 'Common.activeSuccess',
      },
      "EXPIREDSOON": {
        state: 'EXPIREDSOON',
        label: 'Common.expiredSoon',
        status: 'warning',
        outline: false,
        nextState: 'ACTIVE',
        nextStateLabel: 'Common.active',
        confirmText: 'Common.activeConfirm',
        responseTitle: 'Common.activated',
        restponseText: 'Common.activeSuccess',
      },
      "OVEREXPIRED": {
        state: 'OVEREXPIRED',
        label: 'Common.overExpired',
        status: 'danger',
        outline: false,
        nextState: 'ACTIVE',
        nextStateLabel: 'Common.active',
        confirmText: 'Common.activeConfirm',
        responseTitle: 'Common.activated',
        restponseText: 'Common.activeSuccess',
      },
      "INACTIVE": {
        state: 'INACTIVE',
        label: 'Common.inactive',
        status: 'danger',
        outline: true,
        nextState: 'ACTIVE',
        nextStateLabel: 'Common.active',
        confirmText: 'Common.activeConfirm',
        responseTitle: 'Common.activated',
        restponseText: 'Common.activeSuccess',
      },
      "": {
        state: 'NOTJUSTACTIVE',
        label: 'Common.notjustactive',
        status: 'danger',
        outline: false,
        nextState: 'ACTIVE',
        nextStateLabel: 'Common.active',
        confirmText: 'Common.activeConfirm',
        responseTitle: 'Common.activated',
        restponseText: 'Common.activeSuccess',
      },
    },
    commissionVoucher: {
      "CONFIRMATIONREQUESTED": {
        state: 'CONFIRMATIONREQUESTED',
        label: 'Collaborator.Commission.confirmRequest',
        status: 'warning',
        outline: false,
        nextState: 'CONFIRMED',
        nextStateLabel: 'Common.confirm',
        confirmText: 'Common.confirmedConfirm',
        responseTitle: 'Common.confirm',
        restponseText: 'Common.confirmedSuccess',
      },
      "CONFIRMED": {
        state: 'CONFIRMED',
        label: 'Collaborator.Commission.confirmed',
        status: 'primary',
        outline: false,
        nextState: 'APPROVED',
        nextStateLabel: 'Common.approve',
        confirmText: 'Common.approvedConfirm',
        responseTitle: 'Common.approved',
        restponseText: 'Common.approved',
      },
      "APPROVED": {
        state: 'APPROVED',
        label: 'Common.approved',
        status: 'success',
        outline: true,
        nextState: 'NOTJUSTAPPROVED',
        nextStateLabel: 'Common.unbookkeeping',
        confirmText: 'Common.unbookkeepingConfirm',
        responseTitle: 'Common.unbookkeeping',
        restponseText: 'Common.unbookkeepingSuccess',
      },
      "NOTJUSTAPPROVED": {
        state: 'NOTJUSTAPPROVED',
        label: 'Common.notJustCofirmedRequest',
        status: 'danger',
        outline: false,
        nextState: 'CONFIRMATIONREQUESTED',
        nextStateLabel: 'Collaborator.Commission.confirmRequest',
        confirmText: 'Collaborator.Commission.confirmedRequest',
        responseTitle: 'Collaborator.Commission.confirmed',
        restponseText: 'Collaborator.Commission.confirmedSuccess',
      },
      "": {
        state: 'NOTJUSTAPPROVED',
        label: 'Common.notJustCofirmedRequest',
        status: 'danger',
        outline: false,
        nextState: 'CONFIRMATIONREQUESTED',
        nextStateLabel: 'Collaborator.Commission.confirmRequest',
        confirmText: 'Collaborator.Commission.confirmedRequest',
        responseTitle: 'Collaborator.Commission.confirmed',
        restponseText: 'Collaborator.Commission.confirmedSuccess',
      },
    },
    awardVoucher: {
      "CONFIRMATIONREQUESTED": {
        state: 'CONFIRMATIONREQUESTED',
        label: 'Collaborator.Commission.confirmRequest',
        status: 'warning',
        outline: false,
        nextState: 'CONFIRMED',
        nextStateLabel: 'Common.confirm',
        confirmText: 'Common.confirmedConfirm',
        responseTitle: 'Common.confirm',
        restponseText: 'Common.confirmedSuccess',
      },
      "CONFIRMED": {
        state: 'CONFIRMED',
        label: 'Collaborator.Commission.confirmed',
        status: 'primary',
        outline: false,
        nextState: 'APPROVED',
        nextStateLabel: 'Common.approve',
        confirmText: 'Common.approvedConfirm',
        responseTitle: 'Common.approved',
        restponseText: 'Common.approved',
      },
      "APPROVED": {
        state: 'APPROVED',
        label: 'Common.approved',
        status: 'success',
        outline: true,
        nextState: 'NOTJUSTAPPROVED',
        nextStateLabel: 'Common.unbookkeeping',
        confirmText: 'Common.unbookkeepingConfirm',
        responseTitle: 'Common.unbookkeeping',
        restponseText: 'Common.unbookkeepingSuccess',
      },
      "NOTJUSTAPPROVED": {
        state: 'NOTJUSTAPPROVED',
        label: 'Common.notJustCofirmedRequest',
        status: 'danger',
        outline: false,
        nextState: 'CONFIRMATIONREQUESTED',
        nextStateLabel: 'Collaborator.Commission.confirmRequest',
        confirmText: 'Collaborator.Commission.confirmedRequest',
        responseTitle: 'Collaborator.Commission.confirmed',
        restponseText: 'Collaborator.Commission.confirmedSuccess',
      },
      "": {
        state: 'NOTJUSTAPPROVED',
        label: 'Common.notJustCofirmedRequest',
        status: 'danger',
        outline: false,
        nextState: 'CONFIRMATIONREQUESTED',
        nextStateLabel: 'Collaborator.Commission.confirmRequest',
        confirmText: 'Collaborator.Commission.confirmedRequest',
        responseTitle: 'Collaborator.Commission.confirmed',
        restponseText: 'Collaborator.Commission.confirmedSuccess',
      },
    },
    collaboratoOrder: {
      "APPROVED": {
        state: 'APPROVED',
        label: 'Common.approved',
        status: 'success',
        outline: true,
        nextState: 'UNRECORDED',
        nextStateLabel: 'Common.unbookkeeping',
        confirmText: 'Common.unbookkeepingConfirm',
        responseTitle: 'Common.unbookkeeping',
        restponseText: 'Common.unbookkeepingSuccess',
      },
      // "COMPLETE": {
      //   state: 'COMPLETE',
      //   label: 'Common.completed',
      //   status: 'success',
      //   outline: true,
      //   nextState: 'UNBOOKKEEPING',
      //   nextStateLabel: 'Common.unbookkeeping',
      //   confirmText: 'Common.unbookkeepingConfirm',
      //   responseTitle: 'Common.unbookkeeping',
      //   restponseText: 'Common.unbookkeepingSuccess',
      // },
      "UNRECORDED": {
        state: 'UNRECORDED',
        label: 'Common.unbookkeeped',
        status: 'warning',
        outline: true,
        nextState: 'APPROVED',
        nextStateLabel: 'Common.approve',
        confirmText: 'Common.approvedConfirm',
        responseTitle: 'Common.approved',
        restponseText: 'Common.approveSuccess',
      },
      "NOTJUSTAPPROVED": {
        state: 'NOTJUSTAPPROVED',
        label: 'Common.notJustApproved',
        status: 'danger',
        outline: false,
        nextState: 'APPROVED',
        nextStateLabel: 'Common.approve',
        confirmText: 'Common.approvedConfirm',
        responseTitle: 'Common.approved',
        restponseText: 'Common.approveSuccess',
      },
      "": {
        state: 'NOTJUSTAPPROVED',
        label: 'Common.notJustApproved',
        status: 'danger',
        outline: false,
        nextState: 'APPROVE',
        nextStateLabel: 'Common.approve',
        confirmText: 'Common.approvedConfirm',
        responseTitle: 'Common.approved',
        restponseText: 'Common.approveSuccess',
      },
    },
  };
}
