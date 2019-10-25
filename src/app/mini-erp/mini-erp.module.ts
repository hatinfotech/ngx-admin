import {NgModule} from '@angular/core';
import {MiniErpComponent} from './mini-erp.component';
import {MiniErpRoutingModule} from './mini-erp-routing.module';
import {ThemeModule} from '../@theme/theme.module';
import {NbMenuModule} from '@nebular/theme';
import {DashboardModule} from './dashboard/dashboard.module';
import {ECommerceModule} from './e-commerce/e-commerce.module';
import {MiscellaneousModule} from './miscellaneous/miscellaneous.module';
import { HumanResourceComponent } from './human-resource/human-resource.component';

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
  ],
})
export class MiniErpModule {
}
