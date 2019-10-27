import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestComponent } from './test.component';
import { DataTableComponent } from './data-table/data-table.component';
import { FormComponent } from './form/form.component';


const routes: Routes = [{
  path: '',
  component: TestComponent,
  children: [
    {
      path: 'data-table',
      component: DataTableComponent,
    },
    {
      path: 'form',
      component: FormComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestRoutingModule {
}
