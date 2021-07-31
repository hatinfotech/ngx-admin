// import { NgModule } from '@angular/core';
// import { Routes, RouterModule } from '@angular/router';
// import { AuthGuardService } from '../../services/auth-guard.service';
// import { DeploymentVoucherFormComponent } from './deployment-voucher/deployment-voucher-form/deployment-voucher-form.component';
// import { DeploymentVoucherListComponent } from './deployment-voucher/deployment-voucher-list/deployment-voucher-list.component';
// import { DeploymentComponent } from './deployment.component';

// const routes: Routes = [{
//   path: '',
//   component: DeploymentComponent,
//   children: [
//     // Price report
//     {
//       path: 'voucher/list',
//       canActivate: [AuthGuardService],
//       component: DeploymentVoucherListComponent,
//       data: {
//         reuse: true,
//       },
//     },
//     {
//       path: 'voucher/form',
//       canActivate: [AuthGuardService],
//       component: DeploymentVoucherFormComponent,
//     },
//     {
//       path: 'voucher/form/:id',
//       canActivate: [AuthGuardService],
//       component: DeploymentVoucherFormComponent,
//     },
//   ],
// }];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule],
// })
// export class DeploymentRoutingModule {
// }
