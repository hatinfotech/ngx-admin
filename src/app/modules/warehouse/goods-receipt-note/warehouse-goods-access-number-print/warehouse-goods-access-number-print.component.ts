import { WarehouseGoodsReceiptNoteDetailAccessNumberModel } from './../../../../models/warehouse.model';
import { WarehouseGoodsContainerModel } from '../../../../models/warehouse.model';
import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { environment } from '../../../../../environments/environment';
import { DataManagerPrintComponent } from '../../../../lib/data-manager/data-manager-print.component';
import { ProcessMap } from '../../../../models/process-map.model';
import { WarehouseGoodsDeliveryNoteModel, WarehouseGoodsDeliveryNoteDetailModel } from '../../../../models/warehouse.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { AnyTxtRecord } from 'dns';

@Component({
  selector: 'ngx-warehouse-goods-access-number-print',
  templateUrl: './warehouse-goods-access-number-print.component.html',
  styleUrls: ['./warehouse-goods-access-number-print.component.css'],
})
export class WarehouseGoodsReceiptNoteDetailAccessNumberPrintComponent extends DataManagerPrintComponent<any> implements OnInit {

  /** Component name */
  componentName = 'WarehouseGoodsReceiptNoteDetailAccessNumberPrintComponent';
  title: string = 'QRCode chỗ chứa hàng hóa ';
  env = environment;
  apiPath = '/warehouse/goods-receipt-note-detail-access-numbers';
  processMapList: ProcessMap[] = [];
  idKey: ['Code'];
  // formDialog = WarehouseGoodsContainerFormComponent;

  @Input() printForType: string;
  @Input() voucher: string;

  style = /*css*/`
  body {
    margin: 0;
  }
  @media print {
    body {
      background: #fff !important;
    }
    #print-area {
      page-break-after: initial;
    }
  }
  .label {
    float: left;
    page-break-after: always;
    width: 50mm;
    height: 30mm;
    padding: 1mm;
    padding-top: 1mm;
    color: #000;
    font-weight: normal;
  }
  .label .info {
    clear: both;
    overflow: hidden;
    line-height: 2.3mm;
    font-size: 2.3mm !important;
    font-weight: normal;
    max-height: 6.7mm;
  }
  .label .register-info {
    line-height: 2.3mm;
    font-size: 2.3mm !important;
    font-weight: bold;
  }
  .label .access-number {
    font-size: 3mm !important;
    line-height: 3mm;
    font-weight: normal;
  }
  .label .find-order {
    line-height: 22px;
  }
  .label .sku {
    line-height: 2.3mm;
    font-size: 2.3mm !important;
    font-weight: normal;
    white-space: nowrap;
  }
  .bar-code {
    padding: 1px;
    margin-right: 1mm;
    height: 4.5mm;
    width: 100%;
  }
  .qr-code {
    width: 1.35cm;
    height: 1.35cm;
  }
  .page-break {
    clear: left;
    display:block;
    page-break-after:always;
  }
  `;

  registerInfo: any;

  constructor(
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref: NbDialogRef<WarehouseGoodsReceiptNoteDetailAccessNumberPrintComponent>,
    public datePipe: DatePipe,
  ) {
    super(commonService, router, apiService, ref);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
    this.commonService.systemConfigs$.subscribe(registerInfo => {
      this.registerInfo = registerInfo.LICENSE_INFO.register;
    });
  }

  async init() {
    const result = await super.init();
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

  renderTitle(data: WarehouseGoodsDeliveryNoteModel) {
    return `BarCode_Goods_Access_Number_` + new Date().toLocaleDateString();
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
    return this.apiService.getPromise<WarehouseGoodsReceiptNoteDetailAccessNumberModel[]>(this.apiPath, {
      includeWarehouse: true,
      includeContainer: true,
      includeProduct: true,
      includeUnit: true,
      renderBarCode: true,
      renderQrCode: true,
      // eq_Type: this.printForType,
      // id: this.id,
      eq_Voucher: this.voucher,
      limit: 'nolimit'
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

}
