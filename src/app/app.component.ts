/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { NbIconLibraries, NbMenuItem } from '@nebular/theme';
import { CommonService } from './services/common.service';
import { NbAuthService } from '@nebular/auth';

@Component({
  selector: 'ngx-app',
  // template: '<router-outlet></router-outlet>',
  template: `
    <ngx-one-column-layout>
        <nb-menu [items]="menu"></nb-menu>
        <router-outlet></router-outlet>
    </ngx-one-column-layout>
    <img style="display: none" id="distributeCookieRequest" [src]="commonService.distributeFileStoreCookieRequest$ | async">
  `,
})
export class AppComponent implements OnInit {

  // menu = MENU_ITEMS;
  menu: NbMenuItem[] = [
    {
      title: 'Loading',
      icon: 'monitor-outline',
      link: '/loading',
    },
  ];
  // menu: NgxMenuItemModel[];
  // distributeFileStoreCookieRequest: string;

  constructor(
    private analytics: AnalyticsService,
    iconsLibrary: NbIconLibraries,
    public commonService: CommonService,
    public authService: NbAuthService,
  ) {
    iconsLibrary.registerFontPack('fa', { packClass: 'fa', iconClassPrefix: 'fa' });
    this.commonService.getMenuTree(menuTree => this.menu = menuTree);

    this.authService.onAuthenticationChange().subscribe(state => {
      if (state) {
        this.commonService.getMenuTree(menuTree => this.menu = menuTree);
      } else {
        this.menu = [
          {
            title: 'Loading',
            icon: 'monitor-outline',
            link: '/loading',
          },
        ];
      }
    });

  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
    // this.commonService.;
  }
}
