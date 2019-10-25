import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-test',
  template: `
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
