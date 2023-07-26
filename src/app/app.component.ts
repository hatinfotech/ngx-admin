import { NotificationService } from './services/notification.service';
/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { SeoService } from './@core/utils/seo.service';
import { NbMenuItem, NbIconLibraries, NbThemeService, NbMenuService } from '@nebular/theme';
import { CommonService } from './services/common.service';
import { NbAuthService } from '@nebular/auth';
import { TranslateService } from '@ngx-translate/core';
import { filter, take } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { NbMenuInternalService } from '@nebular/theme/components/menu/menu.service';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { AdminProductService } from './modules/admin-product/admin-product.service';

@Component({
  selector: 'ngx-app',
  template: `
  <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
  </ngx-one-column-layout>
  `,
  styleUrls: ['./app.component.scss'],
  providers: [CurrencyPipe]
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
    public currencyPipe: CurrencyPipe,
    public notificatinoSerivce: NotificationService,
    // public menuInternalService: NbMenuInternalService,
    // public menuService: NbMenuService,
    private titleService: Title,
    public router: Router,
  ) {
    this.cms.currencyPipe = currencyPipe;
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

    this.authService.onAuthenticationChange().subscribe(state => {
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
      // this.menu = [
      //   {
      //     title: 'Loading...',
      //     icon: 'monitor-outline',
      //     link: '/loading',
      //   },
      // ];
      this.cms.languageLoaded$.pipe(filter(f => f), take(1)).toPromise().then(() => {
        this.cms.getMenuTree(menuTree => {
          this.menu = this.prepareMenu(menuTree);
        });
      });
    });


    this.cms.languageLoaded$.pipe(filter(state => state)).subscribe(() => {
      this.cms.getMenuTree(menuTree => {
        this.menu = this.prepareMenu(menuTree);
      });
    });

  }

  prepareMenu(menuTree: NbMenuItem[], parent?: NbMenuItem) {
    for (const item of menuTree) {
      if (/\./.test(item.title)) {
        item.title = this.cms.textTransform(this.translate.instant(item.title), 'head-title');
      }
      item.selected = item.link == window.location.pathname.replace(/^\/[^\/]+/i, '');
      if (item.selected) {
        if (parent) parent.expanded = true;
      }
      if (item.children) {
        this.prepareMenu(item.children, item);
        if (item.expanded) {
          if (parent) parent.expanded = true;
        }
      }
    }
    return menuTree;
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
    this.seoService.trackCanonicalChanges();
  }
}
