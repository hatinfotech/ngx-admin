import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Test2Component } from './test2.component';
import {
  NbCardModule, NbCheckboxModule,
  NbTabsetModule, NbPopoverModule, NbButtonModule, NbInputModule,
  NbSelectModule, NbTooltipModule, NbDialogModule, NbWindowModule,
} from '@nebular/theme';
import { DialogNamePromptComponent } from '../modal-overlays/dialog/dialog-name-prompt/dialog-name-prompt.component';
import { WindowFormComponent } from '../modal-overlays/window/window-form/window-form.component';
import { NgxPopoverCardComponent,
  NgxPopoverFormComponent,
  NgxPopoverTabsComponent } from '../modal-overlays/popovers/popover-examples.component';
import { Demo1Component } from './demo1/demo1.component';
import { Test2RoutingModule } from './test2-routing.module';

@NgModule({
  declarations: [
    Test2Component,
    DialogNamePromptComponent,
    WindowFormComponent,
    NgxPopoverCardComponent,
    NgxPopoverFormComponent,
    NgxPopoverTabsComponent,
    Demo1Component,
  ],
  entryComponents: [
    DialogNamePromptComponent,
    WindowFormComponent,
    NgxPopoverCardComponent,
    NgxPopoverFormComponent,
    NgxPopoverTabsComponent,
  ],
  imports: [
    NbDialogModule.forChild(),
    NbWindowModule.forChild(),
    CommonModule,
    NbCardModule,
    NbCheckboxModule,
    NbTabsetModule,
    NbPopoverModule,
    NbButtonModule,
    NbInputModule,
    NbSelectModule,
    NbTooltipModule,
    Test2RoutingModule,
  ],
})
export class Test2Module { }
