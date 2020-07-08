import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminProductComponent } from './admin-product.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { ProductFormComponent } from './product/product-form/product-form.component';
import { NbTabsetModule, NbCardModule, NbIconModule, NbInputModule, NbCheckboxModule, NbRouteTabsetModule, NbStepperModule, NbButtonModule, NbListModule, NbAccordionModule, NbUserModule, NbSelectModule, NbActionsModule, NbRadioModule, NbDatepickerModule, NbProgressBarModule, NbDialogModule, NbDialogRef } from '@nebular/theme';
import { AdminProductRoutingModule } from './admin-product-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CustomElementModule } from '../../lib/custom-element/custom-element.module';
import { IvoipDashboardModule } from '../ivoip/dashboard/ivoip-dashboard.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '../dialog/dialog.module';
import { AgGridModule } from '@ag-grid-community/angular';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { SortablejsModule } from 'ngx-sortablejs';
import { CKEditorModule } from 'ng2-ckeditor';
import { ProductCategoryListComponent } from './category/product-category-list/product-category-list.component';
import { ProductCategoryFormComponent } from './category/product-category-form/product-category-form.component';
import { ProductUnitListComponent } from './unit/product-unit-list/product-unit-list.component';
import { ProductUnitFormComponent } from './unit/product-unit-form/product-unit-form.component';
import { SmartTableThumbnailComponent } from '../../lib/custom-element/smart-table/smart-table.component';
import { NgxUploaderModule } from '../../../vendor/ngx-uploader/src/public_api';
import { TranslateModule } from '@ngx-translate/core';
import { SmartTableFilterComponent, SmartTableSelect2FilterComponent } from '../../lib/custom-element/smart-table/smart-table.filter.component';
import { ProductFormDialogComponent } from './product/product-form-dialog/product-form-dialog.component';
import { AssignCategoriesFormComponent } from './product/assign-categories-form/assign-categories-form.component';

@NgModule({
  declarations: [AdminProductComponent, ProductListComponent, ProductFormComponent,
    ProductCategoryListComponent, ProductCategoryFormComponent, ProductUnitListComponent,
    ProductUnitFormComponent,
    ProductFormDialogComponent,
    AssignCategoriesFormComponent,
  ],
  imports: [
    CommonModule,
    NbTabsetModule,
    AdminProductRoutingModule,
    NbCardModule,
    Ng2SmartTableModule,
    CustomElementModule,
    NbIconModule,
    NbInputModule,
    NbCheckboxModule,
    IvoipDashboardModule,
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
    NgxUploaderModule,
    TranslateModule,
    NbDialogModule.forChild(),
    SortablejsModule.forRoot({
      animation: 200,
    }),
  ],
  exports: [
    ProductListComponent,
  ],
  entryComponents: [
    ProductFormComponent,
    ProductCategoryFormComponent,
    ProductUnitFormComponent,
    ProductFormDialogComponent,
    SmartTableThumbnailComponent,
    SmartTableFilterComponent,
    SmartTableSelect2FilterComponent,
    AssignCategoriesFormComponent,
  ],
  providers: [
    // use french locale
    // { provide: OWL_DATE_TIME_LOCALE, useValue: 'vi' },
  ],
})
export class AdminProductModule { }
