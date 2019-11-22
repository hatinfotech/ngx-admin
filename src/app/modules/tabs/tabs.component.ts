import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

  constructor() { }

  tabs: any[] = [
    {
      title: 'Users',
      route: '/tabs/users',
    },
    {
      title: 'Menu',
      route: '/tabs/menu',
    },
  ];

  ngOnInit() {
  }

}
