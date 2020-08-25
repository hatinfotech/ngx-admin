import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';
import { ZaloOaComponent } from './zalo-oa.component';
import { ZaloOfficialAccountListComponent } from './official-account/zalo-official-account-list/zalo-official-account-list.component';
import { ZaloOfficialAccountFormComponent } from './official-account/zalo-official-account-form/zalo-official-account-form.component';
import { ZaloOaFollowerListComponent } from './follower/zalo-oa-follower-list/zalo-oa-follower-list.component';
import { ZaloOaFollowerFormComponent } from './follower/zalo-oa-follower-form/zalo-oa-follower-form.component';

const routes: Routes = [{
  path: '',
  component: ZaloOaComponent,
  children: [
    // official account
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
    // follower
    {
      path: 'follower/list',
      canActivate: [AuthGuardService],
      component: ZaloOaFollowerListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'follower/form',
      canActivate: [AuthGuardService],
      component: ZaloOaFollowerFormComponent,
    },
    {
      path: 'follower/form/:id',
      canActivate: [AuthGuardService],
      component: ZaloOaFollowerFormComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ZaloOaRoutingModule {
}
