import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';
import { NetworkComponent } from './network.component';
import { ProxyListComponent } from './proxy/proxy-list/proxy-list.component';
import { ProxyFormComponent } from './proxy/proxy-form/proxy-form.component';

const routes: Routes = [{
  path: '',
  component: NetworkComponent,
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
      path: 'proxy/list',
      canActivate: [AuthGuardService],
      component: ProxyListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'proxy/form',
      canActivate: [AuthGuardService],
      component: ProxyFormComponent,
    },
    {
      path: 'proxy/form/:id',
      canActivate: [AuthGuardService],
      component: ProxyFormComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NetworkRoutingModule {
}
