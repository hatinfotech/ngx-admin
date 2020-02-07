import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VirtualPhoneComponent } from './virtual-phone.component';
import { DialpadComponent } from './dialpad/dialpad.component';

@NgModule({
  declarations: [VirtualPhoneComponent, DialpadComponent],
  imports: [
    CommonModule,
  ],
  exports: [
    DialpadComponent,
  ],
})
export class VirtualPhoneModule { }
