import { AccountingService } from '../../../accounting.service';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { environment } from '../../../../../../environments/environment';
import { AppModule } from '../../../../../app.module';
import { DataManagerPrintComponent } from '../../../../../lib/data-manager/data-manager-print.component';
import { CashVoucherModel, CashVoucherDetailModel } from '../../../../../models/accounting.model';
import { ProcessMap } from '../../../../../models/process-map.model';
import { ApiService } from '../../../../../services/api.service';
import { CommonService } from '../../../../../services/common.service';
// import { AccountingModule } from '../../../accounting.module';

@Component({
  selector: 'ngx-accoungting-receivables-from-customers-vouchers-report-print',
  templateUrl: './accoungting-receivables-from-customers-vouchers-report-print.component.html',
  styleUrls: ['./accoungting-receivables-from-customers-vouchers-report-print.component.scss'],
  providers: [CurrencyPipe]
})
export class AccoungtingReceivablesFromCustomersVoucherssReportPrintComponent extends DataManagerPrintComponent<CashVoucherModel> implements OnInit {

  /** Component name */
  componentName = 'AccoungtingReceivablesFromCustomersVoucherssReportPrintComponent';
  title: string = 'Chi Tiết Công Nợ Phải Thu Theo Hóa Đơn';
  apiPath = '/accounting/reports';
  // approvedConfirm?: boolean;
  env = environment;
  processMapList: ProcessMap[] = [];
  // formDialog = CashPaymentVoucherFormComponent;
  @Input() objects: string[];

  constructor(
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref: NbDialogRef<AccoungtingReceivablesFromCustomersVoucherssReportPrintComponent>,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe,
    public accountingService: AccountingService,
  ) {
    super(commonService, router, apiService, ref);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init() {
    const result = await super.init();
    // this.title = `PhieuChi_${this.identifier}` + (this.data.DateOfImplement ? ('_' + this.datePipe.transform(this.data.DateOfImplement, 'short')) : '');
    // for (const i in this.data) {
    //   const data = this.data[i];
    //   data['Total'] = 0;
    //   data['Title'] = this.renderTitle(data);
    //   for (const detail of data.Details) {
    //     data['Total'] += detail['Amount'] = parseFloat(detail['Amount'] as any);
    //   }
    //   this.processMapList[i] = AppModule.processMaps.cashVoucher[data.State || ''];
    // }
    this.summaryCalculate(this.data);

    return result;
  }

  renderTitle(data: CashVoucherModel) {
    return this.title + (data['ToDate'] ? (' đến ' + this.datePipe.transform(data['ToDate'], 'short')) : '');
  }

  close() {
    this.ref.close();
  }

  renderValue(value: any, type?: string) {
    let v = value;
    if (v && value['text']) {
      v = value['text'] || "";
    }
    if (type === 'html') {
      return v.replace(/\n/g, '<br>');
    }
    return v;
  }

  toMoney(detail: CashVoucherDetailModel) {
    let toMoney = parseInt(detail['Amount'] as any);
    // const tax = detail['Tax'] as any;
    // if (tax) {
    //   toMoney += toMoney * tax.Tax / 100;
    // }
    return toMoney;
  }

  getTotal() {
    let total = 0;
    // const details = this.data.Details;
    // for (let i = 0; i < details.length; i++) {
    //   total += this.toMoney(details[i]);
    // }
    return total;
  }

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

  approve() {
    // if (this.data) {
    //   this.apiService.putPromise('/accounting/cash-vouchers', {id: [this.data.Code], approve: true}, [{Code: this.data.Code}]).then(rs => {
    //     if (this.onClose) {
    //       this.onClose(this.data.Code);
    //     }
    //     this.close();
    //   });
    // }
  }

  cancel() {
    // if (this.data) {
    //   this.apiService.putPromise('/accounting/cash-vouchers', {id: [this.data.Code], cancel: true}, [{Code: this.data.Code}]).then(rs => {
    //     if (this.onClose) {
    //       this.onClose(this.data.Code);
    //     }
    //     this.close();
    //   });
    // }
  }


  async getFormData(ids: string[]) {
    const choosedDate = (this.accountingService.reportToDate$.value as Date) || new Date();
    const toDate = new Date(choosedDate.getFullYear(), choosedDate.getMonth(), choosedDate.getDate(), 23, 59, 59);
    const promiseAll = [];
    for(const object of this.objects) {
      promiseAll.push(this.apiService.getPromise<any[]>(this.apiPath, {
        reportVoucherByAccountAndObject: true,
        eq_Account: '131',
        eq_Object: object,
        includeIncrementAmount: true,
        includeObjectInfo: true,
        toDate: toDate.toISOString(),
        limit: 'nolimit',
      }).then(data => {
        const item = { 'ToDate': toDate, 'Object': object, ObjectName: data[0]['ObjectName'], ObjectPhone: data[0]['ObjectPhone'], ObjectEmail: data[0]['ObjectEmail'], ObjectAddress: data[0]['ObjectAddress'], Details: data };
        return item;
      }));
    }
    return Promise.all(promiseAll).then(all => {
      this.summaryCalculate(all);
      return all;
    });
  }

  getItemDescription(item: any) {
    return item?.Description;
  }

  summaryCalculate(data: any[]) {
    for (const i in data) {
      const item = data[i];
      item['Total'] = 0;
      item['TotalDebit'] = 0;
      item['TotalCredit'] = 0;
      // item['Title'] = this.renderTitle(item);
      for (const detail of item.Details) {
        item['TotalDebit'] += parseFloat(detail['GenerateDebit'] as any);
        item['TotalCredit'] += parseFloat(detail['GenerateCredit'] as any);
        item['Total'] += parseFloat(detail['GenerateDebit'] as any) - parseFloat(detail['GenerateCredit'] as any);
      }
      //   this.processMapList[i] = AppModule.processMaps.cashVoucher[item.State || ''];
    }
    return data;
  }

  renderCurrency(money: number) {
    if(typeof money == 'undefined' || money === null) return this.currencyPipe.transform(0, 'VND');
    if(money < 0) {
      let text = this.currencyPipe.transform(-money, 'VND');
      return `<span class="text-color-danger">(${text})</span>`;
    } else {
      return this.currencyPipe.transform(money, 'VND');
    }
  }

}
