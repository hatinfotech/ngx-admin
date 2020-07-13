import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';
import { SystemComponent } from './system.component';
import { SystemParameterListComponent } from './parameter/system-parameter-list/system-parameter-list.component';
import { SystemParameterFormComponent } from './parameter/system-parameter-form/system-parameter-form.component';
import { SystemConfigurationBoardComponent } from './configuration/system-configuration-board/system-configuration-board.component';
import { UserConfigBoardComponent } from './configuration/user-config-board/user-config-board.component';

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
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemRoutingModule {
}
