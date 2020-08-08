import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';
import { HelpdeskComponent } from './helpdesk.component';
import { HelpdeskTicketListComponent } from './ticket/helpdesk-ticket-list/helpdesk-ticket-list.component';
import { HelpdeskTicketFormComponent } from './ticket/helpdesk-ticket-form/helpdesk-ticket-form.component';
import { HelpdeskDashboardComponent } from './dashboard/helpdesk-dashboard/helpdesk-dashboard.component';
import { UserExtensionListComponent } from './user-extensions/user-extension-list/user-extension-list.component';
import { UserExtensionFormComponent } from './user-extensions/user-extension-form/user-extension-form.component';
import { HelpdeskRouteListComponent } from './route/helpdesk-route-list/helpdesk-route-list.component';
import { HelpdeskRouteFormComponent } from './route/helpdesk-route-form/helpdesk-route-form.component';
import { HelpdeskParamListComponent } from './param/helpdesk-param-list/helpdesk-param-list.component';
import { HelpdeskParamFormComponent } from './param/helpdesk-param-form/helpdesk-param-form.component';
import { HelpdeskActionListComponent } from './action/helpdesk-action-list/helpdesk-action-list.component';
import { HelpdeskActionFormComponent } from './action/helpdesk-action-form/helpdesk-action-form.component';

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
    // Routes
    {
      path: 'route/list',
      canActivate: [AuthGuardService],
      component: HelpdeskRouteListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'route/form',
      canActivate: [AuthGuardService],
      component: HelpdeskRouteFormComponent,
    },
    {
      path: 'route/form/:id',
      canActivate: [AuthGuardService],
      component: HelpdeskRouteFormComponent,
    },
    // Params
    {
      path: 'param/list',
      canActivate: [AuthGuardService],
      component: HelpdeskParamListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'param/form',
      canActivate: [AuthGuardService],
      component: HelpdeskParamFormComponent,
    },
    {
      path: 'param/form/:id',
      canActivate: [AuthGuardService],
      component: HelpdeskParamFormComponent,
    },
    // Action
    {
      path: 'action/list',
      canActivate: [AuthGuardService],
      component: HelpdeskActionListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'action/form',
      canActivate: [AuthGuardService],
      component: HelpdeskActionFormComponent,
    },
    {
      path: 'action/form/:id',
      canActivate: [AuthGuardService],
      component: HelpdeskActionFormComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpdeskRoutingModule {
}
