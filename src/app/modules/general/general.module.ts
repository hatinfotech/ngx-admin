// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { NbListModule, NbCardModule, NbUserModule, NbBadgeModule, NbIconModule, NbButtonModule, NbDialogModule } from '@nebular/theme';
// import { HeaderNotificationContextDirective } from './header/header-notification-context/header-notification-context.directive';
// import { HeaderNotificationContextComponent } from './header/header-notification-context/header-notification-context.component';
// import { ActivityNotificationComponent } from './header/activity-notification/activity-notification.component';
// import { RelativeVoucherComponent } from './voucher/relative-voucher/relative-voucher.component';
// import { FilesViewerComponent } from './files-viewer/files-viewer.component';

import { GoogleMapComponent } from "./google-map/google-map.component";


// @NgModule({
//   declarations: [
//     HeaderNotificationContextDirective,
//     HeaderNotificationContextComponent,
//     ActivityNotificationComponent,
//     RelativeVoucherComponent,
//     FilesViewerComponent,
//   ],
//   imports: [
//     CommonModule,
//     NbListModule,
//     NbCardModule,
//     NbListModule,
//     NbUserModule,
//     NbBadgeModule,
//     NbIconModule,
//     NbButtonModule,
//     // SalesModule,
//     NbDialogModule.forChild(),
//   ],
//   exports: [
//     HeaderNotificationContextDirective,
//     ActivityNotificationComponent,
//     RelativeVoucherComponent,
//   ],
//   entryComponents: [
//     HeaderNotificationContextComponent,
//     // SalesVoucherListComponent,
//   ],
// })
// export class GeneralModule { }

export const generalComponents = [
    GoogleMapComponent,
];