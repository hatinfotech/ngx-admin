import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './menu.component';
import { MenuListComponent } from './manager-menu/menu-list/menu-list.component';
import { MenuFormComponent } from './manager-menu/menu-form/menu-form.component';
import { AuthGuardService } from '../../services/auth-guard.service';


const routes: Routes = [{
  path: '',
  component: MenuComponent,
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
      component: MenuListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'manager/form',
      // canActivate: [AuthGuardService],
      component: MenuFormComponent,
    },
    {
      path: 'manager/form/:id',
      // canActivate: [AuthGuardService],
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
