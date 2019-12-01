import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CdrComponent } from './cdr/cdr.component';
import { IvoipComponent } from './ivoip.component';
import { DevicesComponent } from './devices/devices.component';
import { ExtensionsComponent } from './extensions/extensions.component';
import { PstnNumbersComponent } from './pstn-numbers/pstn-numbers.component';
import { CallBlocksComponent } from './call-blocks/call-blocks.component';
import { AuthGuardService } from '../../services/auth-guard.service';
import { IvoipDashboardComponent } from './dashboard/ivoip-dashboard.component';
import { PbxListComponent } from './pbx/pbx-list/pbx-list.component';
import { PbxFormComponent } from './pbx/pbx-form/pbx-form.component';


const routes: Routes = [{
  path: '',
  component: IvoipComponent,
  children: [
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: 'dashboard',
      // canActivate: [AuthGuardService],
      component: IvoipDashboardComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'pbx/list',
      // canActivate: [AuthGuardService],
      component: PbxListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'pbx/form/:id',
      // canActivate: [AuthGuardService],
      component: PbxFormComponent,
    },
    {
      path: 'pbx/form',
      // canActivate: [AuthGuardService],
      component: PbxFormComponent,
    },
    {
      path: 'cdr',
      canActivate: [AuthGuardService],
      component: CdrComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'devices',
      canActivate: [AuthGuardService],
      component: DevicesComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'extensions',
      component: ExtensionsComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'pstn-numbers',
      canActivate: [AuthGuardService],
      component: PstnNumbersComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'call-blocks',
      canActivate: [AuthGuardService],
      component: CallBlocksComponent,
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
export class IvoipRoutingModule {
}
