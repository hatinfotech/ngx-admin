import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowcaseDialogComponent } from './showcase-dialog/showcase-dialog.component';
import { NbCardModule, NbButtonModule, NbIconModule, NbUserModule, NbTabsetModule, NbActionsModule, NbRadioModule, NbSelectModule, NbListModule, NbInputModule, NbCheckboxModule } from '@nebular/theme';
import { PlayerDialogComponent } from './player-dialog/player-dialog.component';
import { ThemeModule } from '../../@theme/theme.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { DialogFormComponent } from './dialog-form/dialog-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomElementModule } from '../../lib/custom-element/custom-element.module';

@NgModule({
  declarations: [ShowcaseDialogComponent, PlayerDialogComponent, DialogFormComponent],
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
    NbInputModule,
    NbCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    CustomElementModule,
  ],
  exports: [ShowcaseDialogComponent, PlayerDialogComponent, DialogFormComponent],
})
export class DialogModule { }
