import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { LogoutComponent } from './logout/logout.component';
import { NbRouteTabsetModule, NbAlertModule, NbButtonModule, NbCheckboxModule, NbInputModule, NbIconModule, NbCardModule } from '@nebular/theme';
import { AuthRoutingModule } from './auth-routing.module';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NbAuthModule } from '@nebular/auth';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AuthComponent,
    LogoutComponent,
    LoginComponent,
  ],
  imports: [
    CommonModule,
    NbRouteTabsetModule,
    AuthRoutingModule,
    NbAlertModule,
    NbButtonModule,
    NbCheckboxModule,
    NbInputModule,
    FormsModule,
    RouterModule,
    NbAuthModule,
    NbIconModule,
    NbCardModule,
  ],
})
export class AuthModule { }
