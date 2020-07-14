import { Component, Input, OnInit } from '@angular/core';
import { ActionControl } from './action-control.interface';
import { CommonService } from '../../../services/common.service';

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

  constructor(public commonService: CommonService) {
    console.log('constructor');
  }

  ngOnInit(): void { }

}
