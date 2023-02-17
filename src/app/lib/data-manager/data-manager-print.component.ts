import { ActionControlListOption } from '../custom-element/action-control-list/action-control.interface';
import { environment } from './../../../environments/environment';
import { BaseComponent } from '../base-component'; import { OnInit, Input, ViewChild, ViewContainerRef, AfterViewInit, ViewChildren, QueryList, Component, Injectable } from '@angular/core'; import { SalesPriceReportModel, SalesPriceReportDetailModel } from '../../models/sales.model'; import { CommonService } from '../../services/common.service'; import { Router } from '@angular/router'; import { ApiService } from '../../services/api.service';
import { NbDialogRef } from '@nebular/theme';
import { Icon } from '../custom-element/card-header/card-header.component';
import { NgModel } from '@angular/forms';
import { DataManagerFormComponent } from './data-manager-form.component';
import { Type } from '@angular/core';
import { ProcessMap } from '../../models/process-map.model';
import { AppModule } from '../../app.module';
import { ShowcaseDialogComponent } from '../../modules/dialog/showcase-dialog/showcase-dialog.component';

declare var $: JQueryStatic;

@Component({ template: '' })
export abstract class DataManagerPrintComponent<M> extends BaseComponent implements OnInit, AfterViewInit {

  // title: string = 'Xem trước';
  @Input() data: M[];
  @Input() id?: string[];
  @ViewChildren('printContent', { read: ViewContainerRef }) printContent: QueryList<ViewContainerRef>;
  @Input() onSaveAndClose?: (data: M, instance?: DataManagerPrintComponent<M>) => void;
  @Input() onSaveAndPrint?: (data: M, instance?: DataManagerPrintComponent<M>) => void;
  @Input() onClose?: (data: M, instance?: DataManagerPrintComponent<M>) => void;
  @Input() onChange?: (data: M, instance?: DataManagerPrintComponent<M>) => void;

  favicon: Icon = { pack: 'eva', name: 'browser', size: 'medium', status: 'primary' };
  @Input() idKey?: string[];
  @Input() title?: string;
  @Input() size?: string = 'medium';
  @Input() mode?: 'print' | 'preview' = 'print';
  @Input() closeAfterStateActionConfirm = false;

  apiPath?: string;
  formDialog: Type<DataManagerFormComponent<M>>;
  processMapList: ProcessMap[] = [];
  style: string;

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
          this.commonService.showDialog(this.commonService.translateText('Common.confirm'), this.commonService.translateText('Print.multiPrintConfirm?'), [
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
    return super.init().then(async rs => {
      if ((!this.data || this.data.length === 0) && this.id) {
        try {
          this.data = await this.getFormData(this.id);
          if (!this.data || this.data.length === 0) {
            this.commonService.showToast('Không tải được dữ liệu', 'Common.warning', { status: 'warning' });
            this.close();
          }
        } catch (err) {
          console.error(err);
          this.close();
        }
      }
      this.onAfterInit && this.onAfterInit(this);
      return rs;
    });
  }

  // abstract close(): void;

  makeId(item: M) {
    if (typeof item === 'string') return item;
    if (Array.isArray(this.idKey)) {
      return this.idKey.map(key => this.encodeId(item[key])).join('-');
    }
    return item[this.idKey];
  }

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

  async print(index?: number, voucherType?: string) {
    return new Promise(resolve => {
      if (this.onSaveAndPrint) {
        this.onSaveAndPrint(this.identifier);
      }

      const printFrame = document.createElement('iframe');
      printFrame.name = 'printFrame';
      printFrame.style.position = 'absolute';
      printFrame.style.top = '-1000000px';
      // printFrame.style.top = '20px';
      printFrame.style.width = '21cm';
      printFrame.style.height = '29.7cm';
      document.body.appendChild(printFrame);
      const frameDoc = printFrame.contentWindow ? printFrame.contentWindow : printFrame.contentDocument['document'] ? printFrame.contentDocument['document'] : printFrame.contentDocument;
      frameDoc.document.open();
      let printContent = '';
      const printContentEles = this.printContent.toArray();
      let title = 'ProBox one ®';
      let data: M;
      if (index !== undefined) {
        printContent += printContentEles[index].element.nativeElement.innerHTML;
        data = this.data[index];
        // Todo: restrict only print created voucher  
        // if(!data['Id']) {
        //   this.commonService.showToast('Không thể in phiếu chưa được luu', 'Lỗi in phiếu', {status: 'danger'})
        //   console.error('voucher not just created');
        //   return false;
        // }
        if (data) {
          title += ' - ' + data['Title'];
        }
      } else {
        for (const item of printContentEles) {
          printContent += item.element.nativeElement.innerHTML;
        }
      }
      let style = '';
      if (this.style) {
        style = `<style>${this.style}</style>`;
      }
      frameDoc.document.write(`
    <html>
      <head>
        <base href="/${environment.basePath}/">
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
        <link href="assets/style/print.css" rel="stylesheet" type="text/css" />
        ${style}
        <title>${title}</title>
      </head>
      <body>
        ${printContent}
      </body>
    </html>`);
      const currentTitle = document.title;
      document.title = data ? this.renderTitle(data) : this.title;
      frameDoc.document.close();
      printFrame.onload = () => {
        window.frames['printFrame'].focus();
        window.frames['printFrame'].print();
        document.body.removeChild(printFrame);
        document.title = currentTitle;
        return resolve(true);
      };

      // setTimeout(function () {

      //   // if (typeof onSuccess == 'function') {
      //   //   onSuccess();
      //   // }
      // }, 5000);
    });
  }

  printX(index?: number) {
    if (this.onSaveAndPrint) {
      this.onSaveAndPrint(this.identifier);
    }

    // const printFrame = document.createElement('iframe');
    const printWindow = window.open();
    const printFrame = printWindow.document;
    // printFrame.name = 'printFrame';
    // printFrame.style.position = 'absolute';
    // printFrame.style.top = '-1000000px';
    // printFrame.style.top = '20px';
    // printFrame.style.width = '21cm';
    // printFrame.style.height = '29.7cm';
    // document.body.appendChild(printFrame);
    // const frameDoc = printFrame.contentWindow ? printFrame.contentWindow : printFrame.contentDocument['document'] ? printFrame.contentDocument['document'] : printFrame.contentDocument;
    // frameDoc.document.open();
    let printContent = '';
    const printContentEles = this.printContent.toArray();
    let title = 'ProBox one ®';
    let data: M;
    if (index !== undefined) {
      printContent += printContentEles[index].element.nativeElement.innerHTML;
      data = this.data[index];
      // Todo: restrict only print created voucher  
      // if(!data['Id']) {
      //   this.commonService.showToast('Không thể in phiếu chưa được luu', 'Lỗi in phiếu', {status: 'danger'})
      //   console.error('voucher not just created');
      //   return false;
      // }
      if (data) {
        title += ' - ' + data['Title'];
      }
    } else {
      for (const item of printContentEles) {
        printContent += item.element.nativeElement.innerHTML;
      }
    }
    let style = '';
    if (this.style) {
      style = `<style>${this.style}</style>`;
    }
    printFrame.write(`
    <html>
      <head>
        <base href="/${environment.basePath}/">
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
        <link href="assets/style/print.css" rel="stylesheet" type="text/css" />
        ${style}
        <title>${title}</title>
      </head>
      <body>
        ${printContent}
      </body>
    </html>`);
    const currentTitle = document.title;
    printFrame.title = data ? this.renderTitle(data) : this.title;
    // frameDoc.document.close();
    printFrame.onload = () => {
      printWindow.focus();
      printWindow.print();
      // document.body.removeChild(printFrame);
      // document.title = currentTitle;
    };

    // setTimeout(function () {

    //   // if (typeof onSuccess == 'function') {
    //   //   onSuccess();
    //   // }
    // }, 5000);
  }

  saveAndClose(data: M) {
    if (this.onSaveAndClose) {
      this.onSaveAndClose(data, this);
    }
    this.close();
    return false;
  }

  exportExcel(type: string, data: M) {
    this.close();
    return false;
  }

  abstract get identifier(): any

  async getFormData(ids: string[]) {
    return [];
  }

  setDetailsNo(details: any[], condition: (detail: any) => boolean) {
    let no = 1;
    for (const detail of details) {
      if (condition(detail)) {
        detail.No = no++;
      }
    }
  }

  edit(data: M) {
    try {
      if (!this.formDialog) {
        console.error('Form Dialog was not defined');
        return;
      }
      this.commonService.openDialog<DataManagerFormComponent<M>>(this.formDialog || this.formDialog, {
        context: {
          showLoadinng: true,
          inputMode: 'dialog',
          inputId: [this.idKey.map(m => this.encodeId(data[m])).join('-')],
          onDialogSave: (newData: M[]) => {
            // resolve({ event: 'save', data: newData });
            // this.refresh();
            // if (editedItems && editedItems.length > 0) {
            //   this.updateGridItems(editedItems, newData);
            // } else {
            //   this.prependGridItems(newData);
            // }
            this.refresh();
          },
          onDialogClose: () => {
            // resolve({ event: 'close' });
          },
        },
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    } catch (e) {
      throw Error(e);
    }
    return true;
  }

  getItemDescription(item: M) {
    return 'undefined';
  }

  stateActionConfirm(item: M, nextState: ProcessMap) {
    const params = { id: this.makeId(item) };
    // const processMap = AppModule.processMaps.awardVoucher[data.State || ''];
    params['changeState'] = nextState.state;
    const putData: any = {};
    if (Array.isArray(this.idKey)) {
      for (const key of this.idKey) {
        putData[key] = item[key];
      }
    } else {
      putData[this.idKey] = item[this.idKey];
    }

    this.commonService.showDialog(this.commonService.translateText(nextState.confirmText), nextState.confirmText + ': ' + this.getItemDescription(item), [
      {
        label: this.commonService.translateText('Common.cancel'),
        status: 'primary',
        action: () => {

        },
      },
      {
        label: this.commonService.translateText(nextState.confirmLabel),
        status: nextState.status,
        action: () => {
          this.loading = true;
          this.apiService.putPromise<M[]>(this.apiPath, params, [putData]).then(async rs => {
            this.loading = false;
            // this.refresh();
            const newstId = this.makeId(item);
            const newestItem = (await this.getFormData([newstId]))[0];
            this.data = this.data.map(m => {
              if (this.makeId(m) == newstId) {
                return newestItem;
              }
              return m;
            });
            this.onChange && this.onChange(newestItem, this);
            this.onClose && this.onClose(newestItem, this);
            if (this.closeAfterStateActionConfirm) {
              this.close();
            }
            this.commonService.showToast(this.commonService.translateText(nextState?.responseText, { object: this.commonService.translateText('Purchase.PrucaseVoucher.title', { definition: '', action: '' }) + ': `' + this.getItemDescription(item) + '`' }), this.commonService.translateText(nextState?.responseTitle), {
              status: 'success',
            });
          }).catch(err => {
            this.loading = false;
          });
        },
      },
    ]);
  }

  prepareCopy(data: M) {
    this.close();
    if (!this.formDialog) {
      console.error('Form Dialog was not defined');
      return;
    }
    this.commonService.openDialog(this.formDialog, {
      context: {
        inputMode: 'dialog',
        inputId: [this.makeId(data)],
        isDuplicate: true,
        onDialogSave: (newData: M[]) => {
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

  close() {
    super.close();
    this.onClose && this.onClose(null, this);
  }

  async refresh() {
    if (this.id) {
      this.data = await this.getFormData(this.id);
    }
    return true;
  }

  summaryCalculate(data: M[]) {

  }

  openRelativeVoucher(relativeVocher: any) {
    if (relativeVocher) this.commonService.previewVoucher(relativeVocher.type, relativeVocher);
    return false;
  }

}
