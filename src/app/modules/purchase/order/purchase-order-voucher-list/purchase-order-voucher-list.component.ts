import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { SmartTableDateTimeComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { DataManagerListComponent } from '../../../../lib/data-manager/data-manger-list.component';
import { PurchaseOrderVoucherModel, PurchaseVoucherModel } from '../../../../models/purchase.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { PurchaseOrderVoucherFormComponent } from '../purchase-order-voucher-form/purchase-order-voucher-form.component';
import { PurchaseOrderVoucherPrintComponent } from '../purchase-order-voucher-print/purchase-order-voucher-print.component';

@Component({
  selector: 'ngx-purchase-order-voucher-list',
  templateUrl: './purchase-order-voucher-list.component.html',
  styleUrls: ['./purchase-order-voucher-list.component.scss']
})
export class PurchaseOrderVoucherListComponent extends DataManagerListComponent<PurchaseOrderVoucherModel> implements OnInit {

  componentName: string = 'PurchaseOrderVoucherListComponent';
  formPath = '/purchase/order-voucher/form';
  apiPath = '/purchase/order-vouchers';
  idKey = 'Code';

  formDialog = PurchaseOrderVoucherFormComponent;

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
  ) {
    super(apiService, router, commonService, dialogService, toastService);
  }

  /** Api get funciton */
  executeGet(params: any, success: (resources: PurchaseOrderVoucherModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: PurchaseOrderVoucherModel[] | HttpErrorResponse) => void) {
    params['useBaseTimezone'] = true;
    super.executeGet(params, success, error, complete);
  }

  editing = {};
  rows = [];

  settings = this.configSetting({
    mode: 'external',
    selectMode: 'multi',
    actions: {
      position: 'right',
    },
    add: this.configAddButton(),
    edit: this.configEditButton(),
    delete: this.configDeleteButton(),
    pager: this.configPaging(),
    columns: {
      Code: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.code'), 'head-title'),
        type: 'string',
        width: '10%',
      },
      ObjectName: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.supplier'), 'head-title'),
        type: 'string',
        width: '20%',
      },
      Note: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.description'), 'head-title'),
        type: 'string',
        width: '30%',
      },
      DateOfPurchase: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Purchase.dateOfPurchase'), 'head-title'),
        type: 'custom',
        width: '15%',
        renderComponent: SmartTableDateTimeComponent,
        onComponentInitFunction: (instance: SmartTableDateTimeComponent) => {
          // instance.format$.next('medium');
        },
      },
      IsApprove: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.isApprove'), 'head-title'),
        type: 'string',
        width: '15%',
      },
    },
  });

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  getList(callback: (list: PurchaseOrderVoucherModel[]) => void) {
    super.getList((rs) => {
      if (callback) callback(rs);
    });
  }

  async getFormData(ids: string[]) {
    return this.apiService.getPromise<PurchaseOrderVoucherModel[]>('/purchase/order-vouchers', { id: ids, includeContact: true, includeDetails: true });
  }

  preview(data: PurchaseOrderVoucherModel[]) {
    this.commonService.openDialog(PurchaseOrderVoucherPrintComponent, {
      context: {
        showLoadinng: true,
        title: 'Xem trước',
        data: data,
        idKey: ['Code'],
        // approvedConfirm: true,
        onClose: (data: PurchaseOrderVoucherModel) => {
          this.refresh();
        },
      },
    });
    return false;
  }

}
