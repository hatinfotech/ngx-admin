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
import { filter, take } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'ngx-app',
  template: `
  <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
  </ngx-one-column-layout>
  `,
  styleUrls: ['./app.component.scss'],
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
    public cms: CommonService,
    public authService: NbAuthService,
    public translate: TranslateService,
    public notificatinoSerivce: NotificationService,
    private titleService: Title,
  ) {
    iconsLibrary.registerFontPack('fa', { packClass: 'fa', iconClassPrefix: 'fa' });
    iconsLibrary.registerFontPack('far', { packClass: 'far', iconClassPrefix: 'far ' });
    iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });
    this.cms.configReady$.subscribe(ready => {
      if (ready) {
        this.loadMenu();
      }
    });

    // Set title
    this.cms.systemConfigs$.pipe(filter(f => !!f), take(1)).toPromise().then(systemConfigs => {
      if (systemConfigs?.ROOT_CONFIGS?.coreName) {
        this.titleService.setTitle(systemConfigs.ROOT_CONFIGS.coreName);
      };
    });

    // translate.use('vi');

    this.authService.onAuthenticationChange().pipe(filter(state => state === true)).subscribe(state => {
      if (state) {
        this.loadMenu();
      } else {
        this.menu = [
          {
            title: 'Loading...',
            icon: 'monitor-outline',
            link: '/loading',
          },
        ];
      }
    });
    this.notificatinoSerivce.active();

  }

  async loadMenu() {
    this.cms.takeOnce('load_main_menu', 5000).then(() => {
      this.menu = [
        {
          title: 'Loading...',
          icon: 'monitor-outline',
          link: '/loading',
        },
      ];
      this.cms.languageLoaded$.pipe(filter(f => f), take(1)).toPromise().then(() => {
        this.cms.getMenuTree(menuTree => {
          this.menu = this.translateMenu(menuTree);
        });
      });
    });
  }

  translateMenu(menuTree: NbMenuItem[]) {
    for (let i = 0; i < menuTree.length; i++) {
      if (/\./.test(menuTree[i].title)) {
        menuTree[i].title = this.cms.textTransform(this.translate.instant(menuTree[i].title), 'head-title');
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
