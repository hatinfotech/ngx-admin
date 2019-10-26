import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [{
  path: '',
  component: TestComponent,
  children: [
    {
      path: 'employees',
      // component: EmployeesComponent,
      loadChildren: () => import('./employees/employees.module')
        .then(m => m.EmployeesModule),
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestRoutingModule {
}
