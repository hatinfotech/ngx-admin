import { CustomElementModule } from './../../lib/custom-element/custom-element.module';
import { TranslateModule } from '@ngx-translate/core';
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
import { LoginDialogComponent } from './login/login-dialog.component';

@NgModule({
  declarations: [
    AuthComponent,
    LogoutComponent,
    LoginComponent,
    LoginDialogComponent,
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
    TranslateModule,
    CustomElementModule,
  ],
  entryComponents: [
    LoginDialogComponent,
  ],
})
export class AuthModule { }
