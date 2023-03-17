import { Component, OnInit } from '@angular/core';
import { DataManagerPrintComponent } from '../../../../lib/data-manager/data-manager-print.component';
import { PurchasePriceTableModel } from '../../../../models/purchase.model';
import { environment } from '../../../../../environments/environment';
import { CommonService } from '../../../../services/common.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { NbDialogRef } from '@nebular/theme';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-purchase-price-table-print',
  templateUrl: './purchase-price-table-print.component.html',
  styleUrls: ['./purchase-price-table-print.component.scss'],
})
export class PurchasePriceTablePrintComponent extends DataManagerPrintComponent<PurchasePriceTableModel> implements OnInit {

  /** Component name */
  componentName = 'PurchasePriceTablePrintComponent';
  title: string = 'Xem trước';
  env = environment;

  constructor(
    public cms: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref: NbDialogRef<PurchasePriceTablePrintComponent>,
    private datePipe: DatePipe,
  ) {
    super(cms, router, apiService);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init() {
    const result = await super.init();
    // this.title = `PhieuBaoGia_${this.identifier}` + (this.data.DateOfApprove ? ('_' + this.datePipe.transform(this.data.DateOfApprove, 'short')) : '');
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

  // toMoney(detail: SalesPriceTableDetailModel) {
  //   let toMoney = detail['Quantity'] * detail['Price'];
  //   const tax = detail['Tax'] as any;
  //   if (tax) {
  //     toMoney += toMoney * tax.Tax / 100;
  //   }
  //   return toMoney;
  // }

  // getTotal() {
  //   let total = 0;
  //   const details = this.data.Details;
  //   for (let i = 0; i < details.length; i++) {
  //     total += this.toMoney(details[i]);
  //   }
  //   return total;
  // }

  saveAndClose() {
    if (this.onSaveAndClose) {
      // this.onSaveAndClose(this.data.Code);
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
