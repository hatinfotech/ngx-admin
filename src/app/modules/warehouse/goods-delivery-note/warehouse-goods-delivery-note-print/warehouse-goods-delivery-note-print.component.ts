import { Component, OnInit } from '@angular/core';
import { DataManagerPrintComponent } from '../../../../lib/data-manager/data-manager-print.component';
import { WarehouseGoodsDeliveryNoteModel } from '../../../../models/warehouse.model';
import { environment } from '../../../../../environments/environment';
import { CommonService } from '../../../../services/common.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { NbDialogRef } from '@nebular/theme';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-warehouse-goods-delivery-note-print',
  templateUrl: './warehouse-goods-delivery-note-print.component.html',
  styleUrls: ['./warehouse-goods-delivery-note-print.component.scss'],
})
export class WarehouseGoodsDeliveryNotePrintComponent extends DataManagerPrintComponent<WarehouseGoodsDeliveryNoteModel> implements OnInit {

  /** Component name */
  componentName = 'WarehouseGoodsDeliveryNotePrintComponent';
  title: string = '';
  env = environment;

  constructor(
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref: NbDialogRef<WarehouseGoodsDeliveryNotePrintComponent>,
    public datePipe: DatePipe,
  ) {
    super(commonService, router, apiService, ref);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init() {
    const result = await super.init();
    this.title = `GoodsDeliveryNote_${this.identifier}` + (this.data.DateOfDelivered ? ('_' + this.datePipe.transform(this.data.DateOfDelivered, 'short')) : '');
    return result;
  }

  close() {
    this.ref.close();
  }

  renderValue(value: any) {
    if (value && value['text']) {
      return value['text'];
    }
    return value;
  }

  saveAndClose() {
    if (this.onSaveAndClose) {
      this.onSaveAndClose(this.data.Code);
    }
    this.close();
    return false;
  }

  exportExcel(type: string) {
    this.close();
    return false;
  }

  get identifier() {
    return this.data.Code;
  }

}
