import {NgModule} from '@angular/core';
import {MiniErpComponent} from './mini-erp.component';
import {MiniErpRoutingModule} from './mini-erp-routing.module';
import {ThemeModule} from '../@theme/theme.module';
import {NbMenuModule, NbCardModule, NbDialogModule, NbWindowModule, NbButtonModule} from '@nebular/theme';
import {DashboardModule} from './dashboard/dashboard.module';
import {ECommerceModule} from './e-commerce/e-commerce.module';
import {MiscellaneousModule} from './miscellaneous/miscellaneous.module';
import { ShowcaseDialogComponent } from './showcase-dialog/showcase-dialog.component';

@NgModule({
  declarations: [
    MiniErpComponent,
    ShowcaseDialogComponent,
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
  ],
})
export class MiniErpModule {
}
