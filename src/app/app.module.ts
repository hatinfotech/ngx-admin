/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from './../environments/environment';
import {
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
  NbCardModule,
  NbLayoutModule,
} from '@nebular/theme';
import { NbAuthModule, NbPasswordAuthStrategy, NbAuthJWTToken, NbAuthOAuth2JWTToken } from '@nebular/auth';
import { AuthModule } from './modules/auth/auth.module';
import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from './custom-route-reuse-stratery';
import { ECommerceModule } from './modules/e-commerce/e-commerce.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { DialogModule } from './modules/dialog/dialog.module';
import { ShowcaseDialogComponent } from './modules/dialog/showcase-dialog/showcase-dialog.component';
import { TreeModule } from 'angular-tree-component';
import { PlayerDialogComponent } from './modules/dialog/player-dialog/player-dialog.component';
import { IvoipModule } from './modules/ivoip/ivoip.module';
import { PbxFormComponent } from './modules/ivoip/pbx/pbx-form/pbx-form.component';
import { NotificationModule } from './modules/notification/notification.module';
import { DialogFormComponent } from './modules/dialog/dialog-form/dialog-form.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    NotificationModule,
    NbLayoutModule,
    ECommerceModule,
    DashboardModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NbCardModule,
    DialogModule,
    IvoipModule,
    HttpClientModule,
    AuthModule,
    TreeModule,
    ThemeModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),
    CoreModule.forRoot(),
    NbAuthModule.forRoot({
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: 'email',
          token: {
            // class: NbAuthJWTToken,
            class: NbAuthOAuth2JWTToken,
            key: 'token', // this parameter tells where to look for the token
          },
          baseEndpoint: environment.api.baseUrl,
          login: {
            // ...
            endpoint: '/user/login',
            redirect: {
              success: null,
              failure: null, // stay on the same page
            },
          },
          refreshToken: {
            method: 'post',
            endpoint: '/user/login/refresh',
            requireValidToken: false,
            redirect: {
              success: null,
              failure: null,
            },
          }
          ,
          logout: {
            // ...
            endpoint: '/user/logout',
            redirect: {
              success: '/auth/login',
              // success: null,
              failure: null, // stay on the same page
            },
          },
          register: {
            // ...
            endpoint: '/user/register',
            redirect: {
              success: '/',
              failure: null, // stay on the same page
            },
          },
        }),
      ],
      forms: {},
    }),
  ],
  entryComponents: [
    ShowcaseDialogComponent,
    PlayerDialogComponent,
    // PbxFormComponent,
    DialogFormComponent,
  ],
  bootstrap: [AppComponent],
  providers: [{
    provide: RouteReuseStrategy,
    useClass: CustomRouteReuseStrategy,
  }],
})
export class AppModule {
}
