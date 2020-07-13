import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactComponent } from './contact.component';
import { AuthGuardService } from '../../services/auth-guard.service';
import { ContactListComponent } from './contact/contact-list/contact-list.component';
import { ContactFormComponent } from './contact/contact-form/contact-form.component';

const routes: Routes = [{
  path: '',
  component: ContactComponent,
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
      path: 'contact/list',
      canActivate: [AuthGuardService],
      component: ContactListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'contact/form',
      canActivate: [AuthGuardService],
      component: ContactFormComponent,
    },
    {
      path: 'contact/form/:id',
      canActivate: [AuthGuardService],
      component: ContactFormComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactRoutingModule {
}
