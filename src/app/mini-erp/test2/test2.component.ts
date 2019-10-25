import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-test2',
  template: `
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./test2.component.scss'],
})
export class Test2Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
