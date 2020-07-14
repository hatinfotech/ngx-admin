import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpdeskComponent } from './helpdesk.component';
import { NbTabsetModule, NbCardModule, NbIconModule, NbInputModule, NbCheckboxModule, NbRouteTabsetModule, NbStepperModule, NbButtonModule, NbListModule, NbAccordionModule, NbUserModule, NbSelectModule, NbActionsModule, NbRadioModule, NbDatepickerModule, NbProgressBarModule, NbDialogModule } from '@nebular/theme';
import { HelpdeskRoutingModule } from './helpdesk-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CustomElementModule } from '../../lib/custom-element/custom-element.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '../dialog/dialog.module';
import { AgGridModule } from '@ag-grid-community/angular';
import { SortablejsModule } from 'ngx-sortablejs';
import { SmartTableCheckboxComponent } from '../../lib/custom-element/smart-table/smart-table.component';
import { HelpdeskTicketListComponent } from './ticket/helpdesk-ticket-list/helpdesk-ticket-list.component';
import { HelpdeskTicketFormComponent } from './ticket/helpdesk-ticket-form/helpdesk-ticket-form.component';
import { HelpdeskDashboardComponent } from './dashboard/helpdesk-dashboard/helpdesk-dashboard.component';
import { OrdersChartComponent } from './charts/orders-chart.component';
import { ChartModule } from 'angular2-chartjs';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ProfitCardComponent } from './profit-card/profit-card.component';
import { StatsCardBackComponent } from './profit-card/back-side/stats-card-back.component';
import { StatsCardFrontComponent } from './profit-card/front-side/stats-card-front.component';
import { StatsAreaChartComponent } from './profit-card/back-side/stats-area-chart.component';
import { StatsBarAnimationChartComponent } from './profit-card/front-side/stats-bar-animation-chart.component';
import { ActionControlListComponent } from '../../lib/custom-element/action-control-list/action-control-list.component';
import { QuickTicketFormComponent } from './dashboard/quick-ticket-form/quick-ticket-form.component';
import { SmartTableFilterComponent } from '../../lib/custom-element/smart-table/smart-table.filter.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    HelpdeskComponent,
    HelpdeskTicketListComponent,
    HelpdeskTicketFormComponent,
    HelpdeskDashboardComponent,
    OrdersChartComponent,
    ProfitCardComponent,
    StatsCardBackComponent,
    StatsCardFrontComponent,
    StatsAreaChartComponent,
    StatsBarAnimationChartComponent,
    QuickTicketFormComponent,
  ],
  imports: [
    CommonModule,
    NbTabsetModule,
    HelpdeskRoutingModule,
    NbCardModule,
    Ng2SmartTableModule,
    CustomElementModule,
    NbIconModule,
    NbInputModule,
    NbCheckboxModule,
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
    AgGridModule,

    NbUserModule,
    NbButtonModule,
    NbIconModule,
    NbTabsetModule,
    NbSelectModule,
    NbListModule,
    ChartModule,
    NbProgressBarModule,
    NgxEchartsModule,
    NgxChartsModule,
    LeafletModule,

    TranslateModule,
    NbDialogModule.forChild(),
    SortablejsModule.forRoot({
      animation: 200,
    }),
  ],
  entryComponents: [
    SmartTableCheckboxComponent,
    ActionControlListComponent,
    QuickTicketFormComponent,
    SmartTableFilterComponent,
  ],
})
export class HelpdeskModule { }
