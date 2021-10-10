import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemComponent } from './system.component';
import { NbTabsetModule, NbCardModule, NbIconModule, NbInputModule, NbCheckboxModule, NbRouteTabsetModule, NbStepperModule, NbButtonModule, NbListModule, NbAccordionModule, NbUserModule, NbSelectModule, NbActionsModule, NbRadioModule, NbDatepickerModule, NbProgressBarModule, NbDialogModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CustomElementModule } from '../../lib/custom-element/custom-element.module';
// import { CurrencyMaskModule } from 'ng2-currency-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { DialogModule } from '../dialog/dialog.module';
import { AgGridModule } from '@ag-grid-community/angular';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
// import { CKEditorModule } from 'ng2-ckeditor';
import { SortablejsModule } from 'ngx-sortablejs';
import { IConfig, NgxMaskModule } from 'ngx-mask';
// import { options } from '../sales/sales.module';
import { TranslateModule } from '@ngx-translate/core';
import { SystemRoutingModule } from './system-routing.module';
import { SystemParameterListComponent } from './parameter/system-parameter-list/system-parameter-list.component';
import { SystemParameterFormComponent } from './parameter/system-parameter-form/system-parameter-form.component';
import { SystemConfigurationBoardComponent } from './configuration/system-configuration-board/system-configuration-board.component';
import { SmartTableCheckboxComponent } from '../../lib/custom-element/smart-table/smart-table.component';
import { SystemLocaleConfigComponent } from './configuration/system-configuration-board/system-locale-config/system-locale-config.component';
import { UserConfigBoardComponent } from './configuration/user-config-board/user-config-board.component';
import { UserLocaleConfigComponent } from './configuration/user-config-board/user-locale-config/user-locale-config.component';
import { SmartTableFilterComponent } from '../../lib/custom-element/smart-table/smart-table.filter.component';
import { SystemActionListComponent } from './action/system-action-list/system-action-list.component';
import { SystemActionFormComponent } from './action/system-action-form/system-action-form.component';
import { SystemParamListComponent } from './param/system-param-list/system-param-list.component';
import { SystemParamFormComponent } from './param/system-param-form/system-param-form.component';
import { SystemRouteListComponent } from './route/system-route-list/system-route-list.component';
import { SystemRouteFormComponent } from './route/system-route-form/system-route-form.component';
import { SystemLibraryIconComponent } from './library/icon/system-library-icon/system-library-icon.component';
import { ThemeConfigBoardComponent } from './configuration/theme-config-board/theme-config-board.component';
import { ThemeConfigComponent } from './configuration/theme-config-board/theme-config/theme-config.component';


export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
  declarations: [SystemComponent, SystemParameterListComponent, SystemParameterFormComponent,
    SystemConfigurationBoardComponent, SystemLocaleConfigComponent, UserConfigBoardComponent,
    UserLocaleConfigComponent, SystemActionListComponent, SystemActionFormComponent,
    SystemParamListComponent, SystemParamFormComponent, SystemRouteListComponent, SystemRouteFormComponent, SystemLibraryIconComponent, ThemeConfigBoardComponent, ThemeConfigComponent,
  ],
  imports: [
    CommonModule,
    NbTabsetModule,
    SystemRoutingModule,
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
    NbDialogModule.forChild(),
    SortablejsModule.forRoot({
      animation: 200,
    }),
    NgxMaskModule.forRoot(options),
    TranslateModule,
  ],
  exports: [
    UserLocaleConfigComponent,
    ThemeConfigComponent,
  ],
  entryComponents: [
    SystemParameterFormComponent,
    SmartTableCheckboxComponent,
    SmartTableFilterComponent,
  ],
})
export class SystemModule { }
