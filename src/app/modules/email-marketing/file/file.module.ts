import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileComponent } from './file.component';
import { FileListComponent } from './file/file-list/file-list.component';
import { FileFormComponent } from './file/file-form/file-form.component';
import { NbTabsetModule, NbCardModule, NbIconModule, NbInputModule, NbCheckboxModule, NbRouteTabsetModule, NbStepperModule, NbButtonModule, NbListModule, NbAccordionModule, NbUserModule, NbSelectModule, NbActionsModule, NbRadioModule, NbDatepickerModule, NbProgressBarModule, NbDialogModule } from '@nebular/theme';
import { FileRoutingModule } from './file-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
// import { CurrencyMaskModule } from 'ng2-currency-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { DialogModule } from '../dialog/dialog.module';
import { AgGridModule } from '@ag-grid-community/angular';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
// import { CKEditorModule } from 'ng2-ckeditor';
import { SortablejsModule } from 'ngx-sortablejs';
import { FileStoreListComponent } from './store/file-store-list/file-store-list.component';
import { FileStoreFormComponent } from './store/file-store-form/file-store-form.component';
import { FileUploadComponent } from './file/file-upload/file-upload.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgxUploaderModule } from '../../../../vendor/ngx-uploader/src/public_api';
import { CustomElementModule } from '../../../lib/custom-element/custom-element.module';
import { SmartTableThumbnailComponent } from '../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableFilterComponent } from '../../../lib/custom-element/smart-table/smart-table.filter.component';

@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    NbTabsetModule,
    FileRoutingModule,
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
    // CurrencyMaskModule,
    FormsModule,
    ReactiveFormsModule,
    // DialogModule,
    NbProgressBarModule,
    AgGridModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    // CKEditorModule,
    NgxUploaderModule,
    TranslateModule,
    NbDialogModule.forChild(),
    SortablejsModule.forRoot({
      animation: 200,
    }),
  ],
  entryComponents: [
    FileStoreFormComponent,
    FileFormComponent,
    FileUploadComponent,
    SmartTableThumbnailComponent,
    SmartTableFilterComponent,
  ],
  providers: [
    // use french locale
    {provide: OWL_DATE_TIME_LOCALE, useValue: 'vi'},
  ],
})
export class FileModule { }
