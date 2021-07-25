import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailMarketingComponent } from './email-marketing.component';
import { EmailMarketingDashboardComponent } from './dashboard/email-marketing-dashboard/email-marketing-dashboard.component';
import { EmailSentListComponent } from './email-sent/email-sent-list/email-sent-list.component';
import { EmailSentFormComponent } from './email-sent/email-sent-form/email-sent-form.component';
import { EmailTemplateListComponent } from './email-template/email-template-list/email-template-list.component';
import { EmailTemplateFormComponent } from './email-template/email-template-form/email-template-form.component';
import { EmailAdvertisementListComponent } from './email-advertisement/email-advertisement-list/email-advertisement-list.component';
import { EmailAdvertisementFormComponent } from './email-advertisement/email-advertisement-form/email-advertisement-form.component';
import { EmailMarketingRoutingModule } from './email-marketing-routing.module';
import { NbTabsetModule, NbCardModule, NbIconModule, NbInputModule, NbCheckboxModule, NbRouteTabsetModule, NbStepperModule, NbButtonModule, NbListModule, NbAccordionModule, NbUserModule, NbSelectModule, NbActionsModule, NbRadioModule, NbDatepickerModule, NbProgressBarModule, NbDialogModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CustomElementModule } from '../../lib/custom-element/custom-element.module';
import { IvoipDashboardModule } from '../ivoip/dashboard/ivoip-dashboard.module';
// import { CurrencyMaskModule } from 'ng2-currency-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '../dialog/dialog.module';
import { AgGridModule } from '@ag-grid-community/angular';
import { SortablejsModule } from 'ngx-sortablejs';
import { SmartTableCheckboxComponent } from '../../lib/custom-element/smart-table/smart-table.component';
import { EmailGatewayListComponent } from './email-gateway/email-gateway-list/email-gateway-list.component';
import { EmailGatewayFormComponent } from './email-gateway/email-gateway-form/email-gateway-form.component';
// import { CKEditorModule } from 'ng2-ckeditor';
import { EmailAddressListComponent } from './address/email-address-list/email-address-list.component';
import { EmailAddressFormComponent } from './address/email-address-form/email-address-form.component';
import { DialogFormComponent } from '../dialog/dialog-form/dialog-form.component';
import { NgxUploaderModule } from '../../../vendor/ngx-uploader/src/public_api';
import { EmailSentStatsListComponent } from './email-sent-stats-list/email-sent-stats-list.component';
import { SmartTableFilterComponent } from '../../lib/custom-element/smart-table/smart-table.filter.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [EmailMarketingComponent,
    EmailMarketingDashboardComponent, EmailSentListComponent,
    EmailSentFormComponent,
    EmailTemplateListComponent, EmailTemplateFormComponent,
    EmailAdvertisementListComponent, EmailAdvertisementFormComponent,
    EmailGatewayListComponent, EmailGatewayFormComponent,
    EmailAddressListComponent, EmailAddressFormComponent, EmailSentStatsListComponent],
  imports: [
    CommonModule,
    EmailMarketingRoutingModule,
    NbTabsetModule,
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
    // CurrencyMaskModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    NbProgressBarModule,
    AgGridModule,
    // CKEditorModule,
    NgxUploaderModule,
    TranslateModule,
    NbDialogModule.forChild(),
    SortablejsModule.forRoot({
      animation: 200,
    }),
  ],
  entryComponents: [
    SmartTableCheckboxComponent,
    EmailGatewayFormComponent,
    EmailTemplateFormComponent,
    EmailAddressFormComponent,
    DialogFormComponent,
    EmailAdvertisementFormComponent,
    EmailSentStatsListComponent,
    SmartTableFilterComponent,
  ],
})
export class EmailMarketingModule { }
