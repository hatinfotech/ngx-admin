import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PriceReportListComponent } from './price-report-list/price-report-list.component';
import { PriceReportFormComponent } from './price-report-form/price-report-form.component';
import { PriceReportViewComponent } from './price-report-view/price-report-view.component';
import { PriceReportComponent } from './price-report.component';
import { AuthGuardService } from '../../../services/auth-guard.service';


const routes: Routes = [{
  path: '',
  component: PriceReportComponent,
  children: [
    {
      path: '',
      component: PriceReportListComponent,
      redirectTo: 'list',
      pathMatch: 'full',
    },
    {
      path: 'list',
      canActivate: [AuthGuardService],
      component: PriceReportListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'form',
      canActivate: [AuthGuardService],
      component: PriceReportFormComponent,
    },
    {
      path: 'form/:id',
      canActivate: [AuthGuardService],
      component: PriceReportFormComponent,
    },
    {
      path: 'view',
      canActivate: [AuthGuardService],
      component: PriceReportViewComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PriceReportRoutingModule {
}
