import { ProductionOrderFormComponent } from '../production-order-form/production-order-form.component';
import { ProductionOrderModel } from '../../../../models/warehouse.model';
import { Component, OnInit } from '@angular/core';
import { DataManagerPrintComponent } from '../../../../lib/data-manager/data-manager-print.component';
import { ProductionOrderFinishedGoodsModel } from '../../../../models/warehouse.model';
import { environment } from '../../../../../environments/environment';
import { CommonService } from '../../../../services/common.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { NbDialogRef } from '@nebular/theme';
import { DatePipe } from '@angular/common';
import { ProcessMap } from '../../../../models/process-map.model';
import { AppModule } from '../../../../app.module';
// import { AppModule } from '../../warehouse.module';
import { WarehouseGoodsFindOrderTempPrintComponent } from '../../goods/warehouse-goods-find-order-temp-print/warehouse-goods-find-order-temp-print.component';
import { RootServices } from '../../../../services/root.services';

@Component({
  selector: 'ngx-production-order-print',
  templateUrl: './production-order-print.component.html',
  styleUrls: ['./production-order-print.component.scss'],
})
export class ProductionOrderPrintComponent extends DataManagerPrintComponent<ProductionOrderModel> implements OnInit {

  /** Component name */
  componentName = 'ProductionOrderPrintComponent';
  title: string = '';
  env = environment;
  apiPath = '/warehouse/production-orders';
  processMapList: ProcessMap[] = [];
  formDialog = ProductionOrderFormComponent;

  constructor(
    public rsv: RootServices,
    public cms: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref: NbDialogRef<ProductionOrderPrintComponent>,
    public datePipe: DatePipe,
  ) {
    super(rsv, cms, router, apiService, ref);
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
    //   this.setDetailsNo(data?.Details, (detail: ProductionOrderFinishedGoodsModel) => detail.Type === 'PRODUCT');
    //   data['Total'] = 0;
    //   data['Title'] = this.renderTitle(data);
    //   for (const detail of data.Details) {
    //     data['Total'] += detail['ToMoney'] = this.toMoney(detail);
    //   }
    //   this.processMapList[i] = AppModule.processMaps.warehouseReceiptGoodsNote[data.State || ''];
    // }
    this.actionButtonList.unshift({
      name: 'print-access-numbers',
      status: 'danger',
      label: this.cms.textTransform(this.cms.translate.instant('Common.printBarCode'), 'head-title'),
      icon: 'grid-outline',
      title: this.cms.textTransform(this.cms.translate.instant('In mã vạch cho hàng hóa quản lý bằng số truy xuất'), 'head-title'),
      size: 'medium',
      disabled: () => {
        return false;
      },
      click: (event: any, option: any) => {
        const item = this.data[option.index];


        const productList = item.Details.filter(f => this.cms.getObjectId(f.Type) != 'CATEGORY').map(m => ({ id: m.Product.id + '/' + m.Product.Sku + ': ' + this.cms.getObjectId(m.Product) + '-' + this.cms.getObjectId(m.Unit), text: m.Description + ' (' + this.cms.getObjectText(m.Unit) + ')', ...m }));

        // this.cms.openDialog(ProductionOrderDetailAccessNumberPrintComponent, {
        //   context: {
        //     voucher: item.Code,
        //     id: ['xxx'],
        //     productList,
        //   }
        // });
        return false;
      },
    });
    this.summaryCalculate(this.data);

    return result;
  }

  renderTitle(data: ProductionOrderModel) {
    return `Phieu_Nhap_Kho_${this.getIdentified(data).join('-')}` + (data.DateOfReceipted ? ('_' + this.datePipe.transform(data.DateOfReceipted, 'short')) : '');
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

  toMoney(detail: ProductionOrderFinishedGoodsModel) {
    // if (detail.Type === 'PRODUCT') {
    //   let toMoney = detail['Quantity'] * detail['Price'];
    //   detail.Tax = typeof detail.Tax === 'string' ? (this.cms.taxList?.find(f => f.Code === detail.Tax) as any) : detail.Tax;
    //   if (detail.Tax) {
    //     if (typeof detail.Tax.Tax == 'undefined') {
    //       throw Error('tax not as tax model');
    //     }
    //     toMoney += toMoney * detail.Tax.Tax / 100;
    //   }
    //   return toMoney;
    // }
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
    return this.apiService.getPromise<ProductionOrderModel[]>(this.apiPath, {
      id: ids,
      includeContact: true,
      includeDetails: true,
      includeRelativeVouchers: true,
      includeAccessNumbers: true,
      detailIncludeShelf: true,
      detailRenderFindOrderLabel: true,
      detailIncludeContainer: true,
    }).then(rs => {
      if (rs[0] && rs[0].Details) {
        this.setDetailsNo(rs[0].Details, (detail: ProductionOrderFinishedGoodsModel) => detail.Type === 'PRODUCT');
        // let no = 1;
        // for (const detail of rs[0].Details) {
        //   if (detail.Type === 'PRODUCT') {
        //     detail.No = no++;
        //   }
        // }
      }
      this.summaryCalculate(rs);
      return rs;
    });
  }

  approvedConfirm(data: ProductionOrderModel, index: number) {
    // if (['BOOKKEEPING'].indexOf(data.State) > -1) {
    //   this.cms.showDiaplog(this.cms.translateText('Common.approved'), this.cms.translateText('Common.completedAlert', { object: this.cms.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
    //     {
    //       label: this.cms.translateText('Common.close'),
    //       status: 'success',
    //       action: () => {
    //         this.onClose(data);
    //       },
    //     },
    //   ]);
    //   return;
    // }
    const params = { id: [data.Code] };
    const processMap = AppModule.processMaps.warehouseReceiptGoodsNote[data.State || ''];
    params['changeState'] = this.processMapList[index]?.nextState;
    // let confirmText = '';
    // let responseText = '';
    // switch (data.State) {
    //   case 'APPROVE':
    //     params['changeState'] = 'COMPLETE';
    //     confirmText = 'Common.completeConfirm';
    //     responseText = 'Common.completeSuccess';
    //     break;
    //   default:
    //     params['changeState'] = 'APPROVE';
    //     confirmText = 'Common.approvedConfirm';
    //     responseText = 'Common.approvedSuccess';
    //     break;
    // }

    this.cms.showDialog(this.cms.translateText('Common.confirm'), this.cms.translateText(processMap?.confirmText, { object: this.cms.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
      {
        label: this.cms.translateText('Common.cancel'),
        status: 'primary',
        action: () => {

        },
      },
      {
        label: this.cms.translateText(this.processMapList[index].nextStateLabel),
        status: 'danger',
        action: () => {
          this.loading = true;
          this.apiService.putPromise<ProductionOrderModel[]>(this.apiPath, params, [{ Code: data.Code }]).then(rs => {
            this.loading = false;
            this.onChange && this.onChange(data);
            this.onClose && this.onClose(data);
            this.close();
            this.cms.toastService.show(this.cms.translateText(processMap?.responseText, { object: this.cms.translateText('Purchase.PrucaseVoucher.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), this.cms.translateText(processMap?.responseTitle), {
              status: 'success',
            });
            // this.cms.showDiaplog(this.cms.translateText('Common.approved'), this.cms.translateText(responseText, { object: this.cms.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
            //   {
            //     label: this.cms.translateText('Common.close'),
            //     status: 'success',
            //     action: () => {
            //     },
            //   },
            // ]);
          }).catch(err => {
            this.loading = false;
          });
        },
      },
    ]);
  }

  getItemDescription(item: ProductionOrderModel) {
    return item?.Description;
  }

  summaryCalculate(data: ProductionOrderModel[]) {
    for (const i in data) {
      const item = data[i];
      item['Total'] = 0;
      item['Title'] = this.renderTitle(item);
      for (const detail of item.Details) {
        item['Total'] += detail['ToMoney'] = this.toMoney(detail);
      }
      this.processMapList[i] = AppModule.processMaps.warehouseReceiptGoodsNote[item.State || ''];
    }
    return data;
  }

  printContainerTemp(detail: ProductionOrderFinishedGoodsModel) {
    this.cms.openDialog(WarehouseGoodsFindOrderTempPrintComponent, {
      context: {
        priceTable: 'default',
        id: [`${this.cms.getObjectId(detail.Product)}-${this.cms.getObjectId(detail.Unit)}-${this.cms.getObjectId(detail.Container)}`],
      }
    });
  }

}
