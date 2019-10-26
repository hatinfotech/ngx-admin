import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { MiniErpComponent } from './mini-erp.component';

const routes: Routes = [{
  path: '',
  component: MiniErpComponent,
  children: [
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
      path: 'data-table',
      loadChildren: () => import('./data-table/data-table.module')
        .then(m => m.DataTableModule),
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MiniErpRoutingModule {
}
