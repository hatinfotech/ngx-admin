import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobileAppComponent } from './mobile-app.component';
import { DialpadComponent } from './dialpad/dialpad.component';
import { NbIconModule, NbCardModule, NbButtonModule } from '@nebular/theme';
import { MediaPlayerComponent } from './media-player/media-player.component';
import { ThemeModule } from '../../@theme/theme.module';
import { TimingPipe } from './pipe/timing.pipe';

@NgModule({
  declarations: [MobileAppComponent, DialpadComponent, MediaPlayerComponent, TimingPipe],
  imports: [
    CommonModule,
    NbIconModule,
    NbCardModule,
    NbButtonModule,
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
