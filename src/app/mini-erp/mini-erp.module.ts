import { NgModule } from '@angular/core';
import { MiniErpComponent } from './mini-erp.component';
import { MiniErpRoutingModule } from './mini-erp-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import {
  NbMenuModule, NbCardModule, NbDialogModule, NbWindowModule, NbButtonModule,
  NbTabsetModule, NbTreeGridModule, NbIconModule, NbInputModule, NbCheckboxModule,
  NbPopoverModule, NbSelectModule, NbTooltipModule,
} from '@nebular/theme';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { ShowcaseDialogComponent } from './showcase-dialog/showcase-dialog.component';
import { NormalDialogComponent } from './dialog/normal-dialog/normal-dialog.component';

@NgModule({
  declarations: [
    MiniErpComponent,
    ShowcaseDialogComponent,
    NormalDialogComponent,
  ],
  entryComponents: [
    ShowcaseDialogComponent,
  ],
  imports: [
    MiniErpRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
    NbCardModule,
    NbDialogModule.forChild(),
    NbWindowModule.forChild(),
    NbButtonModule,
    // NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    // Ng2SmartTableModule,
    // NbDialogModule.forChild(),
    // NbWindowModule.forChild(),
    NbCheckboxModule,
    NbTabsetModule,
    NbPopoverModule,
    // NbButtonModule,
    NbSelectModule,
    NbTooltipModule,
  ],
})
export class MiniErpModule {
}
