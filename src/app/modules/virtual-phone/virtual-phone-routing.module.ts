import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';
import { DialpadComponent } from './dialpad/dialpad.component';
import { VirtualPhoneComponent } from './virtual-phone.component';

const routes: Routes = [{
  path: '',
  component: VirtualPhoneComponent,
  children: [
    // {
    //   path: '',
    //   redirectTo: 'dialpad',
    //   pathMatch: 'full',
    // },
    {
      path: 'dialpad',
      // canActivate: [AuthGuardService],
      component: DialpadComponent,
      data: {
        reuse: true,
      },
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VirtualPhoneRoutingModule {
}
