import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordpressComponent } from './wordpress.component';
import { WpSiteListComponent } from './wp-site/wp-site-list/wp-site-list.component';
import { WpSiteFormComponent } from './wp-site/wp-site-form/wp-site-form.component';
import { NbTabsetModule, NbCardModule, NbIconModule, NbInputModule, NbCheckboxModule, NbRouteTabsetModule, NbStepperModule, NbButtonModule, NbListModule, NbAccordionModule, NbUserModule, NbSelectModule, NbActionsModule, NbRadioModule, NbDatepickerModule, NbProgressBarModule, NbDialogModule } from '@nebular/theme';
import { WordpressRoutingModule } from './wordpress-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CustomElementModule } from '../../lib/custom-element/custom-element.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { DialogModule } from '../dialog/dialog.module';
import { AgGridModule } from '@ag-grid-community/angular';
import { SortablejsModule } from 'ngx-sortablejs';
import { SyncFormComponent } from './sync-form/sync-form.component';
import { SmartTableFilterComponent } from '../../lib/custom-element/smart-table/smart-table.filter.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [WordpressComponent, WpSiteListComponent, WpSiteFormComponent, SyncFormComponent],
  imports: [
    CommonModule,
    NbTabsetModule,
    WordpressRoutingModule,
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
    // DialogModule,
    NbProgressBarModule,
    AgGridModule,
    TranslateModule,
    NbDialogModule.forChild(),
    SortablejsModule.forRoot({
      animation: 200,
    }),
  ],
  entryComponents: [
    WpSiteFormComponent,
    SyncFormComponent,
    SmartTableFilterComponent,
  ],
})
export class WordpressModule { }
