import { CurrencyPipe, DatePipe } from "@angular/common";
import { OnInit, Input, Component } from "@angular/core";
import { Router } from "@angular/router";
import { NbDialogRef } from "@nebular/theme";
import { environment } from "../../../../../environments/environment.prod";
import { DataManagerPrintComponent } from "../../../../lib/data-manager/data-manager-print.component";
import { CashVoucherModel, CashVoucherDetailModel } from "../../../../models/accounting.model";
import { ContactModel } from "../../../../models/contact.model";
import { ProcessMap } from "../../../../models/process-map.model";
import { ApiService } from "../../../../services/api.service";
import { CommonService } from "../../../../services/common.service";
import { RootServices } from "../../../../services/root.services";
import { AccountingService } from "../../../accounting/accounting.service";

@Component({
  selector: 'ngx-authorized-sale-voucher-report-print',
  templateUrl: './authorized-sale-voucher-report-print.component.html',
  styleUrls: ['./authorized-sale-voucher-report-print.component.scss'],
  providers: [CurrencyPipe]
})
export class AuthorizedSaleVoucherReportPrintComponent extends DataManagerPrintComponent<CashVoucherModel> implements OnInit {

  /** Component name */
  componentName = 'AuthorizedSaleVoucherReportPrintComponent';
  title: string = 'Báo cáo';
  apiPath = '/sales/authorized-sale-vouchers';
  // approvedConfirm?: boolean;
  env = environment;
  processMapList: ProcessMap[] = [];
  // formDialog = CashPaymentVoucherFormComponent;
  @Input() suppliers: string[];
  @Input() query = {};
  @Input() fromDate: Date;
  @Input() toDate: Date;

  constructor(
    public rsv: RootServices,
    public cms: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref: NbDialogRef<AuthorizedSaleVoucherReportPrintComponent>,
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
    // const choosedFromDate = (this.accountingService.reportFromDate$.value as Date) || new Date();
    // const fromDate = new Date(choosedFromDate.getFullYear(), choosedFromDate.getMonth(), choosedFromDate.getDate(), 0, 0, 0, 0);
    // const choosedToDate = (this.accountingService.reportToDate$.value as Date) || new Date();
    // const toDate = new Date(choosedToDate.getFullYear(), choosedToDate.getMonth(), choosedToDate.getDate(), 23, 59, 59, 999);
    const promiseAll = [];

    for (const supplier of this.suppliers) {
      promiseAll.push(this.apiService.getPromise<any[]>(this.apiPath, {
        // reportVoucherByAccountAndObject: true,
        includeDetails: true,
        eq_Supplier: supplier,
        // includeIncrementAmount: true,
        // includeObjectInfo: true,
        ge_DateOfSale: this.fromDate.toISOString(),
        le_DateOfSale: this.toDate.toISOString(),
        limit: 'nolimit',
        ...this.query,
      }).then(async data => {
        let contact = null;
        // if (this.suppliers) {
        // const supplier = this.suppliers.replace(/\[|\]/g, '');
        // if (supplier) {
        contact = await this.apiService.getPromise<ContactModel[]>('/contact/contacts/' + this.cms.getObjectId(supplier), { includeIdText: true }).then(rs => rs[0]);
        // }
        // }
        // const accountInfo = this.accountingService.accountList$.value?.find(f => f.Code === supplier);
        let incrementAmount = 0;
        const item = {
          // Account: supplier,
          Title: 'Báo cáo',
          FromDate: this.fromDate,
          ToDate: this.toDate,
          ReportDate: new Date(),
          Details: data.map((voucher) => {
            voucher.VoucherDate = voucher.DateOfSale;
            voucher.Voucher = voucher.Code;
            incrementAmount += voucher.Amount;
            voucher.IncrementAmount = incrementAmount;
            voucher.Description = voucher.Title;
            return voucher;
          }, []),
          Contact: contact,
        };
        return item;
      }));
    }
    return Promise.all(promiseAll).then(all => {
      this.summaryCalculate(all);
      return all;
    });

    // return this.apiService.getPromise<any[]>(this.apiPath, {
    //   includeDetails: true,
    // });
  }

  getItemDescription(item: any) {
    return item?.Description;
  }

  summaryCalculate(data: any[]) {
    for (const i in data) {
      // const item = data[i];
      // item['Total'] = 0;
      // for (const detail of item.Details) {
      //   item['Total'] += parseFloat(detail['GenerateDebit'] as any) - parseFloat(detail['GenerateCredit'] as any);
      // }
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
