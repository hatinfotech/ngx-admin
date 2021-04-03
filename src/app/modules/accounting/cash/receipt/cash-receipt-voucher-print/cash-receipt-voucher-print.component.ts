import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { environment } from '../../../../../../environments/environment';
import { DataManagerPrintComponent } from '../../../../../lib/data-manager/data-manager-print.component';
import { CashVoucherDetailModel, CashVoucherModel } from '../../../../../models/accounting.model';
import { SalesPriceReportDetailModel } from '../../../../../models/sales.model';
import { ApiService } from '../../../../../services/api.service';
import { CommonService } from '../../../../../services/common.service';

@Component({
  selector: 'ngx-cash-receipt-voucher-print',
  templateUrl: './cash-receipt-voucher-print.component.html',
  styleUrls: ['./cash-receipt-voucher-print.component.scss']
})
export class CashReceiptVoucherPrintComponent extends DataManagerPrintComponent<CashVoucherModel> implements OnInit {

  /** Component name */
  componentName = 'CashReceiptVoucherPrintComponent';
  title: string = 'Xem trước phiếu thu';
  env = environment;

  constructor(
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref: NbDialogRef<CashReceiptVoucherPrintComponent>,
    private datePipe: DatePipe,
  ) {
    super(commonService, router, apiService, ref);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init() {
    const result = await super.init();
    // this.title = `PhieuThu_${this.identifier}` + (this.data.DateOfImplement ? ('_' + this.datePipe.transform(this.data.DateOfImplement, 'short')) : '');

    for (const data of this.data) {
      data['Total'] = 0;
      data['Title'] = this.renderTitle(data);
      for (const detail of data.Details) {
        data['Total'] += parseFloat(detail['Amount'] as any);
      }
    }

    return result;
  }

  renderTitle(data: CashVoucherModel) {
    return `PhieuThu_${this.getIdentified(data).join('-')}` + (data.DateOfImplement ? ('_' + this.datePipe.transform(data.DateOfImplement, 'short')) : '');
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

  toMoney(detail: CashVoucherDetailModel) {
    let toMoney = parseInt(detail['Amount'] as any);
    // const tax = detail['Tax'] as any;
    // if (tax) {
    //   toMoney += toMoney * tax.Tax / 100;
    // }
    return toMoney;
  }

  getTotal(data: CashVoucherModel) {
    let total = 0;
    const details = data.Details;
    for (let i = 0; i < details.length; i++) {
      total += this.toMoney(details[i]);
    }
    return total;
  }

  saveAndClose(data: CashVoucherModel) {
    if (this.onSaveAndClose) {
      this.onSaveAndClose(data);
    }
    this.close();
    return false;
  }

  exportExcel(type: string) {
    this.close();
    return false;
  }

  get identifier() {
    // return this.data.Code;
    return '';
  }

}
