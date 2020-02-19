import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobileAppComponent } from './mobile-app.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { DialpadComponent } from './dialpad/dialpad.component';

@NgModule({
  declarations: [MobileAppComponent, ChatRoomComponent, DialpadComponent],
  imports: [
    CommonModule,
  ],
  // exports: [
  //   MobileAppComponent,
  // ],
  exports: [
    // MobileAppComponent,
    ChatRoomComponent,
  ],
})
export class MobileAppModule { }
