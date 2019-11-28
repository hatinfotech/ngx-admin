/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { MENU_ITEMS } from './app-menu';
// import { stat } from 'fs';
// import { NbAuthService } from '@nebular/auth';
import { ApiService } from './services/api.service';

@Component({
  selector: 'ngx-app',
  // template: '<router-outlet></router-outlet>',
  template: `
    <ngx-one-column-layout>
        <nb-menu [items]="menu"></nb-menu>
        <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class AppComponent implements OnInit {

  menu = MENU_ITEMS;

  constructor(
    private analytics: AnalyticsService,
    // private authService: NbAuthService,
    // private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.analytics.trackPageViews();
  }
}
