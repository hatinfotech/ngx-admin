import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceReportComponent } from './price-report.component';
import { PriceReportListComponent } from './price-report-list/price-report-list.component';
import { PriceReportFormComponent } from './price-report-form/price-report-form.component';
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
import { CustomElementModule } from '../../../lib/custom-element/custom-element.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { PriceReportViewComponent } from './price-report-view/price-report-view.component';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
  declarations: [
    PriceReportComponent,
    PriceReportListComponent,
    PriceReportFormComponent,
    PriceReportViewComponent,
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
  // providers: [{
  //   provide: RouteReuseStrategy,
  //   useClass: CustomRouteReuseStrategy,
  // }],
})
export class PriceReportModule { }
