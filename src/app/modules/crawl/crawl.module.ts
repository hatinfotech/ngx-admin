import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrawlComponent } from './crawl.component';
import { CrawlDashboardComponent } from './dashboard/crawl-dashboard/crawl-dashboard.component';
import { CrawlServerListComponent } from './server/crawl-server-list/crawl-server-list.component';
import { CrawlServerFormComponent } from './server/crawl-server-form/crawl-server-form.component';
import { NbTabsetModule, NbCardModule, NbIconModule, NbInputModule, NbCheckboxModule, NbRouteTabsetModule, NbStepperModule, NbButtonModule, NbListModule, NbAccordionModule, NbUserModule, NbSelectModule, NbActionsModule, NbRadioModule, NbDatepickerModule, NbProgressBarModule, NbDialogModule } from '@nebular/theme';
import { CrawlRoutingModule } from './crawl-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CustomElementModule } from '../../lib/custom-element/custom-element.module';
import { IvoipDashboardModule } from '../ivoip/dashboard/ivoip-dashboard.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '../dialog/dialog.module';
import { AgGridModule } from '@ag-grid-community/angular';
import { SortablejsModule } from 'ngx-sortablejs';
import { CrawlPlanListComponent } from './plan/crawl-plan-list/crawl-plan-list.component';
import { CrawlPlanFormComponent } from './plan/crawl-plan-form/crawl-plan-form.component';
import { SmartTableFilterComponent } from '../../lib/custom-element/smart-table/smart-table.filter.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [CrawlComponent, CrawlDashboardComponent, CrawlServerListComponent, CrawlServerFormComponent, CrawlPlanListComponent, CrawlPlanFormComponent],
  imports: [
    CommonModule,
    NbTabsetModule,
    CrawlRoutingModule,
    NbCardModule,
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
    AgGridModule,
    TranslateModule,
    NbDialogModule.forChild(),
    SortablejsModule.forRoot({
      animation: 200,
    }),
  ],
  entryComponents: [
    CrawlServerFormComponent,
    CrawlPlanFormComponent,
    SmartTableFilterComponent,
  ],
})
export class CrawlModule { }
