import { Component, Input, OnInit, TemplateRef, Type } from '@angular/core';

@Component({
  selector: 'ngx-tab-dialog',
  templateUrl: './tab-dialog.component.html',
  styleUrls: ['./tab-dialog.component.scss']
})
export class TabDialogComponent<T> implements OnInit {

  @Input() components: {[key: string]: {
    // name: string,
    title: string,
  }};
  @Input() onDialogChoose?: (chooseItems: any[], type?: string) => void;

  

  // tabs = [
  //   {
  //     title: 'Phiếu báo giá',
  //     route: '/sales/price-report/list/chooosed',
  //     icon: 'home',
  //     // responsive: true, // hide title before `route-tabs-icon-only-max-width` value
  //   },
  //   {
  //     title: 'Phiếu xuất kho',
  //     route: '/warehouse/goods-delivery-note/list',
  //     icon: 'archive',
  //   }
  // ];
  
  constructor() { }

  ngOnInit(): void {
  }

  // onDialogChoose(data: any[]) {
  //   console.log(data);
  // }

}
