/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { MENU_ITEMS } from './app-menu';
import { NbIconLibraries } from '@nebular/theme';

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
    iconsLibrary: NbIconLibraries,
  ) {
    iconsLibrary.registerFontPack('fa', { packClass: 'fa', iconClassPrefix: 'fa' });
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
  }
}
