import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { MiniErpComponent } from './mini-erp.component';
import { ECommerceComponent } from './e-commerce/e-commerce.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [{
  path: '',
  component: MiniErpComponent,
  children: [
    {
      path: '',
      component: ECommerceComponent,
    },
    {
      path: 'dashboard',
      component: ECommerceComponent,
    },
    {
      path: 'iot-dashboard',
      component: DashboardComponent,
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
    },
    {
      path: 'sales',
      loadChildren: () => import('./sales/sales.module')
        .then(m => m.SalesModule),
    },
    {
      path: 'ivoip',
      loadChildren: () => import('./ivoip/ivoip.module')
        .then(m => m.IvoipModule),
    },
    {
      path: 'test',
      loadChildren: () => import('./test/test.module')
        .then(m => m.TestModule),
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MiniErpRoutingModule {
}
