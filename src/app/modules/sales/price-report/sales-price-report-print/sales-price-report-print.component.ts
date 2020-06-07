import { Component, OnInit, Input, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { BaseComponent } from '../../../../lib/base-component';
import { CommonService } from '../../../../services/common.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { NbDialogRef } from '@nebular/theme';
import { SalesPriceReportModel, SalesPriceReportDetailModel } from '../../../../models/sales.model';
import { DataManagerPrintComponent } from '../../../../lib/data-manager/data-manager-print.component';
import { environment } from '../../../../../environments/environment';

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
  ) {
    super(commonService, router, apiService);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init() {
    const result = await super.init();
    this.title = `PhieuBaoGia_${this.identifier}` + (this.data.Reported ? ('_' + this.data.Reported) : '');
    return result;
  }

  dismiss() {
    this.ref.close();
  }

  renderValue(value: any) {
    if (value && value['text']) {
      return value['text'];
    }
    return value;
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
    for (let i = 0; i < details.length; i++) {
      total += this.toMoney(details[i]);
    }
    return total;
  }

  // print() {
  //   if (this.onSaveAndPrint) {
  //     this.onSaveAndPrint(this.data.Code);
  //   }
  //   const printFrame = document.createElement('iframe');
  //   printFrame.name = 'printFrame';
  //   printFrame.style.position = 'absolute';
  //   printFrame.style.top = '-1000000px';
  //   // tslint:disable-next-line: comment-format
  //   //printFrame.style.top = "1px";
  //   printFrame.style.width = '21cm';
  //   printFrame.style.height = '29.7cm';
  //   document.body.appendChild(printFrame);
  //   const frameDoc = printFrame.contentWindow ? printFrame.contentWindow : printFrame.contentDocument['document'] ? printFrame.contentDocument['document'] : printFrame.contentDocument;
  //   frameDoc.document.open();
  //   // const currrentHtmlHeeader = $('head style');
  //   // let currrentHtmlHeeaderContent = '';
  //   // for (let i = 0; i < currrentHtmlHeeader.length; i++) {
  //   //   currrentHtmlHeeaderContent += currrentHtmlHeeader[i].outerHTML + '\n';
  //   // }
  //   frameDoc.document.write(`
  //   <html>
  //     <head>
  //       <base href="http://localhost:4200/mini-erp/">
  //       <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
  //       <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
  //       <link href="assets/style/print.css" rel="stylesheet" type="text/css" />
  //     </head>
  //     <body>
  //       ${this.printContent.element.nativeElement.innerHTML}
  //     </body>
  //   </html>`);
  //   document.title = `Probox_PhieuBaoGia_${this.data.Code}${this.data.Reported ? ('_' + this.data.Reported) : ''}`;
  //   frameDoc.document.close();
  //   setTimeout(function () {
  //     window.frames['printFrame'].focus();
  //     window.frames['printFrame'].print();
  //     document.body.removeChild(printFrame);
  //     // if (typeof onSuccess == 'function') {
  //     //   onSuccess();
  //     // }
  //   }, 500);
  // }

  saveAndClose() {
    if (this.onSaveAndClose) {
      this.onSaveAndClose(this.data.Code);
    }
    this.dismiss();
    return false;
  }

  exportExcel(type: string) {
    this.dismiss();
    return false;
  }

  get identifier() {
    return this.data.Code;
  }

}
