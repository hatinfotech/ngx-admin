import { ContactModel } from './../../../../../models/contact.model';
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
import { RootServices } from '../../../../../services/root.services';
// import { AccountingModule } from '../../../accounting.module';

@Component({
  selector: 'ngx-accounting-receivables-from-customers-details-report-print',
  templateUrl: './accounting-receivables-from-customers-details-report-print.component.html',
  styleUrls: ['./accounting-receivables-from-customers-details-report-print.component.scss'],
  providers: [CurrencyPipe]
})
export class AccountingReceivablesFromCustomersDetailsReportPrintComponent extends DataManagerPrintComponent<CashVoucherModel> implements OnInit {

  /** Component name */
  componentName = 'AccountingReceivablesFromCustomersDetailsReportPrintComponent';
  title: string = 'Chi Tiết Công Nợ Phải Thu';
  apiPath = '/accounting/reports';
  // approvedConfirm?: boolean;
  env = environment;
  processMapList: ProcessMap[] = [];
  // formDialog = CashPaymentVoucherFormComponent;
  @Input() objects: string[];
  @Input() query: any = {};
  showIncreaseAmount = false;

  note: string = '';

  constructor(
    public rsv: RootServices,
    public cms: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref: NbDialogRef<AccountingReceivablesFromCustomersDetailsReportPrintComponent>,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe,
    public accountingService: AccountingService,
  ) {
    super(rsv, cms, router, apiService, ref);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init() {
    const result = await super.init().then(rs => {

      if (this.query && (this.query['eq_Thread'] || this.query['filter_Thread'])) {
        this.note = `Công trình/Dự án  ${this.query['eq_Thread'] || this.query['filter_Thread']}`;
      }

      this.actionButtonList.unshift({
        name: 'showPicture',
        label: 'Hiển thị cột biến động',
        title: 'Biến cộng',
        status: 'info',
        size: 'medium',
        icon: 'eye-outline',
        click: () => {
          this.showIncreaseAmount = !this.showIncreaseAmount;
          return true;
        }
      });

      return rs;
    });
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
    const choosedFromDate = (this.accountingService.reportFromDate$.value as Date) || new Date();
    const fromDate = new Date(choosedFromDate.getFullYear(), choosedFromDate.getMonth(), choosedFromDate.getDate(), 0, 0, 0, 0);
    const choosedToDate = (this.accountingService.reportToDate$.value as Date) || new Date();
    const toDate = new Date(choosedToDate.getFullYear(), choosedToDate.getMonth(), choosedToDate.getDate(), 23, 59, 59, 999);
    const promiseAll = [];
    for (const object of this.objects) {
      promiseAll.push(this.apiService.getPromise<any[]>(this.apiPath, {
        // reportDetailByAccountAndObject: true,
        includeRowHeader: true,
        eq_Accounts: '131',
        // eq_Object: object,
        ...(object ? { eq_Object: object } : {}),
        groupBy: 'Voucher,WriteNo',
        includeIncrementAmount: true,
        includeObjectInfo: true,
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString(),
        limit: 'nolimit',
        ...this.query,
      }).then(async data => {
        const objectInfo = data.find(f => f.Voucher != 'OPN');

        const contact = await this.apiService.getPromise<ContactModel[]>('/contact/contacts/' + object, {}).then(rs => rs[0]);

        const item = {
          FromDate: fromDate,
          ToDate: toDate,
          ReportDate: new Date(),
          'Object': object,
          ObjectName: objectInfo && objectInfo['ObjectName'] || '',
          ObjectPhone: objectInfo && objectInfo['ObjectPhone'] || '',
          ObjectEmail: objectInfo && objectInfo['ObjectEmail'] || '',
          ObjectAddress: objectInfo && objectInfo['ObjectAddress'] || '',
          ObjectNote: contact?.Note || '',
          Details: data
        };
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
      // item['Total'] = 0;
      // // item['Title'] = this.renderTitle(item);
      // for (const detail of item.Details) {
      //   // item['Total'] += parseFloat(detail['GenerateDebit'] as any) - parseFloat(detail['GenerateCredit'] as any);
      //   if (detail.VoucherType == 'RECEIPT') {
      //     detail.Description = `Thu tiền: ${detail.Description}`;
      //   }
      //   if (detail.VoucherType == 'SALESRETURNS') {
      //     detail.Description = `Trả hàng: ${detail.Description}`;
      //   }
      // }
      // item['Total'] = item.Details[item?.Details.length - 1]?.IncrementAmount;

      item['TotalDebit'] = 0;
      item['TotalCredit'] = 0;
      item['TotalReturn'] = 0;
      // item['Title'] = this.renderTitle(item);
      for (const detail of item.Details) {
        if (detail['Voucher'] == 'OPN') {
          detail['GenerateDebit'] = detail['HeadAmount'];
        }
        item['TotalDebit'] += parseFloat(detail['GenerateDebit'] || (detail['HeadDebit'] - detail['HeadCredit']) as any);
        if (detail.VoucherType == 'RECEIPT') {
          item['TotalCredit'] += parseFloat(detail['GenerateCredit'] || (detail['HeadCredit'] - detail['HeadDebit']) as any);
        } else if (detail.VoucherType == 'COMMERCEPOSRETURN') {
          item['TotalReturn'] += parseFloat(detail['GenerateCredit'] || (detail['HeadCredit'] - detail['HeadDebit']) as any);
        }
      }
      item['Total'] = item.Details[item.Details.length - 1]?.IncrementAmount;

    }
    return data;
  }

  renderCurrency(money: number) {
    if (typeof money == 'undefined' || money === null) return this.currencyPipe.transform(0, 'VND');
    if (money < 0) {
      let text = this.currencyPipe.transform(-money, 'VND');
      return `<span class="text-color-danger">(${text})</span>`;
    } else {
      return this.currencyPipe.transform(money, 'VND');
    }
  }

}
