import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowcaseDialogComponent } from './showcase-dialog/showcase-dialog.component';
import { NbCardModule, NbButtonModule } from '@nebular/theme';

@NgModule({
  declarations: [ShowcaseDialogComponent],
  imports: [
    CommonModule,
    NbCardModule,
    NbButtonModule,
  ],
  exports: [ShowcaseDialogComponent],
})
export class DialogModule { }
