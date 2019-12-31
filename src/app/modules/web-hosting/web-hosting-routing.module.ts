import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WebHostingComponent } from './web-hosting.component';
import { AuthGuardService } from '../../services/auth-guard.service';
import { WebHostingDashboardComponent } from './web-hosting-dashboard/web-hosting-dashboard.component';
import { HostingFormComponent } from './hostings/hosting-form/hosting-form.component';
import { HostingListComponent } from './hostings/hosting-list/hosting-list.component';
import { WebsiteListComponent } from './websites/website-list/website-list.component';
import { WebsiteFormComponent } from './websites/website-form/website-form.component';


const routes: Routes = [{
  path: '',
  component: WebHostingComponent,
  children: [
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: 'dashboard',
      canActivate: [AuthGuardService],
      component: WebHostingDashboardComponent,
      data: {
        reuse: true,
      },
    },
    // Hostings
    {
      path: 'hostings/list',
      canActivate: [AuthGuardService],
      component: HostingListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'hostings/form',
      canActivate: [AuthGuardService],
      component: HostingFormComponent,
    },
    {
      path: 'hostings/form/:id',
      canActivate: [AuthGuardService],
      component: HostingFormComponent,
    },
    // Websites
    {
      path: 'websites/list',
      canActivate: [AuthGuardService],
      component: WebsiteListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'websites/form',
      canActivate: [AuthGuardService],
      component: WebsiteFormComponent,
    },
    {
      path: 'websites/form/:id',
      canActivate: [AuthGuardService],
      component: WebsiteFormComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebHostingRoutingModule {
}
