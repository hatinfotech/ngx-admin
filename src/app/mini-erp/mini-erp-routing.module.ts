import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { MiniErpComponent } from './mini-erp.component';
import { ECommerceComponent } from './e-commerce/e-commerce.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [{
  path: '',
  data: {
    reuse: false,
  },
  component: MiniErpComponent,
  children: [
    {
      path: '',
      // component: ECommerceComponent,
      redirectTo: '/dashboard',
      pathMatch: 'full',
      data: {
        reuse: false,
      },
    },
    {
      path: 'dashboard',
      component: ECommerceComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'iot-dashboard',
      component: DashboardComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'auth',
      loadChildren: () => import('./auth/auth.module')
        .then(m => m.AuthModule),
    },
    {
      path: 'human-resource',
      loadChildren: () => import('./human-resource/human-resource.module')
        .then(m => m.HumanResourceModule),
        data: {
          reuse: false,
        },
    },
    {
      path: 'sales',
      loadChildren: () => import('./sales/sales.module')
        .then(m => m.SalesModule),
        data: {
          reuse: false,
        },
    },
    {
      path: 'ivoip',
      loadChildren: () => import('./ivoip/ivoip.module')
        .then(m => m.IvoipModule),
      data: {
        reuse: false,
      },
    },
    {
      path: 'users',
      loadChildren: () => import('./users/users.module')
        .then(m => m.UsersModule),
        data: {
          reuse: false,
        },
    },
    {
      path: 'modules',
      loadChildren: () => import('./modules/modules.module')
        .then(m => m.ModulesModule),
        data: {
          reuse: false,
        },
    },
    {
      path: 'menu',
      loadChildren: () => import('./menu/menu.module')
        .then(m => m.MenuModule),
        data: {
          reuse: false,
        },
    },
    // {
    //   path: 'test',
    //   loadChildren: () => import('./test/test.module')
    //     .then(m => m.TestModule),
    // },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MiniErpRoutingModule {
}
