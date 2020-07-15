import { Component, Input, OnInit } from '@angular/core';
import { ActionControl, ActionControlListOption } from './action-control.interface';
import { CommonService } from '../../../services/common.service';
import { FormGroupName, FormGroup } from '@angular/forms';

@Component({
  selector: 'ngx-action-control-list',
  templateUrl: './action-control-list.component.html',
  styleUrls: ['./action-control-list.component.scss'],
})
export class ActionControlListComponent implements OnInit {
  @Input() list: ActionControl[];
  @Input() hideLabel: boolean = false;
  @Input() hideIcon: boolean = false;
  @Input() option: ActionControlListOption;

  constructor(public commonService: CommonService) {
    console.log('constructor');
  }

  ngOnInit(): void { }

}
