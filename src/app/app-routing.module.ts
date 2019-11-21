import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  NbAuthComponent,
  NbLoginComponent,
  NbLogoutComponent,
  NbRegisterComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
} from '@nebular/auth';
import { LoginComponent } from './mini-erp/auth/login/login.component';
import { AuthGuardService } from './mini-erp/services/auth-guard.service';

const routes: Routes = [
  // {
  //   path: 'pages',
  //   loadChildren: () => import('./pages/pages.module')
  //     .then(m => m.PagesModule),
  // },
  {
    path: '',
    data: {
      reuse: false,
    },
    canActivate: [AuthGuardService],
    loadChildren: () => import('./mini-erp/mini-erp.module')
      .then(m => m.MiniErpModule),
  },
  // {
  //   path: 'auth',
  //   loadChildren: () => import('app/mini-erp/auth/auth.module')
  //     .then(m => m.AuthModule),
  // },
  {
    path: 'auth',
    component: NbAuthComponent,
    children: [
      {
        path: '',
        component: NbLoginComponent,
      },
      {
        path: 'login',
        // component: NbLoginComponent,
        component: LoginComponent,
      },
      {
        path: 'register',
        component: NbRegisterComponent,
      },
      {
        path: 'logout',
        component: NbLogoutComponent,
      },
      {
        path: 'request-password',
        component: NbRequestPasswordComponent,
      },
      {
        path: 'reset-password',
        component: NbResetPasswordComponent,
      },
    ],
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
