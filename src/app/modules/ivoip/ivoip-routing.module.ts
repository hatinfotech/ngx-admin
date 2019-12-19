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
import { CallBlockListComponent } from './call-blocks/call-block-list/call-block-list.component';
import { CallBlockFormComponent } from './call-blocks/call-block-form/call-block-form.component';
import { ExtensionListComponent } from './extensions/extension-list/extension-list.component';
import { ExtensionFormComponent } from './extensions/extension-form/extension-form.component';
import { DeviceListComponent } from './devices/device-list/device-list.component';
import { DeviceFormComponent } from './devices/device-form/device-form.component';
import { DomainListComponent } from './domains/domain-list/domain-list.component';
import { DomainFormComponent } from './domains/domain-form/domain-form.component';
import { CdrListComponent } from './cdrs/cdr-list/cdr-list.component';
import { PstnNumberListComponent } from './pstn-numbers/pstn-number-list/pstn-number-list.component';
import { PstnNumberFormComponent } from './pstn-numbers/pstn-number-form/pstn-number-form.component';
import { GatewayFormComponent } from './gateways/gateway-form/gateway-form.component';
import { GatewayListComponent } from './gateways/gateway-list/gateway-list.component';
import { DialplanFormComponent } from './dialplans/dialplan-form/dialplan-form.component';
import { DialplanListComponent } from './dialplans/dialplan-list/dialplan-list.component';


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
      path: 'pbxs/list',
      // canActivate: [AuthGuardService],
      component: PbxListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'pbxs/form',
      // canActivate: [AuthGuardService],
      component: PbxFormComponent,
    },
    {
      path: 'pbxs/form/:id',
      // canActivate: [AuthGuardService],
      component: PbxFormComponent,
    },
    {
      path: 'domains/list',
      // canActivate: [AuthGuardService],
      component: DomainListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'domains/form',
      // canActivate: [AuthGuardService],
      component: DomainFormComponent,
    },
    {
      path: 'domains/form/:id',
      // canActivate: [AuthGuardService],
      component: DomainFormComponent,
    },
    {
      path: 'cdrs/list',
      // canActivate: [AuthGuardService],
      component: CdrListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'devices/list',
      // canActivate: [AuthGuardService],
      component: DeviceListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'devices/form',
      // canActivate: [AuthGuardService],
      component: DeviceFormComponent,
    },
    {
      path: 'devices/form/:id',
      // canActivate: [AuthGuardService],
      component: DeviceFormComponent,
    },
    // Pstn numbers
    {
      path: 'pstn-numbers/list',
      // canActivate: [AuthGuardService],
      component: PstnNumberListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'pstn-numbers/form',
      // canActivate: [AuthGuardService],
      component: PstnNumberFormComponent,
    },
    {
      path: 'pstn-numbers/form/:id',
      // canActivate: [AuthGuardService],
      component: PstnNumberFormComponent,
    },
    // Gateways
    {
      path: 'gateways/list',
      // canActivate: [AuthGuardService],
      component: GatewayListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'gateways/form',
      // canActivate: [AuthGuardService],
      component: GatewayFormComponent,
    },
    {
      path: 'gateways/form/:id',
      // canActivate: [AuthGuardService],
      component: GatewayFormComponent,
    },
    // Dialplans
    {
      path: 'dialplans/list',
      // canActivate: [AuthGuardService],
      component: DialplanListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'dialplans/form',
      // canActivate: [AuthGuardService],
      component: DialplanFormComponent,
    },
    {
      path: 'dialplans/form/:id',
      // canActivate: [AuthGuardService],
      component: DialplanFormComponent,
    },
    {
      path: 'extensions/list',
      component: ExtensionListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'extensions/form',
      component: ExtensionFormComponent,
    },
    {
      path: 'extensions/form/:id',
      component: ExtensionFormComponent,
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
      path: 'call-blocks/list',
      // canActivate: [AuthGuardService],
      component: CallBlockListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'call-blocks/form',
      // canActivate: [AuthGuardService],
      component: CallBlockFormComponent,
    },
    {
      path: 'call-blocks/form/:id',
      // canActivate: [AuthGuardService],
      component: CallBlockFormComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IvoipRoutingModule {
}
