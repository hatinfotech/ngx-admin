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
import { WarehouseGoodsContainerFormComponent } from '../../goods-container/warehouse-goods-container-form/warehouse-goods-container-form.component';
import { WarehouseGoodsContainerPrintComponent } from '../../goods-container/warehouse-goods-container-print/warehouse-goods-container-print.component';
import { WarehouseGoodsFormComponent } from '../warehouse-goods-form/warehouse-goods-form.component';
import { RootServices } from '../../../../services/root.services';

@Component({
  selector: 'ngx-warehouse-goods-print',
  templateUrl: './warehouse-goods-print.component.html',
  styleUrls: ['./warehouse-goods-print.component.css'],
})
export class WarehouseGoodsPrintComponent extends DataManagerPrintComponent<any> implements OnInit {

  /** Component name */
  componentName = 'WarehouseGoodsPrintComponent';
  title: string = 'QRCode hàng hóa ';
  env = environment;
  apiPath = '/warehouse/goods';
  processMapList: ProcessMap[] = [];
  idKey: ['Code', 'WarehouseUnit'];
  formDialog = WarehouseGoodsFormComponent;

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
  .label {
    padding: 2px;
    page-break-after:always;
    padding: 1mm;
    padding-top: 2mm;
    color: #000;
  }
  .label .info {
    clear: both;
    height: 13mm;
    overflow: hidden;
  }
  .label .find-order {
    font-weight: bold !important;
    font-size: 44px !important;
    line-height: 12mm;
  }
  .bar-code {
    padding: 1px;
    border: 1px #000 solid;
    border-radius: 5px;
    margin-right: 1mm;
    height: 12mm;
  }
  .page-break {
    clear: left;
    display:block;
    page-break-after:always;
  }
  `;

  constructor(
    public rsv: RootServices,
    public cms: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref: NbDialogRef<WarehouseGoodsPrintComponent>,
    public datePipe: DatePipe,
  ) {
    super(rsv, cms, router, apiService, ref);
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
    return `QRCode_Hang_Hoa_${this.getIdentified(data).join('-')}` + (data.DateOfDelivered ? ('_' + this.datePipe.transform(data.DateOfDelivered, 'short')) : '');
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
      // includeWarehouse: true,
      includeUnit: true,
      renderQrCode: true,
      includeCategories: true,
      // includeFeaturePicture: true,
      includeContainer: true,
      // includeInventory: true,
      // eq_Type: this.printForType,
      id: this.id,
      limit: 'nolimit'
    }).then(rs => {
      // rs.map(item => {
      //   // if (item.Path) {
      //   //   const parts = item.Path.split('/');
      //   //   parts.shift();
      //   //   item.Path = parts.join('/');
      //   // }
      //   return item;
      // });
      // const table = [];
      // let row = [];
      // for (let i = 0; i < rs.length; i++) {
      //   row.push(rs[i]);
      //   if ((i + 1) % 4 === 0) {
      //     table.push(row);
      //     row = [];
      //   }
      // }
      // if (row && row.length > 0) {
      //   table.push(row);
      // }
      // return table;
      return rs;
    });
  }


  getItemDescription(item: WarehouseGoodsDeliveryNoteModel) {
    return item?.Description;
  }

}
