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
  selector: 'ngx-master-price-table-qrcode-print',
  templateUrl: './master-price-table-qrcode-print.component.html',
  styleUrls: ['./master-price-table-qrcode-print.component.css'],
})
export class MasterPriceTableQrCodePrintComponent extends DataManagerPrintComponent<any> implements OnInit {

  /** Component name */
  componentName = 'MasterPriceTableQrCodePrintComponent';
  title: string = 'QRCode hàng hóa ';
  env = environment;
  apiPath = '/sales/master-price-table-details';
  processMapList: ProcessMap[] = [];
  idKey: ['Code', 'WarehouseUnit'];
  // formDialog = WarehouseGoodsFormComponent;

  @Input() printForType: string;
  @Input() priceTable: string;

  style = /*css*/`
    #print-area {
      display: flex;
      flex-wrap: wrap;
    }
    .goods-container-label {
    }
    .goods-container-label .wrap {
      display: flex;
      border: 1px solid;
      overflow: hidden;
      border-radius: 5px;
      margin: 3px;
      align-items: flex-start;
    }
    .goods-container-label .wrap .qr-code {
      min-width: 80px;
      min-height: 80px;
      object-fit: contain;
    }
    .goods-container-label .wrap .info {
      margin: 3px;
    }
    .print-voucher-detail-table tr td {
      border: none;
    }

    #print-area .print-voucher-detail-line td {
      padding-top: 0px;
      padding-bottom: 0px;
    }
    
    #print-area .print-voucher-detail-line td, #print-area .print-voucher-detail-header td {
      padding-left: 0px;
      padding-right: 0px;
    }
  `;

  constructor(
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref: NbDialogRef<MasterPriceTableQrCodePrintComponent>,
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
      renderQrCode: true,
      masterPriceTable: this.priceTable,
      includeGroups: true,
      includeUnit: true,
      includeFeaturePicture: true,
      group_Unit: true,
      // eq_Type: this.printForType,
      includeContainers: true,
      id: this.id,
      limit: 'nolimit'
    }).then(rs => {
      rs.map(item => {
        // if (item.Path) {
        //   const parts = item.Path.split('/');
        //   parts.shift();
        //   item.Path = parts.join('/');
        // }
        return item;
      });
      const table = [];
      let row = [];
      for (let i = 0; i < rs.length; i++) {
        row.push(rs[i]);
        if ((i + 1) % 4 === 0) {
          table.push(row);
          row = [];
        }
      }
      if (row && row.length > 0) {
        table.push(row);
      }
      return table;
    });
  }


  getItemDescription(item: WarehouseGoodsDeliveryNoteModel) {
    return item?.Description;
  }

}
