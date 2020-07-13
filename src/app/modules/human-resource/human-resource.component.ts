import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-human-resource',
  styleUrls: ['./human-resource.component.scss'],
  template: `
    <router-outlet></router-outlet>
  `,
})
export class HumanResourceComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
