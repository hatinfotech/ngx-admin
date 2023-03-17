import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';
import { WordpressSyncProfileListComponent } from './sync-profile/sync-profile-list/sync-profile-list.component';
import { WordpressComponent } from './wordpress.component';
import { WpSiteFormComponent } from './wp-site/wp-site-form/wp-site-form.component';
import { WpSiteListComponent } from './wp-site/wp-site-list/wp-site-list.component';

const routes: Routes = [{
  path: '',
  component: WordpressComponent,
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
      path: 'wp-site/list',
      canActivate: [AuthGuardService],
      component: WpSiteListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'wp-site/form',
      canActivate: [AuthGuardService],
      component: WpSiteFormComponent,
    },
    {
      path: 'wp-site/form/:id',
      canActivate: [AuthGuardService],
      component: WpSiteFormComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WordpressRoutingModule {
}
