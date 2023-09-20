import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { isThisTypeNode } from 'typescript';
import { threadId } from 'worker_threads';
import { environment } from '../../../../../environments/environment.prod';
import { DataManagerPrintComponent } from '../../../../lib/data-manager/data-manager-print.component';
import { CommercePosOrderModel } from '../../../../models/commerce-pos.model';
import { ProcessMap } from '../../../../models/process-map.model';
import { WarehouseGoodsDeliveryNoteModel, WarehouseGoodsDeliveryNoteDetailModel, WarehouseGoodsContainerModel } from '../../../../models/warehouse.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { RootServices } from '../../../../services/root.services';

@Component({
  selector: 'ngx-commerce-pos-bill-print',
  templateUrl: './commerce-pos-bill-print.component.html',
  styleUrls: ['./commerce-pos-bill-print.component.css'],
})
export class CommercePosBillPrintComponent extends DataManagerPrintComponent<any> implements OnInit {

  /** Component name */
  componentName = 'CommercePosBillPrintComponentZ';
  title: string = 'PHIẾU BÁO GIÁ';
  env = environment;
  apiPath = '/commerce-pos/orders';
  processMapList: ProcessMap[] = [];
  idKey: ['Code'];
  // formDialog = WarehouseGoodsFormComponent;

  @ViewChild('paymentBtn') paymentBtn: ElementRef;
  @ViewChild('printBtn') printBtn: ElementRef;

  @Input() skipPreview: boolean;
  @Input() order: CommercePosOrderModel;
  @Input() instantPayment: boolean;
  @Input() printType: 'PRICEREPORT' | 'RETAILINVOICE' = 'PRICEREPORT';
  @Input() type: 'PRICEREPORT' | 'COMMERCEPOSORDER' = 'COMMERCEPOSORDER';

  style = /*css*/`
  #print-area {
    width: initial;
    width: 80mm;
  }
  .bill {
  }
  .bill .bill-title {
    font-weight: bold;
    font-size: 1.2rem !important;
    text-align: center;
  }
  .bill table thead td {
    font-weight: bold;
    border-bottom: 1px dashed #000;
  }
  .bill table tr td {
    border-bottom: 1px dashed #000;
    vertical-align: top;
  }
  .bill .bill-register-info {
    text-align: center;
    line-height: 1rem;
  }
  .bill .bill-info {
    text-align: center;
  }
  .bill .bill-register-logo img {
    width: 50mm;
  }
  .bill .bill-register-name {
  }
  .bill .bill-register-tax-code {
  }
  .bill .bill-register-tel {
  }
  .bill .bill-register-email {
  }
  .bill .bill-register-website {
  }
  .bill .bill-register-address {
  }
  
  .bill-head-info div {
    border-bottom: dashed #000 1px;
  }
  

  @media print {
    body {
      background: #fff !important;
    }
    #print-area {
      page-break-after: initial;
    }
  }

  /** Override */
  #print-area {
    width: initial;
  }
  `;

  registerInfo: any;

  constructor(
    public rsv: RootServices,
    public cms: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref: NbDialogRef<CommercePosBillPrintComponent>,
    public datePipe: DatePipe,
  ) {
    super(rsv, cms, router, apiService, ref);
    this.cms.systemConfigs$.subscribe(registerInfo => {
      this.registerInfo = registerInfo.LICENSE_INFO.register;
    });
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init() {
    if (this.printType == 'PRICEREPORT') {
      this.title = 'PHIẾU BÁO GIÁ';
    }
    if (this.printType == 'RETAILINVOICE') {
      this.title = 'HÓA ĐƠN BÁN LẺ';
    }
    const result = await super.init().then(rs => {
      const printActionButn = this.actionButtonList.find(f => f.name == 'print');
      if (printActionButn) {
        printActionButn.disabled = (option) => {
          return this.data[0].State != 'APPROVED';
        };
      }
      return rs;
    });
    if (this.data[0].State == 'APPROVED') {
      this.printBtn['hostElement']?.nativeElement.focus();
    } else {
      this.paymentBtn['hostElement']?.nativeElement.focus();
    }
    // this.title = `PurchaseVoucher_${this.identifier}` + (this.data.DateOfPurchase ? ('_' + this.datePipe.transform(this.data.DateOfPurchase, 'short')) : '');

    // for (const i in this.data) {
    //   const data = this.data[i];
    //   this.setDetailsNo(data?.Details, (detail: WarehouseGoodsDeliveryNoteDetailModel) => detail.Type === 'PRODUCT');
    //   data['Total'] = 0;
    //   data['Title'] = this.renderTitle(data);
    //   for (const detail of data.Details) {
    //     data['Total'] += detail['ToMoney'] = this.toMoney(detail);
    //   }
    //   this.processMapList[i] = AppModule.processMaps.warehouseDeliveryGoodsNote[data.State || ''];
    // }
    this.summaryCalculate(this.data);
    if (this.instantPayment) {
      if (this.type == 'PRICEREPORT') {
        this.saveAndPrint(0, { print: false });
      } else {
        this.payment(0, { print: false });
      }
    }
    return result;
  }

  renderTitle(data: CommercePosOrderModel) {
    return `QRCode_Kho_Ngan_Ke_${this.getIdentified(data).join('-')}` + (data.DateOfDelivered ? ('_' + this.datePipe.transform(data.DateOfDelivered, 'short')) : '');
  }

  close() {
    super.close();
    // this.ref.close();
  }

  renderValue(value: any) {
    if (value && value['text']) {
      return value['text'];
    }
    return value;
  }

  toMoney(detail: WarehouseGoodsDeliveryNoteDetailModel) {
    if (detail.Type === 'PRODUCT') {
      let toMoney = detail['Quantity'] * detail['Price'];
      detail.Tax = typeof detail.Tax === 'string' ? (this.cms.taxList?.find(f => f.Code === detail.Tax) as any) : detail.Tax;
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

  getTotal() {
    let total = 0;
    // const details = this.data.Details;
    // for (let i = 0; i < details.length; i++) {
    //   total += this.toMoney(details[i]);
    // }
    return total;
  }

  saveAndClose() {
    if (this.onSaveAndClose) {
      // this.onSaveAndClose(this.data.Code);
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

  async getFormData(ids: string[]) {
    return this.apiService.getPromise<WarehouseGoodsContainerModel[]>(this.apiPath, {
      includeWarehouse: true,
      renderBarCode: true,
      includeGroups: true,
      includeUnit: true,
      includeFeaturePicture: true,
      group_Unit: true,
      includeContainers: true,
      id: this.id,
      limit: 'nolimit',
      includeDetails: true, includeObject: true, includeRelativeVouchers: true
    }).then(rs => {
      return rs;
    });
  }


  getItemDescription(item: WarehouseGoodsDeliveryNoteModel) {
    return item?.Description;
  }

  summaryCalculate(data: CommercePosOrderModel[]) {
    if (data) {
      for (const item of data) {
        if (item.Details) {
          let total = 0;
          for (const detail of item.Details) {
            detail['ToMoney'] = (detail.Quantity * detail.Price);
            total += detail['ToMoney'];
          }
          item['Total'] = total;
        }
        item['Debit'] = (item.Amount - item.DecreaseForTotal) - (item.CashAmount + item.CashTransferAmount);
        item['Credit'] =  (item.CashAmount + item.CashTransferAmount) - (item.Amount - item.DecreaseForTotal) - item.CashBack;
      }
    }
  }

  isProcessing = false;
  payment(index: number, option?: { print: boolean }) {
    const params: any = { payment: true, includeRelativeVouchers: true, includeObject: true };
    let order = this.data[index];
    if (order) {
      // order.State = 'APPROVED';
      if (order.Code) {
        // params['id0'] = order.Code;
        this.isProcessing = true;
        this.apiService.putPromise('/commerce-pos/orders/' + order.Code, params, [order]).then(rs => {
          order = this.data[index] = rs[0];
          setTimeout(async () => {
            if (option?.print) {
              await this.print(index, this.printType);
            }
            if (this.onSaveAndClose) this.onSaveAndClose(order, this);
          });
          this.isProcessing = false;
        }).catch(err => {
          this.isProcessing = false;
          return Promise.reject(err);
        });
      } else {
        this.isProcessing = true;
        this.apiService.postPromise('/commerce-pos/orders', params, [order]).then(rs => {
          this.id = [rs[0].Code];
          order = this.data[index] = rs[0];
          setTimeout(async () => {
            // await this.print(index);
            if (option?.print) {
              await this.print(index, this.printType);
            }
            if (this.onSaveAndClose) this.onSaveAndClose(order, this);
          }, 300);
          this.isProcessing = false;
        }).catch(err => {
          this.isProcessing = false;
          return Promise.reject(err);
        });

      }
    }
  }

  saveAndPrint(index: number, option?: { print: boolean }) {
    const params: any = { changeState: 'PRICEREPORT', includeRelativeVouchers: true, includeObject: true };
    let order = this.data[index];
    if (order) {
      // order.State = 'APPROVED';
      if (order.Code) {
        // params['id0'] = order.Code;
        this.isProcessing = true;
        this.apiService.putPromise('/commerce-pos/orders/' + order.Code, params, [order]).then(rs => {
          order = this.data[index] = rs[0];
          setTimeout(async () => {
            if (option?.print) {
              await this.print(index, this.printType);
            }
            if (this.onSaveAndClose) this.onSaveAndClose(order, this);
          });
          this.isProcessing = false;
        }).catch(err => {
          this.isProcessing = false;
          return Promise.reject(err);
        });
      } else {
        this.isProcessing = true;
        this.apiService.postPromise('/commerce-pos/orders', params, [order]).then(rs => {
          this.id = [rs[0].Code];
          order = this.data[index] = rs[0];
          setTimeout(async () => {
            // await this.print(index);
            if (option?.print) {
              await this.print(index, this.printType);
            }
            if (this.onSaveAndClose) this.onSaveAndClose(order, this);
          }, 300);
          this.isProcessing = false;
        }).catch(err => {
          this.isProcessing = false;
          return Promise.reject(err);
        });

      }
    }
  }

  onKeyboardEvent(event: KeyboardEvent) {
    if (event.key == 'F9') {

      if (!this.instantPayment) {
        if (this.cms.getObjectId(this.data[0].State) == 'APPROVED') {
          this.print(0, 'RETAILINVOICE');
        } else {
          this.payment(0);
        }
      } else {
        if (this.cms.getObjectId(this.data[0].State) == 'APPROVED' || this.cms.getObjectId(this.data[0].State) == 'PRICEREPORT') {
          this.print(0, 'RETAILINVOICE').then(() => {
            this.close();
          });
        } else {
          this.cms.toastService.show('Bạn vui lòng chờ cho hệ thống xử lý xong đơn hàng này !', 'Chưa thể in bill !', { status: 'warning' });
        }
      }
      return false;
    }
    if (event.key == 'Enter') {

      if (!this.instantPayment) {
        if (this.cms.getObjectId(this.data[0].State) == 'APPROVED' || this.cms.getObjectId(this.data[0].State) == 'PRICEREPORT') {
          this.print(0, 'PRICEREPORT');
        } else {
          this.payment(0);
        }
      } else {
        if (this.cms.getObjectId(this.data[0].State) == 'APPROVED' || this.cms.getObjectId(this.data[0].State) == 'PRICEREPORT') {
          this.print(0, 'PRICEREPORT').then(() => {
            this.close();
          });
        } else {
          this.cms.toastService.show('Bạn vui lòng chờ cho hệ thống xử lý xong đơn hàng này !', 'Chưa thể in bill !', { status: 'warning' });
        }
      }
      return false;
    }
    return true;
  }

  async print(index?: number, voucherType?: string) {
    // if (voucherType == 'PRICEREPORT') {
    if (this.cms.getObjectId(this.data[0].State) == 'PRICEREPORT') {
      this.title = 'PHIẾU BÁO GIÁ';
    // } else if (voucherType == 'RETAILINVOICE') {
    } else if (this.cms.getObjectId(this.data[0].State) == 'APPROVED' ) {
      this.title = 'HÓA ĐƠN BÁN LẺ';
    }
    await new Promise(resolve => setTimeout(() => resolve(true), 300));
    return super.print(index);
  }

}
