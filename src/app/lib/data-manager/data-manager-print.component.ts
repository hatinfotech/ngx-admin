import { environment } from './../../../environments/environment';
import { BaseComponent } from '../base-component'; import { OnInit, Input, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core'; import { SalesPriceReportModel, SalesPriceReportDetailModel } from '../../models/sales.model'; import { CommonService } from '../../services/common.service'; import { Router } from '@angular/router'; import { ApiService } from '../../services/api.service';
import { NbDialogRef } from '@nebular/theme';
import { Icon } from '../custom-element/card-header/card-header.component';

declare var $: JQueryStatic;

export abstract class DataManagerPrintComponent<M> extends BaseComponent implements OnInit, AfterViewInit {

  // title: string = 'Xem trước';
  @Input() data: M;
  @ViewChild('printContent', { read: ViewContainerRef, static: true }) printContent: ViewContainerRef;
  @Input() onSaveAndClose?: (id: any) => void;
  @Input() onSaveAndPrint?: (id: any) => void;

  favicon: Icon = { pack: 'eva', name: 'browser', size: 'medium', status: 'primary' };
  @Input() title?: string;
  @Input() size?: string = 'medium';

  constructor(
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref?: NbDialogRef<DataManagerPrintComponent<M>>,
  ) {
    super(commonService, router, apiService, ref);
    this.actionButtonList.unshift({
      name: 'print',
      status: 'primary',
      label: this.commonService.textTransform(this.commonService.translate.instant('Common.print'), 'head-title'),
      icon: 'printer',
      title: this.commonService.textTransform(this.commonService.translate.instant('Common.print'), 'head-title'),
      size: 'medium',
      disabled: () => false,
      hidden: () => false,
      click: () => {
        this.print();
      },
    });
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  ngAfterViewInit(): void {
    // const nativeEle = this;
    // Fix dialog scroll
    if (this.ref) {
      const dialog: NbDialogRef<DataManagerPrintComponent<M>> = this.ref;
      if (dialog && dialog.componentRef && dialog.componentRef.location && dialog.componentRef.location.nativeElement) {
        const nativeEle = dialog.componentRef.location.nativeElement;
        // tslint:disable-next-line: ban
        $(nativeEle).closest('.cdk-global-overlay-wrapper').addClass('dialog');
      }
    }
  }

  async init() {
    return super.init();
  }

  abstract close(): void;

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
        <base href="/${environment.basePath}/">
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
    this.close();
    return false;
  }

  exportExcel(type: string) {
    this.close();
    return false;
  }

  abstract get identifier(): any
}
