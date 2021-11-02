// import { SalesModule } from './../../sales.module';
import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { NbDialogRef } from '@nebular/theme';
import { SalesPriceReportModel, SalesPriceReportDetailModel } from '../../../../models/sales.model';
import { DataManagerPrintComponent } from '../../../../lib/data-manager/data-manager-print.component';
import { environment } from '../../../../../environments/environment';
import { DatePipe } from '@angular/common';
import { SalesPriceReportFormComponent } from '../sales-price-report-form/sales-price-report-form.component';
import { ProcessMap } from '../../../../models/process-map.model';
import { AppModule } from '../../../../app.module';

declare var $: JQueryStatic;

@Component({
  selector: 'ngx-sales-price-report-print',
  templateUrl: './sales-price-report-print.component.html',
  styleUrls: ['./sales-price-report-print.component.scss'],
})
export class SalesPriceReportPrintComponent extends DataManagerPrintComponent<SalesPriceReportModel> implements OnInit {

  /** Component name */
  componentName = 'SalesPriceReportPrintComponent';
  title: string = 'Xem trước phiếu báo giá';
  apiPath = '/sales/price-reports';
  env = environment;
  processMapList: ProcessMap[] = [];
  formDialog = SalesPriceReportFormComponent;
  idKey: ['Code'];

  constructor(
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref: NbDialogRef<SalesPriceReportPrintComponent>,
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
    // this.title = `PhieuBaoGia_${this.identifier}` + (this.data.Reported ? ('_' + this.datePipe.transform(this.data.Reported, 'short')) : '');
    // for (const i in this.data) {
    //   const data = this.data[i];
    //   data['Total'] = 0;
    //   data['Title'] = this.renderTitle(data);
    //   const taxMap = this.commonService.taxList.reduce(function (map, obj) {
    //     map[obj.Code] = obj;
    //     return map;
    //   }, {});
    //   const unitMap = this.commonService.unitList.reduce(function (map, obj) {
    //     map[obj.Code] = obj;
    //     return map;
    //   }, {});
    //   for (const detail of data.Details) {
    //     if (detail.Type !== 'CATEGORT') {
    //       data['Total'] += detail['ToMoney'] = this.toMoney(detail);
    //     }
    //   }
    //   this.processMapList[i] = AppModule.processMaps.priceReport[data.State || ''];
    // }
    this.summaryCalculate(this.data);
    return result;
  }

  // getIdentified(data: SalesPriceReportModel): string[] {
  //   if (this.idKey && this.idKey.length > 0) {
  //     return this.idKey.map(key => data[key]);
  //   } else {
  //     return data['Id'];
  //   }
  // }

  renderTitle(data: SalesPriceReportModel) {
    return `PhieuBaoGia_${this.getIdentified(data).join('-')}` + (data.Reported ? ('_' + this.datePipe.transform(data.Reported, 'short')) : '');
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

  toMoney(detail: SalesPriceReportDetailModel) {
    if (detail.Type !== 'CATEGORY') {
      let toMoney = detail['Quantity'] * detail['Price'];
      if (detail.Tax) {
        if (typeof detail.Tax?.Tax == 'undefined') {
          throw Error('tax not as tax model');
        }
        toMoney += toMoney * detail.Tax.Tax / 100;
      }
      return toMoney;
    }
    return 0;
  }

  getTotal(data: SalesPriceReportModel) {
    let total = 0;
    const details = data.Details;
    let no = 1;
    for (let i = 0; i < details.length; i++) {
      const detail = details[i];
      if (detail.Type === 'PRODUCT') {
        detail['No'] = no++;
      }
      total += this.toMoney(detail);
    }
    return total;
  }

  saveAndClose(data: SalesPriceReportModel) {
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

  prepareCopy(data: SalesPriceReportModel) {
    this.close();
    this.commonService.openDialog(SalesPriceReportFormComponent, {
      context: {
        showLoadinng: true,
        inputMode: 'dialog',
        inputId: [data.Code],
        isDuplicate: true,
        onDialogSave: (newData: SalesPriceReportModel[]) => {
          // if (onDialogSave) onDialogSave(row);
          this.onClose && this.onClose(newData[0]);
          this.onSaveAndClose && this.onSaveAndClose(newData[0]);
        },
        onDialogClose: () => {
          // if (onDialogClose) onDialogClose();
          this.refresh();
        },
      },
    });
  }

  approvedConfirm(data: SalesPriceReportModel, index: number) {
    if (['COMPLETE'].indexOf(data.State) > -1) {
      this.commonService.showDiaplog(this.commonService.translateText('Common.completed'), this.commonService.translateText('Common.completedAlert', { object: this.commonService.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
        {
          label: this.commonService.translateText('Common.close'),
          status: 'success',
          action: () => {
            this.onClose(data);
          },
        },
      ]);
      return;
    }
    const params = { id: [data.Code] };
    // const processMap = SalesModule.processMaps.priceReport[data.State || ''];
    params['changeState'] = this.processMapList[index]?.nextState;
    // let confirmText = '';
    // let responseText = '';
    // switch (data.State) {
    //   case 'APPROVE':
    //     params['changeState'] = 'DEPLOYMENT';
    //     confirmText = 'Common.implementConfirm';
    //     responseText = 'Common.implementSuccess';
    //     break;
    //   case 'DEPLOYMENT':
    //     params['changeState'] = 'ACCEPTANCE';
    //     confirmText = 'Common.acceptanceConfirm';
    //     responseText = 'Common.acceptanceSuccess';
    //     break;
    //   // case 'ACCEPTANCEREQUEST':
    //   //   params['changeState'] = 'ACCEPTANCE';
    //   //   confirmText = 'Common.acceptanceConfirm';
    //   //   responseText = 'Common.acceptanceSuccess';
    //   //   break;
    //   case 'ACCEPTANCE':
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
    this.commonService.showDiaplog(this.commonService.translateText('Common.confirm'), this.commonService.translateText(this.processMapList[index]?.confirmText, { object: this.commonService.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
      {
        label: this.commonService.translateText('Common.cancel'),
        status: 'primary',
        action: () => {

        },
      },
      {
        label: this.commonService.translateText(this.processMapList[index]?.nextStateLabel),
        status: 'danger',
        action: () => {
          this.loading = true;
          this.apiService.putPromise<SalesPriceReportModel[]>('/sales/price-reports', params, [{ Code: data.Code }]).then(rs => {
            this.loading = true;
            this.onChange && this.onChange(data);
            this.close();
            this.onClose && this.onClose(data);
            this.commonService.toastService.show(this.commonService.translateText(this.processMapList[index]?.responseText, { object: this.commonService.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), this.commonService.translateText(this.processMapList[index]?.responseTitle), {
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
    return this.apiService.getPromise<SalesPriceReportModel[]>(this.apiPath, { id: ids, includeContact: true, includeDetails: true, includeTax: true, includeUnit: true, includeRelativeVouchers: true }).then(rs => {
      if (rs[0] && rs[0].Details) {
        this.setDetailsNo(rs[0].Details, (detail: SalesPriceReportDetailModel) => detail.Type !== 'CATEGORY');
        // let total = 0;
        for (const detail of rs[0].Details) {
          // const tax = detail.Tax;
          // let toMoney = detail['Quantity'] * detail['Price'];
          // if(tax?.Tax) {
          //   toMoney += (toMoney * tax?.Tax / 100);
          // }
          if (detail.Type !== 'CATEGORY') {
            rs[0]['Total'] += (detail['ToMoney'] = this.toMoney(detail));
          }

          // detail['ToMoney'] = toMoney;
          // total += toMoney;
        }
        // rs[0]['Total'] = total;
      }
      this.summaryCalculate(rs);
      return rs;
    });
  }

  getItemDescription(item: SalesPriceReportModel) {
    return item?.Title;
  }

  summaryCalculate(data: SalesPriceReportModel[]) {
    
    for (const i in data) {
      const datanium = data[i];
      datanium['Total'] = 0;
      datanium['Title'] = this.renderTitle(datanium);
      const taxMap = this.commonService.taxList.reduce(function (map, obj) {
        map[obj.Code] = obj;
        return map;
      }, {});
      const unitMap = this.commonService.unitList.reduce(function (map, obj) {
        map[obj.Code] = obj;
        return map;
      }, {});
      for (const detail of datanium.Details) {
        if (detail.Type !== 'CATEGORT') {
          datanium['Total'] += detail['ToMoney'] = this.toMoney(detail);
        }
      }
      this.processMapList[i] = AppModule.processMaps.priceReport[datanium.State || ''];
    }
    
    // for (const i in data) {
    //   const item = this.data[i];
    //   item['Total'] = 0;
    //   item['Title'] = this.renderTitle(item);
    //   for (const detail of item.Details) {
    //     item['Total'] += detail['Amount'] = parseFloat(detail['Amount'] as any);
    //   }
    //   this.processMapList[i] = AppModule.processMaps.cashVoucher[item.State || ''];
    // }
    return data;
  }

}
