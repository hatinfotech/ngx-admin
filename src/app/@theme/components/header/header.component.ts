import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

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

  userMenu = [{ title: 'Profile' }, { title: 'Log out' }];
  mennuBarExpand = true;
  chatBarExpand = true;

  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService) {
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
    // this.sidebarService.onExpand().subscribe(info => {
    //   console.info('onExpand');
    // });
    // this.sidebarService.onCollapse().subscribe(info => {
    //   console.info('onCollapse');
    // });
    // this.sidebarService.onToggle().subscribe(info => {
    //   console.info('onToggle');
    // });
    // this.sidebarService.onCompact().subscribe(info => {
    //   console.info('onCompact');
    // });

    this.menuService.onSubmenuToggle().subscribe(item => {
      // console.info(item);
      this.expandMenu();
    });

    setTimeout(() => {
      this.expandMenu();
      this.collapseChat();
    }, 5000);


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
    this.mennuBarExpand = false;
  }

  expandMenu() {
    this.sidebarService.expand('menu-sidebar');
    this.layoutService.changeLayoutSize();
    this.mennuBarExpand = true;
    this.collapseChat();
  }

  collapseChat() {
    this.sidebarService.collapse('chat-sidebar');
    this.layoutService.changeLayoutSize();
    this.chatBarExpand = false;
  }

  expandChat() {
    this.sidebarService.expand('chat-sidebar');
    this.layoutService.changeLayoutSize();
    this.chatBarExpand = true;
    this.collapseMenu();
  }

  toggleSidebar(): boolean {
    // this.sidebarService.toggle(true, 'menu-sidebar');
    // this.layoutService.changeLayoutSize();

    if (this.mennuBarExpand) {
      this.collapseMenu();
    } else {
      this.expandMenu();
    }

    return false;
  }

  toggleChatbar(): boolean {
    // this.sidebarService.toggle(false, 'chat-sidebar');
    // this.layoutService.changeLayoutSize();

    if (this.chatBarExpand) {
      this.collapseChat();
    } else {
      this.expandChat();
    }

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}
