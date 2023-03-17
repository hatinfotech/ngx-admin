import { WarehouseInventoryAdjustNoteFormComponent } from '../inventory-adjust-note-form/inventory-adjust-note-form.component';
import { WarehouseGoodsReceiptNoteModel, WarehouseInventoryAdjustNoteModel } from '../../../../models/warehouse.model';
import { Component, OnInit } from '@angular/core';
import { DataManagerPrintComponent } from '../../../../lib/data-manager/data-manager-print.component';
import { WarehouseGoodsReceiptNoteDetailModel } from '../../../../models/warehouse.model';
import { environment } from '../../../../../environments/environment';
import { CommonService } from '../../../../services/common.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { NbDialogRef } from '@nebular/theme';
import { DatePipe } from '@angular/common';
import { ProcessMap } from '../../../../models/process-map.model';
import { AppModule } from '../../../../app.module';
import { WarehouseGoodsReceiptNoteDetailAccessNumberPrintComponent } from '../../goods-receipt-note/warehouse-goods-access-number-print/warehouse-goods-access-number-print.component';
// import { AppModule } from '../../warehouse.module';

@Component({
  selector: 'ngx-inventory-adjust-note-print',
  templateUrl: './inventory-adjust-note-print.component.html',
  styleUrls: ['./inventory-adjust-note-print.component.scss'],
})
export class WarehouseInventoryAdjustNotePrintComponent extends DataManagerPrintComponent<WarehouseGoodsReceiptNoteModel> implements OnInit {

  /** Component name */
  componentName = 'WarehouseInventoryAdjustNotePrintComponent';
  title: string = '';
  env = environment;
  apiPath = '/warehouse/inventory-adjust-notes';
  processMapList: ProcessMap[] = [];
  formDialog = WarehouseInventoryAdjustNoteFormComponent;

  constructor(
    public cms: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref: NbDialogRef<WarehouseInventoryAdjustNotePrintComponent>,
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
    //   this.setDetailsNo(data?.Details, (detail: WarehouseGoodsReceiptNoteDetailModel) => detail.Type === 'PRODUCT');
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
      title: this.cms.textTransform(this.cms.translate.instant('In mã vạch cho hàng hóa bị mất tem hoặc không rõ nguồn gốc'), 'head-title'),
      size: 'medium',
      disabled: () => {
        return false;
      },
      click: (event: any, option: any) => {
        const item = this.data[option.index];
        let newAccessNumbers: string[] = [];
        if (item.Details) {
          for (const detail of item.Details) {
            if (detail?.AccessNumbers) {
              newAccessNumbers = newAccessNumbers.concat(detail.AccessNumbers.filter(f => f.IsNew).map(m => m.AccessNumber));
            }
          }
        }
        // this.apiService.getPromise('', {});

        this.cms.openDialog(WarehouseGoodsReceiptNoteDetailAccessNumberPrintComponent, {
          context: {
            // voucher: item.Code,
            id: newAccessNumbers,
            // id: ['xxx']
          }
        });
        return false;
      },
    });

    this.actionButtonList.unshift({
      name: 'print-access-numbers',
      status: 'primary',
      label: this.cms.textTransform(this.cms.translate.instant('In mã vạch cũ'), 'head-title'),
      icon: 'grid-outline',
      title: this.cms.textTransform(this.cms.translate.instant('In lại mã vạch cũ (mã quét được trong lúc kiểm kho)'), 'head-title'),
      size: 'medium',
      disabled: () => {
        return false;
      },
      click: (event: any, option: any) => {
        const item = this.data[option.index];
        let newAccessNumbers: string[] = [];
        if (item.Details) {
          for (const detail of item.Details) {
            if (detail?.AccessNumbers) {
              newAccessNumbers = newAccessNumbers.concat(detail.AccessNumbers.filter(f => !f.IsNew).map(m => m.AccessNumber));
            }
          }
        }
        // this.apiService.getPromise('', {});

        this.cms.openDialog(WarehouseGoodsReceiptNoteDetailAccessNumberPrintComponent, {
          context: {
            // voucher: item.Code,
            id: newAccessNumbers,
            // id: ['xxx']
          }
        });
        return false;
      },
    });

    this.summaryCalculate(this.data);

    return result;
  }

  renderTitle(data: WarehouseInventoryAdjustNoteModel) {
    return `Phieu_Dieu_Chinh_Ton_Kho_${this.getIdentified(data).join('-')}` + (data.DateOfAdjusted ? ('_' + this.datePipe.transform(data.DateOfAdjusted, 'short')) : '');
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

  renderNewAccessNumber(accessNumbers: any[]) {
    if (accessNumbers) {
      return accessNumbers.filter(f => f.IsNew).map(m => m.AccessNumber).join(', ');
    }
    return '';
  }

  toMoney(detail: WarehouseGoodsReceiptNoteDetailModel) {
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
    return this.apiService.getPromise<WarehouseGoodsReceiptNoteModel[]>(this.apiPath, { id: ids, includeContact: true, includeDetails: true, includeRelativeVouchers: true, includeAccessNumbers: true, onlyNewAccessNumbersx: true }).then(rs => {
      if (rs[0] && rs[0].Details) {
        this.setDetailsNo(rs[0].Details, (detail: WarehouseGoodsReceiptNoteDetailModel) => detail.Type === 'PRODUCT');
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

  approvedConfirm(data: WarehouseGoodsReceiptNoteModel, index: number) {
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
          this.apiService.putPromise<WarehouseGoodsReceiptNoteModel[]>(this.apiPath, params, [{ Code: data.Code }]).then(rs => {
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

  getItemDescription(item: WarehouseGoodsReceiptNoteModel) {
    return item?.Description;
  }

  summaryCalculate(data: WarehouseGoodsReceiptNoteModel[]) {
    for (const i in data) {
      const item = data[i];
      item['Total'] = 0;
      // item['Title'] = this.renderTitle(item);
      for (const detail of item.Details) {
        item['Total'] += detail['ToMoney'] = this.toMoney(detail);
      }
      this.processMapList[i] = AppModule.processMaps.warehouseReceiptGoodsNote[item.State || ''];
    }
    return data;
  }

}
