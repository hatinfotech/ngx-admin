import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthComponent } from './auth.componet';

const routes: Routes = [{
  path: '',
  component: AuthComponent,
  children: [
    {
      path: 'auth',
      loadChildren: './auth/auth.module#AuthModule',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {
}
