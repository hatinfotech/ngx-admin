import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceReportComponent } from './price-report.component';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { ViewComponent } from './view/view.component';
import { PriceReportRoutingModule } from './price-report-routing.module';
import { NbCardModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
  declarations: [PriceReportComponent, ListComponent, FormComponent, ViewComponent],
  imports: [
    CommonModule,
    PriceReportRoutingModule,
    NbCardModule,
    Ng2SmartTableModule,
    NbCardModule,
  ],
})
export class PriceReportModule { }
