import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceReportComponent } from './price-report.component';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { ViewComponent } from './view/view.component';
import { PriceReportRoutingModule } from './price-report-routing.module';

@NgModule({
  declarations: [PriceReportComponent, ListComponent, FormComponent, ViewComponent],
  imports: [
    CommonModule,
    PriceReportRoutingModule,
  ],
})
export class PriceReportModule { }
