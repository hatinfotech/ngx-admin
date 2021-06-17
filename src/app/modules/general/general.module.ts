import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbListModule, NbCardModule, NbUserModule, NbBadgeModule } from '@nebular/theme';
import { HeaderNotificationContextDirective } from './header/header-notification-context/header-notification-context.directive';
import { HeaderNotificationContextComponent } from './header/header-notification-context/header-notification-context.component';



@NgModule({
  declarations: [
    HeaderNotificationContextDirective,
    HeaderNotificationContextComponent,
  ],
  imports: [
    CommonModule,
    NbListModule,
    NbCardModule,
    NbListModule,
    NbUserModule,
    NbBadgeModule,
  ],
  exports: [
    HeaderNotificationContextDirective,
  ],
  entryComponents: [
    HeaderNotificationContextComponent,
  ],
})
export class GeneralModule { }
