import { BaseComponent } from '../base-component'; import { OnInit, Input, ViewChild, ViewContainerRef } from '@angular/core'; import { SalesPriceReportModel, SalesPriceReportDetailModel } from '../../models/sales.model'; import { CommonService } from '../../services/common.service'; import { Router } from '@angular/router'; import { ApiService } from '../../services/api.service';

declare var $: JQueryStatic;

export abstract class DataManagerPrintComponent<M> extends BaseComponent implements OnInit {

  title: string = 'Xem trước';
  @Input() data: M;
  @ViewChild('printContent', { read: ViewContainerRef, static: true }) printContent: ViewContainerRef;
  @Input() onSaveAndClose?: (id: any) => void;
  @Input() onSaveAndPrint?: (id: any) => void;

  constructor(
    protected commonService: CommonService,
    protected router: Router,
    protected apiService: ApiService,
  ) {
    super(commonService, router, apiService);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init() {

    return super.init();
  }

  abstract dismiss(): void;

  renderValue(value: any) {
    if (value && value['text']) {
      return value['text'];
    }
    return value;
  }

  print() {
    if (this.onSaveAndPrint) {
      this.onSaveAndPrint(this.identifier);
    }
    const printFrame = document.createElement('iframe');
    printFrame.name = 'printFrame';
    printFrame.style.position = 'absolute';
    printFrame.style.top = '-1000000px';
    printFrame.style.width = '21cm';
    printFrame.style.height = '29.7cm';
    document.body.appendChild(printFrame);
    const frameDoc = printFrame.contentWindow ? printFrame.contentWindow : printFrame.contentDocument['document'] ? printFrame.contentDocument['document'] : printFrame.contentDocument;
    frameDoc.document.open();
    frameDoc.document.write(`
    <html>
      <head>
        <base href="/mini-erp/">
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
        <link href="assets/style/print.css" rel="stylesheet" type="text/css" />
      </head>
      <body>
        ${this.printContent.element.nativeElement.innerHTML}
      </body>
    </html>`);
    const currentTitle = document.title;
    document.title = this.title;
    frameDoc.document.close();
    printFrame.onload = () => {
      window.frames['printFrame'].focus();
      window.frames['printFrame'].print();
      document.body.removeChild(printFrame);
      document.title = currentTitle;
    };

    // setTimeout(function () {

    //   // if (typeof onSuccess == 'function') {
    //   //   onSuccess();
    //   // }
    // }, 5000);
  }

  saveAndClose() {
    if (this.onSaveAndClose) {
      this.onSaveAndClose(this.identifier);
    }
    this.dismiss();
    return false;
  }

  exportExcel(type: string) {
    this.dismiss();
    return false;
  }

  abstract get identifier(): any
}
