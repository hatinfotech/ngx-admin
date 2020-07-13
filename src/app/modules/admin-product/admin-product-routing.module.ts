import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';
import { AdminProductComponent } from './admin-product.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { ProductFormComponent } from './product/product-form/product-form.component';
import { ProductCategoryListComponent } from './category/product-category-list/product-category-list.component';
import { ProductCategoryFormComponent } from './category/product-category-form/product-category-form.component';
import { ProductUnitListComponent } from './unit/product-unit-list/product-unit-list.component';
import { ProductUnitFormComponent } from './unit/product-unit-form/product-unit-form.component';

const routes: Routes = [{
  path: '',
  component: AdminProductComponent,
  children: [
    // {
    //   path: '',
    //   redirectTo: 'dashboard',
    //   pathMatch: 'full',
    // },
    // {
    //   path: 'dashboard',
    //   canActivate: [AuthGuardService],
    //   component: IvoipDashboardComponent,
    //   data: {
    //     reuse: true,
    //   },
    // },
    {
      path: 'product/list',
      canActivate: [AuthGuardService],
      component: ProductListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'product/form',
      canActivate: [AuthGuardService],
      component: ProductFormComponent,
    },
    {
      path: 'product/form/:id',
      canActivate: [AuthGuardService],
      component: ProductFormComponent,
    },
    {
      path: 'category/list',
      canActivate: [AuthGuardService],
      component: ProductCategoryListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'category/form',
      canActivate: [AuthGuardService],
      component: ProductCategoryFormComponent,
    },
    {
      path: 'category/form/:id',
      canActivate: [AuthGuardService],
      component: ProductCategoryFormComponent,
    },
    {
      path: 'unit/list',
      canActivate: [AuthGuardService],
      component: ProductUnitListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'unit/form',
      canActivate: [AuthGuardService],
      component: ProductUnitFormComponent,
    },
    {
      path: 'unit/form/:id',
      canActivate: [AuthGuardService],
      component: ProductUnitFormComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminProductRoutingModule {
}
