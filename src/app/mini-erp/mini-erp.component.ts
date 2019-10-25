import { Component } from '@angular/core';

import { MENU_ITEMS } from './mini-erp-menu';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class MiniErpComponent {

  menu = MENU_ITEMS;
}
