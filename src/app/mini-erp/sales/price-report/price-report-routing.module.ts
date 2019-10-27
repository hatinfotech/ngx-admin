import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PriceReportComponent } from './price-report.component';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { ViewComponent } from './view/view.component';


const routes: Routes = [{
  path: '',
  component: PriceReportComponent,
  children: [
    {
      path: '',
      component: ListComponent,
    },
    {
      path: 'list',
      component: ListComponent,
    },
    {
      path: 'form',
      component: FormComponent,
    },
    {
      path: 'view',
      component: ViewComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PriceReportRoutingModule {
}
