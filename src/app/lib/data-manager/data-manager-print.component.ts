import { ActionControlListOption } from './../custom-element/action-control-list/action-control.interface';
import { environment } from './../../../environments/environment';
import { BaseComponent } from '../base-component'; import { OnInit, Input, ViewChild, ViewContainerRef, AfterViewInit, ViewChildren, QueryList, Component, Injectable } from '@angular/core'; import { SalesPriceReportModel, SalesPriceReportDetailModel } from '../../models/sales.model'; import { CommonService } from '../../services/common.service'; import { Router } from '@angular/router'; import { ApiService } from '../../services/api.service';
import { NbDialogRef } from '@nebular/theme';
import { Icon } from '../custom-element/card-header/card-header.component';
import { NgModel } from '@angular/forms';

declare var $: JQueryStatic;
export abstract class DataManagerPrintComponent<M> extends BaseComponent implements OnInit, AfterViewInit {

  // title: string = 'Xem trước';
  @Input() data: M[];
  @ViewChildren('printContent', { read: ViewContainerRef }) printContent: QueryList<ViewContainerRef>;
  @Input() onSaveAndClose?: (data: M) => void;
  @Input() onSaveAndPrint?: (data: M) => void;
  @Input() onClose?: (data: M) => void;
  @Input() onChange?: (data: M) => void;

  favicon: Icon = { pack: 'eva', name: 'browser', size: 'medium', status: 'primary' };
  @Input() idKey?: string[];
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
      click: (event?: any, option?: ActionControlListOption) => {
        if (this.data.length > 1) {
          this.commonService.showDiaplog(this.commonService.translateText('Common.confirm'), this.commonService.translateText('Print.multiPrintConfirm?'), [
            {
              label: this.commonService.translateText('Common.close'),
              status: 'primary',
              action: () => {

              },
            },
            {
              label: this.commonService.translateText('Common.all'),
              status: 'danger',
              action: () => {
                this.print();
              },
            },
            {
              label: this.commonService.translateText('Common.current'),
              status: 'success',
              action: () => {
                this.print(option?.index);
              },
            },
          ]);
        } else {
          this.print(option?.index);
        }
      },
    });
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  // ngAfterViewInit(): void {
  //   // const nativeEle = this;
  //   // Fix dialog scroll
  //   if (this.ref) {
  //     const dialog: NbDialogRef<DataManagerPrintComponent<M>> = this.ref;
  //     if (dialog && dialog.componentRef && dialog.componentRef.location && dialog.componentRef.location.nativeElement) {
  //       const nativeEle = dialog.componentRef.location.nativeElement;
  //       // tslint:disable-next-line: ban
  //       $(nativeEle).closest('.cdk-global-overlay-wrapper').addClass('dialog');
  //     }
  //   }
  // }

  async init() {
    await this.loadCache();
    return super.init().then(rs => {
      this.onAfterInit && this.onAfterInit();
      return rs;
    });
  }

  abstract close(): void;

  getIdentified(data: M): string[] {
    if (this.idKey && this.idKey.length > 0) {
      return this.idKey.map(key => data[key]);
    } else {
      return [data['Code']];
    }
  }

  renderTitle(data: M) {
    return `Preview-${this.getIdentified(data).join('-')}`;
  }

  renderValue(value: any) {
    if (value && value['text']) {
      return value['text'];
    }
    return value;
  }

  print(index?: number) {
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
    let printContent = '';
    const printContentEles = this.printContent.toArray();
    let title = 'ProBox one ®';
    if (index !== undefined) {
      printContent += printContentEles[index].element.nativeElement.innerHTML;
      const data = this.data[index];
      if(data) {
        title += ' - ' + data['Title'];
      }
    } else {
      for (const item of printContentEles) {
        printContent += item.element.nativeElement.innerHTML;
      }
    }
    frameDoc.document.write(`
    <html>
      <head>
        <base href="/${environment.basePath}/">
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
        <link href="assets/style/print.css" rel="stylesheet" type="text/css" />
        <title>${title}</title>
      </head>
      <body>
        ${printContent}
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

  saveAndClose(data: M) {
    if (this.onSaveAndClose) {
      this.onSaveAndClose(data);
    }
    this.close();
    return false;
  }

  exportExcel(type: string, data: M) {
    this.close();
    return false;
  }

  abstract get identifier(): any
}
