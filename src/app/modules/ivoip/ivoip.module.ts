import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IvoipComponent } from './ivoip.component';
import { CdrComponent } from './cdr/cdr.component';
import { IvoipRoutingModule } from './ivoip-routing.module';
import { NbCardModule, NbIconModule, NbButtonModule, NbInputModule, NbCheckboxModule, NbTabsetModule, NbRouteTabsetModule, NbStepperModule, NbListModule, NbAccordionModule, NbUserModule, NbSelectModule, NbActionsModule, NbRadioModule, NbDatepickerModule } from '@nebular/theme';
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
import { MenuRoutingModule } from '../menu/menu-routing.module';
import { CallBlockListComponent } from './call-blocks/call-block-list/call-block-list.component';
import { CallBlockFormComponent } from './call-blocks/call-block-form/call-block-form.component';
import { ExtensionListComponent, ButtonViewComponent } from './extensions/extension-list/extension-list.component';
import { ExtensionFormComponent } from './extensions/extension-form/extension-form.component';
import { DeviceListComponent } from './devices/device-list/device-list.component';
import { DeviceFormComponent } from './devices/device-form/device-form.component';
import { DomainListComponent } from './domains/domain-list/domain-list.component';
import { DomainFormComponent } from './domains/domain-form/domain-form.component';
import { CdrListComponent } from './cdrs/cdr-list/cdr-list.component';
import { SmartTableButtonComponent } from '../../lib/custom-element/smart-table/smart-table-checkbox.component';
import { PstnNumberListComponent } from './pstn-numbers/pstn-number-list/pstn-number-list.component';
import { PstnNumberFormComponent } from './pstn-numbers/pstn-number-form/pstn-number-form.component';
import { GatewayListComponent } from './gateways/gateway-list/gateway-list.component';
import { GatewayFormComponent } from './gateways/gateway-form/gateway-form.component';
import { DialplanListComponent } from './dialplans/dialplan-list/dialplan-list.component';
import { DialplanFormComponent } from './dialplans/dialplan-form/dialplan-form.component';
import { SortablejsModule } from 'ngx-sortablejs';
import { IvrMenuListComponent } from './ivr-menus/ivr-menu-list/ivr-menu-list.component';
import { IvrMenuFormComponent } from './ivr-menus/ivr-menu-form/ivr-menu-form.component';

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
  ],
  imports: [
    CommonModule,
    NbTabsetModule,
    IvoipRoutingModule,
    NbCardModule,
    Ng2SmartTableModule,
    CustomElementModule,
    NbIconModule,
    NbButtonModule,
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
    SortablejsModule.forRoot({
      animation: 200,
    }),
  ],
  // exports: [PbxFormComponent],
  // providers: [{
  //   provide: RouteReuseStrategy,
  //   useClass: CustomRouteReuseStrategy,
  // }],
  entryComponents: [
    ButtonViewComponent,
    SmartTableButtonComponent,
  ],
})
export class IvoipModule { }
