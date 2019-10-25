import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Test2Component } from './test2.component';
import { Demo1Component } from './demo1/demo1.component';

const routes: Routes = [{
  path: '',
  component: Test2Component,
  children: [
    {
      path: 'demo1',
      component: Demo1Component,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Test2RoutingModule {
}


