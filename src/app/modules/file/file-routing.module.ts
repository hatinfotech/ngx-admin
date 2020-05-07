import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';
import { FileComponent } from './file.component';
import { FileStoreListComponent } from './store/file-store-list/file-store-list.component';
import { FileStoreFormComponent } from './store/file-store-form/file-store-form.component';
import { FileListComponent } from './file/file-list/file-list.component';
import { FileFormComponent } from './file/file-form/file-form.component';

const routes: Routes = [{
  path: '',
  component: FileComponent,
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
      path: 'store/list',
      canActivate: [AuthGuardService],
      component: FileStoreListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'store/form',
      canActivate: [AuthGuardService],
      component: FileStoreListComponent,
    },
    {
      path: 'store/form/:id',
      canActivate: [AuthGuardService],
      component: FileStoreFormComponent,
    },
    {
      path: 'file/list',
      canActivate: [AuthGuardService],
      component: FileListComponent,
      data: {
        reuse: true,
      },
    },
    {
      path: 'file/form',
      canActivate: [AuthGuardService],
      component: FileFormComponent,
    },
    {
      path: 'file/form/:id',
      canActivate: [AuthGuardService],
      component: FileFormComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FileRoutingModule {
}
