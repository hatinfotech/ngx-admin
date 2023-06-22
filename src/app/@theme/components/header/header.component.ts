import { NotificationService } from './../../../services/notification.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService, NbSidebarComponent, NbMenuItem } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { filter, map, take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
// import { IvoipService } from '../../../modules/ivoip/ivoip-service';
import { CommonService } from '../../../services/common.service';
import { ActionControl } from '../../../lib/custom-element/action-control-list/action-control.interface';
import { VirtualPhoneService } from '../../../modules/virtual-phone/virtual-phone.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;
  env = environment;

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

  notifications$ = new Subject<{ name: string, title: string, link: string, picture?: string }[]>();

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
  numOfUnreadNotification: number = 0;
  // headerActionControlListStack: ActionControl[][] = [];

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    // private ivoipService: IvoipService,
    public cms: CommonService,
    private virtualPhoneService: VirtualPhoneService,
    public translate: TranslateService,
    public router: Router,
    public notificationService: NotificationService,
  ) {
    // translate.addLangs(['en', 'vi']);
    // translate.setDefaultLang('en');
    // const browserLang = translate.getBrowserLang();
    // translate.use(browserLang.match(/en|vi/) ? browserLang : 'en');
    // cms.langCode$.subscribe(langCode => {
    //   translate.use(langCode);
    // });

    // this.cms.loginInfo$.pipe(takeUntil(this.destroy$), filter(f => !!f), take(1)).toPromise().then(userInfo => {
    //   const layoutZoomSize = localStorage.getItem(this.cms.loginInfo?.user.Code + '_layout_zoom_size');
    //   if (layoutZoomSize) {
    //     this.layoutFontSize = parseInt(layoutZoomSize);
    //     this.setZoomSizeLayout(parseInt(layoutZoomSize));
    //   }
    // });

    const layoutZoomSize = localStorage.getItem('layout_zoom_size');
    if (layoutZoomSize) {
      $('html').css({ fontSize: layoutZoomSize + 'px' });
    }
    this.cms.loginInfo$.pipe(takeUntil(this.destroy$), filter(f => !!f)).subscribe(loginInfo => {
      let layoutZoomSize = localStorage.getItem(loginInfo?.user.Code + '_layout_zoom_size');
      if (!layoutZoomSize) {
        layoutZoomSize = '16';
      }
      this.setZoomSizeLayout(parseInt(layoutZoomSize));
    });

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

    this.cms.pushHeaderActionControlList$.subscribe(actionControlList => {
      if (actionControlList && actionControlList.length > 0) {
        this.headerActionControlList = actionControlList;
        // this.headerActionControlListStack.push(actionControlList);
      }
    });
    this.cms.popHeaderActionControlList$.subscribe(() => {
      this.headerActionControlList = [];
    });
    this.cms.clearHeaderActionControlList$.subscribe(() => {
      this.headerActionControlList = [];
      // this.headerActionControlListStack = [];
    });


    this.virtualPhoneService.callState$.subscribe(callState => {
      if (callState.state === 'incomming' || callState.state === 'incomming-acecept') {
        this.expandChat();
      }
    });

    // this.cms.loginInfo$.subscribe(loginInfo => {
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

    // this.cms.loginInfo$.subscribe(loginInfo => {
    //   this.notifications$.next([
    //     { name: 'Triet', title: 'Tình hình triển khai tới đâu ròi mọi người', link: '/', picture: loginInfo?.user?.Avatar },
    //     { name: 'Lam', title: 'Báo cáo tính hình nha ae', link: '/', picture: loginInfo?.user?.Avatar },
    //     { name: 'Triet', title: 'Tình hình triển khai tới đâu ròi mọi người', link: '/', picture: loginInfo?.user?.Avatar },
    //     { name: 'Lam', title: 'Báo cáo tính hình nha ae', link: '/', picture: loginInfo?.user?.Avatar },
    //     { name: 'Triet', title: 'Tình hình triển khai tới đâu ròi mọi người', link: '/', picture: loginInfo?.user?.Avatar },
    //     { name: 'Lam', title: 'Báo cáo tính hình nha ae', link: '/', picture: loginInfo?.user?.Avatar },
    //     { name: 'Triet', title: 'Tình hình triển khai tới đâu ròi mọi người', link: '/', picture: loginInfo?.user?.Avatar },
    //     { name: 'Lam', title: 'Báo cáo tính hình nha ae', link: '/', picture: loginInfo?.user?.Avatar },
    //     { name: 'Triet', title: 'Tình hình triển khai tới đâu ròi mọi người', link: '/', picture: loginInfo?.user?.Avatar },
    //     { name: 'Lam', title: 'Báo cáo tính hình nha ae', link: '/', picture: loginInfo?.user?.Avatar },
    //     { name: 'Triet', title: 'Tình hình triển khai tới đâu ròi mọi người', link: '/', picture: loginInfo?.user?.Avatar },
    //     { name: 'Lam', title: 'Báo cáo tính hình nha ae', link: '/', picture: loginInfo?.user?.Avatar },
    //     { name: 'Triet', title: 'Tình hình triển khai tới đâu ròi mọi người', link: '/', picture: loginInfo?.user?.Avatar },
    //     { name: 'Lam', title: 'Báo cáo tính hình nha ae', link: '/', picture: loginInfo?.user?.Avatar },
    //     { name: 'Triet', title: 'Tình hình triển khai tới đâu ròi mọi người', link: '/', picture: loginInfo?.user?.Avatar },
    //     { name: 'Lam', title: 'Báo cáo tính hình nha ae', link: '/', picture: loginInfo?.user?.Avatar },
    //     { name: 'Triet', title: 'Tình hình triển khai tới đâu ròi mọi người', link: '/', picture: loginInfo?.user?.Avatar },
    //     { name: 'Lam', title: 'Báo cáo tính hình nha ae', link: '/', picture: loginInfo?.user?.Avatar },
    //   ]);
    // });



    this.notificationService.numOfUnread.subscribe(numOfUnread => {
      this.numOfUnreadNotification = numOfUnread;
    });

  }

  get activePbxDoamin() {
    return null;
    // todo: tmp remove for fix module circal error
    // return this.ivoipService.getPbxActiveDomainUuid();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    // this.themeService.changeTheme(themeName);
    this.cms.theme$.next({ theme: themeName });
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
    // this.menuService.navigateHome();
    this.router.navigate(['/']);
    return false;
  }

  onChangeDomain(event) {
    // todo: tmp remove for fix module circal error
    // this.ivoipService.onChangeDomain(event);
  }

  changeLanguage(localeCode: any) {
    this.cms.locale$.next({ locale: localeCode });
  }

  layoutFontSize = 16;
  setZoomSizeLayout(size: number) {
    this.layoutFontSize = size;
    localStorage.setItem(this.cms.loginInfo?.user.Code + '_layout_zoom_size', this.layoutFontSize.toString());
    localStorage.setItem('layout_zoom_size', this.layoutFontSize.toString());
    $('html').css({ fontSize: this.layoutFontSize + 'px' });
  }
  zoomInLayout() {
    if (this.layoutFontSize > 29) return;
    this.layoutFontSize++;
    localStorage.setItem(this.cms.loginInfo?.user.Code + '_layout_zoom_size', this.layoutFontSize.toString());
    localStorage.setItem('layout_zoom_size', this.layoutFontSize.toString());
    $('html').css({ fontSize: this.layoutFontSize + 'px' });
  }
  zoomOutLayout() {
    if (this.layoutFontSize < 6) return;
    this.layoutFontSize--;
    localStorage.setItem(this.cms.loginInfo?.user.Code + '_layout_zoom_size', this.layoutFontSize.toString());
    localStorage.setItem('layout_zoom_size', this.layoutFontSize.toString());
    $('html').css({ fontSize: this.layoutFontSize + 'px' });
  }
  zoomResetLayout() {
    this.layoutFontSize = 16;
    localStorage.setItem(this.cms.loginInfo?.user.Code + '_layout_zoom_size', this.layoutFontSize.toString());
    localStorage.setItem('layout_zoom_size', this.layoutFontSize.toString());
    $('html').css({ fontSize: this.layoutFontSize + 'px' });
  }
}
