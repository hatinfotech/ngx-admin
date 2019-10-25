import { NgModule } from '@angular/core';
import { EmployeesComponent } from './employees.component';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { PrintComponent } from './print/print.component';
import { ViewComponent } from './view/view.component';
import { EmployeesRoutingModule } from './employees-routing.module';
import {
  NbRouteTabsetModule,
  NbCardModule,
  NbTreeGridModule,
  NbIconModule,
  NbInputModule,
  NbDialogModule,
  NbWindowModule,
  NbCheckboxModule,
  NbTabsetModule,
  NbPopoverModule,
  NbButtonModule,
  NbSelectModule,
  NbTooltipModule,
} from '@nebular/theme';
import { ThemeModule } from '../../../@theme/theme.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ShowcaseDialogComponent } from '../../modal-overlays/dialog/showcase-dialog/showcase-dialog.component';
import { ModalOverlaysComponent } from '../../modal-overlays/modal-overlays.component';
import { ToastrComponent } from '../../modal-overlays/toastr/toastr.component';
import { DialogComponent } from '../../modal-overlays/dialog/dialog.component';
import { DialogNamePromptComponent } from '../../modal-overlays/dialog/dialog-name-prompt/dialog-name-prompt.component';
import { WindowComponent } from '../../modal-overlays/window/window.component';
import { WindowFormComponent } from '../../modal-overlays/window/window-form/window-form.component';
import { PopoversComponent } from '../../modal-overlays/popovers/popovers.component';
import {
  NgxPopoverCardComponent,
  NgxPopoverFormComponent,
  NgxPopoverTabsComponent,
} from '../../modal-overlays/popovers/popover-examples.component';
import { TooltipComponent } from '../../modal-overlays/tooltip/tooltip.component';
import { FormsModule } from '@angular/forms';
import { ModalOverlaysRoutingModule } from '../../modal-overlays/modal-overlays-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    EmployeesComponent,
    ListComponent,
    FormComponent,
    PrintComponent,
    ViewComponent,
    ShowcaseDialogComponent,
  ],
  entryComponents: [
    ShowcaseDialogComponent,
  ],
  imports: [
    NbRouteTabsetModule,
    EmployeesRoutingModule,
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    Ng2SmartTableModule,
    FormsModule,
    NbDialogModule.forChild(),
    NbWindowModule.forChild(),
    NbCheckboxModule,
    NbTabsetModule,
    NbPopoverModule,
    NbButtonModule,
    NbSelectModule,
    NbTooltipModule,
    CommonModule,
  ],
})
export class EmployeesModule { }
