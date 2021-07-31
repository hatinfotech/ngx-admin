import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZaloOaComponent } from './zalo-oa.component';
import { NbTabsetModule, NbCardModule, NbIconModule, NbInputModule, NbCheckboxModule, NbRouteTabsetModule, NbStepperModule, NbButtonModule, NbListModule, NbAccordionModule, NbUserModule, NbSelectModule, NbActionsModule, NbRadioModule, NbDatepickerModule, NbProgressBarModule, NbDialogModule } from '@nebular/theme';
import { ZaloOaRoutingModule } from './zalo-ao-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CustomElementModule } from '../../lib/custom-element/custom-element.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { DialogModule } from '../dialog/dialog.module';
import { AgGridModule } from '@ag-grid-community/angular';
import { ChartModule } from 'angular2-chartjs';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
// import { CKEditorModule } from 'ng2-ckeditor';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { TranslateModule } from '@ngx-translate/core';
import { SortablejsModule } from 'ngx-sortablejs';
import { ZaloOaConversationComponent } from './conversation/zalo-oa-conversation/zalo-oa-conversation.component';
import { ZaloOaFollowerListComponent } from './follower/zalo-oa-follower-list/zalo-oa-follower-list.component';
import { ZaloOaFollowerFormComponent } from './follower/zalo-oa-follower-form/zalo-oa-follower-form.component';
import { ZaloOfficialAccountListComponent } from './official-account/zalo-official-account-list/zalo-official-account-list.component';
import { ZaloOfficialAccountFormComponent } from './official-account/zalo-official-account-form/zalo-official-account-form.component';
import { ZaloOaTemplateListComponent } from './template/zalo-oa-template-list/zalo-oa-template-list.component';
import { ZaloOaTemplateFormComponent } from './template/zalo-oa-template-form/zalo-oa-template-form.component';



@NgModule({
  declarations: [ZaloOaComponent, ZaloOaConversationComponent,
    ZaloOaFollowerListComponent, ZaloOaFollowerFormComponent,
    ZaloOfficialAccountListComponent, ZaloOfficialAccountFormComponent, ZaloOaTemplateListComponent, ZaloOaTemplateFormComponent],
  imports: [
    CommonModule,
    NbTabsetModule,
    ZaloOaRoutingModule,
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

    NbUserModule,
    NbButtonModule,
    NbTabsetModule,
    NbSelectModule,
    NbListModule,
    ChartModule,
    NbProgressBarModule,
    NgxEchartsModule,
    NgxChartsModule,
    LeafletModule,
    // CKEditorModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,

    TranslateModule,
    NbDialogModule.forChild(),
    SortablejsModule.forRoot({
      animation: 200,
    }),
  ],
  entryComponents: [
    ZaloOfficialAccountFormComponent,
    ZaloOaFollowerFormComponent,
    ZaloOaTemplateFormComponent,
  ],
})
export class ZaloOaModule { }
