import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';
import { AdsContentListComponent } from './ads-content/ads-content-list/ads-content-list.component';
import { AdsContentFormComponent } from './ads-content/ads-content-form/ads-content-form.component';
import { AdsCodeFormComponent } from './ads-code/ads-code-form/ads-code-form.component';
import { AdsCodeListComponent } from './ads-code/ads-code-list/ads-code-list.component';
import { AdsComponent } from './ads.component';

const routes: Routes = [{
  path: '',
  component: AdsComponent,
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
      path: 'content/list',
      canActivate: [AuthGuardService],
      component: AdsContentListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'content/form',
      canActivate: [AuthGuardService],
      component: AdsContentFormComponent,
    },
    {
      path: 'content/form/:id',
      canActivate: [AuthGuardService],
      component: AdsCodeFormComponent,
    },
    {
      path: 'code/list',
      canActivate: [AuthGuardService],
      component: AdsCodeListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'ads-code/form',
      canActivate: [AuthGuardService],
      component: AdsCodeFormComponent,
    },
    {
      path: 'ads-code/form/:id',
      canActivate: [AuthGuardService],
      component: AdsCodeFormComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdsRoutingModule {
}
