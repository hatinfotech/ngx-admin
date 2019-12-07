import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification.component';
import { NbCardModule, NbIconModule, NbButtonModule } from '@nebular/theme';

@NgModule({
  declarations: [NotificationComponent],
  imports: [
    CommonModule,
    NbCardModule,
    NbIconModule,
    NbButtonModule,
  ],
})
export class NotificationModule { }
