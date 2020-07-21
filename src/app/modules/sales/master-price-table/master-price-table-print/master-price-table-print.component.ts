import { Component, OnInit } from '@angular/core';
import { DataManagerPrintComponent } from '../../../../lib/data-manager/data-manager-print.component';
import { SalesMasterPriceTableModel } from '../../../../models/sales.model';
import { environment } from '../../../../../environments/environment';
import { CommonService } from '../../../../services/common.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { PriceTablePrintComponent } from '../../price-table/price-table-print/price-table-print.component';
import { DatePipe } from '@angular/common';
import { ShowcaseDialogComponent } from '../../../dialog/showcase-dialog/showcase-dialog.component';

@Component({
  selector: 'ngx-master-price-table-print',
  templateUrl: './master-price-table-print.component.html',
  styleUrls: ['./master-price-table-print.component.scss'],
})
export class MasterPriceTablePrintComponent extends DataManagerPrintComponent<SalesMasterPriceTableModel> implements OnInit {

  /** Component name */
  componentName = 'MasterPriceTablePrintComponent';
  title: string = 'Xem trước';
  env = environment;

  constructor(
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref: NbDialogRef<MasterPriceTablePrintComponent>,
    public datePipe: DatePipe,
    public dialogService: NbDialogService,
  ) {
    super(commonService, router, apiService);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init() {
    const result = await super.init();
    this.calculateDetailRows();
    this.title = `PhieuBaoGia_${this.identifier}` + (this.data.DateOfApproved ? ('_' + this.datePipe.transform(this.data.DateOfApproved, 'short')) : '');
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

  public detailRows = [];
  calculateDetailRows() {
    this.detailRows = [];
    const numOfColumns = 4;
    let currentRow = null;
    for (let i = 0; i < this.data.Details.length; i++) {
      if (i % 4 === 0) {
        currentRow = [];
        this.detailRows.push(currentRow);
      }
      currentRow.push(this.data.Details[i]);
    }
  }

  approve(priceReport: SalesMasterPriceTableModel) {
    this.commonService.openDialog(ShowcaseDialogComponent, {
      context: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Sales.MasterPriceTable.approve'), 'head-title'),
        content: this.commonService.textTransform(this.commonService.translate.instant('Sales.MasterPriceTable.approvedComfirmMessage', { title: priceReport.Title }), 'head-title'),
        actions: [
          {
            label: this.commonService.textTransform(this.commonService.translate.instant('Common.goback'), 'head-title'),
            icon: 'back',
            status: 'info',
            action: () => { },
          },
          {
            label: this.commonService.textTransform(this.commonService.translate.instant('Common.approve'), 'head-title'),
            icon: 'checkmark-square',
            status: 'danger',
            action: () => {
              this.apiService.putPromise<SalesMasterPriceTableModel[]>('/sales/master-price-tables', { id: [priceReport.Code] }, [{ Code: priceReport.Code, Approved: true }]).then(rs => {
                this.close();
                this.onSaveAndClose(rs);
              });
            },
          },
        ],
      },
    });
  }

}
