import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';
import { CrawlComponent } from './crawl.component';
import { CrawlServerFormComponent } from './server/crawl-server-form/crawl-server-form.component';
import { CrawlServerListComponent } from './server/crawl-server-list/crawl-server-list.component';

const routes: Routes = [{
  path: '',
  component: CrawlComponent,
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
      component: CrawlServerListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'contact/form',
      canActivate: [AuthGuardService],
      component: CrawlServerFormComponent,
    },
    {
      path: 'contact/form/:id',
      canActivate: [AuthGuardService],
      component: CrawlServerFormComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrawlRoutingModule {
}
