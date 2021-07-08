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
import { TaxModel } from '../../../../models/tax.model';
import { UnitModel } from '../../../../models/unit.model';

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
  env = environment;

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
    for (const data of this.data) {
      data['Total'] = 0;
      data['Title'] = this.renderTitle(data);
      const taxMap = this.commonService.taxList.reduce(function (map, obj) {
        map[obj.Code] = obj;
        return map;
      }, {});
      const unitMap = this.commonService.unitList.reduce(function (map, obj) {
        map[obj.Code] = obj;
        return map;
      }, {});
      for (const detail of data.Details) {
        if (detail.Type === 'PRODUCT') {
          detail.Tax = typeof detail.Tax === 'string' ? taxMap[detail.Tax] : detail.Tax;
          detail.Unit = typeof detail.Unit === 'string' ? unitMap[detail.Unit] : detail.Unit;
          data['Total'] += detail['ToMoney'] = this.toMoney(detail);
        }
      }
    }
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
    return (html && html?.placeholder || html || '').replace(/\n/g, '<br>');
  }

  toMoney(detail: SalesPriceReportDetailModel) {
    if (detail.Type === 'PRODUCT') {
      let toMoney = detail['Quantity'] * detail['Price'];
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
        inputMode: 'dialog',
        inputId: [data.Code],
        isDuplicate: true,
        onDialogSave: (newData: SalesPriceReportModel[]) => {
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

  approvedConfirm(data: SalesPriceReportModel) {
    if (['COMPLETE'].indexOf(data.State) > -1) {
      this.commonService.showDiaplog(this.commonService.translateText('Common.approved'), this.commonService.translateText('Common.completedAlert', { object: this.commonService.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
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
    let confirmText = '';
    let responseText = '';
    switch (data.State) {
      case 'APPROVE':
        params['changeState'] = 'DEPLOYMENT';
        confirmText = 'Common.implementConfirm';
        responseText = 'Common.implementSuccess';
        break;
      case 'DEPLOYMENT':
        params['changeState'] = 'ACCEPTANCE';
        confirmText = 'Common.acceptanceConfirm';
        responseText = 'Common.acceptanceSuccess';
        break;
      // case 'ACCEPTANCEREQUEST':
      //   params['changeState'] = 'ACCEPTANCE';
      //   confirmText = 'Common.acceptanceConfirm';
      //   responseText = 'Common.acceptanceSuccess';
      //   break;
      case 'ACCEPTANCE':
        params['changeState'] = 'COMPLETE';
        confirmText = 'Common.completeConfirm';
        responseText = 'Common.completeSuccess';
        break;
      default:
        params['changeState'] = 'APPROVE';
        confirmText = 'Common.approvedConfirm';
        responseText = 'Common.approvedSuccess';
        break;
    }
    this.commonService.showDiaplog(this.commonService.translateText('Common.confirm'), this.commonService.translateText(confirmText, { object: this.commonService.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
      {
        label: this.commonService.translateText('Common.cancel'),
        status: 'primary',
        action: () => {

        },
      },
      {
        label: this.commonService.translateText(data.State == 'APPROVE' ? 'Common.implement' : (data.State == 'DEPLOYMENT' ? 'Common.acceptance' : (data.State == 'ACCEPTANCEREQUEST' ? 'Common.complete' : (data.State == 'COMPLETE' ? 'Common.completed' : 'Common.approve')))),
        status: 'danger',
        action: () => {
          this.apiService.putPromise<SalesPriceReportModel[]>('/sales/price-reports', params, [{ Code: data.Code }]).then(rs => {
            this.onChange && this.onChange(data);
            this.commonService.showDiaplog(this.commonService.translateText('Common.approved'), this.commonService.translateText(responseText, { object: this.commonService.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
              {
                label: this.commonService.translateText('Common.close'),
                status: 'success',
                action: () => {
                  this.onClose && this.onClose(data);
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

}
