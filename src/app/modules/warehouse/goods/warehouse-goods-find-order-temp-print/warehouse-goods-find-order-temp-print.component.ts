import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { environment } from '../../../../../environments/environment.prod';
import { DataManagerPrintComponent } from '../../../../lib/data-manager/data-manager-print.component';
import { ProcessMap } from '../../../../models/process-map.model';
import { WarehouseGoodsDeliveryNoteModel, WarehouseGoodsDeliveryNoteDetailModel, WarehouseGoodsContainerModel } from '../../../../models/warehouse.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'ngx-warehouse-goods-find-order-temp-print',
  templateUrl: './warehouse-goods-find-order-temp-print.component.html',
  styleUrls: ['./warehouse-goods-find-order-temp-print.component.css'],
})
export class WarehouseGoodsFindOrderTempPrintComponent extends DataManagerPrintComponent<any> implements OnInit {

  /** Component name */
  componentName = 'WarehouseGoodsFindOrderTempPrintComponentZ';
  title: string = 'In Tem nhận thức';
  env = environment;
  apiPath = '/warehouse/find-order-tems';
  processMapList: ProcessMap[] = [];
  idKey: ['Code', 'WarehouseUnit', 'Container'];
  // formDialog = WarehouseGoodsFormComponent;

  @Input() printForType: string;
  @Input() priceTable: string;
  @Input() product: string;
  @Input() unit: string;
  @Input() container: string;

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
  float: left;
  page-break-after: always;
  border: 1px #000 dashed;
  float: left;
  page-break-after: always;
  width: 50mm;
  height: 30mm;
  padding: 1mm;
  padding-top: 2mm;
  color: #000;
}
.blabel .find-order {
  font-weight: bold;
  font-size: 7mm !important;
  line-height: 7mm;
  margin-right: 1mm;
}
.blabel .bar-code {
  height: 4.5mm;
}
.blabel .product-name {
  font-weight: bold;
  font-size: 3.4mm !important;
  line-height: 3.4mm;
  max-height: 10mm;
  overflow: hidden;
  padding-top: 1.1mm;
}
.blabel .product-price {
  font-weight: bold !important;
  font-size: 3.5mm !important;
  line-height: 4mm;
}
.blabel .product-sku {
  font-size: 2.6mm !important;
  line-height: 3mm;
}
.blabel .product-id {
  font-size: 2.6mm !important;
  line-height: 3mm;
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
    public cms: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref: NbDialogRef<WarehouseGoodsFindOrderTempPrintComponent>,
    public datePipe: DatePipe,
  ) {
    super(cms, router, apiService, ref);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
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
      masterPriceTable: this.priceTable,
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

}
