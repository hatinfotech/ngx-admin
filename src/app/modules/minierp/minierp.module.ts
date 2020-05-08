import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MinierpComponent } from './minierp.component';
import { MinierpDashboardComponent } from './minierp-dashboard/minierp-dashboard.component';
import { MinierpListComponent } from './minierps/minierp-list/minierp-list.component';
import { MinierpFormComponent } from './minierps/minierp-form/minierp-form.component';
import { NbTabsetModule, NbCardModule, NbIconModule, NbInputModule, NbCheckboxModule, NbRouteTabsetModule, NbStepperModule, NbButtonModule, NbListModule, NbAccordionModule, NbUserModule, NbSelectModule, NbActionsModule, NbRadioModule, NbDatepickerModule, NbProgressBarModule } from '@nebular/theme';
import { MinierpRoutingModule } from './minierp-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CustomElementModule } from '../../lib/custom-element/custom-element.module';
import { IvoipDashboardModule } from '../ivoip/dashboard/ivoip-dashboard.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '../dialog/dialog.module';
import { SortablejsModule } from 'ngx-sortablejs';
import { SmartTableButtonComponent, SmartTableCheckboxComponent, SmartTableIconComponent } from '../../lib/custom-element/smart-table/smart-table.component';

@NgModule({
  declarations: [
    MinierpComponent, MinierpDashboardComponent, MinierpListComponent, MinierpFormComponent,
  ],
  imports: [
    CommonModule,
    NbTabsetModule,
    MinierpRoutingModule,
    NbCardModule,
    Ng2SmartTableModule,
    CustomElementModule,
    NbIconModule,
    NbInputModule,
    NbCheckboxModule,
    IvoipDashboardModule,
    NbRouteTabsetModule,
    NbStepperModule,
    NbButtonModule,
    NbListModule,
    NbAccordionModule,
    NbUserModule,
    NbSelectModule,
    NbActionsModule,
    NbRadioModule,
    NbDatepickerModule,
    CurrencyMaskModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    NbProgressBarModule,
    SortablejsModule.forRoot({
      animation: 200,
    }),
  ],
  entryComponents: [
    SmartTableButtonComponent,
    SmartTableCheckboxComponent,
    SmartTableIconComponent,
  ],
})
export class MinierpModule { }
