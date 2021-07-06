import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeploymentVoucherListComponent } from './deployment-voucher/deployment-voucher-list/deployment-voucher-list.component';
import { DeploymentVoucherFormComponent } from './deployment-voucher/deployment-voucher-form/deployment-voucher-form.component';
import { DeploymentVoucherPrintComponent } from './deployment-voucher/deployment-voucher-print/deployment-voucher-print.component';
import { DeploymentComponent } from './deployment.component';
import { NbAccordionModule, NbActionsModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbDatepickerModule, NbDialogModule, NbIconModule, NbInputModule, NbListModule, NbProgressBarModule, NbRadioModule, NbRouteTabsetModule, NbSelectModule, NbStepperModule, NbTabsetModule, NbUserModule } from '@nebular/theme';
import { DeploymentRoutingModule } from './deployment-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CustomElementModule } from '../../lib/custom-element/custom-element.module';
import { IvoipDashboardModule } from '../ivoip/dashboard/ivoip-dashboard.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '../dialog/dialog.module';
import { AgGridModule } from '@ag-grid-community/angular';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { CKEditorModule } from 'ng2-ckeditor';
import { SortablejsModule } from 'ngx-sortablejs';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { TranslateModule } from '@ngx-translate/core';
import { AdminProductModule } from '../admin-product/admin-product.module';
import { NgxUploaderModule } from '../../../vendor/ngx-uploader/src/public_api';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;


@NgModule({
  declarations: [DeploymentVoucherListComponent, DeploymentVoucherFormComponent, DeploymentVoucherPrintComponent, DeploymentComponent],
  imports: [
    CommonModule,
    NbTabsetModule,
    DeploymentRoutingModule,
    NbCardModule,
    Ng2SmartTableModule,
    CustomElementModule,
    NbIconModule,
    NbInputModule,
    NbCheckboxModule,
    NbRouteTabsetModule,
    NbStepperModule,
    NbButtonModule,
    NbListModule,
    NbAccordionModule,
    NbUserModule,
    NbSelectModule,
    NbActionsModule,
    NbRadioModule,
    NbDatepickerModule,
    CurrencyMaskModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    NbProgressBarModule,
    AgGridModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    CKEditorModule,
    NbDialogModule.forChild(),
    SortablejsModule.forRoot({
      animation: 200,
    }),
    NgxMaskModule.forRoot(options),
    TranslateModule,
    AdminProductModule,
    NgxUploaderModule,
  ]
})
export class DeploymentModule { }
