import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VirtualPhoneComponent } from './virtual-phone.component';
import { VirtualPhoneRoutingModule } from './virtual-phone-routing.module';
import { DialpadComponent } from './dialpad/dialpad.component';

@NgModule({
  declarations: [VirtualPhoneComponent, DialpadComponent],
  imports: [
    CommonModule,
    VirtualPhoneRoutingModule,
  ],
  exports: [
    DialpadComponent,
  ],
})
export class VirtualPhoneModule { }
