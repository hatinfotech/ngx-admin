import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';
import { SmsComponent } from './sms.component';
import { SmsDashboardComponent } from './sms-dashboard/sms-dashboard.component';
import { SmsSentListComponent } from './sms-sent/sms-sent-list/sms-sent-list.component';
import { SmsTemplateListComponent } from './sms-template/sms-template-list/sms-template-list.component';
import { SmsTemplateFormComponent } from './sms-template/sms-template-form/sms-template-form.component';
import { SmsGatewayListComponent } from './sms-gateway/sms-gateway-list/sms-gateway-list.component';
import { SmsGatewayFormComponent } from './sms-gateway/sms-gateway-form/sms-gateway-form.component';
import { SmsAdvertisementFormComponent } from './sms-advertisement/sms-advertisement-form/sms-advertisement-form.component';
import { SmsAdvertisementListComponent } from './sms-advertisement/sms-advertisement-list/sms-advertisement-list.component';
import { SmsPhoneNumberListComponent } from './phone-number/sms-phone-number-list/sms-phone-number-list.component';
import { SmsPhoneNumberFormComponent } from './phone-number/sms-phone-number-form/sms-phone-number-form.component';
import { SmsSentStatsListComponent } from './sms-sent-stats-list/sms-sent-stats-list.component';

const routes: Routes = [{
  path: '',
  component: SmsComponent,
  children: [
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: 'dashboard',
      canActivate: [AuthGuardService],
      component: SmsDashboardComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'sent/list',
      canActivate: [AuthGuardService],
      component: SmsSentListComponent,
      data: {
        reuse: true,
      },
    },
    // {
    //   path: 'contact/form',
    //   canActivate: [AuthGuardService],
    //   component: ContactFormComponent,
    // },
    // {
    //   path: 'contact/form/:id',
    //   canActivate: [AuthGuardService],
    //   component: ContactFormComponent,
    // },
    {
      path: 'template/list',
      canActivate: [AuthGuardService],
      component: SmsTemplateListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'template/form',
      canActivate: [AuthGuardService],
      component: SmsTemplateFormComponent,
    },
    {
      path: 'template/form/:id',
      canActivate: [AuthGuardService],
      component: SmsTemplateFormComponent,
    },
    {
      path: 'gateway/list',
      canActivate: [AuthGuardService],
      component: SmsGatewayListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'gateway/form',
      canActivate: [AuthGuardService],
      component: SmsGatewayListComponent,
    },
    {
      path: 'gateway/form/:id',
      canActivate: [AuthGuardService],
      component: SmsGatewayFormComponent,
    },
    {
      path: 'advertisement/list',
      canActivate: [AuthGuardService],
      component: SmsAdvertisementListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'advertisement/form',
      canActivate: [AuthGuardService],
      component: SmsAdvertisementFormComponent,
    },
    {
      path: 'advertisement/form/:id',
      canActivate: [AuthGuardService],
      component: SmsAdvertisementFormComponent,
    },

    {
      path: 'phone-number/list',
      canActivate: [AuthGuardService],
      component: SmsPhoneNumberListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'phone-number/form',
      canActivate: [AuthGuardService],
      component: SmsPhoneNumberFormComponent,
    },
    {
      path: 'phone-number/form/:id',
      canActivate: [AuthGuardService],
      component: SmsPhoneNumberFormComponent,
    },
    {
      path: 'sent-state/list',
      canActivate: [AuthGuardService],
      component: SmsSentStatsListComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SmsRoutingModule {
}
