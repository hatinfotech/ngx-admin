import { WordpressOrderListComponent } from './modules/wordpress/order/order-list/order-list.component';
import { ProductObjectReferenceListComponent } from './modules/admin-product/product-object-reference/product-object-reference-list/product-object-reference-list.component';
import { CommercePosOrderListComponent } from './modules/commerce-pos/commerce-pos-order/commerce-pos-order-list/commerce-pos-order-list.component';
import { CommercePosGuiComponent } from './modules/commerce-pos/gui/commerce-pos-gui/commerce-pos-gui.component';
import { ContactCustomerListComponent } from './modules/contact/contact-customer-list/contact-customer-list.component';
import { ContactRemovedListComponent } from './modules/contact/contact-removed-list/contact-removed-list.component';
import { ContactEmployeeListComponent } from './modules/contact/contact-employee-list/contact-employee-list.component';
import { ContactSupplierListComponent } from './modules/contact/contact-supplier-list/contact-supplier-list.component';
import { ContactAllListComponent } from './modules/contact/contact-all-list/contact-all-list.component';
import { CommerceServiceByCycleListComponent } from './modules/commerce-service-by-cycle/service-by-cycle/commerce-service-by-cycle-list/commerce-service-by-cycle-list.component';
import { PurchaseGoodsListComponent } from './modules/purchase/goods/purchase-goods-list/purchase-goods-list.component';
import { ExtraOptions, RouterModule, Routes, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { NgModule, Injectable } from '@angular/core';
import { AuthGuardService } from './services/auth-guard.service';
// import { ECommerceComponent } from './modules/e-commerce/e-commerce.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { NotificationComponent } from './modules/notification/notification.component';
import { MobileAppComponent } from './modules/mobile-app/mobile-app.component';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from './services/common.service';
import { PurchaseOrderVoucherFormComponent } from './modules/purchase/order/purchase-order-voucher-form/purchase-order-voucher-form.component';
import { PurchaseOrderVoucherListComponent } from './modules/purchase/order/purchase-order-voucher-list/purchase-order-voucher-list.component';
import { PurchasePriceTableFormComponent } from './modules/purchase/price-table/purchase-price-table-form/purchase-price-table-form.component';
import { PurchasePriceTableListComponent } from './modules/purchase/price-table/purchase-price-table-list/purchase-price-table-list.component';
import { PurchaseVoucherFormComponent } from './modules/purchase/voucher/purchase-voucher-form/purchase-voucher-form.component';
import { PurchaseVoucherListComponent } from './modules/purchase/voucher/purchase-voucher-list/purchase-voucher-list.component';
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
import { ContactListComponent } from './modules/contact/contact/contact-list/contact-list.component';
import { ClusterAuthorizedKeyListComponent } from './modules/cluster/authorized-key/cluster-authorized-key-list/cluster-authorized-key-list.component';
import { ECommerceComponent } from './modules/e-commerce/e-commerce.component';
import { PageFormComponent } from './modules/page/page-form/page-form.component';
import { PageListComponent } from './modules/page/page-list/page-list.component';
import { CommercePosReturnListComponent } from './modules/commerce-pos/commerce-pos-return/commerce-pos-return-list/commerce-pos-return-list.component';
import { CommercePosDashboardComponent } from './modules/commerce-pos/commerce-pos-dashboard/commerce-pos-dashboard.component';
import { PurchaseDashboardComponent } from './modules/purchase/purchase-dashboard/purchase-dashboard.component';
import { ProductBrandListComponent } from './modules/admin-product/brand/product-brand-list/product-brand-list.component';
import { ProductPropertyListComponent } from './modules/admin-product/property/product-property-list/product-property-list.component';
import { ProductKeywordListComponent } from './modules/admin-product/keyword/product-keyword-list/product-keyword-list.component';
import { PurchaseProductListComponent } from './modules/purchase/product/purchase-product-list/purchase-product-list.component';
import { WordpressSyncProfileListComponent } from './modules/wordpress/sync-profile/sync-profile-list/sync-profile-list.component';
import { WordpressProductListComponent } from './modules/wordpress/product/product-list/product-list.component';
import { WordpressOrderFormComponent } from './modules/wordpress/order/order-form/order-form.component';
import { MktMemberCardListComponent } from './modules/marketing/member-card/member-card-list/member-card-list.component';
import { collaboratorRoutes } from './modules/collaborator/collaborator.routing';
import { salesRoutes } from './modules/sales/sales.routing';
import { accoutingRoutes } from './modules/accounting/accounting.routing';
import { warehouseRoutes } from './modules/warehouse/warehouse.routing';
import { systemRoutes } from './modules/system/system-routing.module';
import { userRoutes } from './modules/users/users-routing.module';

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
  ...warehouseRoutes,


  // Sales routes
  ...salesRoutes,

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
  ...accoutingRoutes,

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
  ...collaboratorRoutes,


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


  // Marketing
  {
    path: 'marketing/member-card/list',
    canActivate: [AuthGuardService],
    component: MktMemberCardListComponent,
    data: {
      reuse: true,
    },
  },
  // End Marketing


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
  // {
  //   path: 'users',
  //   resolve: {
  //     configuration: RoutingResolve,
  //   },
  //   // canActivate: [AuthGuardService],
  //   loadChildren: () => import('./modules/users/users.module')
  //     .then(m => m.UsersModule),
  // },
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
  // {
  //   path: 'system',
  //   resolve: {
  //     configuration: RoutingResolve,
  //   },
  //   // canActivate: [AuthGuardService],
  //   loadChildren: () => import('./modules/system/system.module')
  //     .then(m => m.SystemModule),
  // },
  ...systemRoutes,
  ...userRoutes,
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
