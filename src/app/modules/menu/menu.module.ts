import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';
import { NbRouteTabsetModule, NbTabsetModule, NbStepperModule, NbCardModule, NbButtonModule, NbListModule, NbAccordionModule, NbUserModule, NbIconModule, NbSelectModule, NbInputModule, NbActionsModule, NbCheckboxModule, NbRadioModule, NbDatepickerModule } from '@nebular/theme';
import { MenuRoutingModule } from './menu-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CustomElementModule } from '../custom-element/custom-element.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { MenuListComponent } from './manager-menu/menu-list/menu-list.component';
import { MenuFormComponent } from './manager-menu/menu-form/menu-form.component';
import { SmartTableCheckboxComponent } from '../custom-element/smart-table/smart-table-checkbox.component';

@NgModule({
  declarations: [MenuComponent, MenuListComponent, MenuFormComponent],
  imports: [
    CommonModule,
    NbRouteTabsetModule,
    MenuRoutingModule,
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
    CustomElementModule,
  ],
  entryComponents: [
    SmartTableCheckboxComponent,
  ],
  exports: [MenuListComponent],
})
export class MenuModule { }
