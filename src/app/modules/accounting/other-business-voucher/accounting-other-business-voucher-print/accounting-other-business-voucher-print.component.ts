import { AccountingOtherBusinessVoucherFormComponent } from './../accounting-other-business-voucher-form/accounting-other-business-voucher-form.component';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { environment } from '../../../../../environments/environment.prod';
import { AppModule } from '../../../../app.module';
import { DataManagerPrintComponent } from '../../../../lib/data-manager/data-manager-print.component';
import { OtherBusinessVoucherModel, CashVoucherDetailModel } from '../../../../models/accounting.model';
import { ProcessMap } from '../../../../models/process-map.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'ngx-accounting-other-business-voucher-print',
  templateUrl: './accounting-other-business-voucher-print.component.html',
  styleUrls: ['./accounting-other-business-voucher-print.component.scss']
})
export class AccountingOtherBusinessVoucherPrintComponent extends DataManagerPrintComponent<OtherBusinessVoucherModel> implements OnInit {

  /** Component name */
  componentName = 'AccountingOtherBusinessVoucherPrintComponent';
  title: string = 'Xem trước chứng từ kế toán';
  apiPath = '/accounting/other-business-vouchers';
  env = environment;
  processMapList: ProcessMap[] = [];
  idKey: ['Code'];
  formDialog = AccountingOtherBusinessVoucherFormComponent;

  constructor(
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref: NbDialogRef<AccountingOtherBusinessVoucherPrintComponent>,
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

    // for (const i in this.data) {
    //   const data = this.data[i];
    //   data['Title'] = this.renderTitle(data);
    //   for (const detail of data.Details) {
    //     data['Total'] += parseFloat(detail['Amount'] as any);
    //   }
    //   this.processMapList[i] = AppModule.processMaps.otherBusinessVoucher[data.State || ''];
    // }
    this.summaryCalculate(this.data);

    return result;
  }

  renderTitle(data: OtherBusinessVoucherModel) {
    return `Nghiep_Vu_Khac_${this.getIdentified(data).join('-')}` + (data.DateOfVoucher ? ('_' + this.datePipe.transform(data.DateOfVoucher, 'short')) : '');
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

  getTotal(data: OtherBusinessVoucherModel) {
    let total = 0;
    const details = data.Details;
    for (let i = 0; i < details.length; i++) {
      total += this.toMoney(details[i]);
    }
    return total;
  }

  saveAndClose(data: OtherBusinessVoucherModel) {
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
  
  approvedConfirm(data: OtherBusinessVoucherModel) {
    // if (['COMPLETE'].indexOf(data.State) > -1) {
    //   this.commonService.showDiaplog(this.commonService.translateText('Common.approved'), this.commonService.translateText('Common.completedAlert', { object: this.commonService.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
    //     {
    //       label: this.commonService.translateText('Common.close'),
    //       status: 'success',
    //       action: () => {
    //         this.onClose(data);
    //       },
    //     },
    //   ]);
    //   return;
    // }
    const params = { id: [data.Code] };
    const processMap = AppModule.processMaps.otherBusinessVoucher[data.State || ''];
    params['changeState'] = processMap?.nextState;
    // let confirmText = '';
    // let responseText = '';
    // switch (data.State) {
    //   case 'APPROVE':
    //     params['changeState'] = 'COMPLETE';
    //     confirmText = 'Common.completeConfirm';
    //     responseText = 'Common.completeSuccess';
    //     break;
    //   default:
    //     params['changeState'] = 'APPROVE';
    //     confirmText = 'Common.approvedConfirm';
    //     responseText = 'Common.approvedSuccess';
    //     break;
    // }

    this.commonService.showDiaplog(this.commonService.translateText('Common.confirm'), this.commonService.translateText(processMap?.confirmText, { object: this.commonService.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Description + '`' }), [
      {
        label: this.commonService.translateText('Common.cancel'),
        status: 'primary',
        action: () => {

        },
      },
      {
        label: this.commonService.translateText(data.State == 'APPROVED' ? 'Common.complete' : 'Common.approve'),
        status: 'danger',
        action: () => {
          this.loading = true;
          this.apiService.putPromise<OtherBusinessVoucherModel[]>(this.apiPath, params, [{ Code: data.Code }]).then(rs => {
            this.loading = false;
            this.onChange && this.onChange(data);
            this.onClose && this.onClose(data);
            this.close();
            this.commonService.toastService.show(this.commonService.translateText(processMap?.responseText, { object: this.commonService.translateText('Purchase.PrucaseVoucher.title', { definition: '', action: '' }) + ': `' + data.Description + '`' }), this.commonService.translateText(processMap?.responseTitle), {
              status: 'success',
            });
            // this.commonService.showDiaplog(this.commonService.translateText('Common.approved'), this.commonService.translateText(responseText, { object: this.commonService.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
            //   {
            //     label: this.commonService.translateText('Common.close'),
            //     status: 'success',
            //     action: () => {
            //     },
            //   },
            // ]);
          }).catch(err => {
            this.loading = false;
          });
        },
      },
    ]);
  }

  async getFormData(ids: string[]) {
    return this.apiService.getPromise<OtherBusinessVoucherModel[]>(this.apiPath, { id: ids, includeContact: true, includeDetails: true }).then(data => {
      this.summaryCalculate(data);
      return data;
    });
  }

  getItemDescription(item: OtherBusinessVoucherModel) {
    return item?.Description;
  }

  summaryCalculate(data: OtherBusinessVoucherModel[]) {
    for (const i in data) {
      const item = data[i];
      item['Total'] = 0;
      item['Title'] = this.renderTitle(item);
      for (const detail of item.Details) {
        item['Total'] += detail['Amount'] = parseFloat(detail['Amount'] as any);
      }
      this.processMapList[i] = AppModule.processMaps.cashVoucher[item.State || ''];
    }
    return data;
  }


}
