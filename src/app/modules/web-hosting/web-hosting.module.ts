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
// import { CurrencyMaskModule } from 'ng2-currency-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '../dialog/dialog.module';
import { SortablejsModule } from 'ngx-sortablejs';
import { WebHostingRoutingModule } from './web-hosting-routing.module';
import { WebsiteListComponent } from './websites/website-list/website-list.component';
import { WebsiteFormComponent } from './websites/website-form/website-form.component';
import { DatabaseListComponent } from './databases/database-list/database-list.component';
import { DatabaseFormComponent } from './databases/database-form/database-form.component';
import { DatabaseUserListComponent } from './database-users/database-user-list/database-user-list.component';
import { DatabaseUserFormComponent } from './database-users/database-user-form/database-user-form.component';
import { FtpListComponent } from './ftps/ftp-list/ftp-list.component';
import { FtpFormComponent } from './ftps/ftp-form/ftp-form.component';
import { SmartTableFilterComponent } from '../../lib/custom-element/smart-table/smart-table.filter.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    WebHostingComponent,
    HostingListComponent,
    HostingFormComponent,
    WebHostingDashboardComponent,
    WebsiteListComponent,
    WebsiteFormComponent,
    DatabaseListComponent,
    DatabaseFormComponent,
    DatabaseUserListComponent,
    DatabaseUserFormComponent,
    FtpListComponent,
    FtpFormComponent,
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
    // CurrencyMaskModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    NbProgressBarModule,
    NbCardModule,
    TranslateModule,
    SortablejsModule.forRoot({
      animation: 200,
    }),
  ],
  entryComponents: [
    SmartTableFilterComponent,
  ],
})
export class WebHostingModule { }
