// import { SalesModule } from './../../sales.module';
import { Component, OnInit } from '@angular/core';
import { DataManagerPrintComponent } from '../../../../lib/data-manager/data-manager-print.component';
import { SalesVoucherModel, SalesVoucherDetailModel } from '../../../../models/sales.model';
import { environment } from '../../../../../environments/environment';
import { CommonService } from '../../../../services/common.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { NbDialogRef } from '@nebular/theme';
import { DatePipe } from '@angular/common';
import { TaxModel } from '../../../../models/tax.model';
import { UnitModel } from '../../../../models/unit.model';
import { SalesVoucherFormComponent } from '../sales-voucher-form/sales-voucher-form.component';
import { ProcessMap } from '../../../../models/process-map.model';
import { AppModule } from '../../../../app.module';

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
  apiPath = '/sales/sales-vouchers';
  processMapList: ProcessMap[] = [];
  formDialog = SalesVoucherFormComponent;

  constructor(
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref: NbDialogRef<SalesVoucherPrintComponent>,
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
    // this.title = `SalesVoucher_${this.identifier}` + (this.data.DateOfSale ? ('_' + this.datePipe.transform(this.data.DateOfSale, 'short')) : '');

    if (this.data && this.data.length > 0) {
      for (const i in this.data) {
        const data = this.data[i];
        data['Total'] = 0;
        data['Title'] = this.renderTitle(data);
        for (const detail of data.Details) {
          data['Total'] += detail['ToMoney'] = this.toMoney(detail);
        }
        this.processMapList[i] = AppModule.processMaps.salesVoucher[data.State || ''];
      }
    }

    return result;
  }

  renderTitle(data: SalesVoucherModel) {
    return `PhieuBanHang_${this.getIdentified(data).join('-')}` + (data.DateOfSale ? ('_' + this.datePipe.transform(data.DateOfSale, 'short')) : '');
  }

  close() {
    this.ref.close();
  }

  renderValue(value: any) {
    let html = value;
    if (value && value['text']) {
      html = value['text'];
    }
    try {
      return (html && html?.placeholder || html || '').toString().replace(/\n/g, '<br>');
    } catch (e) {
      console.error(e);
      return '';
    }
  }

  toMoney(detail: SalesVoucherDetailModel) {
    if (detail.Type !== 'CATEGORY') {
      let toMoney = detail['Quantity'] * detail['Price'];
      detail.Tax = typeof detail.Tax === 'string' ? (this.commonService.taxList?.find(f => f.Code === detail.Tax) as any) : detail.Tax;
      if (detail.Tax) {
        if (typeof detail.Tax.Tax == 'undefined') {
          throw Error('tax not as tax model');
        }
        toMoney += toMoney * detail.Tax.Tax / 100;
      }
      return toMoney;
    }
    return 0;
  }

  getTotal() {
    let total = 0;
    // const details = this.data.Details;
    // for (let i = 0; i < details.length; i++) {
    //   total += this.toMoney(details[i]);
    // }
    // return total;
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

  prepareCopy(data: SalesVoucherModel) {
    this.close();
    this.commonService.openDialog(SalesVoucherFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: [data.Code],
        isDuplicate: true,
        onDialogSave: (newData: SalesVoucherModel[]) => {
          // if (onDialogSave) onDialogSave(row);
          this.onClose(newData[0]);
        },
        onDialogClose: () => {
          // if (onDialogClose) onDialogClose();
          this.refresh();

        },
      },
    });
  }

  approvedConfirm(data: SalesVoucherModel) {
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
    const processMap = AppModule.processMaps.salesVoucher[data.State || ''];
    params['changeState'] = processMap.nextState;
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

    this.commonService.showDiaplog(this.commonService.translateText('Common.confirm'), this.commonService.translateText(processMap?.confirmText, { object: this.commonService.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
      {
        label: this.commonService.translateText('Common.cancel'),
        status: 'primary',
        action: () => {

        },
      },
      {
        label: this.commonService.translateText(processMap?.nextStateLabel),
        status: 'danger',
        action: () => {
          this.loading = true;
          this.apiService.putPromise<SalesVoucherModel[]>(this.apiPath, params, [{ Code: data.Code }]).then(rs => {
            this.loading = false;
            this.onChange && this.onChange(data);
            this.onClose && this.onClose(data);
            this.close();
            this.commonService.toastService.show(this.commonService.translateText(processMap?.restponseText, { object: this.commonService.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), this.commonService.translateText(processMap?.responseTitle), {
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

  approvedConfirmX(data: SalesVoucherModel) {
    if (data.State === 'COMPLETE') {
      this.commonService.showDiaplog(this.commonService.translateText('Common.notice'), this.commonService.translateText('Common.completedNotice', { resource: this.commonService.translateText('Sales.SalesVoucher.title', { action: '', definition: '' }) }), [
        {
          label: this.commonService.translateText('Common.ok'),
          status: 'success',
        }
      ]);
      return;
    }
    this.commonService.showDiaplog(this.commonService.translateText('Common.confirm'), this.commonService.translateText(!data.State ? 'Common.approvedConfirm' : (data.State === 'APPROVE' ? 'Common.completedConfirm' : ''), { object: this.commonService.translateText('Sales.SalesVoucher.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
      {
        label: this.commonService.translateText('Common.cancel'),
        status: 'primary',
        action: () => {

        },
      },
      {
        label: this.commonService.translateText(!data.State ? 'Common.approve' : (data.State === 'APPROVE' ? 'Common.complete' : '')),
        status: 'danger',
        action: () => {
          const params = { id: [data.Code] };
          if (!data.State) {
            params['approve'] = true;
          } else if (data.State === 'APPROVE') {
            params['complete'] = true;
          }
          this.apiService.putPromise<SalesVoucherModel[]>('/sales/sales-vouchers', params, [{ Code: data.Code }]).then(rs => {
            this.commonService.showDiaplog(this.commonService.translateText('Common.completed'), this.commonService.translateText('Common.completedSuccess', { object: this.commonService.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
              {
                label: this.commonService.translateText('Common.close'),
                status: 'success',
                action: () => {
                  this.onClose(data);
                  this.close();
                },
              },
            ]);
          }).catch(err => {

          });
        },
      },
    ]);
  }

  async getFormData(ids: string[]) {
    return this.apiService.getPromise<SalesVoucherModel[]>(this.apiPath, { id: ids, includeContact: true, includeDetails: true, useBaseTimezone: true, includeTax: true, includeUnit: true }).then(rs => {
      if (rs[0] && rs[0].Details) {
        this.setDetailsNo(rs[0].Details, (detail: SalesVoucherDetailModel) => detail.Type !== 'CATEGORY');
        for(const detail of rs[0].Details) {
          rs[0]['Total'] += detail['ToMoney'] = this.toMoney(detail);
        }
      }
      return rs;
    });
  }

}
