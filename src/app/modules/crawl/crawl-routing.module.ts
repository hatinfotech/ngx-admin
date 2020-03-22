import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';
import { CrawlComponent } from './crawl.component';
import { CrawlServerFormComponent } from './server/crawl-server-form/crawl-server-form.component';
import { CrawlServerListComponent } from './server/crawl-server-list/crawl-server-list.component';
import { CrawlPlanListComponent } from './plan/crawl-plan-list/crawl-plan-list.component';
import { CrawlPlanFormComponent } from './plan/crawl-plan-form/crawl-plan-form.component';

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
      path: 'server/list',
      canActivate: [AuthGuardService],
      component: CrawlServerListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'server/form',
      canActivate: [AuthGuardService],
      component: CrawlServerFormComponent,
    },
    {
      path: 'server/form/:id',
      canActivate: [AuthGuardService],
      component: CrawlServerFormComponent,
    },

    {
      path: 'plan/list',
      canActivate: [AuthGuardService],
      component: CrawlPlanListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'plan/form',
      canActivate: [AuthGuardService],
      component: CrawlPlanFormComponent,
    },
    {
      path: 'plan/form/:id',
      canActivate: [AuthGuardService],
      component: CrawlPlanFormComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrawlRoutingModule {
}
