import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModulesComponent } from './modules.component';
import { ModuleListComponent } from './module-manager/module-list/module-list.component';
import { ModuleFormComponent } from './module-manager/module-form/module-form.component';


const routes: Routes = [{
  path: '',
  component: ModulesComponent,
  children: [
    // User manager
    {
      path: 'manager/list',
      component: ModuleListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'manager/form',
      component: ModuleFormComponent,
    },
    {
      path: 'manager/form/:id',
      component: ModuleFormComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModulesRoutingModule {
}
