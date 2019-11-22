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
      component: UserListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'user-manager/form',
      component: UserFormComponent,
    },
    {
      path: 'user-manager/form/:id',
      component: UserFormComponent,
    },
    {
      path: 'user-manager/view',
      component: UserViewComponent,
    },
    {
      path: 'user-manager/report',
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
      component: UserGroupListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'group/form',
      component: UserGroupFormComponent,
    },
    {
      path: 'group/form/:id',
      component: UserGroupFormComponent,
    },
    {
      path: 'group/view',
      component: UserGroupViewComponent,
    },
    {
      path: 'group/report',
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
