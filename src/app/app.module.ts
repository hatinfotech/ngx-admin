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
import {
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
} from '@nebular/theme';
import { NbAuthModule, NbPasswordAuthStrategy, NbAuthSimpleToken, NbAuthJWTToken } from '@nebular/auth';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,

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
    HttpClientModule,
    NbAuthModule.forRoot({
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: 'email',
          token: {
            class: NbAuthJWTToken,
            key: 'token', // this parameter tells where to look for the token
          },
          baseEndpoint: 'https://local.namsoftware.com/v1',
          login: {
            // ...
            endpoint: '/user/login',
            redirect: {
              success: '/mini-erp/human-resource/employees/list',
              failure: null, // stay on the same page
            },
          },
          register: {
            // ...
            endpoint: '/user/register',
            redirect: {
              success: '/mini-erp/human-resource/employees/list',
              failure: null, // stay on the same page
            },
          },
        }),
      ],
      forms: { },
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
