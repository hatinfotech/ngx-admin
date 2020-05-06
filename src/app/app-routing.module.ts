import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  NbAuthComponent,
  NbLoginComponent,
} from '@nebular/auth';
import { AuthGuardService } from './services/auth-guard.service';
import { ECommerceComponent } from './modules/e-commerce/e-commerce.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { NotificationComponent } from './modules/notification/notification.component';
import { MobileAppComponent } from './modules/mobile-app/mobile-app.component';

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
  },
  {
    path: 'dashboard',
    component: ECommerceComponent,
    canActivate: [AuthGuardService],
    data: {
      reuse: true,
    },
  },
  {
    path: 'mobile-app',
    component: MobileAppComponent,
    // canActivate: [AuthGuardService],
    data: {
      reuse: true,
    },
  },
  {
    path: 'iot-dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuardService],
    data: {
      reuse: true,
    },
  },
  {
    path: 'notification/:id',
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
    loadChildren: () => import('./modules/human-resource/human-resource.module')
      .then(m => m.HumanResourceModule),
  },
  {
    path: 'sales',
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/sales/sales.module')
      .then(m => m.SalesModule),
  },
  {
    path: 'ivoip',
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/ivoip/ivoip.module')
      .then(m => m.IvoipModule),
  },
  {
    path: 'web-hosting',
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/web-hosting/web-hosting.module')
      .then(m => m.WebHostingModule),
  },
  {
    path: 'users',
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/users/users.module')
      .then(m => m.UsersModule),
  },
  {
    path: 'modules',
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/modules/modules.module')
      .then(m => m.ModulesModule),
  },
  {
    path: 'menu',
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/menu/menu.module')
      .then(m => m.MenuModule),
  },
  {
    path: 'minierp',
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/minierp/minierp.module')
      .then(m => m.MinierpModule),
  },
  {
    path: 'contact',
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/contact/contact.module')
      .then(m => m.ContactModule),
  },
  {
    path: 'helpdesk',
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/helpdesk/helpdesk.module')
      .then(m => m.HelpdeskModule),
  },
  {
    path: 'sms',
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/sms/sms.module')
      .then(m => m.SmsModule),
  },
  {
    path: 'email-marketing',
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/email-marketing/email-marketing.module')
      .then(m => m.EmailMarketingModule),
  },
  {
    path: 'crawl',
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/crawl/crawl.module')
      .then(m => m.CrawlModule),
  },
  {
    path: 'wordpress',
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/wordpress/wordpress.module')
      .then(m => m.WordpressModule),
  },
  {
    path: 'network',
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/network/network.module')
      .then(m => m.NetworkModule),
  },
  {
    path: 'ads',
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/ads/ads.module')
      .then(m => m.AdsModule),
  },
  {
    path: 'short-link',
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/short-link/short-link.module')
      .then(m => m.ShortLinkModule),
  },
  {
    path: 'promotion',
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/promotion/promotion.module')
      .then(m => m.PromotionModule),
  },
  {
    path: 'admin-product',
    // canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/admin-product/admin-product.module')
      .then(m => m.AdminProductModule),
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

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
