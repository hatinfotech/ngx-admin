import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobileAppComponent } from './mobile-app.component';
import { DialpadComponent } from './dialpad/dialpad.component';
import { NbIconModule } from '@nebular/theme';

@NgModule({
  declarations: [MobileAppComponent, DialpadComponent],
  imports: [
    CommonModule,
    NbIconModule,
  ],
  // exports: [
  //   MobileAppComponent,
  // ],
  exports: [
    // MobileAppComponent,
    MobileAppComponent,
  ],
})
export class MobileAppModule { }
