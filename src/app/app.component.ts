import { BehaviorSubject } from 'rxjs';
import { NotificationService } from './services/notification.service';
/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { SeoService } from './@core/utils/seo.service';
import { NbMenuItem, NbIconLibraries, NbThemeService } from '@nebular/theme';
import { CommonService } from './services/common.service';
import { NbAuthService } from '@nebular/auth';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-app',
  template: `
  <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
  </ngx-one-column-layout>
  `,
})
export class AppComponent implements OnInit {
  menu: NbMenuItem[] = [
    {
      title: 'Loading',
      icon: 'monitor-outline',
      link: '/loading',
    },
  ];

  constructor(
    private analytics: AnalyticsService,
    private seoService: SeoService,
    public iconsLibrary: NbIconLibraries,
    public commonService: CommonService,
    public authService: NbAuthService,
    public translate: TranslateService,
    public notificatinoSerivce: NotificationService,
  ) {
    iconsLibrary.registerFontPack('fa', { packClass: 'fa', iconClassPrefix: 'fa' });
    this.commonService.configReady$.subscribe(ready => {
      if (ready) {
        this.commonService.getMenuTree(menuTree => {
          this.menu = this.translateMenu(menuTree);
        });
      }
    });


    // translate.use('vi');

    this.authService.onAuthenticationChange().subscribe(state => {
      if (state) {
        this.commonService.getMenuTree(menuTree => this.menu = this.translateMenu(menuTree));
        // this.commonService.langCode$.subscribe(langCode => {
        //   if (langCode) {
        //     this.locale = langCode;
        //   }
        // });
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
    this.notificatinoSerivce.active();
    
  }

  translateMenu(menuTree: NbMenuItem[]) {
    for (let i = 0; i < menuTree.length; i++) {
      if (/\./.test(menuTree[i].title)) {
        menuTree[i].title = this.commonService.textTransform(this.translate.instant(menuTree[i].title), 'head-title');
      }
      if (menuTree[i].children) {
        this.translateMenu(menuTree[i].children);
      }
    }
    return menuTree;
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
    this.seoService.trackCanonicalChanges();
  }
}
