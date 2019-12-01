import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowcaseDialogComponent } from './showcase-dialog/showcase-dialog.component';
import { NbCardModule, NbButtonModule, NbIconModule, NbUserModule, NbTabsetModule, NbActionsModule, NbRadioModule, NbSelectModule, NbListModule } from '@nebular/theme';
import { PlayerDialogComponent } from './player-dialog/player-dialog.component';
import { MediaModule } from '../media/media.module';
import { ThemeModule } from '../../@theme/theme.module';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  declarations: [ShowcaseDialogComponent, PlayerDialogComponent],
  imports: [
    MediaModule,

    CommonModule,
    NbCardModule,
    ThemeModule,
    NbUserModule,
    NbTabsetModule,
    NbActionsModule,
    NbRadioModule,
    NbSelectModule,
    NbListModule,
    NbIconModule,
    NbButtonModule,
    NgxEchartsModule,
  ],
  exports: [ShowcaseDialogComponent, PlayerDialogComponent],
})
export class DialogModule { }
