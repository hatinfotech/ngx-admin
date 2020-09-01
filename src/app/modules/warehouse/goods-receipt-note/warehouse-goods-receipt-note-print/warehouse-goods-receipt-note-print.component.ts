import { Component, OnInit } from '@angular/core';
import { DataManagerPrintComponent } from '../../../../lib/data-manager/data-manager-print.component';
import { WarehouseGoodsReceiptNoteModel } from '../../../../models/warehouse.model';
import { environment } from '../../../../../environments/environment';
import { CommonService } from '../../../../services/common.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { NbDialogRef } from '@nebular/theme';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-warehouse-goods-receipt-note-print',
  templateUrl: './warehouse-goods-receipt-note-print.component.html',
  styleUrls: ['./warehouse-goods-receipt-note-print.component.scss'],
})
export class WarehouseGoodsReceiptNotePrintComponent extends DataManagerPrintComponent<WarehouseGoodsReceiptNoteModel> implements OnInit {

  /** Component name */
  componentName = 'WarehouseGoodsReceiptNotePrintComponent';
  title: string = '';
  env = environment;

  constructor(
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref: NbDialogRef<WarehouseGoodsReceiptNotePrintComponent>,
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
    this.title = `GoodsReceiptNote_${this.identifier}` + (this.data.DateOfReceipted ? ('_' + this.datePipe.transform(this.data.DateOfReceipted, 'short')) : '');
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
