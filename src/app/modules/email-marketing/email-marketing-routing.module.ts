import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';
import { EmailSentListComponent } from './email-sent/email-sent-list/email-sent-list.component';
import { EmailTemplateFormComponent } from './email-template/email-template-form/email-template-form.component';
import { EmailGatewayFormComponent } from './email-gateway/email-gateway-form/email-gateway-form.component';
import { EmailAdvertisementFormComponent } from './email-advertisement/email-advertisement-form/email-advertisement-form.component';
import { EmailMarketingDashboardComponent } from './dashboard/email-marketing-dashboard/email-marketing-dashboard.component';
import { EmailTemplateListComponent } from './email-template/email-template-list/email-template-list.component';
import { EmailGatewayListComponent } from './email-gateway/email-gateway-list/email-gateway-list.component';
import { EmailAdvertisementListComponent } from './email-advertisement/email-advertisement-list/email-advertisement-list.component';
import { EmailMarketingComponent } from './email-marketing.component';
import { EmailAddressListComponent } from './address/email-address-list/email-address-list.component';
import { EmailAddressFormComponent } from './address/email-address-form/email-address-form.component';

const routes: Routes = [{
  path: '',
  component: EmailMarketingComponent,
  children: [
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: 'dashboard',
      canActivate: [AuthGuardService],
      component: EmailMarketingDashboardComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'sent/list',
      canActivate: [AuthGuardService],
      component: EmailSentListComponent,
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
      component: EmailTemplateListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'template/form',
      canActivate: [AuthGuardService],
      component: EmailTemplateFormComponent,
    },
    {
      path: 'template/form/:id',
      canActivate: [AuthGuardService],
      component: EmailTemplateFormComponent,
    },
    {
      path: 'gateway/list',
      canActivate: [AuthGuardService],
      component: EmailGatewayListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'gateway/form',
      canActivate: [AuthGuardService],
      component: EmailGatewayFormComponent,
    },
    {
      path: 'gateway/form/:id',
      canActivate: [AuthGuardService],
      component: EmailGatewayFormComponent,
    },
    {
      path: 'ads-email/list',
      canActivate: [AuthGuardService],
      component: EmailAdvertisementListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'ads-email/form',
      canActivate: [AuthGuardService],
      component: EmailAdvertisementFormComponent,
    },
    {
      path: 'ads-email/form/:id',
      canActivate: [AuthGuardService],
      component: EmailAdvertisementFormComponent,
    },
    {
      path: 'address/list',
      canActivate: [AuthGuardService],
      component: EmailAddressListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'address/form',
      canActivate: [AuthGuardService],
      component: EmailAddressFormComponent,
    },
    {
      path: 'address/form/:id',
      canActivate: [AuthGuardService],
      component: EmailAddressFormComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailMarketingRoutingModule {
}
