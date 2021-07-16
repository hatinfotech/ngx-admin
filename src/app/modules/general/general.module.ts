import { SalesVoucherListComponent } from './../sales/sales-voucher/sales-voucher-list/sales-voucher-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbListModule, NbCardModule, NbUserModule, NbBadgeModule, NbIconModule, NbButtonModule, NbDialogModule } from '@nebular/theme';
import { HeaderNotificationContextDirective } from './header/header-notification-context/header-notification-context.directive';
import { HeaderNotificationContextComponent } from './header/header-notification-context/header-notification-context.component';
import { ActivityNotificationComponent } from './header/activity-notification/activity-notification.component';
import { RelativeVoucherComponent } from './voucher/relative-voucher/relative-voucher.component';
// import { SalesModule } from '../sales/sales.module';



@NgModule({
  declarations: [
    HeaderNotificationContextDirective,
    HeaderNotificationContextComponent,
    ActivityNotificationComponent,
    RelativeVoucherComponent,
  ],
  imports: [
    CommonModule,
    NbListModule,
    NbCardModule,
    NbListModule,
    NbUserModule,
    NbBadgeModule,
    NbIconModule,
    NbButtonModule,
    // SalesModule,
    NbDialogModule.forChild(),
  ],
  exports: [
    HeaderNotificationContextDirective,
    ActivityNotificationComponent,
    RelativeVoucherComponent,
  ],
  entryComponents: [
    HeaderNotificationContextComponent,
    // SalesVoucherListComponent,
  ],
})
export class GeneralModule { }
