import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';
import { SystemComponent } from './system.component';
import { SystemParameterListComponent } from './parameter/system-parameter-list/system-parameter-list.component';
import { SystemParameterFormComponent } from './parameter/system-parameter-form/system-parameter-form.component';
import { SystemConfigurationBoardComponent } from './configuration/system-configuration-board/system-configuration-board.component';
import { UserConfigBoardComponent } from './configuration/user-config-board/user-config-board.component';
import { SystemRouteListComponent } from './route/system-route-list/system-route-list.component';
import { SystemRouteFormComponent } from './route/system-route-form/system-route-form.component';
import { SystemParamListComponent } from './param/system-param-list/system-param-list.component';
import { SystemParamFormComponent } from './param/system-param-form/system-param-form.component';
import { SystemActionListComponent } from './action/system-action-list/system-action-list.component';
import { SystemActionFormComponent } from './action/system-action-form/system-action-form.component';

const routes: Routes = [{
  path: '',
  component: SystemComponent,
  children: [
    {
      path: 'parameter/list',
      canActivate: [AuthGuardService],
      component: SystemParameterListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'parameter/form',
      canActivate: [AuthGuardService],
      component: SystemParameterFormComponent,
    },
    {
      path: 'parameter/form/:id',
      canActivate: [AuthGuardService],
      component: SystemParameterFormComponent,
    },
    {
      path: 'config-board',
      canActivate: [AuthGuardService],
      component: SystemConfigurationBoardComponent,
    },
    {
      path: 'user-config-board',
      canActivate: [AuthGuardService],
      component: UserConfigBoardComponent,
    },
    // Routes
    {
      path: 'route/rule/list',
      canActivate: [AuthGuardService],
      component: SystemRouteListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'route/rule/form',
      canActivate: [AuthGuardService],
      component: SystemRouteFormComponent,
    },
    {
      path: 'route/rule/form/:id',
      canActivate: [AuthGuardService],
      component: SystemRouteFormComponent,
    },
    // Params
    {
      path: 'route/param/list',
      canActivate: [AuthGuardService],
      component: SystemParamListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'route/param/form',
      canActivate: [AuthGuardService],
      component: SystemParamFormComponent,
    },
    {
      path: 'route/param/form/:id',
      canActivate: [AuthGuardService],
      component: SystemParamFormComponent,
    },
    // Action
    {
      path: 'route/action/list',
      canActivate: [AuthGuardService],
      component: SystemActionListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'route/action/form',
      canActivate: [AuthGuardService],
      component: SystemActionFormComponent,
    },
    {
      path: 'route/action/form/:id',
      canActivate: [AuthGuardService],
      component: SystemActionFormComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemRoutingModule {
}
