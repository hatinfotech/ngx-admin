import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './menu.component';
import { MenuListComponent } from './manager-menu/menu-list/menu-list.component';
import { MenuFormComponent } from './manager-menu/menu-form/menu-form.component';


const routes: Routes = [{
  path: '',
  component: MenuComponent,
  children: [
    // User manager
    {
      path: 'manager/list',
      component: MenuListComponent,
    },
    {
      path: 'manager/form',
      component: MenuFormComponent,
    },
    {
      path: 'manager/form/:id',
      component: MenuFormComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuRoutingModule {
}
