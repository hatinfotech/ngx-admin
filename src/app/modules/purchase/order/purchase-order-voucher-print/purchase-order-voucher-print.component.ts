import { PurchaseOrderVoucherDetailModel } from './../../../../models/purchase.model';
import { PurchaseOrderVoucherFormComponent } from './../purchase-order-voucher-form/purchase-order-voucher-form.component';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { environment } from '../../../../../environments/environment';
import { AppModule } from '../../../../app.module';
import { DataManagerPrintComponent } from '../../../../lib/data-manager/data-manager-print.component';
import { ProcessMap } from '../../../../models/process-map.model';
import { PurchaseOrderVoucherModel, PurchaseVoucherDetailModel } from '../../../../models/purchase.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { DialogFormComponent } from '../../../dialog/dialog-form/dialog-form.component';
import { FormGroup } from '@angular/forms';
// import { PurchaseModule } from '../../purchase.module';

@Component({
  selector: 'ngx-purchase-order-voucher-print',
  templateUrl: './purchase-order-voucher-print.component.html',
  styleUrls: ['./purchase-order-voucher-print.component.scss']
})
export class PurchaseOrderVoucherPrintComponent extends DataManagerPrintComponent<PurchaseOrderVoucherModel> implements OnInit {

  /** Component name */
  componentName = 'PurchaseOrderVoucherPrintComponent';
  title: string = '';
  env = environment;
  apiPath = '/purchase/order-vouchers';
  processMapList: ProcessMap[] = [];
  formDialog = PurchaseOrderVoucherFormComponent;

  constructor(
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref: NbDialogRef<PurchaseOrderVoucherPrintComponent>,
    public datePipe: DatePipe,
  ) {
    super(commonService, router, apiService, ref);
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
    //   data['Total'] = 0;
    //   data['Title'] = this.renderTitle(data);
    //   for (const detail of data.Details) {
    //     data['Total'] += detail['ToMoney'] = this.toMoney(detail);
    //   }
    //   this.processMapList[i] = AppModule.processMaps.purchaseOrder[data.State || ''];
    // }
    this.summaryCalculate(this.data);

    return result;
  }

  renderTitle(data: PurchaseOrderVoucherModel) {
    return `PhieuDatHangNCC_${this.getIdentified(data).join('-')}` + (data.DateOfPurchase ? ('_' + this.datePipe.transform(data.DateOfPurchase, 'short')) : '');
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

  toMoney(detail: PurchaseVoucherDetailModel) {
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
    return this.apiService.getPromise<PurchaseOrderVoucherModel[]>(this.apiPath, { id: ids, includeContact: true, includeDetails: true, includeUnit: true }).then(data => {
      this.summaryCalculate(data);

      for (const item of data) {
        this.setDetailsNo(item.Details, (detail: PurchaseVoucherDetailModel) => detail.Type !== 'CATEGORY');
      }

      return data;
    });
  }



  approvedConfirm(data: PurchaseOrderVoucherModel, index: number) {
    if (['COMPLETE'].indexOf(data.State) > -1) {
      this.commonService.showDialog(this.commonService.translateText('Common.approved'), this.commonService.translateText('Common.completedAlert', { object: this.commonService.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
        {
          label: this.commonService.translateText('Common.close'),
          status: 'success',
          action: () => {
            this.onClose(data);
          },
        },
      ]);
      return;
    }
    const params = { id: [data.Code] };
    const processMap = AppModule.processMaps.purchaseVoucher[data.State || ''];
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

    this.commonService.showDialog(this.commonService.translateText('Common.confirm'), this.commonService.translateText(processMap?.confirmText, { object: this.commonService.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
      {
        label: this.commonService.translateText('Common.cancel'),
        status: 'primary',
        action: () => {

        },
      },
      {
        label: this.commonService.translateText(data.State == 'APPROVED' ? 'Common.complete' : 'Common.approve'),
        status: 'danger',
        action: () => {
          this.loading = true;
          this.apiService.putPromise<PurchaseOrderVoucherModel[]>(this.apiPath, params, [{ Code: data.Code }]).then(rs => {
            this.loading = false;
            this.onChange && this.onChange(data);
            this.onClose && this.onClose(data);
            this.close();
            this.commonService.toastService.show(this.commonService.translateText(processMap?.responseText, { object: this.commonService.translateText('Purchase.PrucaseVoucher.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), this.commonService.translateText(processMap?.responseTitle), {
              status: 'success',
            });
            // this.commonService.showDiaplog(this.commonService.translateText('Common.approved'), this.commonService.translateText(responseText, { object: this.commonService.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
            //   {
            //     label: this.commonService.translateText('Common.close'),
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

  getItemDescription(item: PurchaseOrderVoucherModel) {
    return item?.Title;
  }

  summaryCalculate(data: PurchaseOrderVoucherModel[]) {
    for (const i in data) {
      const item = data[i];
      item['Total'] = 0;
      item['Title'] = this.renderTitle(item);
      for (const detail of item.Details) {
        item['Total'] += detail['ToMoney'] = this.toMoney(detail);
      }
      this.processMapList[i] = AppModule.processMaps.purchaseOrder[item.State || ''];
    }
    return data;
  }

  updateSalePrice(detail: PurchaseOrderVoucherDetailModel) {
    this.commonService.openDialog(DialogFormComponent, {
      context: {
        title: 'Cập nhật giá bán',
        onInit: async (form, dialog) => {
          const price = form.get('Price');
          await this.apiService.getPromise('/sales/master-price-table-details', { masterPriceTable: 'default', eq_Code: this.commonService.getObjectId(detail?.Product), eq_Unit: this.commonService.getObjectId(detail?.Unit) }).then(rs => {
            console.log(rs);
            price.setValue(rs[0]?.Price);
            dialog['MasterPriceTable'] = rs[0].MasterPriceTable;
          });
          return true;
        },
        controls: [
          {
            name: 'Price',
            label: 'Giá thay đổi',
            placeholder: 'Giá thay đổi',
            type: 'currency',
            initValue: 0,
            focus: true,
          },
          {
            name: 'Description',
            label: 'Mô tả',
            placeholder: 'Mô tả thêm cho việc thay đổi giá bán',
            type: 'text',
            disabled: true,
            initValue: detail.Description,
          },
        ],
        actions: [
          {
            label: 'Esc - Trở về',
            icon: 'back',
            status: 'basic',
            keyShortcut: 'Escape',
            action: () => { return true; },
          },
          {
            label: 'Enter - Xác nhận',
            icon: 'generate',
            status: 'success',
            keyShortcut: 'Enter',
            action: (form: FormGroup, formDialogConpoent: DialogFormComponent) => {
              this.apiService.putPromise('/sales/master-price-table-details', {}, [{
                MasterPriceTable: formDialogConpoent['MasterPriceTable'],
                Product: this.commonService.getObjectId(detail.Product),
                Unit: this.commonService.getObjectId(detail.Unit),
                Price: form.get('Price').value
              }]);
              // formDialogConpoent.dismiss();
              return true;
            },
          },
        ],
      },
    });
  }

}
