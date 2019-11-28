import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CdrComponent } from './cdr/cdr.component';
import { IvoipComponent } from './ivoip.component';
import { PbxComponent } from './pbx/pbx.component';
import { DevicesComponent } from './devices/devices.component';
import { ExtensionsComponent } from './extensions/extensions.component';
import { PstnNumbersComponent } from './pstn-numbers/pstn-numbers.component';
import { CallBlocksComponent } from './call-blocks/call-blocks.component';
import { AuthGuardService } from '../../services/auth-guard.service';


const routes: Routes = [{
  path: '',
  component: IvoipComponent,
  children: [
    {
      path: '',
      redirectTo: 'cdr',
      pathMatch: 'full',
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
      path: 'pbx',
      canActivate: [AuthGuardService],
      component: PbxComponent,
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
