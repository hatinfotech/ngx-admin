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
import { UserChangePasswordFormComponent } from './profile/user-change-password-form/user-change-password-form.component';


export const userRoutes: Routes = [{
  path: '',
  component: UsersComponent,
  children: [
    // User manager
    {
      path: 'users/user-manager',
      redirectTo: 'user-manager/list',
      pathMatch: 'full',
    },
    {
      path: 'users/user-manager/list',
      // canActivate: [AuthGuardService],
      component: UserListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'users/user-manager/form',
      // canActivate: [AuthGuardService],
      component: UserFormComponent,
    },
    {
      path: 'users/user-manager/form/:id',
      // canActivate: [AuthGuardService],
      component: UserFormComponent,
    },
    {
      path: 'users/user-manager/view',
      // canActivate: [AuthGuardService],
      component: UserViewComponent,
    },
    {
      path: 'users/user-manager/report',
      canActivate: [AuthGuardService],
      component: UserReportComponent,
    },
    // User group
    {
      path: 'users/group',
      redirectTo: 'group/list',
      pathMatch: 'full',
    },
    {
      path: 'users/group/list',
      // canActivate: [AuthGuardService],
      component: UserGroupListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'users/group/form',
      // canActivate: [AuthGuardService],
      component: UserGroupFormComponent,
    },
    {
      path: 'users/group/form/:id',
      // canActivate: [AuthGuardService],
      component: UserGroupFormComponent,
    },
    {
      path: 'users/group/view',
      // canActivate: [AuthGuardService],
      component: UserGroupViewComponent,
    },
    {
      path: 'users/group/report',
      canActivate: [AuthGuardService],
      component: UserGroupReportComponent,
    },
    // Permission
    {
      path: 'users/permission',
      redirectTo: 'permission/grant',
      pathMatch: 'full',
    },
    {
      path: 'users/permission/grant',
      canActivate: [AuthGuardService],
      component: PermissionGrantComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'users/profile/change-password',
      canActivate: [AuthGuardService],
      component: UserChangePasswordFormComponent,
    },
  ],
}];

// @NgModule({
//   imports: [RouterModule.forChild(userRoutes)],
//   exports: [RouterModule],
// })
// export class UsersRoutingModule {
// }
