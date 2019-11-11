import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogoutComponent } from './logout/logout.component';
import { AuthComponent } from './auth.component';

const routes: Routes = [{
  path: '',
  component: AuthComponent,
  children: [
    // {
    //   path: '',
    //   component: NbAuthComponent,  // <---
    // },
    // {
    //   path: 'auth',
    //   loadChildren: './auth/auth.module#AuthModule',
    // },
    // {
    //   path: 'login',
    //   component: LoginComponent, // <---
    // },
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
