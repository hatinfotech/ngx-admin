import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { MiniErpComponent } from './mini-erp.component';
import { ECommerceComponent } from './e-commerce/e-commerce.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TabsComponent } from './tabs/tabs.component';
import { UserListComponent } from './users/user-manager/user-list/user-list.component';
import { MenuListComponent } from './menu/manager-menu/menu-list/menu-list.component';

const routes: Routes = [{
  path: '',
  component: MiniErpComponent,
  children: [
    {
      path: '',
      redirectTo: '/dashboard',
      pathMatch: 'full',
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
      path: 'users',
      loadChildren: () => import('./users/users.module')
        .then(m => m.UsersModule),
    },
    {
      path: 'modules',
      loadChildren: () => import('./modules/modules.module')
        .then(m => m.ModulesModule),
    },
    {
      path: 'menu',
      loadChildren: () => import('./menu/menu.module')
        .then(m => m.MenuModule),
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MiniErpRoutingModule {
}
