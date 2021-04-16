import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent } from '../../../../lib/data-manager/data-manger-list.component';
import { PurchaseVoucherModel } from '../../../../models/purchase.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SmartTableDateTimeComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { PurchaseSimpleVoucherFormComponent } from '../purchase-simple-voucher-form/purchase-simple-voucher-form.component';
import { PurchaseVoucherFormComponent } from '../purchase-voucher-form/purchase-voucher-form.component';
import { PurchaseVoucherPrintComponent } from '../purchase-voucher-print/purchase-voucher-print.component';

@Component({
  selector: 'ngx-purchase-voucher-list',
  templateUrl: './purchase-voucher-list.component.html',
  styleUrls: ['./purchase-voucher-list.component.scss'],
})
export class PurchaseVoucherListComponent extends DataManagerListComponent<PurchaseVoucherModel> implements OnInit {

  componentName: string = 'PurchaseVoucherListComponent';
  formPath = '/purchase/voucher/form';
  apiPath = '/purchase/vouchers';
  idKey = 'Code';

  formDialog = PurchaseVoucherFormComponent;

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
  executeGet(params: any, success: (resources: PurchaseVoucherModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: PurchaseVoucherModel[] | HttpErrorResponse) => void) {
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

  getList(callback: (list: PurchaseVoucherModel[]) => void) {
    super.getList((rs) => {
      if (callback) callback(rs);
    });
  }

  async getFormData(ids: string[]) {
    return this.apiService.getPromise<PurchaseVoucherModel[]>('/purchase/vouchers', { id: ids, includeContact: true, includeDetails: true });
  }

  preview(data: PurchaseVoucherModel[]) {
    this.commonService.openDialog(PurchaseVoucherPrintComponent, {
      context: {
        showLoadinng: true,
        title: 'Xem trước',
        data: data,
        idKey: ['Code'],
        // approvedConfirm: true,
        onClose: (data: PurchaseVoucherModel) => {
          this.refresh();
        },
      },
    });
    return false;
  }

}
