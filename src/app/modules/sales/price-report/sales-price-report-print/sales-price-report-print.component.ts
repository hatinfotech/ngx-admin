import { Component, OnInit, Input, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { BaseComponent } from '../../../../lib/base-component';
import { CommonService } from '../../../../services/common.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { NbDialogRef } from '@nebular/theme';
import { SalesPriceReportModel, SalesPriceReportDetailModel } from '../../../../models/sales.model';
import { TaxModel } from '../../../../models/tax.model';

@Component({
  selector: 'ngx-sales-price-report-print',
  templateUrl: './sales-price-report-print.component.html',
  styleUrls: ['./sales-price-report-print.component.scss'],
})
export class SalesPriceReportPrintComponent extends BaseComponent implements OnInit {

  /** Component name */
  componentName = 'SalesPriceReportPrintComponent';

  title: string = 'Xem trước phiếu báo giá';
  @Input() data: SalesPriceReportModel;
  @ViewChild('printContent', { read: ViewContainerRef, static: true }) printContent: ViewContainerRef;

  constructor(
    protected commonService: CommonService,
    protected router: Router,
    protected apiService: ApiService,
    protected ref: NbDialogRef<SalesPriceReportPrintComponent>,
  ) {
    super(commonService, router, apiService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  async init() {

    return super.init();
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

  }

  print() {
    var printFrame = document.createElement('iframe');
    printFrame.name = 'printFrame';
    printFrame.style.position = 'absolute';
    printFrame.style.top = '-1000000px';
    //printFrame.style.top = "1px";
    printFrame.style.width = '21cm';
    printFrame.style.height = '29.7cm';
    document.body.appendChild(printFrame);
    var frameDoc = printFrame.contentWindow ? printFrame.contentWindow : printFrame.contentDocument['document'] ? printFrame.contentDocument['document'] : printFrame.contentDocument;
    frameDoc.document.open();
    frameDoc.document.write('<html><head><title>DIV Contents</title>');
    frameDoc.document.write('</head><body>');
    frameDoc.document.write(this.printContent.element.nativeElement.innerHTML);
    frameDoc.document.write('</body></html>');
    frameDoc.document.close();
    setTimeout(function () {
      window.frames['printFrame'].focus();
      window.frames['printFrame'].print();
      // document.body.removeChild(printFrame);
      // if (typeof onSuccess == 'function') {
      //   onSuccess();
      // }
    }, 500);
  }

}
