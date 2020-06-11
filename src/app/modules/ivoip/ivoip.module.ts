import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IvoipComponent } from './ivoip.component';
import { CdrComponent } from './cdr/cdr.component';
import { IvoipRoutingModule } from './ivoip-routing.module';
import { NbCardModule, NbIconModule, NbButtonModule, NbInputModule, NbCheckboxModule, NbTabsetModule, NbRouteTabsetModule, NbStepperModule, NbListModule, NbAccordionModule, NbUserModule, NbSelectModule, NbActionsModule, NbRadioModule, NbDatepickerModule, NbProgressBarModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CustomElementModule } from '../../lib/custom-element/custom-element.module';
import { ExtensionsComponent } from './extensions/extensions.component';
import { DevicesComponent } from './devices/devices.component';
import { PstnNumbersComponent } from './pstn-numbers/pstn-numbers.component';
import { CallBlocksComponent } from './call-blocks/call-blocks.component';
import { IvoipDashboardModule } from './dashboard/ivoip-dashboard.module';
import { PbxFormComponent } from './pbx/pbx-form/pbx-form.component';
import { PbxListComponent } from './pbx/pbx-list/pbx-list.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '../dialog/dialog.module';
import { CallBlockListComponent } from './call-blocks/call-block-list/call-block-list.component';
import { CallBlockFormComponent } from './call-blocks/call-block-form/call-block-form.component';
import { ExtensionListComponent, ButtonViewComponent } from './extensions/extension-list/extension-list.component';
import { ExtensionFormComponent } from './extensions/extension-form/extension-form.component';
import { DeviceListComponent } from './devices/device-list/device-list.component';
import { DeviceFormComponent } from './devices/device-form/device-form.component';
import { DomainListComponent } from './domains/domain-list/domain-list.component';
import { DomainFormComponent } from './domains/domain-form/domain-form.component';
import { CdrListComponent } from './cdrs/cdr-list/cdr-list.component';
import { SmartTableButtonComponent, SmartTableDateTimeComponent } from '../../lib/custom-element/smart-table/smart-table.component';
import { PstnNumberListComponent } from './pstn-numbers/pstn-number-list/pstn-number-list.component';
import { PstnNumberFormComponent } from './pstn-numbers/pstn-number-form/pstn-number-form.component';
import { GatewayListComponent } from './gateways/gateway-list/gateway-list.component';
import { GatewayFormComponent } from './gateways/gateway-form/gateway-form.component';
import { DialplanListComponent } from './dialplans/dialplan-list/dialplan-list.component';
import { DialplanFormComponent } from './dialplans/dialplan-form/dialplan-form.component';
import { SortablejsModule } from 'ngx-sortablejs';
import { IvrMenuListComponent } from './ivr-menus/ivr-menu-list/ivr-menu-list.component';
import { IvrMenuFormComponent } from './ivr-menus/ivr-menu-form/ivr-menu-form.component';
import { TimeConditionListComponent } from './time-conditions/time-condition-list/time-condition-list.component';
import { TimeConditionFormComponent } from './time-conditions/time-condition-form/time-condition-form.component';
import { CallRouteListComponent } from './call-routes/call-route-list/call-route-list.component';
import { CallRouteFormComponent } from './call-routes/call-route-form/call-route-form.component';
import { CallCenterFormComponent } from './call-centers/call-center-form/call-center-form.component';
import { CallCenterListComponent } from './call-centers/call-center-list/call-center-list.component';
import { CallCenterAgentListComponent } from './call-centers/agents/call-center-agent-list/call-center-agent-list.component';
import { CallCenterAgentFormComponent } from './call-centers/agents/call-center-agent-form/call-center-agent-form.component';
import { RecordingListComponent } from './recordings/recording-list/recording-list.component';
import { RecordingFormComponent } from './recordings/recording-form/recording-form.component';
import { CustomerListComponent } from './customers/customer-list/customer-list.component';
import { CustomerFormComponent } from './customers/customer-form/customer-form.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserFormComponent } from './users/user-form/user-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { RoutingResolve } from '../../app-routing.module';

@NgModule({
  declarations: [
    IvoipComponent, CdrComponent,
    ExtensionsComponent, DevicesComponent,
    PstnNumbersComponent, CallBlocksComponent,
    PbxListComponent, PbxFormComponent, CallBlockListComponent, CallBlockFormComponent,
    ExtensionListComponent, ExtensionFormComponent,
    ButtonViewComponent,
    DeviceListComponent,
    DeviceFormComponent,
    DomainListComponent,
    DomainFormComponent,
    CdrListComponent,
    PstnNumberListComponent,
    PstnNumberFormComponent,
    GatewayListComponent,
    GatewayFormComponent,
    DialplanListComponent,
    DialplanFormComponent,
    IvrMenuListComponent,
    IvrMenuFormComponent,
    TimeConditionListComponent,
    TimeConditionFormComponent,
    CallRouteListComponent,
    CallRouteFormComponent,
    CallCenterListComponent,
    CallCenterFormComponent,
    CallCenterAgentListComponent,
    CallCenterAgentFormComponent,
    RecordingListComponent,
    RecordingFormComponent,
    CustomerListComponent,
    CustomerFormComponent,
    UserListComponent,
    UserFormComponent,
  ],
  imports: [
    CommonModule,
    NbTabsetModule,
    IvoipRoutingModule,
    NbCardModule,
    Ng2SmartTableModule,
    CustomElementModule,
    NbIconModule,
    NbInputModule,
    NbCheckboxModule,
    IvoipDashboardModule,
    NbRouteTabsetModule,
    NbStepperModule,
    NbButtonModule,
    NbListModule,
    NbAccordionModule,
    NbUserModule,
    NbSelectModule,
    NbActionsModule,
    NbRadioModule,
    NbDatepickerModule,
    CurrencyMaskModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    NbProgressBarModule,
    TranslateModule,
    SortablejsModule.forRoot({
      animation: 200,
    }),
  ],
  // exports: [PbxFormComponent],
  providers: [
    // {
    //   provide: RouteReuseStrategy,
    //   useClass: CustomRouteReuseStrategy,
    // },
    // RoutingResolve,
  ],
  entryComponents: [
    ButtonViewComponent,
    SmartTableButtonComponent,
    SmartTableDateTimeComponent,
  ],
})
export class IvoipModule { }
