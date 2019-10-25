import {NgModule} from '@angular/core';
import {MiniErpComponent} from './mini-erp.component';
import {MiniErpRoutingModule} from './mini-erp-routing.module';
import {ThemeModule} from '../@theme/theme.module';
import {NbMenuModule, NbCardModule} from '@nebular/theme';
import {DashboardModule} from './dashboard/dashboard.module';
import {ECommerceModule} from './e-commerce/e-commerce.module';
import {MiscellaneousModule} from './miscellaneous/miscellaneous.module';

@NgModule({
  declarations: [
    MiniErpComponent,
  ],
  imports: [
    MiniErpRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
    NbCardModule,
  ],
})
export class MiniErpModule {
}
