import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobileAppComponent } from './mobile-app.component';
import { DialpadComponent } from './dialpad/dialpad.component';
import { NbIconModule, NbCardModule, NbButtonModule } from '@nebular/theme';
import { MediaPlayerComponent } from './media-player/media-player.component';
import { TimingPipe } from './pipe/timing.pipe';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [MobileAppComponent, DialpadComponent, MediaPlayerComponent, TimingPipe],
  imports: [
    CommonModule,
    NbIconModule,
    NbCardModule,
    NbButtonModule,
    FormsModule,
    // ThemeModule,
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
