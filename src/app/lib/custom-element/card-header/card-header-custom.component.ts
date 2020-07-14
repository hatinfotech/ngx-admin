import { Component, OnInit, Input } from '@angular/core';
import { ActionControl } from '../action-control-list/action-control.interface';

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
