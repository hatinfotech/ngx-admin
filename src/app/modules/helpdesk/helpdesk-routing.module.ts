import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';
import { HelpdeskComponent } from './helpdesk.component';
import { HelpdeskTicketListComponent } from './ticket/helpdesk-ticket-list/helpdesk-ticket-list.component';
import { HelpdeskTicketFormComponent } from './ticket/helpdesk-ticket-form/helpdesk-ticket-form.component';
import { HelpdeskDashboardComponent } from './dashboard/helpdesk-dashboard/helpdesk-dashboard.component';

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
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpdeskRoutingModule {
}
