import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebHostingComponent } from './web-hosting.component';
import { HostingListComponent } from './hostings/hosting-list/hosting-list.component';
import { HostingFormComponent } from './hostings/hosting-form/hosting-form.component';
import { WebHostingDashboardComponent } from './web-hosting-dashboard/web-hosting-dashboard.component';
import { NbTabsetModule, NbIconModule, NbButtonModule, NbInputModule, NbCheckboxModule, NbRouteTabsetModule, NbStepperModule, NbListModule, NbAccordionModule, NbUserModule, NbSelectModule, NbActionsModule, NbRadioModule, NbDatepickerModule, NbProgressBarModule, NbCardModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CustomElementModule } from '../../lib/custom-element/custom-element.module';
import { IvoipDashboardModule } from '../ivoip/dashboard/ivoip-dashboard.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '../dialog/dialog.module';
import { SortablejsModule } from 'ngx-sortablejs';
import { WebHostingRoutingModule } from './web-hosting-routing.module';
import { WebsiteListComponent } from './websites/website-list/website-list.component';
import { WebsiteFormComponent } from './websites/website-form/website-form.component';

@NgModule({
  declarations: [
    WebHostingComponent,
    HostingListComponent,
    HostingFormComponent,
    WebHostingDashboardComponent,
    WebsiteListComponent,
    WebsiteFormComponent,
  ],
  imports: [
    WebHostingRoutingModule,
    CommonModule,
    NbTabsetModule,
    Ng2SmartTableModule,
    CustomElementModule,
    NbIconModule,
    NbInputModule,
    NbCheckboxModule,
    IvoipDashboardModule,
    NbRouteTabsetModule,
    NbStepperModule,
    NbButtonModule,
    NbListModule,
    NbAccordionModule,
    NbUserModule,
    NbSelectModule,
    NbActionsModule,
    NbRadioModule,
    NbDatepickerModule,
    CurrencyMaskModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    NbProgressBarModule,
    NbCardModule,
    SortablejsModule.forRoot({
      animation: 200,
    }),
  ],
})
export class WebHostingModule { }
