/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { SmartBotModule } from './modules/smart-bot/smart-bot.module';
import { CookieService } from 'ngx-cookie-service';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { SortablejsModule } from 'ngx-sortablejs';
import { NbCardModule, NbRouteTabsetModule, NbIconModule, NbSpinnerModule, NbAccordionModule, NbActionsModule, NbButtonModule, NbCheckboxModule, NbInputModule, NbListModule, NbProgressBarModule, NbRadioModule, NbSelectModule, NbStepperModule, NbTabsetModule, NbUserModule, NbDialogRef, NbTagModule, NbTooltipModule, NbBadgeModule, NbButtonGroupModule } from '@nebular/theme';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LOCALE_ID, NgModule } from '@angular/core';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule, RoutingResolve } from './app-routing.module';
import {
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
} from '@nebular/theme';
import { ECommerceComponent } from './modules/e-commerce/e-commerce.component';
import { ContactListComponent } from './modules/contact/contact/contact-list/contact-list.component';
import { ShowcaseDialogComponent } from './modules/dialog/showcase-dialog/showcase-dialog.component';
import { ContactFormComponent } from './modules/contact/contact/contact-form/contact-form.component';
import { AgGridModule } from '@ag-grid-community/angular';
import { CommonModule, CurrencyPipe, DecimalPipe, registerLocaleData } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxUploaderModule } from '../vendor/ngx-uploader/src/public_api';
import { CustomElementModule } from './lib/custom-element/custom-element.module';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NbAuthModule, NbAuthOAuth2JWTToken, NbPasswordAuthStrategy } from '@nebular/auth';
import { environment } from '../environments/environment';
import { RouteReuseStrategy } from '@angular/router';
import { TimingPipe } from './@theme/pipes';
import { CustomRouteReuseStrategy } from './custom-route-reuse-stratery';
import { ApiInterceptor } from './services/api.service';
import { ContactAllListComponent } from './modules/contact/contact-all-list/contact-all-list.component';
import { ContactCustomerListComponent } from './modules/contact/contact-customer-list/contact-customer-list.component';
import { ContactEmployeeListComponent } from './modules/contact/contact-employee-list/contact-employee-list.component';
import { ContactRemovedListComponent } from './modules/contact/contact-removed-list/contact-removed-list.component';
import { ContactSupplierListComponent } from './modules/contact/contact-supplier-list/contact-supplier-list.component';
import { ProductCategoryFormComponent } from './modules/admin-product/category/product-category-form/product-category-form.component';
import { ProductCategoryListComponent } from './modules/admin-product/category/product-category-list/product-category-list.component';
import { ProductGroupFormComponent } from './modules/admin-product/product-group/product-group-form/product-group-form.component';
import { ProductGroupListComponent } from './modules/admin-product/product-group/product-group-list/product-group-list.component';
import { AssignCategoriesFormComponent } from './modules/admin-product/product/assign-categories-form/assign-categories-form.component';
import { ProductFormComponent } from './modules/admin-product/product/product-form/product-form.component';
import { ProductListComponent } from './modules/admin-product/product/product-list/product-list.component';
import { ProductUnitFormComponent } from './modules/admin-product/unit/product-unit-form/product-unit-form.component';
import { ProductUnitListComponent } from './modules/admin-product/unit/product-unit-list/product-unit-list.component';
import { ChartjsBarHorizontalComponent } from './modules/collaborator/collaborator-page-dashboard/chartjs-bar-horizontal.component';
import { ChartjsBarComponent } from './modules/collaborator/collaborator-page-dashboard/chartjs-bar.component';
import { ChartjsLineComponent } from './modules/collaborator/collaborator-page-dashboard/chartjs-line.component';
import { ChartjsMultipleXaxisComponent } from './modules/collaborator/collaborator-page-dashboard/chartjs-multiple-xaxis.component';
import { ChartjsPieComponent } from './modules/collaborator/collaborator-page-dashboard/chartjs-pie.component';
import { ChartjsRadarComponent } from './modules/collaborator/collaborator-page-dashboard/chartjs-radar.component';
import { CollaboratorPageDashboardComponent } from './modules/collaborator/collaborator-page-dashboard/collaborator-page-dashboard.component';
import { MostActivePublishersComponent } from './modules/collaborator/collaborator-page-dashboard/most-active-publishers/most-active-publishers.component';
import { PageCommissionStatisticsComponent } from './modules/collaborator/collaborator-page-dashboard/page-commission-statistics.component';
import { CollaboratorPageReportComponent } from './modules/collaborator/collaborator-page-report/collaborator-page-report.component';
import { CollaboratorPublisherDashboardComponent } from './modules/collaborator/collaborator-publisher-dashboard/collaborator-publisher-dashboard.component';
import { MostActiveProductsComponent } from './modules/collaborator/collaborator-publisher-dashboard/most-active-products/most-active-products.component';
import { PublisherCommissionStatisticsComponent } from './modules/collaborator/collaborator-publisher-dashboard/publisher-commission-statistics.component';
import { CollaboratorPublisherReportComponent } from './modules/collaborator/collaborator-publisher-report/collaborator-publisher-report.component';
import { CollaboratorPublisherSummaryComponent } from './modules/collaborator/collaborator-publisher-summary/collaborator-publisher-summary.component';
import { CollaboratorPublisherComponent } from './modules/collaborator/collaborator-publisher/collaborator-publisher.component';
import { CollaboratorOrderFormComponent } from './modules/collaborator/order/collaborator-order-form/collaborator-order-form.component';
import { CollaboratorOrderListComponent } from './modules/collaborator/order/collaborator-order-list/collaborator-order-list.component';
import { CollaboratorOrderPrintComponent } from './modules/collaborator/order/collaborator-order-print/collaborator-order-print.component';
import { CollaboratorPageFormComponent } from './modules/collaborator/page/collaborator-page-form/collaborator-page-form.component';
import { CollaboratorPageListComponent } from './modules/collaborator/page/collaborator-page-list/collaborator-page-list.component';
import { CollaboratorSubscriptionPageListComponent } from './modules/collaborator/page/collaborator-subscription-page-list/collaborator-subscription-page-list.component';
import { CollaboratorProductCategoryFormComponent } from './modules/collaborator/product-category/collaborator-product-category-form/collaborator-product-category-form.component';
import { CollaboratorProductCategoryListComponent } from './modules/collaborator/product-category/collaborator-product-category-list/collaborator-product-category-list.component';
import { CollaboratorProductFormComponent } from './modules/collaborator/product/collaborator-product-form/collaborator-product-form.component';
import { CollaboratorProductListComponent } from './modules/collaborator/product/collaborator-product-list/collaborator-product-list.component';
import { CollaboratorProductPreviewListComponent } from './modules/collaborator/product/collaborator-product-preview-list/collaborator-product-preview-list.component';
import { CollaboratorSubscriptionProductComponent } from './modules/collaborator/product/collaborator-subscription-product/collaborator-subscription-product.component';
import { CollaboratorPublisherListComponent } from './modules/collaborator/publisher/collaborator-publisher-list/collaborator-publisher-list.component';
import { CollaboratorUnitFormComponent } from './modules/collaborator/unit/collaborator-unit-form/collaborator-unit-form.component';
import { CollaboratorUnitListComponent } from './modules/collaborator/unit/collaborator-unit-list/collaborator-unit-list.component';
import { CommerceServiceByCycleFormComponent } from './modules/commerce-service-by-cycle/service-by-cycle/commerce-service-by-cycle-form/commerce-service-by-cycle-form.component';
import { CommerceServiceByCycleListComponent } from './modules/commerce-service-by-cycle/service-by-cycle/commerce-service-by-cycle-list/commerce-service-by-cycle-list.component';
import { ContactsComponent } from './modules/dashboard/contacts/contacts.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { ElectricityChartComponent } from './modules/dashboard/electricity/electricity-chart/electricity-chart.component';
import { ElectricityComponent } from './modules/dashboard/electricity/electricity.component';
import { KittenComponent } from './modules/dashboard/kitten/kitten.component';
import { PlayerComponent } from './modules/dashboard/rooms/player/player.component';
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
import { DeploymentVoucherFormComponent } from './modules/deployment/deployment-voucher/deployment-voucher-form/deployment-voucher-form.component';
import { DeploymentVoucherListComponent } from './modules/deployment/deployment-voucher/deployment-voucher-list/deployment-voucher-list.component';
import { DeploymentVoucherPrintComponent } from './modules/deployment/deployment-voucher/deployment-voucher-print/deployment-voucher-print.component';
import { DialogFormComponent } from './modules/dialog/dialog-form/dialog-form.component';
import { PlayerDialogComponent } from './modules/dialog/player-dialog/player-dialog.component';
import { ReferenceChoosingDialogComponent } from './modules/dialog/reference-choosing-dialog/reference-choosing-dialog.component';
import { ModulesComponent } from './modules/minierp/modules/modules.component';
import { PageFormComponent } from './modules/page/page-form/page-form.component';
import { PageListComponent } from './modules/page/page-list/page-list.component';
import { PurchaseGoodsFormComponent } from './modules/purchase/goods/purchase-goods-form/warehouse-goods-form.component';
import { PurchaseGoodsListComponent } from './modules/purchase/goods/purchase-goods-list/purchase-goods-list.component';
import { PurchaseGoodsPrintComponent } from './modules/purchase/goods/purchase-goods-print/purchase-goods-print.component';
import { PurchaseOrderVoucherFormComponent } from './modules/purchase/order/purchase-order-voucher-form/purchase-order-voucher-form.component';
import { PurchaseOrderVoucherListComponent } from './modules/purchase/order/purchase-order-voucher-list/purchase-order-voucher-list.component';
import { PurchaseOrderVoucherPrintComponent } from './modules/purchase/order/purchase-order-voucher-print/purchase-order-voucher-print.component';
import { PurchasePriceTableFormComponent } from './modules/purchase/price-table/purchase-price-table-form/purchase-price-table-form.component';
import { PurchasePriceTableImportComponent } from './modules/purchase/price-table/purchase-price-table-import/purchase-price-table-import.component';
import { PurchasePriceTableListComponent } from './modules/purchase/price-table/purchase-price-table-list/purchase-price-table-list.component';
import { PurchasePriceTablePrintComponent } from './modules/purchase/price-table/purchase-price-table-print/purchase-price-table-print.component';
import { PurchaseSimpleVoucherFormComponent } from './modules/purchase/voucher/purchase-simple-voucher-form/purchase-simple-voucher-form.component';
import { PurchaseVoucherFormComponent } from './modules/purchase/voucher/purchase-voucher-form/purchase-voucher-form.component';
import { PurchaseVoucherListComponent } from './modules/purchase/voucher/purchase-voucher-list/purchase-voucher-list.component';
import { PurchaseVoucherPrintComponent } from './modules/purchase/voucher/purchase-voucher-print/purchase-voucher-print.component';
import localeVi from '@angular/common/locales/vi';
import localeViExtra from '@angular/common/locales/extra/vi';
import { LibSystemModule } from './lib/lib-system.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { ChartModule } from 'angular2-chartjs';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { InputMaskModule } from '@ngneat/input-mask';
import { ClusterAuthorizedKeyFormComponent } from './modules/cluster/authorized-key/cluster-authorized-key-form/cluster-authorized-key-form.component';
import { ClusterAuthorizedKeyListComponent } from './modules/cluster/authorized-key/cluster-authorized-key-list/cluster-authorized-key-list.component';
import { TreeModule } from 'angular-tree-component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { AngularFireModule } from '@angular/fire/compat';
import { ProcessMap } from './models/process-map.model';
import { DynamicListDialogComponent } from './modules/dialog/dynamic-list-dialog/dynamic-list-dialog.component';
import { CollaboratorOrderTeleCommitFormComponent } from './modules/collaborator/order/collaborator-order-tele-commit/collaborator-order-tele-commit.component';
import { CollaboratorOrderTeleCommitPrintComponent } from './modules/collaborator/order/collaborator-order-tele-commit-print/collaborator-order-tele-commit-print.component';
import { CommercePosGuiComponent } from './modules/commerce-pos/gui/commerce-pos-gui/commerce-pos-gui.component';
import { CommercePosOrderFormComponent } from './modules/commerce-pos/commerce-pos-order/commerce-pos-order-form/commerce-pos-order-form.component';
import { CommercePosOrderPrintComponent } from './modules/commerce-pos/commerce-pos-order/commerce-pos-order-print/commerce-pos-order-print.component';
import { CommercePosOrderListComponent } from './modules/commerce-pos/commerce-pos-order/commerce-pos-order-list/commerce-pos-order-list.component';
import { CommercePosBillPrintComponent } from './modules/commerce-pos/gui/commerce-pos-order-print/commerce-pos-bill-print.component';
import { CommercePosReturnsPrintComponent } from './modules/commerce-pos/gui/commerce-pos-returns-print/commerce-pos-returns-print.component';
import { CommercePosPaymnentPrintComponent } from './modules/commerce-pos/gui/commerce-pos-payment-print/commerce-pos-payment-print.component';
import { CommercePosReturnFormComponent } from './modules/commerce-pos/commerce-pos-return/commerce-pos-return-form/commerce-pos-return-form.component';
import { CommercePosReturnListComponent } from './modules/commerce-pos/commerce-pos-return/commerce-pos-return-list/commerce-pos-return-list.component';
import { CommercePosReturnPrintComponent } from './modules/commerce-pos/commerce-pos-return/commerce-pos-return-print/commerce-pos-return-print.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommercePosDashboardComponent } from './modules/commerce-pos/commerce-pos-dashboard/commerce-pos-dashboard.component';
import { CommercePosDeploymentVoucherPrintComponent } from './modules/commerce-pos/gui/commerce-pos-deployment-voucher-print/commerce-pos-deployment-voucher-print.component';
import { PurchaseDashboardComponent } from './modules/purchase/purchase-dashboard/purchase-dashboard.component';
import { NgxBarcodeModule } from 'ngx-barcode';
import { CoreConnectionListComponent } from './modules/core-connection/core-connection-list/core-connection-list.component';
import { CoreConnectionFormComponent } from './modules/core-connection/core-connection-form/core-connection-form.component';
import { ImportProductDialogComponent } from './modules/admin-product/product/import-products-dialog/import-products-dialog.component';
import { ProductBrandListComponent } from './modules/admin-product/brand/product-brand-list/product-brand-list.component';
import { ProductBrandFormComponent } from './modules/admin-product/brand/product-brand-form/product-brand-form.component';
import { ProductPropertyListComponent } from './modules/admin-product/property/product-property-list/product-property-list.component';
import { ProductPropertyFormComponent } from './modules/admin-product/property/product-property-form/product-property-form.component';
import { ImportProductMapFormComponent } from './modules/admin-product/product/import-product-map-form/import-product-map-form.component';
import { ProductObjectReferenceListComponent } from './modules/admin-product/product-object-reference/product-object-reference-list/product-object-reference-list.component';
import { ProductObjectReferenceFormComponent } from './modules/admin-product/product-object-reference/product-object-reference-form/product-object-reference-form.component';
import { ProductKeywordListComponent } from './modules/admin-product/keyword/product-keyword-list/product-keyword-list.component';
import { ProductKeywordFormComponent } from './modules/admin-product/keyword/product-keyword-form/product-keyword-form.component';
import { PurchaseProductListComponent } from './modules/purchase/product/purchase-product-list/purchase-product-list.component';
import { PurchaseProductFormComponent } from './modules/purchase/product/purchase-product-form/purchase-product-form.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { WordpressSyncProfileListComponent } from './modules/wordpress/sync-profile/sync-profile-list/sync-profile-list.component';
import { WordpressSyncProfileFormComponent } from './modules/wordpress/sync-profile/sync-profile-form/sync-profile-form.component';
import { WordpressProductListComponent } from './modules/wordpress/product/product-list/product-list.component';
import { WordpressProductFormComponent } from './modules/wordpress/product/product-form/product-form.component';
import { WordpressSyncProfilePreviewComponent } from './modules/wordpress/sync-profile/sync-profile-preview/sync-profile-preview.component';
import { WordpressOrderListComponent } from './modules/wordpress/order/order-list/order-list.component';
import { WordpressOrderFormComponent } from './modules/wordpress/order/order-form/order-form.component';
import { WordpressOrderPrintComponent } from './modules/wordpress/order/order-print/order-print.component';
import { AgDynamicListComponent } from './modules/general/ag-dymanic-list/ag-dymanic-list.component';
import { MktMemberCardListComponent } from './modules/marketing/member-card/member-card-list/member-card-list.component';
import { MktMemberCardFormComponent } from './modules/marketing/member-card/member-card-form/member-card-form.component';
import { MktMemberCardPrintComponent } from './modules/marketing/member-card/member-card-print/member-card-print.component';
import { collaboratorComponents } from './modules/collaborator/collaborator.module';
import { MentionModule } from 'angular-mentions';
import { saleComponents } from './modules/sales/sales.module';
import { ProductListV1Component } from './modules/admin-product/product/product-list-v1/product-list.component';
import { accountingComponents } from './modules/accounting/accounting.module';
import { warehouseComponents } from './modules/warehouse/warehouse.module';
import { systemComponents } from './modules/system/system.module';
import { userComponents } from './modules/users/users.module';

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
    ...saleComponents,

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
    PurchaseDashboardComponent,
    PurchaseProductListComponent,
    PurchaseProductFormComponent,

    // Warehouse components
    ...warehouseComponents,


    // Accounting components
    ...accountingComponents,

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
    ImportProductDialogComponent,
    ProductGroupListComponent,
    ProductGroupFormComponent,
    ModulesComponent,
    ProductBrandListComponent,
    ProductBrandFormComponent,
    ProductPropertyListComponent,
    ProductPropertyFormComponent,
    ImportProductMapFormComponent,
    ProductObjectReferenceListComponent,
    ProductObjectReferenceFormComponent,
    ProductKeywordListComponent,
    ProductKeywordFormComponent,
    ProductListV1Component,

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
    // CollaboratorPageComponent,
    CollaboratorPublisherComponent,
    CollaboratorProductPreviewListComponent,
    CollaboratorSubscriptionProductComponent,
    CollaboratorOrderTeleCommitFormComponent,
    CollaboratorOrderTeleCommitPrintComponent,
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

    // Collaborator
    ...collaboratorComponents,

    DynamicListDialogComponent,

    // Commerce POS
    CommercePosGuiComponent,
    CommercePosBillPrintComponent,
    CommercePosReturnsPrintComponent,
    CommercePosPaymnentPrintComponent,
    CommercePosOrderFormComponent,
    CommercePosOrderListComponent,
    CommercePosOrderPrintComponent,
    CommercePosReturnFormComponent,
    CommercePosReturnListComponent,
    CommercePosReturnPrintComponent,
    CommercePosDashboardComponent,
    // CommercePosDashboardStatisticsComponent,
    CommercePosDeploymentVoucherPrintComponent,

    // Ag-Grid components
    // BtnCellRenderer,

    // Core connection
    CoreConnectionListComponent,
    CoreConnectionFormComponent,

    // Wordpress
    WordpressSyncProfileListComponent,
    WordpressSyncProfileFormComponent,
    WordpressProductListComponent,
    WordpressProductFormComponent,
    WordpressSyncProfilePreviewComponent,
    WordpressOrderListComponent,
    WordpressOrderFormComponent,
    WordpressOrderPrintComponent,

    // Marketing
    MktMemberCardListComponent,
    MktMemberCardFormComponent,
    MktMemberCardPrintComponent,

    // General components
    AgDynamicListComponent,

    ...systemComponents,
    ...userComponents,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
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
    ThemeModule.forRoot(),

    NbCardModule,
    NbRouteTabsetModule,
    NbIconModule,
    NbTagModule,
    NbTooltipModule,
    NbSpinnerModule,
    NgxEchartsModule,
    ChartModule,
    LeafletModule,
    InputMaskModule,
    CKEditorModule,
    CurrencyMaskModule,
    TreeModule.forRoot(),

    // Vendors
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    AngularFireModule.initializeApp(environment.firebase),

    // My Lib
    CustomElementModule,
    LibSystemModule,
    SmartBotModule,
    ScrollingModule,

    // Form List Form Components
    CommonModule,
    NbTabsetModule,
    Ng2SmartTableModule,
    NbInputModule,
    NbCheckboxModule,
    NbStepperModule,
    NbButtonModule,
    NbButtonGroupModule,
    NbListModule,
    NbAccordionModule,
    NbUserModule,
    MentionModule,
    NbSelectModule,
    NbActionsModule,
    NbRadioModule,
    NbBadgeModule,
    FormsModule,
    ReactiveFormsModule,
    NbProgressBarModule,
    AgGridModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    SortablejsModule.forRoot({
      animation: 200,
    }),
    NgxMaskModule.forRoot(options),
    NgxUploaderModule,

    NgxBarcodeModule.forRoot(),
    NgxQRCodeModule,

    // Photo browser
    // AngularImageViewerModule,

    // Modules
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
          // refreshToken: false
          refreshToken: {
            method: 'post',
            endpoint: '/user/login/refresh',
            requireValidToken: false,
            redirect: {
              success: null,
              failure: null,
            },
          },
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
    { provide: NbDialogRef, useValue: {} },
    { provide: CurrencyPipe, useValue: {} },
    { provide: DecimalPipe, useValue: {} },
    { provide: TimingPipe, useValue: {} },
    RoutingResolve,
  ],
})
export class AppModule {

  static newState: ProcessMap = {
    state: 'NEW',
    label: 'Mới',
    confirmLabel: 'Mới',
    status: 'success',
    outline: false,
    confirmTitle: 'Chuyển sang trạng thái MỚI',
    confirmText: 'Bạn có muốn chuyển sang trạng thái MỚI',
    responseTitle: 'Đã chuyển sang trạng thái MỚI',
    responseText: 'Đã chuyển sang trạng thái mới',
  };
  static approvedState: ProcessMap = {
    state: 'APPROVED',
    label: 'Common.approved',
    confirmLabel: 'Common.approve',
    status: 'success',
    outline: true,
    confirmTitle: 'Common.approve',
    confirmText: 'Common.approvedConfirm',
    responseTitle: 'Common.approved',
    responseText: 'Common.approved',
  };
  static priceReportState: ProcessMap = {
    state: 'PRICEREPORT',
    label: 'Báo giá',
    confirmLabel: 'Báo giá',
    status: 'primary',
    outline: true,
    confirmTitle: 'Báo giá',
    confirmText: 'Bạn có muốn báo giá',
    responseTitle: 'Đã báo giá',
    responseText: 'Đã báo giá',
  };
  static proccessingState: ProcessMap = {
    state: 'PROCESSING',
    label: 'Common.processing',
    confirmLabel: 'Common.process',
    status: 'danger',
    outline: false,
    confirmTitle: 'Common.processingConfirmTitle',
    confirmText: 'Common.processedConfirmText',
    responseTitle: 'Common.processingResponseTitle',
    responseText: 'Common.processingResponseText',
  };
  static unrecordedState: ProcessMap = {
    state: 'UNRECORDED',
    status: 'warning',
    label: 'Common.unrecorded',
    confirmLabel: 'Common.unrecord',
    confirmTitle: 'Common.unrecorded',
    confirmText: 'Common.unrecordedConfirm',
    responseTitle: 'Common.unrecorded',
    responseText: 'Common.unrecordedResponse',
  };
  static confirmedState: ProcessMap = {
    state: 'CONFIRMED',
    status: 'primary',
    label: 'Common.confirmed',
    confirmLabel: 'Common.confirm',
    confirmTitle: 'Common.confirm',
    confirmText: 'Common.confirmedConfirm',
    responseTitle: 'Common.confirm',
    responseText: 'Common.confirmedSuccess',
  };
  static notJustApprodedState: ProcessMap = {
    state: 'NOTJUSTAPPROVED',
    label: 'Common.notJustApproved',
    confirmLabel: 'Common.unApprove',
    status: 'warning',
    outline: false,
    confirmTitle: 'Common.unApprove',
    confirmText: 'Common.unApproveConfirmText',
    responseTitle: 'Common.unApprove',
    responseText: 'Common.unApproveSuccessText',
  };
  static inQueueState: ProcessMap = {
    state: 'INQUEUE',
    label: 'Hàng đợi',
    confirmLabel: 'Chuyển sang hàng đợi',
    status: 'warning',
    outline: false,
    confirmTitle: 'Chuyển sang hàng đợi',
    confirmText: 'Bạn có muốn chuyển sang trạng thái đợi ?',
    responseTitle: 'Đã chuyển sang hàng đợi',
    responseText: 'Đã chuyển sang hàng đợi thành công',
  };
  static queueState: ProcessMap = {
    state: 'QUEUE',
    label: 'Chờ xử lý',
    confirmLabel: 'Đẩy vào hàng đợi',
    status: 'warning',
    outline: false,
    confirmTitle: 'Chuyển sang hàng đợi',
    confirmText: 'Bạn có muốn chuyển sang trạng thái đợi ?',
    responseTitle: 'Đã chuyển sang hàng đợi',
    responseText: 'Đã chuyển sang hàng đợi thành công',
  };
  static confirmationRequestedState: ProcessMap = {
    state: 'CONFIRMATIONREQUESTED',
    label: 'Common.confirmRequested',
    confirmLabel: 'Common.confirmationRequest',
    status: 'info',
    outline: false,
    confirmTitle: 'Common.confirmationRequeset',
    confirmText: 'Common.confirmationRequesetedConfirmText',
    responseTitle: 'Common.confirmationRequeseted',
    responseText: 'Common.confirmationRequesetedResponseText',
  };
  static acceptanceState: ProcessMap = {
    state: 'ACCEPTANCE',
    label: 'Common.acceptance',
    confirmLabel: 'Common.acceptance',
    status: 'info',
    outline: false,
    confirmTitle: 'Common.acceptance',
    nextStateLabel: 'Common.acceptance',
    confirmText: 'Common.acceptanceConfirm',
    responseTitle: 'Common.acceptanced',
    responseText: 'Common.acceptanceSuccess',
  };
  static completeState: ProcessMap = {
    state: 'COMPLETED',
    label: 'Common.completed',
    confirmLabel: 'Common.complete',
    status: 'basic',
    outline: true,
    nextState: '',
    nextStateLabel: '',
    confirmText: 'Common.completeConfirm',
    responseTitle: 'Common.completed',
    responseText: 'Common.completeSuccess',
  };
  static returnState: ProcessMap = {
    state: 'RETURN',
    label: 'Trả hàng',
    confirmLabel: 'Trả hàng',
    status: 'danger',
    outline: true,
    nextState: '',
    nextStateLabel: '',
    confirmText: 'Bạn có muốn chuyển sang trạng thái trả hàng',
    responseTitle: 'Trả hàng',
    responseText: 'Đã chuyển sang trạng thái trả hàng',
  };
  static transportState: ProcessMap = {
    state: 'TRANSPORT',
    label: 'Đang vận chuyển',
    confirmLabel: 'Vận chuyển',
    status: 'primary',
    outline: true,
    nextState: '',
    nextStateLabel: '',
    confirmText: 'Bạn có muốn chuyển sang trạng thái đang vận chuyển',
    responseTitle: 'Đang vận chuyển',
    responseText: 'Đã chuyển sang trạng thái đang vận chuyển',
  };
  static deliveredState: ProcessMap = {
    state: 'DELIVERED',
    label: 'Đã giao hàng',
    confirmLabel: 'Đã giao hàng',
    status: 'success',
    outline: true,
    nextState: '',
    nextStateLabel: '',
    confirmText: 'Bạn có muốn chuyển sang trạng thái đã giao hàng',
    responseTitle: 'Đã giao hàng',
    responseText: 'Đã chuyển sang trạng thái đã giao hàng',
  };
  static depploymentState: ProcessMap = {
    state: 'DEPLOYMENT',
    label: 'Common.deploying',
    confirmLabel: 'Common.deploy',
    status: 'primary',
    outline: false,
    confirmTitle: 'Common.deployed',
    nextStateLabel: 'Common.deploy',
    confirmText: 'Common.deployedConfirm',
    responseTitle: 'Common.deployed',
    responseText: 'Common.deployedSuccess',
  };
  static deployedState: ProcessMap = {
    state: 'DEPLOYED',
    label: 'Đã triển khai',
    confirmLabel: 'Hoàn tất triển khai',
    status: 'primary',
    outline: false,
    confirmTitle: 'Hoàn tất triển khai',
    confirmText: 'Bạn có muốn hoàn tất triển khai ?',
    responseTitle: 'Hoàn tất triển khai',
    responseText: 'Đã hoàn tất triển khai !',
  };
  static depploymentedState: ProcessMap = {
    state: 'DEPLOYMENTED',
    label: 'Common.deployed',
    confirmLabel: 'Common.deploy',
    status: 'primary',
    outline: false,
    confirmTitle: 'Common.deployed',
    nextStateLabel: 'Common.deploy',
    confirmText: 'Common.deployedConfirm',
    responseTitle: 'Common.deployed',
    responseText: 'Common.deployedSuccess',
  };
  static approvalRequestedState: ProcessMap = {
    state: 'APPROVALREQUESTED',
    label: 'Common.approvedRequest',
    confirmLabel: 'Common.approvedRequest',
    status: 'warning',
    outline: false,
    nextState: '',
    nextStateLabel: 'Common.approvedRequest',
    confirmText: 'Common.approvedRequest',
    responseTitle: 'Common.approvedRequest',
    responseText: 'Common.approvedRequest',
  };
  // static paymentState: ProcessMap = {
  //   state: 'PAYMENT',
  //   label: 'Common.payment',
  //   confirmLabel: 'Common.approvedRequest',
  //   status: 'warning',
  //   outline: false,
  //   nextState: '',
  //   nextStateLabel: 'Common.approvedRequest',
  //   confirmText: 'Common.approvedRequest',
  //   responseTitle: 'Common.approvedRequest',
  //   responseText: 'Common.approvedRequest',
  // };

  static distributedState: ProcessMap = {
    state: 'DISTRIBUTED',
    label: 'Đã phát hành',
    confirmLabel: 'Bạn có muốn phát hành',
    status: 'info',
    outline: true,
    confirmTitle: 'Bạn có muốn phát hành',
    confirmText: 'Bạn có muốn phát hành',
    responseTitle: 'Đã phát hành',
    responseText: 'Đã phát hành',
  };
  static assignedState: ProcessMap = {
    state: 'ASSIGNED',
    label: 'Đã cấp phát',
    confirmLabel: 'Bạn có muốn cấp phát',
    status: 'success',
    outline: true,
    confirmTitle: 'Bạn có muốn cấp phát',
    confirmText: 'Bạn có muốn cấp phát',
    responseTitle: 'Đã cấp phát',
    responseText: 'Đã cấp phát',
  };
  static notJustDistributedState: ProcessMap = {
    state: 'NOTJUSTDISTRIBUTED',
    status: 'warning',
    label: 'Chưa phát hành',
    confirmLabel: 'Hủy phát hành',
    confirmTitle: 'Bạn có muốn hủy phát hành ?',
    confirmText: 'Bạn có muốn hủy phát hành ?',
    responseTitle: 'Đã hủy phát hành',
    responseText: 'Đã hủy phát hành',
  };
  static lockedState: ProcessMap = {
    state: 'LOCKED',
    status: 'danger',
    label: 'Đã khóa',
    confirmLabel: 'Khóa',
    confirmTitle: 'Bạn có muốn khóa ?',
    confirmText: 'Bạn có muốn khóa ?',
    responseTitle: 'Đã khóa',
    responseText: 'Đã khóa',
  };

  static processMaps = {
    common: {
      "APPROVED": {
        ...AppModule.approvedState,
        nextState: 'NOTJUSTAPPROVED',
        nextStates: [
          { ...AppModule.notJustApprodedState, status: 'warning' },
        ],
      },
      "NOTJUSTAPPROVED": {
        ...AppModule.notJustApprodedState,
        state: 'NOTJUSTAPPROVED',
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
        ],
      },
      "COMPLETE": {
        ...AppModule.completeState,
        nextState: 'UNRECORDED',
        nextStates: [
          AppModule.unrecordedState,
        ],
      },
      "UNRECORDED": {
        ...AppModule.unrecordedState,
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
          AppModule.unrecordedState,
        ],
      },
      "": {
        ...AppModule.notJustApprodedState,
        state: 'NOTJUSTAPPROVED',
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
        ],
      },
    },
    masterPriceTable: {
      "APPROVED": {
        ...AppModule.approvedState,
        nextState: 'NOTJUSTAPPROVED',
        nextStates: [
          { ...AppModule.notJustApprodedState, status: 'warning' },
        ],
      },
      "NOTJUSTAPPROVED": {
        ...AppModule.notJustApprodedState,
        state: 'NOTJUSTAPPROVED',
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
        ],
      },
      "": {
        ...AppModule.notJustApprodedState,
        state: 'NOTJUSTAPPROVED',
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
        ],
      },
    },
    priceReport: {
      "APPROVED": {
        ...AppModule.approvedState,
        nextState: 'NOTJUSTAPPROVED',
        nextStates: [
          AppModule.notJustApprodedState,
        ],
      },
      "NOTJUSTAPPROVED": {
        ...AppModule.notJustApprodedState,
        nextStates: [
          AppModule.approvedState,
        ],
      },
      "": {
        ...AppModule.notJustApprodedState,
        nextStates: [
          AppModule.approvedState,
        ],
      },
    },
    salesVoucher: {
      "APPROVED": {
        ...AppModule.approvedState,
        nextState: 'COMPLETE',
        nextStates: [
          { ...AppModule.completeState, status: 'success' },
          AppModule.unrecordedState,
        ],
      },
      "COMPLETE": {
        ...AppModule.completeState,
        nextState: 'UNRECORDED',
        nextStates: [
          AppModule.unrecordedState,
        ],
      },
      "UNRECORDED": {
        ...AppModule.unrecordedState,
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
          AppModule.unrecordedState,
        ],
      },
      "NOTJUSTAPPROVED": {
        ...AppModule.notJustApprodedState,
        state: 'NOTJUSTAPPROVED',
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
          AppModule.unrecordedState,
        ],
      },
      "": {
        ...AppModule.notJustApprodedState,
        state: 'NOTJUSTAPPROVED',
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
          AppModule.unrecordedState,
        ],
      },
    },
    purchaseVoucher: {
      "APPROVED": {
        ...AppModule.approvedState,
        nextState: 'COMPLETE',
        nextStates: [
          // { ...AppModule.completeState, status: 'success' },
          AppModule.unrecordedState,
        ],
      },
      "COMPLETE": {
        ...AppModule.completeState,
        nextState: 'UNRECORDED',
        nextStates: [
          AppModule.unrecordedState,
        ],
      },
      "UNRECORDED": {
        ...AppModule.unrecordedState,
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
          AppModule.unrecordedState,
        ],
      },
      "NOTJUSTAPPROVED": {
        ...AppModule.notJustApprodedState,
        state: 'NOTJUSTAPPROVED',
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
          AppModule.unrecordedState,
        ],
      },
      "": {
        ...AppModule.notJustApprodedState,
        state: 'NOTJUSTAPPROVED',
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
          AppModule.unrecordedState,
        ],
      },
    },
    purchaseOrder: {
      "APPROVED": {
        ...AppModule.approvedState,
        nextState: 'NOTJUSTAPPROVED',
        nextStates: [
          AppModule.notJustApprodedState,
        ],
      },
      "NOTJUSTAPPROVED": {
        ...AppModule.notJustApprodedState,
        nextStates: [
          AppModule.approvedState,
        ],
      },
      "INQUEUE": {
        ...AppModule.inQueueState,
        nextStates: [
          AppModule.approvedState,
        ],
      },
      "": {
        ...AppModule.notJustApprodedState,
        nextStates: [
          AppModule.approvedState,
        ],
      },
    },
    warehouseReceiptGoodsNote: {
      "APPROVED": {
        ...AppModule.approvedState,
        outline: true,
        nextState: 'UNRECORDED',
        nextStates: [
          AppModule.unrecordedState,
        ],
      },
      "UNRECORDED": {
        ...AppModule.unrecordedState,
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
          AppModule.unrecordedState,
        ],
      },
      "NOTJUSTAPPROVED": {
        ...AppModule.notJustApprodedState,
        state: 'NOTJUSTAPPROVED',
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
          AppModule.unrecordedState,
        ],
      },
      "": {
        ...AppModule.notJustApprodedState,
        state: 'NOTJUSTAPPROVED',
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
          AppModule.unrecordedState,
        ],
      },
    },
    warehouseDeliveryGoodsNote: {
      "APPROVED": {
        ...AppModule.approvedState,
        outline: true,
        nextState: 'UNRECORDED',
        nextStates: [
          AppModule.unrecordedState,
        ],
      },
      "UNRECORDED": {
        ...AppModule.unrecordedState,
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
          AppModule.unrecordedState,
        ],
      },
      "NOTJUSTAPPROVED": {
        ...AppModule.notJustApprodedState,
        state: 'NOTJUSTAPPROVED',
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
          AppModule.unrecordedState,
        ],
      },
      "": {
        ...AppModule.notJustApprodedState,
        state: 'NOTJUSTAPPROVED',
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
          AppModule.unrecordedState,
        ],
      },
    },
    cashVoucher: {
      "APPROVED": {
        ...AppModule.approvedState,
        nextState: 'UNRECORDED',
        nextStates: [
          AppModule.unrecordedState,
        ],
      },
      "APPROVALREQUESTED": {
        ...AppModule.approvalRequestedState,
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
          AppModule.unrecordedState,
        ],
      },
      "UNRECORDED": {
        ...AppModule.unrecordedState,
        nextState: 'UNRECORDED',
        nextStates: [
          AppModule.approvedState,
          AppModule.unrecordedState,
        ],
      },
      "NOTJUSTAPPROVED": {
        ...AppModule.notJustApprodedState,
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
        ],
      },
      "": {
        ...AppModule.notJustApprodedState,
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
        ]
      },
    },
    otherBusinessVoucher: {
      "APPROVED": {
        ...AppModule.approvedState,
        nextState: 'UNRECORDED',
        nextStates: [
          AppModule.unrecordedState,
        ],
      },
      "APPROVALREQUESTED": {
        ...AppModule.approvalRequestedState,
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
          AppModule.unrecordedState,
        ],
      },
      "UNRECORDED": {
        ...AppModule.unrecordedState,
        nextState: 'UNRECORDED',
        nextStates: [
          AppModule.approvedState,
          AppModule.unrecordedState,
        ],
      },
      "NOTJUSTAPPROVED": {
        ...AppModule.notJustApprodedState,
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
        ],
      },
      "": {
        ...AppModule.notJustApprodedState,
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
        ]
      },
    },
    commissionPaymentVoucher: {
      "APPROVALREQUESTED": {
        ...AppModule.approvalRequestedState,
        nextState: 'UNRECORDED',
        nextStates: [
          AppModule.unrecordedState,
        ],
      },
      "APPROVED": {
        ...AppModule.approvedState,
        nextState: 'UNRECORDED',
        nextStates: [
          AppModule.unrecordedState,
        ],
      },
      "UNRECORDED": {
        ...AppModule.unrecordedState,
        nextState: 'APPROVALREQUESTED',
        nextStates: [
          AppModule.approvalRequestedState,
          AppModule.unrecordedState,
        ],
      },
      "NOTJUSTAPPROVED": {
        ...AppModule.notJustApprodedState,
        nextState: 'APPROVALREQUESTED',
        nextStates: [
          AppModule.approvalRequestedState,
          AppModule.unrecordedState,
        ],
      },
      "": {
        ...AppModule.notJustApprodedState,
        nextState: 'APPROVALREQUESTED',
        nextStates: [
          AppModule.approvalRequestedState,
          AppModule.unrecordedState,
        ]
      },
    },
    deploymentVoucher: {
      "APPROVED": {
        ...AppModule.approvedState,
        outline: true,
        nextState: 'COMPLETED',
        nextStates: [
          AppModule.completeState,
        ],
      },
      // "DEPLOYMENT": {
      //   ...AppModule.depploymentState,
      //   nextState: 'COMPLETE',
      //   nextStates: [
      //     { ...AppModule.completeState, status: 'success' },
      //     AppModule.notJustApprodedState,
      //   ],
      // },
      // "ACCEPTANCE": {
      //   ...AppModule.acceptanceState,
      //   nextState: 'COMPLETE',
      //   nextStates: [
      //     { ...AppModule.completeState, status: 'success' },
      //     AppModule.notJustApprodedState,
      //   ],
      // },
      // "COMPLETE": {
      //   ...AppModule.completeState,
      //   nextState: 'NOTJUSTAPPROVED',
      //   nextStates: [
      //     AppModule.notJustApprodedState,
      //   ],
      // },
      "UNRECORDED": {
        ...AppModule.unrecordedState,
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
        ],
      },
      "QUEUE": {
        ...AppModule.queueState,
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
        ],
      },
      "NOTJUSTAPPROVED": {
        ...AppModule.notJustApprodedState,
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
        ],
      },
      "COMPLETED": {
        ...AppModule.completeState,
        nextState: 'UNRECORDED',
        nextStates: [
          AppModule.unrecordedState,
        ],
      },
      "": {
        ...AppModule.notJustApprodedState,
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
        ],
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
        responseText: 'Common.completeSuccess',
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
        responseText: 'Common.unbookkeepingSuccess',
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
        responseText: 'Common.approveSuccess',
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
        responseText: 'Common.approveSuccess',
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
        responseText: 'Common.inactiveSuccess',
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
        responseText: 'Common.activeSuccess',
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
        responseText: 'Common.activeSuccess',
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
        responseText: 'Common.activeSuccess',
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
        responseText: 'Common.activeSuccess',
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
        responseText: 'Common.activeSuccess',
      },
    },
    commissionVoucher: {
      "CONFIRMATIONREQUESTED": {
        ...AppModule.confirmationRequestedState,
        nextState: 'CONFIRMED',
        nextStates: [
          AppModule.confirmedState,
          AppModule.unrecordedState,
        ],
      },
      "CONFIRMED": {
        ...AppModule.confirmedState,
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
          AppModule.unrecordedState,
        ],
      },
      "APPROVED": {
        ...AppModule.approvedState,
        nextState: 'UNRECORDED',
        nextStates: [
          AppModule.unrecordedState
        ],
      },
      "UNRECORDED": {
        ...AppModule.unrecordedState,
        nextState: 'APPROVED',
        nextStates: [
          AppModule.confirmationRequestedState,
          AppModule.approvedState,
          AppModule.unrecordedState,
        ],
      },
      "NOTJUSTAPPROVED": {
        ...AppModule.notJustApprodedState,
        nextState: 'CONFIRMATIONREQUESTED',
        nextStates: [
          AppModule.confirmationRequestedState,
          AppModule.unrecordedState,
        ],
      },
      "": {
        ...AppModule.notJustApprodedState,
        nextState: 'CONFIRMATIONREQUESTED',
        nextStates: [
          AppModule.confirmationRequestedState,
          AppModule.unrecordedState,
        ],
      },
    },
    awardVoucher: {
      "CONFIRMATIONREQUESTED": {
        ...AppModule.confirmationRequestedState,
        nextState: 'CONFIRMED',
        nextStates: [
          AppModule.confirmedState,
          AppModule.unrecordedState,
        ],
      },
      "CONFIRMED": {
        ...AppModule.confirmedState,
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
          AppModule.unrecordedState,
        ],
      },
      "APPROVED": {
        ...AppModule.approvedState,
        nextState: 'UNRECORDED',
        nextStates: [
          AppModule.unrecordedState
        ],
      },
      "UNRECORDED": {
        ...AppModule.unrecordedState,
        nextState: 'APPROVED',
        nextStates: [
          AppModule.confirmationRequestedState,
          AppModule.approvedState,
          AppModule.unrecordedState,
        ],
      },
      "NOTJUSTAPPROVED": {
        ...AppModule.notJustApprodedState,
        nextState: 'CONFIRMATIONREQUESTED',
        nextStates: [
          AppModule.confirmationRequestedState,
          AppModule.unrecordedState,
        ],
      },
      "": {
        ...AppModule.notJustApprodedState,
        nextState: 'CONFIRMATIONREQUESTED',
        nextStates: [
          AppModule.confirmationRequestedState,
          AppModule.unrecordedState,
        ],
      },
    },
    collaboratoOrder: {
      "PROCESSING": {
        ...AppModule.proccessingState,
        nextState: 'APPROVED',
        nextStates: [
          { ...AppModule.approvedState, confirmLabel: 'Chốt đơn', confirmText: 'Bạn có muốn chốt đơn', status: 'success' },
          AppModule.unrecordedState,
        ],
      },
      "APPROVED": {
        ...AppModule.approvedState,
        label: 'Chốt đơn',
        nextState: 'COMPLETED',
        nextStates: [
          // AppModule.depploymentState,
          // AppModule.transportState,
          AppModule.completeState,
          AppModule.unrecordedState,
        ],
      },
      // "TRANSPORT": {
      //   ...AppModule.transportState,
      //   nextState: 'DELIVERED',
      //   nextStates: [
      //     { ...AppModule.deliveredState, status: 'success' },
      //     AppModule.unrecordedState,
      //   ],
      // },
      // "DEPLOYMENT": {
      //   ...AppModule.depploymentState,
      //   nextState: 'DEPLOYED',
      //   nextStates: [
      //     AppModule.deployedState,
      //     AppModule.unrecordedState,
      //   ],
      // },
      "DEPLOYED": {
        ...AppModule.deployedState,
        nextState: 'COMPLETED',
        nextStates: [
          AppModule.completeState,
          AppModule.unrecordedState,
        ],
      },
      // "DELIVERED": {
      //   ...AppModule.deliveredState,
      //   nextState: 'COMPLETED',
      //   nextStates: [
      //     AppModule.completeState,
      //     AppModule.returnState,
      //     AppModule.unrecordedState,
      //   ],
      // },
      "COMPLETED": {
        ...AppModule.completeState,
        nextState: 'UNRECORDED',
        nextStates: [
          AppModule.unrecordedState,
        ],
      },
      "RETURN": {
        ...AppModule.returnState,
        nextState: 'COMPLETED',
        nextStates: [
          // { ...AppModule.completeState, status: 'success' },
          AppModule.completeState,
          AppModule.unrecordedState,
        ],
      },
      // "COMPLETE": {
      //   ...AppModule.completeState,
      //   nextState: 'UNRECORDED',
      //   nextStates: [
      //     AppModule.unrecordedState,
      //   ],
      // },
      "UNRECORDED": {
        ...AppModule.unrecordedState,
        nextState: 'PROCESSING',
        nextStates: [
          AppModule.proccessingState,
        ],
      },
      "NOTJUSTAPPROVED": {
        ...AppModule.notJustApprodedState,
        nextState: 'PROCESSING',
        nextStates: [
          AppModule.proccessingState,
        ],
      },
    },
    collaboratoCommissionIncurred: {
      "NOTJUSTAPPROVED": {
        ...AppModule.notJustApprodedState,
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
        ],
      },
      "APPROVED": {
        ...AppModule.approvedState,
        nextState: 'UNRECORDED',
        nextStates: [
          AppModule.unrecordedState,
        ],
      },
      "UNRECORDED": {
        ...AppModule.unrecordedState,
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
        ],
      },
    },
    collaboratorEdutcationArticle: {
      "APPROVED": {
        ...AppModule.approvedState,
        label: 'Common.approved',
        nextState: 'NOTJUSTAPPROVED',
        nextStates: [
          AppModule.notJustApprodedState,
        ],
      },
      "NOTJUSTAPPROVED": {
        ...AppModule.notJustApprodedState,
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
        ],
      },
      "": {
        ...AppModule.notJustApprodedState,
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
        ],
      },
    },
    commercePos: {
      "APPROVED": {
        ...AppModule.approvedState,
        nextState: 'UNRECORDED',
        nextStates: [
          // { ...AppModule.completeState, status: 'success' },
          AppModule.unrecordedState,
        ],
      },
      "PRICEREPORT": {
        ...AppModule.priceReportState,
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
          AppModule.unrecordedState,
        ],
      },
      "UNRECORDED": {
        ...AppModule.unrecordedState,
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
          AppModule.priceReportState,
          AppModule.unrecordedState,
        ],
      },
      "NOTJUSTAPPROVED": {
        ...AppModule.notJustApprodedState,
        state: 'NOTJUSTAPPROVED',
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
          AppModule.priceReportState,
          AppModule.unrecordedState,
        ],
      },
      "": {
        ...AppModule.notJustApprodedState,
        state: 'NOTJUSTAPPROVED',
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState,
          AppModule.unrecordedState,
        ],
      },
    },
    memberCard: {
      "DISTRIBUTED": {
        ...AppModule.distributedState,
        nextState: 'ASSIGNED',
        nextStates: [
          AppModule.lockedState
        ],
      },
      "ASSIGNED": {
        ...AppModule.assignedState,
        nextState: 'LOCKED',
        nextStates: [
          AppModule.lockedState
        ],
      },
      "LOCKED": {
        ...AppModule.lockedState,
        nextState: 'DISTRIBUTED',
        nextStates: [
          AppModule.distributedState
        ],
      },
      "NOTJUSTDISTRIBUTED": {
        ...AppModule.notJustDistributedState,
        state: 'NOTJUSTDISTRIBUTED',
        nextState: 'DISTRIBUTED',
        nextStates: [
          AppModule.distributedState,
          AppModule.lockedState,
        ],
      },
    },
    // wordpressOrder: {
    //   "PROCESSING": {
    //     ...AppModule.proccessingState,
    //     nextState: 'APPROVED',
    //     nextStates: [
    //       // { ...AppModule.completeState, status: 'success' },
    //       AppModule.approvedState,
    //     ],
    //   },
    //   "PENDING": {
    //     ...AppModule.approvedState,
    //     nextState: 'APPROVED',
    //     nextStates: [
    //       // { ...AppModule.completeState, status: 'success' },
    //       AppModule.approvedState,
    //     ],
    //   },
    //   "ONHOLD": {
    //     ...AppModule.approvedState,
    //     nextState: 'APPROVED',
    //     nextStates: [
    //       // { ...AppModule.completeState, status: 'success' },
    //       AppModule.approvedState,
    //     ],
    //   },
    //   "COMPLETED": {
    //     ...AppModule.approvedState,
    //     nextState: 'UNRECORDED',
    //     outline: true,
    //     nextStates: [
    //       // { ...AppModule.completeState, status: 'success' },
    //       AppModule.unrecordedState,
    //     ],
    //   },
    //   "CANCELED": {
    //     ...AppModule.approvedState,
    //     nextState: 'UNRECORDED',
    //     nextStates: [
    //       // { ...AppModule.completeState, status: 'success' },
    //       AppModule.unrecordedState,
    //     ],
    //   },
    //   "REFUNDED": {
    //     ...AppModule.approvedState,
    //     nextState: 'UNRECORDED',
    //     nextStates: [
    //       // { ...AppModule.completeState, status: 'success' },
    //       AppModule.unrecordedState,
    //     ],
    //   },
    //   "FAILED": {
    //     ...AppModule.approvedState,
    //     nextState: 'UNRECORDED',
    //     nextStates: [
    //       // { ...AppModule.completeState, status: 'success' },
    //       AppModule.unrecordedState,
    //     ],
    //   },
    //   "CHECKOUTDRAFT": {
    //     ...AppModule.approvedState,
    //     nextState: 'UNRECORDED',
    //     nextStates: [
    //       // { ...AppModule.completeState, status: 'success' },
    //       AppModule.unrecordedState,
    //     ],
    //   },
    //   "APPROVED": {
    //     ...AppModule.approvedState,
    //     nextState: 'COMPLETED',
    //     nextStates: [
    //       { ...AppModule.completeState, status: 'basic', outline: true },
    //       AppModule.unrecordedState,
    //     ],
    //   },
    //   "UNRECORDED": {
    //     ...AppModule.unrecordedState,
    //     nextState: 'APPROVED',
    //     nextStates: [
    //       AppModule.approvedState,
    //       AppModule.priceReportState,
    //       AppModule.unrecordedState,
    //     ],
    //   },
    //   "NEW": {
    //     ...AppModule.newState,
    //     label: 'Đơn mới',
    //     nextState: 'APPROVED',
    //     nextStates: [
    //       AppModule.approvedState,
    //       AppModule.priceReportState,
    //       AppModule.unrecordedState,
    //     ],
    //   },
    //   "": {
    //     ...AppModule.newState,
    //     label: 'Đơn mới',
    //     nextState: 'APPROVED',
    //     nextStates: [
    //       AppModule.approvedState,
    //       AppModule.unrecordedState,
    //     ],
    //   },
    // },
  };
}

AppModule.processMaps['wordpressOrder'] = {
  ...AppModule.processMaps.collaboratoOrder,
  "NOTJUSTAPPROVED": {
    ...AppModule.processMaps.collaboratoOrder['NOTJUSTAPPROVED'],
    label: 'Đơn mới',
    status: 'danger',
  }
};
