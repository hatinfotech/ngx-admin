import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';
import { ShortLinkComponent } from './short-link.component';
import { ShortLinkListComponent } from './short-link/short-link-list/short-link-list.component';
import { ShortLinkFormComponent } from './short-link/short-link-form/short-link-form.component';

const routes: Routes = [{
  path: '',
  component: ShortLinkComponent,
  children: [
    // {
    //   path: '',
    //   redirectTo: 'dashboard',
    //   pathMatch: 'full',
    // },
    // {
    //   path: 'dashboard',
    //   canActivate: [AuthGuardService],
    //   component: IvoipDashboardComponent,
    //   data: {
    //     reuse: true,
    //   },
    // },
    {
      path: 'short-link/list',
      canActivate: [AuthGuardService],
      component: ShortLinkListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'short-link/form',
      canActivate: [AuthGuardService],
      component: ShortLinkFormComponent,
    },
    {
      path: 'short-link/form/:id',
      canActivate: [AuthGuardService],
      component: ShortLinkFormComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShortLinkRoutingModule {
}
