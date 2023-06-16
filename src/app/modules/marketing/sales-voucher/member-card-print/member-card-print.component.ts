import { CashVoucherModel } from './../../../../models/accounting.model';
import { CashReceiptVoucherFormComponent } from './../../../accounting/cash/receipt/cash-receipt-voucher-form/cash-receipt-voucher-form.component';
// import { SalesModule } from './../../sales.module';
import { Component, OnInit } from '@angular/core';
import { DataManagerPrintComponent } from '../../../../lib/data-manager/data-manager-print.component';
import { environment } from '../../../../../environments/environment';
import { CommonService } from '../../../../services/common.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { NbDialogRef } from '@nebular/theme';
import { DatePipe } from '@angular/common';
import { MktMemberCardFormComponent } from '../member-card-form/member-card-form.component';
import { ProcessMap } from '../../../../models/process-map.model';
import { AppModule } from '../../../../app.module';
import { MktMemberCardModel } from '../../../../models/marketing.model';

@Component({
  selector: 'ngx-mkt-member-card-print',
  templateUrl: './member-card-print.component.html',
  styleUrls: ['./member-card-print.component.scss'],
})
export class MktMemberCardPrintComponent extends DataManagerPrintComponent<MktMemberCardModel> implements OnInit {

  /** Component name */
  componentName = 'SalesPriceReportPrintComponent';
  title: string = '';
  env = environment;
  apiPath = '/marketing/member-cards';
  processMapList: ProcessMap[] = [];
  idKey = ['Code'];
  formDialog = MktMemberCardFormComponent;
  
  registerInfo: any = {
    voucherInfo: this.cms.translateText('Information.Voucher.register'),
    voucherLogo: environment.register.logo.voucher,
    voucherLogoHeight: 60,
  };

  constructor(
    public cms: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref: NbDialogRef<MktMemberCardPrintComponent>,
    public datePipe: DatePipe,
  ) {
    super(cms, router, apiService, ref);

    this.cms.systemConfigs$.subscribe(settings => {
      if (settings.LICENSE_INFO && settings.LICENSE_INFO.register && settings.LICENSE_INFO.register) {
        this.registerInfo.voucherInfo = settings.LICENSE_INFO.register.voucherInfo.replace(/\\n/g, '<br>');
        this.registerInfo.voucherLogo = settings.LICENSE_INFO.register.voucherLogo;
        this.registerInfo.voucherLogoHeight = settings.LICENSE_INFO.register.voucherLogoHeight;
      }
    });

  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init() {
    const result = await super.init();
    // this.title = `MktMemberCard_${this.identifier}` + (this.data.DateOfSale ? ('_' + this.datePipe.transform(this.data.DateOfSale, 'short')) : '');

    // if (this.data && this.data.length > 0) {
    //   for (const i in this.data) {
    //     const data = this.data[i];
    //     data['Total'] = 0;
    //     data['Title'] = this.renderTitle(data);
    //     for (const detail of data.Details) {
    //       data['Total'] += detail['ToMoney'] = this.toMoney(detail);
    //     }
    //     this.processMapList[i] = AppModule.processMaps.memberCard[data.State || ''];
    //   }
    // }
    this.summaryCalculate(this.data);

    return result;
  }

  renderTitle(data: MktMemberCardModel) {
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

  // toMoney(detail: any) {
  //   if (detail.Type !== 'CATEGORY') {
  //     let toMoney = detail['Quantity'] * detail['Price'];
  //     // detail.Tax = typeof detail.Tax === 'string' ? (this.cms.taxList?.find(f => f.Code === detail.Tax) as any) : detail.Tax;
  //     // if (detail.Tax) {
  //     //   if (typeof detail.Tax.Tax == 'undefined') {
  //     //     throw Error('tax not as tax model');
  //     //   }
  //     //   toMoney += toMoney * detail.Tax.Tax / 100;
  //     // }
  //     return toMoney;
  //   }
  //   return 0;
  // }

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

  prepareCopy(data: MktMemberCardModel) {
    this.close();
    this.cms.openDialog(MktMemberCardFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: [data.Code],
        isDuplicate: true,
        onDialogSave: (newData: MktMemberCardModel[]) => {
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

  approvedConfirm(data: MktMemberCardModel) {
    // if (['COMPLETE'].indexOf(data.State) > -1) {
    //   this.cms.showDiaplog(this.cms.translateText('Common.approved'), this.cms.translateText('Common.completedAlert', { object: this.cms.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
    //     {
    //       label: this.cms.translateText('Common.close'),
    //       status: 'success',
    //       action: () => {
    //         this.onClose(data);
    //       },
    //     },
    //   ]);
    //   return;
    // }
    const params = { id: [data.Code] };
    const processMap = AppModule.processMaps.memberCard[data.State || ''];
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

    this.cms.showDialog(this.cms.translateText('Common.confirm'), this.cms.translateText(processMap?.confirmText, { object: this.cms.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
      {
        label: this.cms.translateText('Common.cancel'),
        status: 'primary',
        action: () => {

        },
      },
      {
        label: this.cms.translateText(processMap?.nextStateLabel),
        status: 'danger',
        action: () => {
          this.loading = true;
          this.apiService.putPromise<MktMemberCardModel[]>(this.apiPath, params, [{ Code: data.Code }]).then(rs => {
            this.loading = false;
            this.onChange && this.onChange(data);
            this.onClose && this.onClose(data);
            this.close();
            this.cms.toastService.show(this.cms.translateText(processMap?.responseText, { object: this.cms.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), this.cms.translateText(processMap?.responseTitle), {
              status: 'success',
            });
            // this.cms.showDiaplog(this.cms.translateText('Common.approved'), this.cms.translateText(responseText, { object: this.cms.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
            //   {
            //     label: this.cms.translateText('Common.close'),
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

  approvedConfirmX(data: MktMemberCardModel) {
    if (data.State === 'COMPLETE') {
      this.cms.showDialog(this.cms.translateText('Common.notice'), this.cms.translateText('Common.completedNotice', { resource: this.cms.translateText('Sales.MktMemberCard.title', { action: '', definition: '' }) }), [
        {
          label: this.cms.translateText('Common.ok'),
          status: 'success',
        }
      ]);
      return;
    }
    this.cms.showDialog(this.cms.translateText('Common.confirm'), this.cms.translateText(!data.State ? 'Common.approvedConfirm' : (data.State === 'APPROVE' ? 'Common.completedConfirm' : ''), { object: this.cms.translateText('Sales.MktMemberCard.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
      {
        label: this.cms.translateText('Common.cancel'),
        status: 'primary',
        action: () => {

        },
      },
      {
        label: this.cms.translateText(!data.State ? 'Common.approve' : (data.State === 'APPROVED' ? 'Common.complete' : '')),
        status: 'danger',
        action: () => {
          const params = { id: [data.Code] };
          if (!data.State) {
            params['approve'] = true;
          } else if (data.State === 'APPROVED') {
            params['complete'] = true;
          }
          this.apiService.putPromise<MktMemberCardModel[]>('/marketing/member-cards', params, [{ Code: data.Code }]).then(rs => {
            this.cms.showDialog(this.cms.translateText('Common.completed'), this.cms.translateText('Common.completedSuccess', { object: this.cms.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
              {
                label: this.cms.translateText('Common.close'),
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
    return this.apiService.getPromise<MktMemberCardModel[]>(this.apiPath, { id: ids, includeContact: true, includeObject: true, includeDetails: true, useBaseTimezone: true, includeTax: true, includeUnit: true, includeRelativeVouchers: true, includeSignature: true }).then(rs => {
      for (const item of rs) {
        const processMap = AppModule.processMaps.memberCard[item.State || ''];
        item.StateLabel = processMap.label;
        // if (item && item.Details) {
        //   this.setDetailsNo(item.Details, (detail: any) => detail.Type !== 'CATEGORY');
        //   for (const detail of item.Details) {
        //     // item['Total'] += detail['ToMoney'] = this.toMoney(detail);
        //   }
        // }
      }
      this.summaryCalculate(rs);
      return rs;
    });
  }

  getItemDescription(item: MktMemberCardModel) {
    return item?.Description;
  }

  summaryCalculate(data: MktMemberCardModel[]) {
    for (const i in data) {
      const item = data[i];
      item['Total'] = 0;
      item['Title'] = this.renderTitle(item);

      // if (this.cms.getObjectId(item['State']) !== 'COMPLETE') {
      //   item['DefaultNote'] = 'cho phép công nợ 1 tháng kể từ ngày bán hàng';
      // }

      // for (const detail of item.Details) {
      //   // item['Total'] += detail['ToMoney'] = this.toMoney(detail);
      // }
      this.processMapList[i] = AppModule.processMaps.memberCard[item.State || ''];
    }
    return data;
  }

  receipt(item: MktMemberCardModel) {
    this.cms.openDialog(CashReceiptVoucherFormComponent, {
      context: {
        onDialogSave: (items: CashVoucherModel[]) => {
          this.refresh();
          this.onChange && this.onChange(item, this);
        },
        onAfterInit: (formComponent: CashReceiptVoucherFormComponent) => {
          formComponent.addRelativeVoucher(item, 'SALES');
        },
      }
    })
    return false;
  }

}
