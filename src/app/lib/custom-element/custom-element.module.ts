import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { Select2Component } from './select2/select2.component';
import { SmartTableCheckboxComponent, SmartTableButtonComponent, SmartTableIconComponent, SmartTableThumbnailComponent, SmartTableDateTimeComponent, SmartTableCurrencyEditableComponent, IconViewComponent, SmartTableNumberEditableComponent, SmartTableTextEditableComponent, SmartTableCurrencyComponent, SmartTableBaseComponent, SmartTableTagsComponent, SmartTableAccCurrencyComponent } from './smart-table/smart-table.component';
import { NbCheckboxModule, NbIconModule, NbButtonModule, NbInputModule, NbSelectModule, NbTooltipModule, NbProgressBarModule, NbCardModule, NbSpinnerModule, NbPopoverModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActionControlListComponent } from './action-control-list/action-control-list.component';
import { AgListComponent } from './ag-list/ag-list.component';
import { AgGridModule } from '@ag-grid-community/angular';
import { HeadTitlePipe } from '../pipes/head-title.pipe';
import { SmartTableDateTimeRangeFilterComponent, SmartTableClearingFilterComponent, SmartTableFilterComponent, SmartTableSelect2FilterComponent, SmartTableSelectFilterComponent, SmartTableDateRangeFilterComponent } from './smart-table/smart-table.filter.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { TranslateModule } from '@ngx-translate/core';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CardHeaderComponent } from './card-header/card-header.component';
import { CardHeaderCustomComponent } from './card-header/card-header-custom.component';
import { DatetimPickerComponent } from './datetime-picker/datetime-picker.component';
import { TextNTagsComponent } from './textntags/textntags.component';
import { FormGroupComponent } from './form/form-group/form-group.component';
import { ObjectIdPipe, ObjectsIdPipe } from '../pipes/objectid';
import { ObjectTextPipe, ObjectsTextPipe } from '../pipes/objecttext';
import { MyTableComponent } from './my-components/my-table/my-table.component';
import { FileInputComponent } from './my-components/file-input/file-input.component';
import { NgxUploaderModule } from '../../../vendor/ngx-uploader/src/public_api';
import { FilesInputComponent } from './my-components/files-input/files-input.component';
import { PrintHeaderComponent } from './print/print-header/print-header.component';
import { Select2Module } from '../../../vendor/ng2select2/lib/ng2-select2';
import { ImagesViewerComponent } from './my-components/images-viewer/images-viewer.component';
import { ImageViewerModule } from 'ngx-image-viewer';
// import { AngularImageViewerModule } from '@hreimer/angular-image-viewer';

@NgModule({
  declarations: [
    Select2Component,
    SmartTableCheckboxComponent,
    SmartTableButtonComponent,
    SmartTableIconComponent,
    SmartTableThumbnailComponent,
    ActionControlListComponent,
    AgListComponent,
    HeadTitlePipe,
    ObjectIdPipe,
    ObjectTextPipe,
    ObjectsTextPipe,
    ObjectsIdPipe,
    SmartTableDateTimeComponent,
    SmartTableDateTimeRangeFilterComponent,
    SmartTableDateRangeFilterComponent,
    SmartTableClearingFilterComponent,
    SmartTableFilterComponent,
    SmartTableSelect2FilterComponent,
    SmartTableCurrencyEditableComponent,
    CardHeaderComponent, CardHeaderCustomComponent, SmartTableSelectFilterComponent,
    IconViewComponent, DatetimPickerComponent, TextNTagsComponent, FormGroupComponent,
    SmartTableNumberEditableComponent,
    SmartTableTextEditableComponent,
    SmartTableCurrencyComponent,
    SmartTableBaseComponent,
    MyTableComponent,
    FileInputComponent,
    FilesInputComponent,
    PrintHeaderComponent,
    SmartTableTagsComponent,
    SmartTableAccCurrencyComponent,
    ImagesViewerComponent,
  ],
  imports: [
    CommonModule,
    Select2Module,
    NbCheckboxModule,
    NbIconModule,
    NbButtonModule,
    NbTooltipModule,
    NbProgressBarModule,
    FormsModule,
    NbInputModule,
    AgGridModule,
    NbSelectModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    TranslateModule,
    CurrencyMaskModule,
    NgxUploaderModule,
    // NgxViewerModule,
    // AngularImageViewerModule,
    NbCardModule,
    NbSpinnerModule,
    NbPopoverModule,
    ImageViewerModule.forRoot({
      btnClass: 'default', // The CSS class(es) that will apply to the buttons
      zoomFactor: 0.1, // The amount that the scale will be increased by
      containerBackgroundColor: '#ccc', // The color to use for the background. This can provided in hex, or rgb(a).
      wheelZoom: false, // If true, the mouse wheel can be used to zoom in
      allowFullscreen: true, // If true, the fullscreen button will be shown, allowing the user to entr fullscreen mode
      allowKeyboardNavigation: true, // If true, the left / right arrow keys can be used for navigation
      btnIcons: { // The icon classes that will apply to the buttons. By default, font-awesome is used.
        zoomIn: 'fa fa-plus',
        zoomOut: 'fa fa-minus',
        rotateClockwise: 'fa fa-undo fa-flip-horizontal',
        rotateCounterClockwise: 'fa fa-undo',
        next: 'fa fa-arrow-right',
        prev: 'fa fa-arrow-left',
        fullscreen: 'fa fa-arrows-alt',
      },
      btnShow: {
        zoomIn: true,
        zoomOut: true,
        rotateClockwise: true,
        rotateCounterClockwise: true,
        next: true,
        prev: true
      }
    }),
  ],
  exports: [
    Select2Component,
    SmartTableCheckboxComponent,
    SmartTableButtonComponent,
    SmartTableIconComponent,
    SmartTableThumbnailComponent,
    ActionControlListComponent,
    AgListComponent,
    HeadTitlePipe,
    ObjectIdPipe,
    ObjectTextPipe,
    ObjectsIdPipe,
    ObjectsTextPipe,
    SmartTableDateTimeComponent,
    SmartTableDateTimeRangeFilterComponent,
    SmartTableClearingFilterComponent,
    SmartTableFilterComponent,
    SmartTableSelect2FilterComponent,
    SmartTableCurrencyEditableComponent,
    SmartTableTagsComponent,
    CardHeaderComponent, CardHeaderCustomComponent, SmartTableSelectFilterComponent,
    IconViewComponent, DatetimPickerComponent, TextNTagsComponent, FormGroupComponent,
    SmartTableNumberEditableComponent,
    SmartTableTextEditableComponent,
    SmartTableCurrencyComponent,
    SmartTableBaseComponent,
    MyTableComponent,
    FileInputComponent,
    FilesInputComponent,
    PrintHeaderComponent,
    SmartTableAccCurrencyComponent,
  ],
  providers: [
    { provide: CurrencyPipe, useValue: {} },
    { provide: DecimalPipe, useValue: {} },
  ],
})
export class CustomElementModule { }
