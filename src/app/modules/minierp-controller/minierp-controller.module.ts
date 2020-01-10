import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MinierpControllerComponent } from './minierp-controller.component';
import { MinierpControllerDashboardComponent } from './minierp-controller-dashboard/minierp-controller-dashboard.component';
import { MinierpListComponent } from './minierps/minierp-list/minierp-list.component';
import { MinierpFormComponent } from './minierps/minierp-form/minierp-form.component';

@NgModule({
  declarations: [MinierpControllerComponent, MinierpControllerDashboardComponent, MinierpListComponent, MinierpFormComponent],
  imports: [
    CommonModule,
  ]
})
export class MinierpControllerModule { }
