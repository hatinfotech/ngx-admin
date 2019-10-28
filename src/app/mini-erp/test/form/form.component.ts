import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { PriceReport, PriceReportDetail } from '../../models/sales/price-report.model';

@Component({
  selector: 'ngx-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  constructor() { }
  editing = {};
  rows = [];

  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      Code: {
        title: 'Stt',
        type: 'number',
      },
      Photo: {
        title: 'Hình',
        type: 'string',
      },
      Name: {
        title: 'Sản phẩm',
        type: 'string',
      },
      Quanity: {
        title: 'Số lượng',
        type: 'string',
      },
      Unit: {
        title: 'ĐVT',
        type: 'string',
      },
      Price: {
        title: 'Đơn giá',
        type: 'string',
      },
      Tax: {
        title: 'Thuế',
        type: 'string',
      },
      ToMoney: {
        title: 'Thành tiền',
        type: 'string',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  no = 0;

  priceReport: PriceReport = new PriceReport();

  priceReportDetails: PriceReportDetail[] = [];

  ngOnInit() {
    this.source.load([
      {
        Code: 'PRD2423432',
        Photo: 'IMG',
        Name: 'Thiết bị Router Mikrotik CCR1016-12G',
        Quantity: 2,
        Unit: 'CAI',
        Price: 200000,
        Tax: '10%',
        ToMoney: 400000,
      },
      {
        Code: 'PRD2423432',
        Photo: 'IMG',
        Name: 'Thiết bị Router Mikrotik CCR1016-12G',
        Quantity: 2,
        Unit: 'CAI',
        Price: 200000,
        Tax: '10%',
        ToMoney: 400000,
      },
      {
        Code: 'PRD2423432',
        Photo: 'IMG',
        Name: 'Thiết bị Router Mikrotik CCR1016-12G',
        Quantity: 2,
        Unit: 'CAI',
        Price: 200000,
        Tax: '10%',
        ToMoney: 400000,
      },
      {
        Code: 'PRD2423432',
        Photo: 'IMG',
        Name: 'Thiết bị Router Mikrotik CCR1016-12G',
        Quantity: 2,
        Unit: 'CAI',
        Price: 200000,
        Tax: '10%',
        ToMoney: 400000,
      },
      {
        Code: 'PRD2423432',
        Photo: 'IMG',
        Name: 'Thiết bị Router Mikrotik CCR1016-12G',
        Quantity: 2,
        Unit: 'CAI',
        Price: 200000,
        Tax: '10%',
        ToMoney: 400000,
      },
      {
        Code: 'PRD2423432',
        Photo: 'IMG',
        Name: 'Thiết bị Router Mikrotik CCR1016-12G',
        Quantity: 2,
        Unit: 'CAI',
        Price: 200000,
        Tax: '10%',
        ToMoney: 400000,
      },
    ]);
  }

}
