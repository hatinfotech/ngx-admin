import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';
import { HelpdeskComponent } from './helpdesk.component';
import { HelpdeskTicketListComponent } from './ticket/helpdesk-ticket-list/helpdesk-ticket-list.component';
import { HelpdeskTicketFormComponent } from './ticket/helpdesk-ticket-form/helpdesk-ticket-form.component';
import { HelpdeskDashboardComponent } from './dashboard/helpdesk-dashboard/helpdesk-dashboard.component';
import { UserExtensionListComponent } from './user-extensions/user-extension-list/user-extension-list.component';
import { UserExtensionFormComponent } from './user-extensions/user-extension-form/user-extension-form.component';
import { HelpdeskProcedureListComponent } from './procedure/helpdesk-procedure-list/helpdesk-procedure-list.component';
import { HelpdeskProcedureFormComponent } from './procedure/helpdesk-procedure-form/helpdesk-procedure-form.component';

const routes: Routes = [{
  path: '',
  component: HelpdeskComponent,
  children: [
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: 'dashboard',
      canActivate: [AuthGuardService],
      component: HelpdeskDashboardComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'ticket/list',
      canActivate: [AuthGuardService],
      component: HelpdeskTicketListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'ticket/form',
      canActivate: [AuthGuardService],
      component: HelpdeskTicketFormComponent,
    },
    {
      path: 'ticket/form/:id',
      canActivate: [AuthGuardService],
      component: HelpdeskTicketFormComponent,
    },
    // User extension
    {
      path: 'user-extension/list',
      canActivate: [AuthGuardService],
      component: UserExtensionListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'user-extension/form',
      canActivate: [AuthGuardService],
      component: UserExtensionFormComponent,
    },
    {
      path: 'user-extension/form/:id',
      canActivate: [AuthGuardService],
      component: UserExtensionFormComponent,
    },
    // procedure
    {
      path: 'procedure/list',
      canActivate: [AuthGuardService],
      component: HelpdeskProcedureListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'procedure/form',
      canActivate: [AuthGuardService],
      component: HelpdeskProcedureFormComponent,
    },
    {
      path: 'user-extension/form/:id',
      canActivate: [AuthGuardService],
      component: HelpdeskProcedureFormComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpdeskRoutingModule {
}
