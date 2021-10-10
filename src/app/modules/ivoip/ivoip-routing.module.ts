import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IvoipComponent } from './ivoip.component';
import { AuthGuardService } from '../../services/auth-guard.service';
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
import { IvrMenuListComponent } from './ivr-menus/ivr-menu-list/ivr-menu-list.component';
import { IvrMenuFormComponent } from './ivr-menus/ivr-menu-form/ivr-menu-form.component';
import { CallRouteListComponent } from './call-routes/call-route-list/call-route-list.component';
import { CallRouteFormComponent } from './call-routes/call-route-form/call-route-form.component';
import { TimeConditionListComponent } from './time-conditions/time-condition-list/time-condition-list.component';
import { TimeConditionFormComponent } from './time-conditions/time-condition-form/time-condition-form.component';
import { CallCenterListComponent } from './call-centers/call-center-list/call-center-list.component';
import { CallCenterFormComponent } from './call-centers/call-center-form/call-center-form.component';
import { CallCenterAgentListComponent } from './call-centers/agents/call-center-agent-list/call-center-agent-list.component';
import { CallCenterAgentFormComponent } from './call-centers/agents/call-center-agent-form/call-center-agent-form.component';
import { RecordingListComponent } from './recordings/recording-list/recording-list.component';
import { RecordingFormComponent } from './recordings/recording-form/recording-form.component';
import { CustomerListComponent } from './customers/customer-list/customer-list.component';
import { CustomerFormComponent } from './customers/customer-form/customer-form.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserFormComponent } from './users/user-form/user-form.component';
import { IvoipDashboardComponent } from './dashboard/ivoip-dashboard.component';


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
      canActivate: [AuthGuardService],
      component: IvoipDashboardComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'pbxs/list',
      canActivate: [AuthGuardService],
      component: PbxListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'pbxs/form',
      canActivate: [AuthGuardService],
      component: PbxFormComponent,
    },
    {
      path: 'pbxs/form/:id',
      canActivate: [AuthGuardService],
      component: PbxFormComponent,
    },
    {
      path: 'domains/list',
      canActivate: [AuthGuardService],
      component: DomainListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'domains/form',
      canActivate: [AuthGuardService],
      component: DomainFormComponent,
    },
    {
      path: 'domains/form/:id',
      canActivate: [AuthGuardService],
      component: DomainFormComponent,
    },
    {
      path: 'cdrs/list',
      canActivate: [AuthGuardService],
      component: CdrListComponent,
      // resolve: {
      //   configuration: RoutingResolve,
      // },
      data: {
        reuse: true,
      },
    },
    {
      path: 'devices/list',
      canActivate: [AuthGuardService],
      component: DeviceListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'devices/form',
      canActivate: [AuthGuardService],
      component: DeviceFormComponent,
    },
    {
      path: 'devices/form/:id',
      canActivate: [AuthGuardService],
      component: DeviceFormComponent,
    },
    // Pstn numbers
    {
      path: 'pstn-numbers/list',
      canActivate: [AuthGuardService],
      component: PstnNumberListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'pstn-numbers/form',
      canActivate: [AuthGuardService],
      component: PstnNumberFormComponent,
    },
    {
      path: 'pstn-numbers/form/:id',
      canActivate: [AuthGuardService],
      component: PstnNumberFormComponent,
    },
    // Gateways
    {
      path: 'gateways/list',
      canActivate: [AuthGuardService],
      component: GatewayListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'gateways/form',
      canActivate: [AuthGuardService],
      component: GatewayFormComponent,
    },
    {
      path: 'gateways/form/:id',
      canActivate: [AuthGuardService],
      component: GatewayFormComponent,
    },
    // Dialplans
    {
      path: 'dialplans/list',
      canActivate: [AuthGuardService],
      component: DialplanListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'dialplans/form',
      canActivate: [AuthGuardService],
      component: DialplanFormComponent,
    },
    {
      path: 'dialplans/form/:id',
      canActivate: [AuthGuardService],
      component: DialplanFormComponent,
    },
    // Time conditions
    {
      path: 'time-conditions/list',
      canActivate: [AuthGuardService],
      component: TimeConditionListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'time-conditions/form',
      canActivate: [AuthGuardService],
      component: TimeConditionFormComponent,
    },
    {
      path: 'time-conditions/form/:id',
      canActivate: [AuthGuardService],
      component: TimeConditionFormComponent,
    },
    // Call centers
    {
      path: 'call-centers/list',
      canActivate: [AuthGuardService],
      component: CallCenterListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'call-centers/form',
      canActivate: [AuthGuardService],
      component: CallCenterFormComponent,
    },
    {
      path: 'call-centers/form/:id',
      canActivate: [AuthGuardService],
      component: CallCenterFormComponent,
    },
    // Call center agents
    {
      path: 'call-centers/agents/list',
      canActivate: [AuthGuardService],
      component: CallCenterAgentListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'call-centers/agents/form',
      canActivate: [AuthGuardService],
      component: CallCenterAgentFormComponent,
    },
    {
      path: 'call-centers/agents/form/:id',
      canActivate: [AuthGuardService],
      component: CallCenterAgentFormComponent,
    },
    // Call routing
    {
      path: 'call-routes/list',
      canActivate: [AuthGuardService],
      component: CallRouteListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'call-routes/form',
      canActivate: [AuthGuardService],
      component: CallRouteFormComponent,
    },
    {
      path: 'call-routes/form/:id',
      canActivate: [AuthGuardService],
      component: CallRouteFormComponent,
    },
    // IVR Menu
    {
      path: 'ivr-menus/list',
      canActivate: [AuthGuardService],
      component: IvrMenuListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'ivr-menus/form',
      canActivate: [AuthGuardService],
      component: IvrMenuFormComponent,
    },
    {
      path: 'ivr-menus/form/:id',
      canActivate: [AuthGuardService],
      component: IvrMenuFormComponent,
    },
    {
      path: 'extensions/list',
      canActivate: [AuthGuardService],
      component: ExtensionListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'extensions/form',
      canActivate: [AuthGuardService],
      component: ExtensionFormComponent,
    },
    {
      path: 'extensions/form/:id',
      canActivate: [AuthGuardService],
      component: ExtensionFormComponent,
    },
    {
      path: 'call-blocks/list',
      canActivate: [AuthGuardService],
      component: CallBlockListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'call-blocks/form',
      canActivate: [AuthGuardService],
      component: CallBlockFormComponent,
    },
    {
      path: 'call-blocks/form/:id',
      canActivate: [AuthGuardService],
      component: CallBlockFormComponent,
    },
    // Recordings
    {
      path: 'recordings/list',
      canActivate: [AuthGuardService],
      component: RecordingListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'recordings/form',
      canActivate: [AuthGuardService],
      component: RecordingFormComponent,
    },
    {
      path: 'recordings/form/:id',
      canActivate: [AuthGuardService],
      component: RecordingFormComponent,
    },
    // Customers
    {
      path: 'customers/list',
      canActivate: [AuthGuardService],
      component: CustomerListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'customers/form',
      canActivate: [AuthGuardService],
      component: CustomerFormComponent,
    },
    {
      path: 'customers/form/:id',
      canActivate: [AuthGuardService],
      component: CustomerFormComponent,
    },
    // Users
    {
      path: 'users/list',
      canActivate: [AuthGuardService],
      component: UserListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'users/form',
      canActivate: [AuthGuardService],
      component: UserFormComponent,
    },
    {
      path: 'users/form/:id',
      canActivate: [AuthGuardService],
      component: UserFormComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IvoipRoutingModule {
}
