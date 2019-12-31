import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WebHostingComponent } from './web-hosting.component';
import { AuthGuardService } from '../../services/auth-guard.service';
import { WebHostingDashboardComponent } from './web-hosting-dashboard/web-hosting-dashboard.component';
import { HostingFormComponent } from './hostings/hosting-form/hosting-form.component';
import { HostingListComponent } from './hostings/hosting-list/hosting-list.component';
import { WebsiteListComponent } from './websites/website-list/website-list.component';
import { WebsiteFormComponent } from './websites/website-form/website-form.component';
import { DatabaseListComponent } from './databases/database-list/database-list.component';
import { DatabaseFormComponent } from './databases/database-form/database-form.component';
import { DatabaseUserListComponent } from './database-users/database-user-list/database-user-list.component';
import { DatabaseUserFormComponent } from './database-users/database-user-form/database-user-form.component';
import { FtpListComponent } from './ftps/ftp-list/ftp-list.component';
import { FtpFormComponent } from './ftps/ftp-form/ftp-form.component';


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
    // Databases
    {
      path: 'databases/list',
      canActivate: [AuthGuardService],
      component: DatabaseListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'databases/form',
      canActivate: [AuthGuardService],
      component: DatabaseFormComponent,
    },
    {
      path: 'databases/form/:id',
      canActivate: [AuthGuardService],
      component: DatabaseFormComponent,
    },
    // Database users
    {
      path: 'database-users/list',
      canActivate: [AuthGuardService],
      component: DatabaseUserListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'database-users/form',
      canActivate: [AuthGuardService],
      component: DatabaseUserFormComponent,
    },
    {
      path: 'database-users/form/:id',
      canActivate: [AuthGuardService],
      component: DatabaseUserFormComponent,
    },
    // ftp users
    {
      path: 'ftps/list',
      canActivate: [AuthGuardService],
      component: FtpListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'ftps/form',
      canActivate: [AuthGuardService],
      component: FtpFormComponent,
    },
    {
      path: 'ftps/form/:id',
      canActivate: [AuthGuardService],
      component: FtpFormComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebHostingRoutingModule {
}
