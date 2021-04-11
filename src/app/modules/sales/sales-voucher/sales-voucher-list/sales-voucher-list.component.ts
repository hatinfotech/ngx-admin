import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent } from '../../../../lib/data-manager/data-manger-list.component';
import { SalesVoucherModel } from '../../../../models/sales.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SmartTableButtonComponent, SmartTableDateTimeComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SimpleSalesVoucherFormComponent } from '../simple-sales-voucher-form/simple-sales-voucher-form.component';
import { SalesVoucherFormComponent } from '../sales-voucher-form/sales-voucher-form.component';
import { SalesVoucherPrintComponent } from '../sales-voucher-print/sales-voucher-print.component';
import { ResourcePermissionEditComponent } from '../../../../lib/lib-system/components/resource-permission-edit/resource-permission-edit.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ngx-sales-voucher-list',
  templateUrl: './sales-voucher-list.component.html',
  styleUrls: ['./sales-voucher-list.component.scss'],
})
export class SalesVoucherListComponent extends DataManagerListComponent<SalesVoucherModel> implements OnInit {

  componentName: string = 'SalesVoucherListComponent';
  formPath = '/sales/sales-voucher/form';
  apiPath = '/sales/sales-vouchers';
  idKey = 'Code';
  formDialog = SalesVoucherFormComponent;

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
  executeGet(params: any, success: (resources: SalesVoucherModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: SalesVoucherModel[] | HttpErrorResponse) => void) {
    params['useBaseTimezone'] = true;
    super.executeGet(params, success, error, complete);
  }

  editing = {};
  rows = [];

  stateDic = {
    APPROVE: { label: this.commonService.translateText('Common.approved'), status: 'primary', outline: true },
    COMPLETE: { label: this.commonService.translateText('Common.completed'), status: 'success', outline: true },
  };

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
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.customer'), 'head-title'),
        type: 'string',
        width: '20%',
      },
      Note: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.description'), 'head-title'),
        type: 'string',
        width: '30%',
      },
      Created: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.dateOfcreated'), 'head-title'),
        type: 'custom',
        width: '15%',
        renderComponent: SmartTableDateTimeComponent,
        onComponentInitFunction: (instance: SmartTableDateTimeComponent) => {
          // instance.format$.next('medium');
        },
      },
      State: {
        title: this.commonService.translateText('Common.approve'),
        type: 'custom',
        width: '5%',
        // class: 'align-right',
        renderComponent: SmartTableButtonComponent,
        onComponentInitFunction: (instance: SmartTableButtonComponent) => {
          instance.iconPack = 'eva';
          instance.icon = 'checkmark-circle';
          instance.display = true;
          instance.status = 'success';
          // instance.style = 'text-align: right';
          // instance.class = 'align-right';
          instance.title = this.commonService.translateText('Common.approved');
          instance.label = this.commonService.translateText('Common.approved');
          instance.valueChange.subscribe(value => {
            instance.label = this.stateDic[value]?.label || this.commonService.translateText('Common.notJustApproved');
            instance.status = this.stateDic[value]?.status || 'danger';
            instance.outline = this.stateDic[value]?.outline || false;
            instance.disable = (value === 'APPROVE');
            // instance.icon = value ? 'unlock' : 'lock';
            // instance.status = value === 'REQUEST' ? 'warning' : 'success';
            // instance.disabled = value !== 'REQUEST';
          });
          instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: SalesVoucherModel) => {
            this.apiService.getPromise<SalesVoucherModel[]>('/sales/sales-vouchers', { id: [rowData.Code], includeContact: true, includeDetails: true, useBaseTimezone: true }).then(rs => {
              this.preview(rs);
            });
          });
        },
      },
      Permission: {
        title: this.commonService.translateText('Common.permission'),
        type: 'custom',
        width: '5%',
        class: 'align-right',
        renderComponent: SmartTableButtonComponent,
        onComponentInitFunction: (instance: SmartTableButtonComponent) => {
          instance.iconPack = 'eva';
          instance.icon = 'shield';
          instance.display = true;
          instance.status = 'danger';
          instance.style = 'text-align: right';
          instance.class = 'align-right';
          instance.title = this.commonService.translateText('Common.preview');
          instance.valueChange.subscribe(value => {
            // instance.icon = value ? 'unlock' : 'lock';
            // instance.status = value === 'REQUEST' ? 'warning' : 'success';
            // instance.disabled = value !== 'REQUEST';
          });
          instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: SalesVoucherModel) => {

            this.commonService.openDialog(ResourcePermissionEditComponent, {
              context: {
                inputMode: 'dialog',
                inputId: [rowData.Code],
                note: 'Click vào nút + để thêm 1 phân quyền, mỗi phân quyền bao gồm người được phân quyền và các quyền mà người đó được thao tác',
                resourceName: this.commonService.translateText('Sales.SalesVoucher.title', {action: '', definition: ''}) + ` ${rowData.Title || ''}`,
                // resrouce: rowData,
                apiPath: '/sales/sales-vouchers',
              }
            });

            // this.getFormData([rowData.Code]).then(rs => {
            //   this.preview(rs);
            // });
          });
        },
      },
      Preview: {
        title: this.commonService.translateText('Common.show'),
        type: 'custom',
        width: '5%',
        class: 'align-right',
        renderComponent: SmartTableButtonComponent,
        onComponentInitFunction: (instance: SmartTableButtonComponent) => {
          instance.iconPack = 'eva';
          instance.icon = 'external-link-outline';
          instance.display = true;
          instance.status = 'primary';
          instance.style = 'text-align: right';
          instance.class = 'align-right';
          instance.title = this.commonService.translateText('Common.preview');
          instance.valueChange.subscribe(value => {
            // instance.icon = value ? 'unlock' : 'lock';
            // instance.status = value === 'REQUEST' ? 'warning' : 'success';
            // instance.disabled = value !== 'REQUEST';
          });
          instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: SalesVoucherModel) => {
            this.getFormData([rowData.Code]).then(rs => {
              this.preview(rs);
            });
          });
        },
      }
    },
  });

  ngOnInit() {
    this.restrict();
    super.ngOnInit();

    // this.apiService.getObservable<ProductModel[]>('/admin-product/products', {})
    //   .pipe(map(product => {
    //     return {
    //       product: product,
    //     };
    //   }));
  }

  getList(callback: (list: SalesVoucherModel[]) => void) {
    super.getList((rs) => {
      if (callback) callback(rs);
    });
  }

  /** Implement required */
  // openFormDialog(ids?: string[]) {
  //   this.commonService.openDialog(SalesVoucherFormComponent, {
  //     context: {
  //       inputMode: 'dialog',
  //       inputId: ids,
  //       onDialogSave: (newData: SalesVoucherModel[]) => {
  //         if (onDialogSave) onDialogSave(newData);
  //       },
  //       onDialogClose: () => {
  //         if (onDialogClose) onDialogClose();
  //         this.refresh();
  //       },
  //     },
  //     closeOnEsc: false,
  //     closeOnBackdropClick: false,
  //   });
  // }

  /** Implement required */
  openSimpleFormDialog(ids?: string[], onDialogSave?: (newData: SalesVoucherModel[]) => void, onDialogClose?: () => void) {
    this.commonService.openDialog(SimpleSalesVoucherFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: ids,
        onDialogSave: (newData: SalesVoucherModel[]) => {
          if (onDialogSave) onDialogSave(newData);
        },
        onDialogClose: () => {
          if (onDialogClose) onDialogClose();
          this.refresh();
        },
      },
      closeOnEsc: false,
      closeOnBackdropClick: false,
    });
  }

  /** Go to form */
  // gotoForm(id?: string): false {
  //   this.openSimpleFormDialog(id ? decodeURIComponent(id).split('&') : null);
  //   return false;
  // }

  async getFormData(ids: string[]) {
    return this.apiService.getPromise<SalesVoucherModel[]>('/sales/sales-vouchers', { id: ids, includeContact: true, includeDetails: true });
  }

  preview(data: SalesVoucherModel[]) {
    this.commonService.openDialog(SalesVoucherPrintComponent, {
      context: {
        title: 'Xem trước',
        data: data,
        idKey: ['Code'],
        // approvedConfirm: true,
        onClose: (data: SalesVoucherModel) => {
          this.refresh();
        },
      },
    });
    return false;
  }

}
