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
  NbIconModule, NbSelectModule,
} from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ReactiveFormsModule } from '@angular/forms';
import { SortablejsModule } from 'ngx-sortablejs';
import { Select2Module } from 'ng2-select2';
import { CustomElementModule } from '../../custom-element/custom-element.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { NgxMaskModule, IConfig } from 'ngx-mask';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
  declarations: [
    PriceReportComponent,
    ListComponent,
    FormComponent,
    ViewComponent,
  ],
  imports: [
    CommonModule,
    PriceReportRoutingModule,
    NbCardModule,
    Ng2SmartTableModule,
    NbCardModule,
    NbInputModule,
    NbSelectModule,
    NbButtonModule,
    NbActionsModule,
    NbUserModule,
    NbCheckboxModule,
    NbRadioModule,
    NbDatepickerModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
    NbIconModule,
    // AutocompleteLibModule,
    Select2Module,
    SortablejsModule.forRoot({
      animation: 200,
    }),
    CustomElementModule,
    CurrencyMaskModule,
    NgxMaskModule.forRoot(options),
  ],
})
export class PriceReportModule { }
