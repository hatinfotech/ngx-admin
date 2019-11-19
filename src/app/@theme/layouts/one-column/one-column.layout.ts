import { Component, ViewChild, AfterViewInit, OnInit, ViewChildren, QueryList } from '@angular/core';
import { NbSidebarComponent, NbSidebarService, NbMenuService } from '@nebular/theme';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  template: `
    <nb-layout windowMode>
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
        <!--<iframe class="itLocalapp" src="https://nam2019.mtsg.vn/app/ITLocal/index.html" style="height: 100% ; width:100%; border:0"></iframe>-->
      </nb-sidebar>

      <nb-layout-footer fixed>
        <ngx-footer></ngx-footer>
      </nb-layout-footer>
    </nb-layout>
  `,
})
export class OneColumnLayoutComponent implements OnInit, AfterViewInit {

  @ViewChild('menuSidebar', { static: false }) menuSidebar: NbSidebarComponent;
  @ViewChild('chatSidebar', { static: false }) chatSiderbar: NbSidebarComponent;

  messages: any[];

  ngOnInit(): void {
  }

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
  ) {
  }

  ngAfterViewInit(): void {
    // console.info(this.siderbar);
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
    });

    this.menuService.onSubmenuToggle().subscribe(item => {
      if (this.chatSiderbar.expanded) {
        this.sidebarService.toggle(true, 'menu-sidebar');
      }
    });
  }
}
