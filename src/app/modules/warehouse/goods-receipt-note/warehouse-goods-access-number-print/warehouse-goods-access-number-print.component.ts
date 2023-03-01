import { takeUntil, filter } from 'rxjs/operators';
import { FormControl, FormBuilder, FormArray } from '@angular/forms';
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
import { ActionControlListOption } from '../../../../lib/custom-element/action-control-list/action-control.interface';
import { of } from 'rxjs';

@Component({
  selector: 'ngx-warehouse-goods-access-number-print',
  templateUrl: './warehouse-goods-access-number-print.component.html',
  styleUrls: ['./warehouse-goods-access-number-print.component.css'],
})
export class WarehouseGoodsReceiptNoteDetailAccessNumberPrintComponent extends DataManagerPrintComponent<any> implements OnInit {

  /** Component name */
  componentName = 'WarehouseGoodsReceiptNoteDetailAccessNumberPrintComponent';
  title: string = 'BarCode hàng hóa';
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
  .blabel {
    border: 1px #000 dashed;
    float: left;
    page-break-after: always;
    height: 30mm;
    width: 50mm;
    color: #000;
    font-weight: normal;
    overflow: hidden;
    padding: 1mm;
  }
  .blabel .info {
    clear: both;
    overflow: hidden;
    line-height: 2.2mm;
    font-size: 2.2mm !important;
    font-weight: normal;
    max-height: 6.7mm;
    margin-top: 0.4mm;
    margin-bottom: 0.4mm;
  }
  .blabel .probox-link {
    clear: both;
    overflow: hidden;
    line-height: 2.2mm;
    font-size: 2.2mm !important;
    font-weight: normal;
    max-height: 6.7mm;
    margin-top: 0.4mm;
    margin-bottom: 0.4mm;
    word-break: break-all;
    inline-size: 170px;
  }
  .blabel .register-info {
    line-height: 1.8mm;
    font-size: 1.9mm !important;
    font-weight: bold;
  }
  .blabel .access-number {
    line-height: 2.2mm;
    font-size: 2.2mm !important;
    font-weight: normal;
    margin-bottom: 0.5mm;
    padding-top: 0.7mm;
  }
  .blabel .find-order {
    line-height: 22px;
  }
  .blabel .product-price {
    line-height: 2.2mm;
    font-size: 2.2mm !important;
    font-weight: bold;
    margin-bottom: 0.5mm;
    padding-top: 0.7mm;
  }
  .blabel .sku {
    line-height: 1.8mm;
    font-size: 2mm !important;
    font-weight: normal;
    white-space: nowrap;
  }
  .bar-code {
    height: 3.7mm;
  }
  .qr-code img {
    height: 9mm;
    width: 9mm;
  }
  .page-break {
    clear: left;
    display: block;
    page-break-after: always;
  }
  
  /** reset */
  .blabel {
    border: none;
    width: inherit;
    height: 25mm;
    width: 46mm;
    margin: 2mm;
    padding: 0mm;
  }
  .print-choosed {
    display: none;
  }
  `;

  registerInfo: any;
  choosedForms = this.formBuilder.array([]);

  constructor(
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref: NbDialogRef<WarehouseGoodsReceiptNoteDetailAccessNumberPrintComponent>,
    public datePipe: DatePipe,
    public formBuilder?: FormBuilder,
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

    const printActionButton = this.actionButtonList.find(f => f.name == 'print');
    if (printActionButton) {
      printActionButton.click = (event?: any, option?: ActionControlListOption) => {
        this.print(option?.index);
      };
    }

    this.actionButtonList.unshift({
      name: 'choosedtoogle',
      label: 'Chọn/bỏ chọn',
      status: 'info',
      title: 'Chọn/bỏ chọn tất cả',
      type: 'button',
      icon: 'checkmark-square-outline',
      click: () => {
        if (this.choosedForms.controls.length == this.choosedForms.controls.filter(f => f.get('Choosed').value).length) {
          for (const itemControl of this.choosedForms.controls) {
            itemControl.get('Choosed').setValue(false);
          }
        } else {

          for (const itemControl of this.choosedForms.controls) {
            itemControl.get('Choosed').setValue(true);
          }
        }
      },
      size: 'medium'
    });


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
    const params: any = {};
    if (this.voucher) {
      params.eq_Voucher = this.voucher;
    } else if (this.id) {
      params.id = this.id;
    }
    let rs;
    if (this.data) {
      rs = this.data;
    } else {
      rs = await this.apiService.getPromise<WarehouseGoodsReceiptNoteDetailAccessNumberModel[]>(this.apiPath, {
        includeWarehouse: true,
        includeContainer: true,
        includeProduct: true,
        includeUnit: true,
        // renderBarCode: true,
        // renderQrCode: true,
        includePrice: true,
        // eq_Type: this.printForType,
        // id: this.id,
        // eq_Voucher: this.voucher,
        sort_No: 'asc',
        sort_AccessNumberNo: 'asc',
        limit: 'nolimit',
        ...params
      }).then(rs => {
        return rs;
      });
    }
    this.choosedForms.controls = [];
    for (const item of rs) {
      const formData = {};
      // item['Price'] = item['Price'] && (parseInt(item['Price']) / 1000) || null as any;
      for (const field of Object.keys(item)) {
        formData[field] = [item[field]];
      }
      const checkbox = this.formBuilder.group({
        'Choosed': [true],
        ...formData,
      });
      this.choosedForms.push(checkbox);

      checkbox.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
        console.log(value);
      });
    }
    return rs;
  }


  getItemDescription(item: WarehouseGoodsDeliveryNoteModel) {
    return item?.Description;
  }

  async print(index?: number) {
    const oldLength = this.choosedForms.controls.length;
    const currentForm = this.choosedForms.controls;
    this.choosedForms.controls = this.choosedForms.controls.filter(f => f.value?.Choosed);
    if (this.choosedForms.controls.length === 0) {
      this.commonService.toastService.show('Không có tem nào được chọn !', 'In barcode', { status: 'warning' })
      this.choosedForms.controls = [...currentForm];
    } else {
      if (oldLength != this.choosedForms.controls.length) {
        setTimeout(() => {
          super.print();
        }, 1000);
      } else {
        super.print();
      }
    }
    return true;
  }

}
