import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataManagerComponent } from './data-manager.component';
import { NbRouteTabsetModule, NbTabsetModule, NbStepperModule, NbCardModule, NbButtonModule, NbListModule, NbAccordionModule, NbUserModule, NbIconModule, NbSelectModule, NbInputModule, NbActionsModule, NbCheckboxModule, NbRadioModule, NbDatepickerModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CustomElementModule } from '../../custom-element/custom-element.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { FormComponent } from './form/form.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { ReportComponent } from './report/report.component';

@NgModule({
  declarations: [DataManagerComponent, ListComponent, FormComponent, ViewComponent, ReportComponent],
  imports: [
    CommonModule,
    NbRouteTabsetModule,
    FormsModule,
    ReactiveFormsModule,
    NbTabsetModule,
    NbStepperModule,
    NbCardModule,
    NbButtonModule,
    NbListModule,
    NbAccordionModule,
    NbUserModule,
    Ng2SmartTableModule,
    NbIconModule,
    NbSelectModule,
    CustomElementModule,
    CurrencyMaskModule,
    NbInputModule,
    NbActionsModule,
    NbCheckboxModule,
    NbRadioModule,
    NbDatepickerModule,
  ],
})
export class DataManagerModule { }
