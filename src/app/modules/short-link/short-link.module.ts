import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShortLinkComponent } from './short-link.component';
import { ShortLinkListComponent } from './short-link/short-link-list/short-link-list.component';
import { ShortLinkFormComponent } from './short-link/short-link-form/short-link-form.component';
import { NbTabsetModule, NbCardModule, NbIconModule, NbInputModule, NbCheckboxModule, NbRouteTabsetModule, NbStepperModule, NbButtonModule, NbListModule, NbAccordionModule, NbUserModule, NbSelectModule, NbActionsModule, NbRadioModule, NbDatepickerModule, NbProgressBarModule, NbDialogModule } from '@nebular/theme';
import { ShortLinkRoutingModule } from './ads-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CustomElementModule } from '../../lib/custom-element/custom-element.module';
import { IvoipDashboardModule } from '../ivoip/dashboard/ivoip-dashboard.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '../dialog/dialog.module';
import { AgGridModule } from '@ag-grid-community/angular';
import { SortablejsModule } from 'ngx-sortablejs';
import { SmartTableCheckboxComponent } from '../../lib/custom-element/smart-table/smart-table.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ShortLinkComponent, ShortLinkListComponent, ShortLinkFormComponent],
  imports: [
    CommonModule,
    NbTabsetModule,
    ShortLinkRoutingModule,
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
    AgGridModule,
    TranslateModule,
    NbDialogModule.forChild(),
    SortablejsModule.forRoot({
      animation: 200,
    }),
  ],
  entryComponents: [
    ShortLinkFormComponent,
    SmartTableCheckboxComponent,
  ],
})
export class ShortLinkModule { }
