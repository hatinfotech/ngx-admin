import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { UserGroupListComponent } from './user-group/user-group-list/user-group-list.component';
import { UserGroupFormComponent } from './user-group/user-group-form/user-group-form.component';
import { UserGroupViewComponent } from './user-group/user-group-view/user-group-view.component';
import { UserGroupReportComponent } from './user-group/user-group-report/user-group-report.component';
import { UserListComponent } from './user-manager/user-list/user-list.component';
import { UserFormComponent } from './user-manager/user-form/user-form.component';
import { UserViewComponent } from './user-manager/user-view/user-view.component';
import { UserReportComponent } from './user-manager/user-report/user-report.component';
import { NbRouteTabsetModule, NbTabsetModule, NbStepperModule, NbCardModule, NbButtonModule,
  NbListModule, NbAccordionModule, NbUserModule, NbIconModule, NbSelectModule, NbInputModule, NbActionsModule, NbCheckboxModule, NbRadioModule, NbDatepickerModule } from '@nebular/theme';
import { UsersRoutingModule } from './users-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PermissionGrantComponent } from './permission-grant/permission-grant.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CustomElementModule } from '../../lib/custom-element/custom-element.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { TreeModule } from 'angular-tree-component';
import { UserChangePasswordFormComponent } from './profile/user-change-password-form/user-change-password-form.component';
import { SystemModule } from '../system/system.module';
import { SmartTableFilterComponent } from '../../lib/custom-element/smart-table/smart-table.filter.component';

@NgModule({
  declarations: [
    UsersComponent, UserListComponent,
    UserFormComponent, UserViewComponent, UserReportComponent, UserGroupListComponent,
    UserGroupFormComponent, UserGroupViewComponent, UserGroupReportComponent,
    UserListComponent, UserFormComponent, UserViewComponent, UserReportComponent, PermissionGrantComponent, UserChangePasswordFormComponent],
  imports: [
    CommonModule,
    NbRouteTabsetModule,
    UsersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NbTabsetModule,
    NbStepperModule,
    NbCardModule,
    NbButtonModule,
    NbListModule,
    NbAccordionModule,
    NbUserModule,
    Ng2SmartTableModule,
    NbIconModule,
    NbSelectModule,
    CustomElementModule,
    CurrencyMaskModule,
    NbInputModule,
    NbActionsModule,
    NbCheckboxModule,
    NbRadioModule,
    NbDatepickerModule,
    TreeModule,
    SystemModule,
  ],
  exports: [UserListComponent],
  entryComponents: [
    SmartTableFilterComponent,
  ],
})
export class UsersModule { }
