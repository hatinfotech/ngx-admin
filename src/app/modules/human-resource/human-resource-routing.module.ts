import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HumanResourceComponent } from './human-resource.component';
import { AuthGuardService } from '../../services/auth-guard.service';

const routes: Routes = [{
  path: '',
  component: HumanResourceComponent,
  children: [
    {
      path: 'employees',
      canActivate: [AuthGuardService],
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
export class HumanResouceRoutingModule {
}
