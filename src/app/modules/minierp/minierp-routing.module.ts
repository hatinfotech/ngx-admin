import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MinierpComponent } from './minierp.component';
import { AuthGuardService } from '../../services/auth-guard.service';
import { MinierpDashboardComponent } from './minierp-dashboard/minierp-dashboard.component';
import { MinierpFormComponent } from './minierps/minierp-form/minierp-form.component';
import { MinierpListComponent } from './minierps/minierp-list/minierp-list.component';


const routes: Routes = [{
  path: '',
  component: MinierpComponent,
  children: [
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: 'dashboard',
      canActivate: [AuthGuardService],
      component: MinierpDashboardComponent,
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
      path: 'minierps/form',
      canActivate: [AuthGuardService],
      component: MinierpFormComponent,
    },
    {
      path: 'minierps/form/:id',
      canActivate: [AuthGuardService],
      component: MinierpFormComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MinierpRoutingModule {
}
