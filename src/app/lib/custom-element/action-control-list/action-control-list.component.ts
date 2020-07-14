import { Component, Input, OnInit } from '@angular/core';
import { ActionControl } from './action-control.interface';

@Component({
  selector: 'ngx-action-control-list',
  templateUrl: './action-control-list.component.html',
  styleUrls: ['./action-control-list.component.scss'],
})
export class ActionControlListComponent implements OnInit {
  @Input() list: ActionControl[];
  @Input() hideLabel: boolean = false;
  @Input() hideIcon: boolean = false;
  @Input() option: any;

  constructor() {
    console.log('constructor');
  }

  ngOnInit(): void {
    console.log('on init');
    for (let i = 0; i < this.list.length; i++) {
      console.log(this.list[i]);
    }
  }
}
