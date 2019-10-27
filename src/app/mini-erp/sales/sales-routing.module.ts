import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalesComponent } from './sales.component';


const routes: Routes = [{
  path: '',
  component: SalesComponent,
  children: [
    {
      path: 'price-report',
      // component: EmployeesComponent,
      loadChildren: () => import('./price-report/price-report.module')
        .then(m => m.PriceReportModule),
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule {
}
