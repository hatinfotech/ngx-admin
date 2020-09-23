import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogoutComponent } from './logout/logout.component';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [{
  path: '',
  component: AuthComponent,
  children: [
    {
      path: '',
      component: LoginComponent,  // <---
    },
    // {
    //   path: 'auth',
    //   loadChildren: './auth/auth.module#AuthModule',
    // },
    {
      path: 'login',
      component: LoginComponent, // <---
    },
    {
      path: 'logout',
      component: LogoutComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {
}
