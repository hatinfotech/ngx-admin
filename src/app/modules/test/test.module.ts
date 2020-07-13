import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestComponent } from './test.component';
import { DataTableComponent } from './data-table/data-table.component';
import { TestRoutingModule } from './test-routing.module';
import { NbRouteTabsetModule, NbCardModule, NbInputModule, NbButtonModule,
  NbActionsModule, NbUserModule, NbCheckboxModule, NbRadioModule, NbDatepickerModule } from '@nebular/theme';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormComponent } from './form/form.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
  declarations: [
    TestComponent,
    DataTableComponent,
    FormComponent,
  ],
  imports: [
    CommonModule,
    NbRouteTabsetModule,
    TestRoutingModule,
    NgxDatatableModule,
    NbCardModule,
    NbInputModule,
    NbCardModule,
    NbButtonModule,
    NbActionsModule,
    NbUserModule,
    NbCheckboxModule,
    NbRadioModule,
    NbDatepickerModule,
    Ng2SmartTableModule,
  ],
})
export class TestModule {

 }
