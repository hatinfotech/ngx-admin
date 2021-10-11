import { Component, ViewChild } from '@angular/core';
import { NbAuthService } from '@nebular/auth';
import { NbSidebarComponent, NbSidebarService, NbMenuService } from '@nebular/theme';
import { environment } from '../../../../environments/environment.prod';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  template: `
    <nb-layout [attr.authState]="authState" windowMode>
      <nb-layout-header fixed>
        <ngx-header></ngx-header>
      </nb-layout-header>

      <nb-sidebar #menuSidebar class="menu-sidebar" tag="menu-sidebar" responsive state="expanded">
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column>
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

      <nb-sidebar #chatSidebar right class="chat-sidebar" tag="chat-sidebar" responsive state="collapsed">
        <ngx-smart-bot id="small-smart-bot"></ngx-smart-bot>
      </nb-sidebar>

      <nb-layout-footer fixed>
        <ngx-footer></ngx-footer>
      </nb-layout-footer>
    </nb-layout>
  `,
})
export class OneColumnLayoutComponent {
  @ViewChild('menuSidebar', { static: false }) menuSidebar: NbSidebarComponent;
  @ViewChild('chatSidebar', { static: false }) chatSiderbar: NbSidebarComponent;

  messages: any[];
  authState = 'logout';
  enableLocalApp: boolean;
  localAppUrl = '/app/ITLocal/index.html';

  ngOnInit(): void {

    // Local app
    this.enableLocalApp = environment.localApp.enabled;
    this.localAppUrl = environment.localApp.url;

  }

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private authService: NbAuthService,
    private commonService: CommonService,
  ) {
    // setTimeout(() => {
    //   this.authState = 'login';
    // }, 10000);
    this.authService.onAuthenticationChange().subscribe(state => {
      this.authState = state ? 'login' : 'logout';
    });
  }

  // loginState(): Observable<boolean> {
  //   return this.authService.onAuthenticationChange().pipe(tap(state => state));
  // }

  ngAfterViewInit(): void {

    this.commonService.menuSidebar = this.menuSidebar;
    this.commonService.mobileSidebar = this.chatSiderbar;

    // Restore sidebar state
    const menuSidebarState = localStorage.getItem(`sidebar-state-menu`);
    const chatSidebarState = localStorage.getItem(`sidebar-state-chat`);
    if(menuSidebarState === 'true' || menuSidebarState == null) {
      this.sidebarService.expand('menu-sidebar');
    } else {
      this.sidebarService.collapse('menu-sidebar');
    }
    if(chatSidebarState === 'true') {
      this.sidebarService.expand('chat-sidebar');
    } else {
      this.sidebarService.collapse('chat-sidebar');
    }

    this.sidebarService.onToggle().subscribe(info => {
      if (info.tag === 'menu-sidebar') {
        if (this.menuSidebar.expanded && this.chatSiderbar.expanded) {
          this.sidebarService.toggle(false, 'chat-sidebar');
        }
      }
      if (info.tag === 'chat-sidebar') {
        if (this.menuSidebar.expanded && this.chatSiderbar.expanded) {
          this.sidebarService.toggle(true, 'menu-sidebar');
        }
      }
      localStorage.setItem(`sidebar-state-menu`, `${this.menuSidebar.expanded}`);
      localStorage.setItem(`sidebar-state-chat`, `${this.chatSiderbar.expanded}`);
    });

    this.menuService.onSubmenuToggle().subscribe(item => {
      if (this.chatSiderbar.expanded) {
        this.sidebarService.toggle(true, 'menu-sidebar');
      }
    });
  }
}
