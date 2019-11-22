import { Component } from '@angular/core';

import { MENU_ITEMS } from './mini-erp-menu';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['mini-erp.component.scss'],
  template: `
    <router-outlet></router-outlet>
  `,
})
export class MiniErpComponent {

  menu = MENU_ITEMS;
}
