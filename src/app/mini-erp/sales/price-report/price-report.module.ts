import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceReportComponent } from './price-report.component';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { ViewComponent } from './view/view.component';
import { PriceReportRoutingModule } from './price-report-routing.module';
import {
  NbCardModule, NbButtonModule, NbInputModule, NbActionsModule,
  NbUserModule, NbCheckboxModule, NbRadioModule, NbDatepickerModule,
} from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [PriceReportComponent, ListComponent, FormComponent, ViewComponent],
  imports: [
    CommonModule,
    PriceReportRoutingModule,
    NbCardModule,
    Ng2SmartTableModule,
    NbCardModule,
    NbInputModule,
    NbButtonModule,
    NbActionsModule,
    NbUserModule,
    NbCheckboxModule,
    NbRadioModule,
    NbDatepickerModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
  ],
})
export class PriceReportModule { }
