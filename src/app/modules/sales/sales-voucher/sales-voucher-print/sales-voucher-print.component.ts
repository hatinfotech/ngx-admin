import { Component, OnInit } from '@angular/core';
import { DataManagerPrintComponent } from '../../../../lib/data-manager/data-manager-print.component';
import { SalesVoucherModel, SalesPriceReportDetailModel, SalesVoucherDetailModel } from '../../../../models/sales.model';
import { environment } from '../../../../../environments/environment';
import { CommonService } from '../../../../services/common.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { NbDialogRef } from '@nebular/theme';
import { SalesPriceReportPrintComponent } from '../../price-report/sales-price-report-print/sales-price-report-print.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-sales-voucher-print',
  templateUrl: './sales-voucher-print.component.html',
  styleUrls: ['./sales-voucher-print.component.scss'],
})
export class SalesVoucherPrintComponent extends DataManagerPrintComponent<SalesVoucherModel> implements OnInit {

  /** Component name */
  componentName = 'SalesPriceReportPrintComponent';
  title: string = '';
  env = environment;

  constructor(
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref: NbDialogRef<SalesPriceReportPrintComponent>,
    private datePipe: DatePipe,
  ) {
    super(commonService, router, apiService);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init() {
    const result = await super.init();
    this.title = `SalesVoucher_${this.identifier}` + (this.data.DateOfSale ? ('_' + this.datePipe.transform(this.data.DateOfSale, 'short')) : '');
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

  toMoney(detail: SalesVoucherDetailModel) {
    let toMoney = detail['Quantity'] * detail['Price'];
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
