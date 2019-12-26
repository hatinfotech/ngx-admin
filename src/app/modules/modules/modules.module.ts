import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModulesComponent } from './modules.component';
import { ModuleFormComponent } from './module-manager/module-form/module-form.component';
import { ModuleListComponent } from './module-manager/module-list/module-list.component';
import { NbRouteTabsetModule, NbTabsetModule, NbStepperModule, NbCardModule, NbButtonModule, NbListModule, NbAccordionModule, NbUserModule, NbIconModule, NbSelectModule, NbInputModule, NbActionsModule, NbCheckboxModule, NbRadioModule, NbDatepickerModule } from '@nebular/theme';
import { ModulesRoutingModule } from './modules-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CustomElementModule } from '../../lib/custom-element/custom-element.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ResourceListComponent } from './resources/resource-list/resource-list.component';
import { ResourceFormComponent } from './resources/resource-form/resource-form.component';

@NgModule({
  declarations: [ModulesComponent, ModuleFormComponent, ModuleListComponent, ResourceListComponent, ResourceFormComponent],
  imports: [
    CommonModule,
    NbRouteTabsetModule,
    ModulesRoutingModule,
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
export class ModulesModule { }
