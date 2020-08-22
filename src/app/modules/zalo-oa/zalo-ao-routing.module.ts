import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';
import { ZaloOaComponent } from './zalo-oa.component';
import { ZaloOfficialAccountListComponent } from './official-account/zalo-official-account-list/zalo-official-account-list.component';
import { ZaloOfficialAccountFormComponent } from './official-account/zalo-official-account-form/zalo-official-account-form.component';

const routes: Routes = [{
  path: '',
  component: ZaloOaComponent,
  children: [
    {
      path: 'official-account/list',
      canActivate: [AuthGuardService],
      component: ZaloOfficialAccountListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'official-account/form',
      canActivate: [AuthGuardService],
      component: ZaloOfficialAccountFormComponent,
    },
    {
      path: 'official-account/form/:id',
      canActivate: [AuthGuardService],
      component: ZaloOfficialAccountFormComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ZaloOaRoutingModule {
}
