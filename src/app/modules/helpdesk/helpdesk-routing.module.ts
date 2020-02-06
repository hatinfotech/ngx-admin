import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { TicketFormComponent } from './ticket-form/ticket-form.component';
import { HelpdeskComponent } from './helpdesk.component';

const routes: Routes = [{
  path: '',
  component: HelpdeskComponent,
  children: [
    // {
    //   path: '',
    //   redirectTo: 'dashboard',
    //   pathMatch: 'full',
    // },
    // {
    //   path: 'dashboard',
    //   canActivate: [AuthGuardService],
    //   component: IvoipDashboardComponent,
    //   data: {
    //     reuse: true,
    //   },
    // },
    {
      path: 'ticket/list',
      canActivate: [AuthGuardService],
      component: TicketListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'ticket/form',
      canActivate: [AuthGuardService],
      component: TicketFormComponent,
    },
    {
      path: 'ticket/form/:id',
      canActivate: [AuthGuardService],
      component: TicketFormComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpdeskRoutingModule {
}
