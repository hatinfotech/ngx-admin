import { Component, OnInit } from '@angular/core';
import { DateTimeAdapter } from 'ng-pick-datetime';

@Component({
  selector: 'ngx-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss'],
})
export class PurchaseComponent implements OnInit {

  constructor(dateTimeAdapter: DateTimeAdapter<any>) {
    dateTimeAdapter.setLocale('vi-VN');
  }

  ngOnInit() {
  }

}
