import { NgModule } from '@angular/core';
import { EmployeesComponent } from './employees.component';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { PrintComponent } from './print/print.component';
import { ViewComponent } from './view/view.component';
import { EmployeesRoutingModule } from './employees-routing.module';
import {
  NbRouteTabsetModule,
  NbCardModule,
} from '@nebular/theme';
import { ThemeModule } from '../../../@theme/theme.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    EmployeesComponent,
    ListComponent,
    FormComponent,
    PrintComponent,
    ViewComponent,
  ],
  entryComponents: [
  ],
  imports: [
    NbRouteTabsetModule,
    EmployeesRoutingModule,
    ThemeModule,
    FormsModule,
    CommonModule,
    NbCardModule,
    Ng2SmartTableModule,
  ],
})
export class EmployeesModule { }
