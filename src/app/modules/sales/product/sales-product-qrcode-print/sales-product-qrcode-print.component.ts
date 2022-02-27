import { WarehouseGoodsContainerModel } from '../../../../models/warehouse.model';
import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { environment } from '../../../../../environments/environment';
import { AppModule } from '../../../../app.module';
import { DataManagerPrintComponent } from '../../../../lib/data-manager/data-manager-print.component';
import { ProcessMap } from '../../../../models/process-map.model';
import { WarehouseGoodsDeliveryNoteModel, WarehouseGoodsDeliveryNoteDetailModel } from '../../../../models/warehouse.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { trim } from 'jquery';

@Component({
  selector: 'ngx-sales-product-qrcode-print',
  templateUrl: './sales-product-qrcode-print.component.html',
  styleUrls: ['./sales-product-qrcode-print.component.css'],
})
export class SalesProductQrCodePrintComponent extends DataManagerPrintComponent<any> implements OnInit {

  /** Component name */
  componentName = 'WarehouseGoodsContainerPrintComponent';
  title: string = 'QRCode chỗ chứa hàng hóa ';
  env = environment;
  apiPath = '/sales/master-price-table-details';
  processMapList: ProcessMap[] = [];
  idKey: ['Product', 'Unit'];
  // formDialog = WarehouseGoodsContainerFormComponent;

  @Input() printForType: string;

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
  .blabel {
    /* padding: 5px; */
    border: 1px #000 dashed;
    float: left;
    page-break-after: always;
    width: 50mm;
    height: 30mm;
    padding: 1mm;
    padding-top: 2mm;
    color: #000;
    font-size: 2mm !important;
    overflow: hidden;
  }
  .blabel .info {
    clear: both;
    font-size: 2.8mm !important;
    height: 8.9mm;
    line-height: 3mm;
    overflow: hidden;
  }
  .blabel .price {
    font-weight: bold !important;
    font-size: 5.2mm !important;
    line-height: 6mm;
  }
  .blabel .unit {
    line-height: 2.5mm;
    font-size: 2.5mm;
  }
  .blabel .find-order {
    clear: both;
    font-size: 3mm !important;
    height: 3mm;
    line-height: 3mm;
    overflow: hidden;
    font-weight: bold;
  }
  .blabel .location {
    font-weight: bold;
    font-size: 3mm !important;
    height: 4.2mm;
    overflow: hidden;
    width: 29mm;
    padding: 0;
  }
  .bar-code {
    padding: 1px;
    margin-right: 1mm;
    height: 14mm;
  }
  .qr-code {
    padding: 1px;
    margin-right: 1mm;
    height: 13mm;
  }
  .page-break {
    clear: left;
    display: block;
    page-break-after: always;
  }

  /** Override */
  .blabel {
    border: none;
    width: inherit;
    height: 25mm;
    width: 46mm;
    margin: 2mm;
    padding: 0mm;
  }
  
  `;

  constructor(
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref: NbDialogRef<SalesProductQrCodePrintComponent>,
    public datePipe: DatePipe,
  ) {
    super(commonService, router, apiService, ref);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit(); ``
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
    return `QRCode_Kho_Ngan_Ke_${this.getIdentified(data).join('-')}` + (data.DateOfDelivered ? ('_' + this.datePipe.transform(data.DateOfDelivered, 'short')) : '');
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
    return this.apiService.getPromise<WarehouseGoodsContainerModel[]>(this.apiPath, {
      includeWarehouse: true,
      masterPriceTable: 'default',
      includeGoodsInContainer: true,
      renderQrCode: true,

      // masterPriceTable: 'default',
      includeCategories: true,
      includeGroups: true,
      includeUnit: true,
      includeFeaturePicture: true,
      group_Unit: true,
      includeContainers: true,
      includeShelf: true,


      // renderBarCode: true,
      // eq_Type: this.printForType,
      id: this.id,
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
      return rs.map(item => {
        // if (item['Goods'] && item['Goods'].length > 0) {
        //   item['Sku'] = item['Goods'][0]['Sku'];

        // }
        if (item['Containers'] && item['Containers'].length > 0) {
          const container = item['Containers'][0];
          item.FindOrder = container['ContainerFindOrder'];
          item['Shelf'] = container['Shelf']['Name'];
          item['Warehouse'] = {
            id: container['Warehouse'],
            text: container['WarehouseName']
          } as any;
        }
        return item;
      });
    });
  }


  getItemDescription(item: WarehouseGoodsDeliveryNoteModel) {
    return item?.Description;
  }

}
