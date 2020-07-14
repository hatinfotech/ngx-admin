import { Component, OnInit, Input } from '@angular/core';
import { ActionControl } from '../action-control-list/action-control.interface';

@Component({
  selector: 'ngx-card-header',
  templateUrl: './card-header.component.html',
  styleUrls: ['./card-header.component.scss'],
})
export class CardHeaderComponent implements OnInit {

  @Input() title: string;
  @Input() icon?: Icon;
  @Input() size?: string;
  @Input() controls?: ActionControl[];

  constructor() {
    console.log('debug');
  }

  ngOnInit(): void {
    if (!this.size) {
      this.size = 'medium';
    }
  }

}

export interface Icon {
  pack?: 'eva' | 'fa';
  name?: string;
  size: string;
  status: 'success' | 'warning' | 'info' | 'primary' | 'danger';
}
