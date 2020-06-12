import { ExtraOptions, RouterModule, Routes, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { NgModule, Injectable } from '@angular/core';
import {
  NbAuthComponent,
  NbLoginComponent,
} from '@nebular/auth';
import { AuthGuardService } from './services/auth-guard.service';
import { ECommerceComponent } from './modules/e-commerce/e-commerce.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { NotificationComponent } from './modules/notification/notification.component';
import { MobileAppComponent } from './modules/mobile-app/mobile-app.component';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class RoutingResolve implements Resolve<any> {

  constructor(public translate: TranslateService) { }

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
  {
    path: 'auth',
    component: NbAuthComponent,
    children: [
      {
        path: '',
        component: NbLoginComponent,
      },
      // {
      //   path: 'login',
      //   component: NbLoginComponent,
      //   // component: LoginComponent,
      // },
      // {
      //   path: 'register',
      //   component: NbRegisterComponent,
      // },
      // {
      //   path: 'logout',
      //   component: NbLogoutComponent,
      // },
      // {
      //   path: 'request-password',
      //   component: NbRequestPasswordComponent,
      // },
      // {
      //   path: 'reset-password',
      //   component: NbResetPasswordComponent,
      // },
    ],
  },
  {
    path: '',
    redirectTo: '/ivoip/dashboard',
    pathMatch: 'full',
    resolve: {
      configuration: RoutingResolve,
    },
  },
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
    path: 'notification/:id',
    resolve: {
      configuration: RoutingResolve,
    },
    component: NotificationComponent,
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
  {
    path: 'sales',
    resolve: {
      configuration: RoutingResolve,
    },
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/sales/sales.module')
      .then(m => m.SalesModule),
  },
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
  {
    path: 'contact',
    resolve: {
      configuration: RoutingResolve,
    },
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/contact/contact.module')
      .then(m => m.ContactModule),
  },
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
  {
    path: 'admin-product',
    resolve: {
      configuration: RoutingResolve,
    },
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/admin-product/admin-product.module')
      .then(m => m.AdminProductModule),
  },
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
  // {
  //   path: 'virtual-phone',
  //   // canActivate: [AuthGuardService],
  //   loadChildren: () => import('./modules/virtual-phone/virtual-phone.module')
  //     .then(m => m.VirtualPhoneModule),
  // },
  // { path: '', redirectTo: 'mini-erp', pathMatch: 'full' },
  // { path: '**', redirectTo: 'mini-erp' },
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
