import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-auth',
  styleUrls: ['./auth.component.scss'],
  template: `
    <router-outlet></router-outlet>
  `,
})
export class AuthComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
