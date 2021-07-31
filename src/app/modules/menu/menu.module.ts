import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';
import {
  NbRouteTabsetModule, NbTabsetModule, NbStepperModule,
  NbCardModule, NbButtonModule, NbListModule, NbAccordionModule,
  NbUserModule, NbIconModule, NbSelectModule, NbInputModule, NbActionsModule,
  NbCheckboxModule, NbRadioModule, NbDatepickerModule,
} from '@nebular/theme';
import { MenuRoutingModule } from './menu-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CustomElementModule } from '../../lib/custom-element/custom-element.module';
// import { CurrencyMaskModule } from 'ng2-currency-mask';
import { MenuListComponent } from './manager-menu/menu-list/menu-list.component';
import { MenuFormComponent } from './manager-menu/menu-form/menu-form.component';
// import { DialogModule } from '../dialog/dialog.module';
import { SmartTableFilterComponent } from '../../lib/custom-element/smart-table/smart-table.filter.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [MenuComponent, MenuListComponent, MenuFormComponent],
  imports: [
    // NbDialogModule.forChild(),
    NbRouteTabsetModule,
    NbTabsetModule,
    NbStepperModule,
    NbCardModule,
    NbButtonModule,
    NbListModule,
    NbAccordionModule,
    NbUserModule,
    NbIconModule,
    NbSelectModule,
    NbInputModule,
    NbActionsModule,
    NbCheckboxModule,
    NbRadioModule,
    NbDatepickerModule,
    CustomElementModule,
    // CurrencyMaskModule,
    Ng2SmartTableModule,
    FormsModule,
    ReactiveFormsModule,
    // DialogModule,
    CommonModule,
    MenuRoutingModule,
    TranslateModule,
  ],
  entryComponents: [
    SmartTableFilterComponent,
  ],
})
export class MenuModule { }
