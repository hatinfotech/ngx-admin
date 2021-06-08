import { ServiceWorkerModule } from '@angular/service-worker';
/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule, RoutingResolve } from './app-routing.module';
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
  NbDialogRef,
} from '@nebular/theme';
import { NbAuthModule, NbPasswordAuthStrategy, NbAuthOAuth2JWTToken } from '@nebular/auth';
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
import { NotificationModule } from './modules/notification/notification.module';
import { DialogFormComponent } from './modules/dialog/dialog-form/dialog-form.component';
import { CookieService } from 'ngx-cookie-service';
import { MobileAppModule } from './modules/mobile-app/mobile-app.module';
import { ApiInterceptor } from './services/api.service';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { registerLocaleData, CurrencyPipe, DecimalPipe } from '@angular/common';
import localeVi from '@angular/common/locales/vi';
import localeViExtra from '@angular/common/locales/extra/vi';
import { OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireModule } from '@angular/fire';
registerLocaleData(localeVi, 'vi', localeViExtra);

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

export class DynamicLocaleId extends String {
  constructor(public translate: TranslateService) {
    super();
  }

  toString() {
    return this.translate.currentLang;
  }
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    NotificationModule,
    NbLayoutModule,
    ECommerceModule,
    DashboardModule,
    MobileAppModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NbCardModule,
    DialogModule,
    IvoipModule,
    HttpClientModule,
    AuthModule,
    CurrencyMaskModule,
    TreeModule.forRoot(),
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
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
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
            // endpoint: '/user/logout',
            endpoint: '',
            redirect: {
              success: '/auth/logout',
              // success: null,
              failure: null, // stay on the same page
            },
            requireValidToken: true,
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
    // ServiceWorkerModule.register('/probox-core/firebase-messaging-sw.js', { enabled: true || environment.production, registrationStrategy: 'registerImmediately' }),
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase),
  ],
  entryComponents: [
    ShowcaseDialogComponent,
    PlayerDialogComponent,
    // PbxFormComponent,
    DialogFormComponent,
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: CustomRouteReuseStrategy,
    },
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
    },
    {
      provide: LOCALE_ID,
      useClass: DynamicLocaleId,
      deps: [TranslateService],
    },
    {
      provide: OWL_DATE_TIME_LOCALE,
      useClass: DynamicLocaleId,
      deps: [TranslateService],
    },
    { provide: NbDialogRef, useValue: {} },
    { provide: CurrencyPipe, useValue: {} },
    { provide: DecimalPipe, useValue: {} },
    RoutingResolve,
  ],
})
export class AppModule {
}
