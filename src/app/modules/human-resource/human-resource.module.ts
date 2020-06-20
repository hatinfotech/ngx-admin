import { NgModule } from '@angular/core';
import { HumanResourceComponent } from './human-resource.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbTabsetModule, NbRouteTabsetModule, NbStepperModule, NbCardModule,
  NbButtonModule, NbListModule, NbAccordionModule, NbUserModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { HumanResouceRoutingModule } from './human-resource-routing.module';
import { SmartTableFilterComponent } from '../../lib/custom-element/smart-table/smart-table.filter.component';

@NgModule({
  declarations: [
    HumanResourceComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NbTabsetModule,
    NbStepperModule,
    NbCardModule,
    NbButtonModule,
    NbListModule,
    NbAccordionModule,
    NbUserModule,
    NbRouteTabsetModule,
    HumanResouceRoutingModule,
  ],
  entryComponents: [
    SmartTableFilterComponent,
  ],
})
export class HumanResourceModule { }
