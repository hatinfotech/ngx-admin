import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmsComponent } from './sms.component';
import { SmsTemplateListComponent } from './sms-template/sms-template-list/sms-template-list.component';
import { SmsTemplateFormComponent } from './sms-template/sms-template-form/sms-template-form.component';
import { SmsSentListComponent } from './sms-sent/sms-sent-list/sms-sent-list.component';
import { SmsSentFormComponent } from './sms-sent/sms-sent-form/sms-sent-form.component';
import { SmsDashboardComponent } from './sms-dashboard/sms-dashboard.component';
import { NbTabsetModule, NbCardModule, NbIconModule, NbInputModule, NbCheckboxModule, NbRouteTabsetModule, NbStepperModule, NbButtonModule, NbListModule, NbAccordionModule, NbUserModule, NbSelectModule, NbActionsModule, NbRadioModule, NbDatepickerModule, NbProgressBarModule, NbDialogModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CustomElementModule } from '../../lib/custom-element/custom-element.module';
import { IvoipDashboardModule } from '../ivoip/dashboard/ivoip-dashboard.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '../dialog/dialog.module';
import { AgGridModule } from '@ag-grid-community/angular';
import { SortablejsModule } from 'ngx-sortablejs';
import { SmartTableCheckboxComponent } from '../../lib/custom-element/smart-table/smart-table.component';
import { SmsRoutingModule } from './sms-routing.module';
import { SmsGatewayListComponent } from './sms-gateway/sms-gateway-list/sms-gateway-list.component';
import { SmsGatewayFormComponent } from './sms-gateway/sms-gateway-form/sms-gateway-form.component';
import { SmsAdvertisementListComponent } from './sms-advertisement/sms-advertisement-list/sms-advertisement-list.component';
import { SmsAdvertisementFormComponent } from './sms-advertisement/sms-advertisement-form/sms-advertisement-form.component';

@NgModule({
  declarations: [SmsComponent, SmsTemplateListComponent,
    SmsTemplateFormComponent,
    SmsSentListComponent, SmsSentFormComponent,
    SmsDashboardComponent, SmsGatewayListComponent,
    SmsGatewayFormComponent, SmsAdvertisementListComponent,
    SmsAdvertisementFormComponent],
  imports: [
    CommonModule,
    SmsRoutingModule,
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
    CurrencyMaskModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    NbProgressBarModule,
    AgGridModule,
    NbDialogModule.forChild(),
    SortablejsModule.forRoot({
      animation: 200,
    }),
  ],
  entryComponents: [
    SmartTableCheckboxComponent,
    SmsTemplateFormComponent,
    SmsGatewayFormComponent,
  ],
})
export class SmsModule { }
