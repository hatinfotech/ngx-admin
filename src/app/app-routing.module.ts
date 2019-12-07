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
    redirectTo: '/dashboard',
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
