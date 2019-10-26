import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { LogoutComponent } from './logout/logout.component';
import { NbRouteTabsetModule } from '@nebular/theme';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [
    AuthComponent,
    LogoutComponent,
  ],
  imports: [
    CommonModule,
    NbRouteTabsetModule,
    AuthRoutingModule,
  ],
})
export class AuthModule { }
