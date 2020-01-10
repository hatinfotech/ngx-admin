import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MinierpControllerComponent } from './minierp-controller.component';
import { AuthGuardService } from '../../services/auth-guard.service';
import { MinierpControllerDashboardComponent } from './minierp-controller-dashboard/minierp-controller-dashboard.component';
import { MinierpFormComponent } from './minierps/minierp-form/minierp-form.component';
import { MinierpListComponent } from './minierps/minierp-list/minierp-list.component';


const routes: Routes = [{
  path: '',
  component: MinierpControllerComponent,
  children: [
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: 'dashboard',
      canActivate: [AuthGuardService],
      component: MinierpControllerDashboardComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'minierps/list',
      canActivate: [AuthGuardService],
      component: MinierpListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'pbxs/form',
      canActivate: [AuthGuardService],
      component: MinierpFormComponent,
    },
    {
      path: 'pbxs/form/:id',
      canActivate: [AuthGuardService],
      component: MinierpFormComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IvoipRoutingModule {
}
