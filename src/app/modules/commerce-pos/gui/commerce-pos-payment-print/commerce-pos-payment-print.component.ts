import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
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

@Component({
  selector: 'ngx-commerce-pos-payment-print',
  templateUrl: './commerce-pos-payment-print.component.html',
  styleUrls: ['./commerce-pos-payment-print.component.css'],
})
export class CommercePosPaymnentPrintComponent extends DataManagerPrintComponent<any> implements OnInit {

  /** Component name */
  componentName = 'CommercePosPaymnentPrintComponent';
  title: string = 'In bill';
  env = environment;
  apiPath = '/warehouse/find-order-tems';
  processMapList: ProcessMap[] = [];
  idKey: ['Code', 'WarehouseUnit', 'Container'];
  // formDialog = WarehouseGoodsFormComponent;

  @Input() skipPreview: boolean;
  @Input() order: CommercePosOrderModel;

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
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref: NbDialogRef<CommercePosPaymnentPrintComponent>,
    public datePipe: DatePipe,
  ) {
    super(commonService, router, apiService, ref);
    this.commonService.systemConfigs$.subscribe(registerInfo => {
      this.registerInfo = registerInfo.LICENSE_INFO.register;
    });
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init() {
    const result = await super.init().then(rs => {
      const printActionButn = this.actionButtonList.find(f => f.name == 'print');
      if (printActionButn) {
        printActionButn.disabled = (option) => {
          return this.data[0].State != 'APPROVED';
        };
      }
      return rs;
    });
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
      detail.Tax = typeof detail.Tax === 'string' ? (this.commonService.taxList?.find(f => f.Code === detail.Tax) as any) : detail.Tax;
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
      // masterPriceTable: this.priceTable,
      includeGroups: true,
      includeUnit: true,
      includeFeaturePicture: true,
      group_Unit: true,
      // eq_Type: this.printForType,
      includeContainers: true,
      id: this.id,
      limit: 'nolimit',
      // eq_Product: this.product,
      // eq_WarehouseUnit: this.unit,
      // eq_Container: this.container,
    }).then(rs => {
      // rs.map(item => {
      //   if (item.Path) {
      //     const parts = item.Path.split('/');
      //     parts.shift();
      //     item.Path = parts.join('/');
      //   }
      //   return item;
      // });
      // const table = [];
      // let row = [];
      // for (let i = 0; i < rs.length; i++) {
      //   row.push(rs[i]);
      //   if ((i+1) % 4 === 0) {
      //     table.push(row);
      //     row = [];
      //   }
      // }
      // return table;
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
            total += detail['Amount'];
          }
          item['Total'] = total;
        }
      }
    }
  }

  approve(index: number) {
    const params: any = { payment: true };
    let returnsPayment = this.data[index];
    if (returnsPayment) {
      returnsPayment.State = 'APPROVED';
      if (returnsPayment.Code) {
        // params['id0'] = order.Code;
        this.apiService.putPromise('/commerce-pos/cash-vouchers/' + returnsPayment.Code, params, [returnsPayment]).then(rs => {
          returnsPayment = this.data[index] = rs[0];
          setTimeout(async () => {
            await this.print(index);
            this.onSaveAndClose(returnsPayment, this);
          });
        });
      } else {
        this.apiService.postPromise('/commerce-pos/cash-vouchers', params, [returnsPayment]).then(rs => {
          this.id = [rs[0].Code];
          returnsPayment = this.data[index] = rs[0];
          setTimeout(async () => {
            await this.print(index);
            if (this.onSaveAndClose) this.onSaveAndClose(returnsPayment, this);
          }, 300);
        });

      }
    }
  }

}
