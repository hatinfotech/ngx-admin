import { NgModule } from '@angular/core';
import { MiniErpComponent } from './mini-erp.component';
import { MiniErpRoutingModule } from './mini-erp-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import {
  NbMenuModule, NbCardModule, NbDialogModule, NbWindowModule, NbButtonModule,
  NbTabsetModule, NbTreeGridModule, NbIconModule, NbInputModule, NbCheckboxModule,
  NbPopoverModule, NbSelectModule, NbTooltipModule, NbRouteTabsetModule,
} from '@nebular/theme';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { ShowcaseDialogComponent } from './showcase-dialog/showcase-dialog.component';
import { NormalDialogComponent } from './dialog/normal-dialog/normal-dialog.component';
import { TabsComponent } from './tabs/tabs.component';
import { UsersModule } from './users/users.module';
import { UserListComponent } from './users/user-manager/user-list/user-list.component';
import { MenuModule } from './menu/menu.module';
import { MenuListComponent } from './menu/manager-menu/menu-list/menu-list.component';
import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from '../custom-route-reuse-stratery';

@NgModule({
  declarations: [
    MiniErpComponent,
    ShowcaseDialogComponent,
    NormalDialogComponent,
    TabsComponent,
  ],
  entryComponents: [
    ShowcaseDialogComponent,
    UserListComponent,
    MenuListComponent,
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
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    NbCheckboxModule,
    NbTabsetModule,
    NbPopoverModule,
    NbSelectModule,
    NbTooltipModule,
    NbRouteTabsetModule,
    UsersModule,
    MenuModule,
  ],
  // providers: [{
  //   provide: RouteReuseStrategy,
  //   useClass: CustomRouteReuseStrategy,
  // }],
})
export class MiniErpModule {
}
