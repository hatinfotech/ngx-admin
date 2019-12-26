import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModulesComponent } from './modules.component';
import { ModuleListComponent } from './module-manager/module-list/module-list.component';
import { ModuleFormComponent } from './module-manager/module-form/module-form.component';
import { AuthGuardService } from '../../services/auth-guard.service';
import { ResourceListComponent } from './resources/resource-list/resource-list.component';
import { ResourceFormComponent } from './resources/resource-form/resource-form.component';


const routes: Routes = [{
  path: '',
  component: ModulesComponent,
  children: [
    // User manager
    {
      path: 'manager',
      redirectTo: 'manager/list',
      pathMatch: 'full',
    },
    {
      path: 'manager/list',
      // canActivate: [AuthGuardService],
      component: ModuleListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'manager/form',
      // canActivate: [AuthGuardService],
      component: ModuleFormComponent,
    },
    {
      path: 'manager/form/:id',
      // canActivate: [AuthGuardService],
      component: ModuleFormComponent,
    },
    // Resources
    {
      path: 'resources/list',
      // canActivate: [AuthGuardService],
      component: ResourceListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'resources/form',
      // canActivate: [AuthGuardService],
      component: ResourceFormComponent,
    },
    {
      path: 'resources/form/:id',
      // canActivate: [AuthGuardService],
      component: ResourceFormComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModulesRoutingModule {
}
