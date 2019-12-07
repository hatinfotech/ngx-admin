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

@NgModule({
  declarations: [
    IvoipComponent, CdrComponent,
    ExtensionsComponent, DevicesComponent,
    PstnNumbersComponent, CallBlocksComponent,
    PbxListComponent, PbxFormComponent, CallBlockListComponent, CallBlockFormComponent],
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
  ],
  // exports: [PbxFormComponent],
  // providers: [{
  //   provide: RouteReuseStrategy,
  //   useClass: CustomRouteReuseStrategy,
  // }],
})
export class IvoipModule { }
