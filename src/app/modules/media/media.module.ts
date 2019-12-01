import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerComponent } from './player/player.component';
import { NbCardModule, NbIconModule, NbUserModule, NbButtonModule, NbTabsetModule, NbActionsModule, NbRadioModule, NbSelectModule, NbListModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  declarations: [PlayerComponent],
  imports: [
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
  exports: [PlayerComponent],
})
export class MediaModule { }
