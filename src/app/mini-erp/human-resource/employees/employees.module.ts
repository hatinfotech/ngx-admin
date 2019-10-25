import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeesComponent } from './employees.component';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { PrintComponent } from './print/print.component';
import { ViewComponent } from './view/view.component';
import { EmployeesRoutingModule } from './employees-routing.module';
import { NbRouteTabsetModule, NbCardModule, NbTreeGridModule, NbIconModule, NbInputModule } from '@nebular/theme';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ThemeModule } from '../../../@theme/theme.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
  declarations: [EmployeesComponent, ListComponent, FormComponent, PrintComponent, ViewComponent],
  imports: [
    NbRouteTabsetModule,
    EmployeesRoutingModule,
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    Ng2SmartTableModule,
  ],
})
export class EmployeesModule { }
