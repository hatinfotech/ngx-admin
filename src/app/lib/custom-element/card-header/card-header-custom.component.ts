import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-card-header-custom',
  template: `<ng-content></ng-content>`,
})
export class CardHeaderCustomComponent implements OnInit {

  constructor() {
    console.log('debug');
  }

  ngOnInit(): void {}

}
