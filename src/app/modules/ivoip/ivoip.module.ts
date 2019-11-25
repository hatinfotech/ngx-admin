import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IvoipComponent } from './ivoip.component';
import { CdrComponent } from './cdr/cdr.component';
import { IvoipRoutingModule } from './ivoip-routing.module';
import { NbCardModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CustomElementModule } from '../../lib/custom-element/custom-element.module';
import { PbxComponent } from './pbx/pbx.component';
import { ExtensionsComponent } from './extensions/extensions.component';
import { DevicesComponent } from './devices/devices.component';
import { PstnNumbersComponent } from './pstn-numbers/pstn-numbers.component';
import { CallBlocksComponent } from './call-blocks/call-blocks.component';

@NgModule({
  declarations: [
    IvoipComponent, CdrComponent, PbxComponent,
    ExtensionsComponent, DevicesComponent,
    PstnNumbersComponent, CallBlocksComponent],
  imports: [
    CommonModule,
    IvoipRoutingModule,
    NbCardModule,
    Ng2SmartTableModule,
    CustomElementModule,
  ],
  // providers: [{
  //   provide: RouteReuseStrategy,
  //   useClass: CustomRouteReuseStrategy,
  // }],
})
export class IvoipModule { }
