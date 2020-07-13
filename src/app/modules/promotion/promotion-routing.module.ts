import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';
import { PromotionComponent } from './promotion.component';
import { PromotionListComponent } from './promotion/promotion-list/promotion-list.component';
import { PromotionFormComponent } from './promotion/promotion-form/promotion-form.component';

const routes: Routes = [{
  path: '',
  component: PromotionComponent,
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
      path: 'promotion/list',
      canActivate: [AuthGuardService],
      component: PromotionListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'promotion/form',
      canActivate: [AuthGuardService],
      component: PromotionFormComponent,
    },
    {
      path: 'promotion/form/:id',
      canActivate: [AuthGuardService],
      component: PromotionFormComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromotionRoutingModule {
}
