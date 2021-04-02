import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { environment } from '../../../../../environments/environment';
import { DataManagerPrintComponent } from '../../../../lib/data-manager/data-manager-print.component';
import { PurchaseOrderVoucherModel, PurchaseVoucherDetailModel } from '../../../../models/purchase.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'ngx-purchase-order-voucher-print',
  templateUrl: './purchase-order-voucher-print.component.html',
  styleUrls: ['./purchase-order-voucher-print.component.scss']
})
export class PurchaseOrderVoucherPrintComponent extends DataManagerPrintComponent<PurchaseOrderVoucherModel> implements OnInit {

  /** Component name */
  componentName = 'PurchaseOrderVoucherPrintComponent';
  title: string = '';
  env = environment;

  constructor(
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref: NbDialogRef<PurchaseOrderVoucherPrintComponent>,
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
    this.title = `PurchaseVoucher_${this.identifier}` + (this.data.DateOfPurchase ? ('_' + this.datePipe.transform(this.data.DateOfPurchase, 'short')) : '');
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

  toMoney(detail: PurchaseVoucherDetailModel) {
    let toMoney = detail.Quantity * detail.Price;
    const tax = detail['Tax'] as any;
    if (tax) {
      toMoney += toMoney * tax.Tax / 100;
    }
    return toMoney;
  }

  getTotal() {
    let total = 0;
    const details = this.data.Details;
    for (let i = 0; i < details.length; i++) {
      total += this.toMoney(details[i]);
    }
    return total;
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
