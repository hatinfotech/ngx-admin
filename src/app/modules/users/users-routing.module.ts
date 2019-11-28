import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';
import { UserGroupListComponent } from './user-group/user-group-list/user-group-list.component';
import { UserGroupFormComponent } from './user-group/user-group-form/user-group-form.component';
import { UserGroupViewComponent } from './user-group/user-group-view/user-group-view.component';
import { UserGroupReportComponent } from './user-group/user-group-report/user-group-report.component';
import { UserListComponent } from './user-manager/user-list/user-list.component';
import { UserFormComponent } from './user-manager/user-form/user-form.component';
import { UserViewComponent } from './user-manager/user-view/user-view.component';
import { UserReportComponent } from './user-manager/user-report/user-report.component';
import { PermissionGrantComponent } from './permission-grant/permission-grant.component';
import { AuthGuardService } from '../../services/auth-guard.service';


const routes: Routes = [{
  path: '',
  component: UsersComponent,
  children: [
    // User manager
    {
      path: 'user-manager',
      redirectTo: 'user-manager/list',
      pathMatch: 'full',
    },
    {
      path: 'user-manager/list',
      // canActivate: [AuthGuardService],
      component: UserListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'user-manager/form',
      // canActivate: [AuthGuardService],
      component: UserFormComponent,
    },
    {
      path: 'user-manager/form/:id',
      // canActivate: [AuthGuardService],
      component: UserFormComponent,
    },
    {
      path: 'user-manager/view',
      // canActivate: [AuthGuardService],
      component: UserViewComponent,
    },
    {
      path: 'user-manager/report',
      canActivate: [AuthGuardService],
      component: UserReportComponent,
    },
    // User group
    {
      path: 'group',
      redirectTo: 'group/list',
      pathMatch: 'full',
    },
    {
      path: 'group/list',
      // canActivate: [AuthGuardService],
      component: UserGroupListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'group/form',
      // canActivate: [AuthGuardService],
      component: UserGroupFormComponent,
    },
    {
      path: 'group/form/:id',
      // canActivate: [AuthGuardService],
      component: UserGroupFormComponent,
    },
    {
      path: 'group/view',
      // canActivate: [AuthGuardService],
      component: UserGroupViewComponent,
    },
    {
      path: 'group/report',
      canActivate: [AuthGuardService],
      component: UserGroupReportComponent,
    },
    // Permission
    {
      path: 'permission',
      redirectTo: 'permission/grant',
      pathMatch: 'full',
    },
    {
      path: 'permission/grant',
      // canActivate: [AuthGuardService],
      component: PermissionGrantComponent,
      data: {
        reuse: true,
      },
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {
}
