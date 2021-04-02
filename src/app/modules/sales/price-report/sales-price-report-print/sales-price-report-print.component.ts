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
    this.title = `PhieuBaoGia_${this.identifier}` + (this.data.Reported ? ('_' + this.datePipe.transform(this.data.Reported, 'short')) : '');
    return result;
  }

  close() {
    this.ref.close();
  }

  renderValue(value: any) {
    let html = value;
    if (value && value['text']) {
      html = value['text'];
    }
    return (html || '').replace(/\n/g, '<br>');
  }

  toMoney(detail: SalesPriceReportDetailModel) {
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

  prepareCopy() {
    this.close();
    this.commonService.openDialog(SalesPriceReportFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: [this.data.Code],
        isDuplicate: true,
        onDialogSave: (newData: SalesPriceReportModel[]) => {
          // if (onDialogSave) onDialogSave(row);
          this.onClose(newData);
        },
        onDialogClose: () => {
          // if (onDialogClose) onDialogClose();
          this.refresh();

        },
      },
    });
  }

  approvedConfirm() {
    this.commonService.showDiaplog(this.commonService.translateText('Common.confirm'), this.commonService.translateText('Common.approvedConfirm', { object: this.commonService.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + this.data.Title + '`' }), [
      {
        label: this.commonService.translateText('Common.cancel'),
        status: 'primary',
        action: () => {

        },
      },
      {
        label: this.commonService.translateText('Common.approve'),
        status: 'danger',
        action: () => {
          this.apiService.putPromise<SalesPriceReportModel[]>('/sales/price-reports', { id: [this.data.Code], approve: true }, [{ Code: this.data.Code }]).then(rs => {
            this.commonService.showDiaplog(this.commonService.translateText('Common.approved'), this.commonService.translateText('Common.approvedSuccess', { object: this.commonService.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + this.data.Title + '`' }), [
              {
                label: this.commonService.translateText('Common.close'),
                status: 'success',
                action: () => {
                  this.onClose(this.data);
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
