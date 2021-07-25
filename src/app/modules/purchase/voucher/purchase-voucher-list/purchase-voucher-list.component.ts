import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent } from '../../../../lib/data-manager/data-manger-list.component';
import { PurchaseVoucherModel } from '../../../../models/purchase.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SmartTableButtonComponent, SmartTableDateTimeComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { PurchaseSimpleVoucherFormComponent } from '../purchase-simple-voucher-form/purchase-simple-voucher-form.component';
import { PurchaseVoucherFormComponent } from '../purchase-voucher-form/purchase-voucher-form.component';
import { PurchaseVoucherPrintComponent } from '../purchase-voucher-print/purchase-voucher-print.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { takeUntil } from 'rxjs/operators';
import { PurchaseModule } from '../../purchase.module';
import { ResourcePermissionEditComponent } from '../../../../lib/lib-system/components/resource-permission-edit/resource-permission-edit.component';

@Component({
  selector: 'ngx-purchase-voucher-list',
  templateUrl: './purchase-voucher-list.component.html',
  styleUrls: ['./purchase-voucher-list.component.scss'],
})
export class PurchaseVoucherListComponent extends ServerDataManagerListComponent<PurchaseVoucherModel> implements OnInit {

  componentName: string = 'PurchaseVoucherListComponent';
  formPath = '/purchase/voucher/form';
  apiPath = '/purchase/vouchers';
  idKey = 'Code';

  formDialog = PurchaseVoucherFormComponent;
  reuseDialog = true;
  static _dialog: NbDialogRef<PurchaseVoucherListComponent>;

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<PurchaseVoucherListComponent>,
  ) {
    super(apiService, router, commonService, dialogService, toastService, ref);
  }

  async init() {
    return super.init();
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
    actions: this.isChoosedMode ? false : {
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
      Title: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.title'), 'head-title'),
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
      Creator: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.creator'), 'head-title'),
        type: 'string',
        width: '10%',
        // filter: {
        //   type: 'custom',
        //   component: SmartTableDateTimeRangeFilterComponent,
        // },
        valuePrepareFunction: (cell: string, row?: any) => {
          return this.commonService.getObjectText(cell);
        },
      },
      Copy: {
        title: 'Copy',
        type: 'custom',
        width: '5%',
        exclude: this.isChoosedMode,
        renderComponent: SmartTableButtonComponent,
        onComponentInitFunction: (instance: SmartTableButtonComponent) => {
          instance.iconPack = 'eva';
          instance.icon = 'copy';
          // instance.label = this.commonService.translateText('Common.copy');
          instance.display = true;
          instance.status = 'warning';
          instance.valueChange.subscribe(value => {
            // if (value) {
            //   instance.disabled = false;
            // } else {
            //   instance.disabled = true;
            // }
          });
          instance.click.subscribe(async (row: PurchaseVoucherModel) => {

            this.commonService.openDialog(PurchaseVoucherFormComponent, {
              context: {
                inputMode: 'dialog',
                inputId: [row.Code],
                isDuplicate: true,
                onDialogSave: (newData: PurchaseVoucherModel[]) => {
                  // if (onDialogSave) onDialogSave(row);
                },
                onDialogClose: () => {
                  // if (onDialogClose) onDialogClose();
                  this.refresh();
                },
              },
            });

          });
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
          instance.disabled = this.isChoosedMode;
          // instance.style = 'text-align: right';
          // instance.class = 'align-right';
          instance.title = this.commonService.translateText('Common.approved');
          instance.label = this.commonService.translateText('Common.approved');
          instance.valueChange.subscribe(value => {
            const processMap = PurchaseModule.processMaps.purchaseVoucher[value || ''];
            instance.label = this.commonService.translateText(processMap?.label);
            instance.status = processMap?.status;
            instance.outline = processMap?.outline;
            // instance.disabled = (value === 'APPROVE');
            // instance.icon = value ? 'unlock' : 'lock';
            // instance.status = value === 'REQUEST' ? 'warning' : 'success';
            // instance.disabled = value !== 'REQUEST';
          });
          instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: PurchaseVoucherModel) => {
            this.apiService.getPromise<PurchaseVoucherModel[]>(this.apiPath, { id: [rowData.Code], includeContact: true, includeDetails: true, useBaseTimezone: true }).then(rs => {
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
        exclude: this.isChoosedMode,
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
          instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: PurchaseVoucherModel) => {

            this.commonService.openDialog(ResourcePermissionEditComponent, {
              context: {
                inputMode: 'dialog',
                inputId: [rowData.Code],
                note: 'Click vào nút + để thêm 1 phân quyền, mỗi phân quyền bao gồm người được phân quyền và các quyền mà người đó được thao tác',
                resourceName: this.commonService.translateText('Purchase.PurchaseVoucher  .title', { action: '', definition: '' }) + ` ${rowData.Title || ''}`,
                // resrouce: rowData,
                apiPath: this.apiPath,
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
          instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: PurchaseVoucherModel) => {
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
  }

  getList(callback: (list: PurchaseVoucherModel[]) => void) {
    super.getList((rs) => {
      if (callback) callback(rs);
    });
  }

  initDataSource() {
    const source = super.initDataSource();

    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {
      params['includeCreator'] = true;
      params['sort_Id'] = 'desc';
      // params['eq_Type'] = 'PAYMENT';
      return params;
    };

    return source;
  }

  async getFormData(ids: string[]) {
    return this.apiService.getPromise<PurchaseVoucherModel[]>(this.apiPath, { id: ids, includeContact: true, includeDetails: true });
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
