import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdsComponent } from './ads.component';
import { AdsContentListComponent } from './ads-content/ads-content-list/ads-content-list.component';
import { AdsContentFormComponent } from './ads-content/ads-content-form/ads-content-form.component';
import { AdsCodeListComponent } from './ads-code/ads-code-list/ads-code-list.component';
import { AdsCodeFormComponent } from './ads-code/ads-code-form/ads-code-form.component';
import { AdsRoutingModule } from './ads-routing.module';
import { NbTabsetModule, NbCardModule, NbIconModule, NbInputModule, NbCheckboxModule, NbRouteTabsetModule, NbStepperModule, NbButtonModule, NbListModule, NbAccordionModule, NbUserModule, NbSelectModule, NbActionsModule, NbRadioModule, NbDatepickerModule, NbProgressBarModule, NbDialogModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CustomElementModule } from '../../lib/custom-element/custom-element.module';
import { IvoipDashboardModule } from '../ivoip/dashboard/ivoip-dashboard.module';
// import { CurrencyMaskModule } from 'ng2-currency-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { DialogModule } from '../dialog/dialog.module';
import { AgGridModule } from '@ag-grid-community/angular';
import { SortablejsModule } from 'ngx-sortablejs';
import { SmartTableFilterComponent } from '../../lib/custom-element/smart-table/smart-table.filter.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AdsComponent, AdsContentListComponent, AdsContentFormComponent, AdsCodeListComponent, AdsCodeFormComponent],
  imports: [
    CommonModule,
    NbTabsetModule,
    AdsRoutingModule,
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
    // CurrencyMaskModule,
    FormsModule,
    ReactiveFormsModule,
    // DialogModule,
    NbProgressBarModule,
    AgGridModule,
    TranslateModule,
    NbDialogModule.forChild(),
    SortablejsModule.forRoot({
      animation: 200,
    }),
  ],
  entryComponents: [
    AdsContentFormComponent,
    AdsCodeFormComponent,
    SmartTableFilterComponent,
  ],
})
export class AdsModule { }
