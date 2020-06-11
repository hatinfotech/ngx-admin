import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService, NbSidebarComponent } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IvoipService } from '../../../modules/ivoip/ivoip-service';
import { CommonService } from '../../../services/common.service';
import { ActionControl } from '../../../lib/custom-element/action-control-list/action-control.interface';
import { VirtualPhoneService } from '../../../modules/virtual-phone/virtual-phone.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  userMenu = [
    { title: 'Profile', link: '/users/profile/change-password' },
    { title: 'Log out', link: '/auth/logout' }];
  mennuBarExpand = true;
  chatBarExpand = true;
  sidebars: NbSidebarComponent[];

  domainList: { id?: string, text: string, children: any[] }[] = [];
  domainListConfig = {
    placeholder: 'Chọn domain...',
    allowClear: false,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'DomainUuid',
      text: 'DomainName',
    },
  };
  headerActionControlList: ActionControl[] = [];

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private ivoipService: IvoipService,
    public commonService: CommonService,
    private virtualPhoneService: VirtualPhoneService,
    public translate: TranslateService,
  ) {
    // translate.addLangs(['en', 'vi']);
    // translate.setDefaultLang('en');
    // const browserLang = translate.getBrowserLang();
    // translate.use(browserLang.match(/en|vi/) ? browserLang : 'en');
    // commonService.langCode$.subscribe(langCode => {
    //   translate.use(langCode);
    // });

  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => this.user = users.nick);

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
    this.sidebarService.onExpand().subscribe(info => {
      console.info('onExpand: ' + info.tag);
      if (info.tag === 'menu-sidebar') {
        this.collapseChat();
      } else {
        this.collapseMenu();
      }
    });

    this.commonService.headerActionControlList$.subscribe(actionControlList => {
      this.headerActionControlList = actionControlList;
    });

    this.virtualPhoneService.callState$.subscribe(callState => {
      if (callState.state === 'incomming' || callState.state === 'incomming-acecept') {
        this.expandChat();
      }
    });

    // this.commonService.loginInfo$.subscribe(loginInfo => {
    //   if (loginInfo) {
    //     this.user['picture'] = loginInfo.user.Avatar;
    //     this.user['name'] = loginInfo.user.Name;
    //   }
    // });
    // this.sidebarService.onCollapse().subscribe(info => {
    //   console.info('onCollapse: ');
    //   console.info(info);
    // });
    // this.sidebarService.onToggle().subscribe(info => {
    //   console.info('onToggle: ');
    //   console.info(info);
    // });
    // this.sidebarService.onCompact().subscribe(info => {
    //   console.info('onCompact: ');
    //   console.info(info);
    // });

    // this.menuService.onSubmenuToggle().subscribe(item => {
    //   // console.info(item);
    //   this.expandMenu();
    // });

    // setTimeout(() => {
    //   this.toggleChatbar();
    // }, 5000);

    // this.ivoipService.getDomainList(domainList => {
    //   this.domainList = domainList;
    // });

  }

  get activePbxDoamin() {
    return this.ivoipService.getPbxActiveDomainUuid();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  collapseMenu() {
    this.sidebarService.compact('menu-sidebar');
    this.layoutService.changeLayoutSize();
    // this.mennuBarExpand = false;
  }

  expandMenu() {
    this.sidebarService.expand('menu-sidebar');
    this.layoutService.changeLayoutSize();
    // this.mennuBarExpand = true;
    // this.collapseChat();
  }

  collapseChat() {
    this.sidebarService.collapse('chat-sidebar');
    this.layoutService.changeLayoutSize();
    // this.chatBarExpand = false;
  }

  expandChat() {
    this.sidebarService.expand('chat-sidebar');
    this.layoutService.changeLayoutSize();
    // this.chatBarExpand = true;
    this.collapseMenu();
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    // if (this.mennuBarExpand) {
    //   this.collapseMenu();
    // } else {
    //   this.expandMenu();
    // }

    return false;
  }

  toggleChatbar(): boolean {
    this.sidebarService.toggle(false, 'chat-sidebar');
    this.layoutService.changeLayoutSize();

    // if (this.chatBarExpand) {
    //   this.collapseChat();
    // } else {
    //   this.expandChat();
    // }

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  onChangeDomain(event) {
    this.ivoipService.onChangeDomain(event);
  }

  changeLanguage(localeCode: any) {
    this.commonService.locale$.next({locale: localeCode});
  }
}
