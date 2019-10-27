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
