import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent } from '../../../../lib/data-manager/data-manger-list.component';
import { SalesVoucherModel } from '../../../../models/sales.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SmartTableButtonComponent, SmartTableDateTimeComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SimpleSalesVoucherFormComponent } from '../simple-sales-voucher-form/simple-sales-voucher-form.component';
import { SalesVoucherFormComponent } from '../sales-voucher-form/sales-voucher-form.component';
import { SalesVoucherPrintComponent } from '../sales-voucher-print/sales-voucher-print.component';
import { ResourcePermissionEditComponent } from '../../../../lib/lib-system/components/resource-permission-edit/resource-permission-edit.component';
import { takeUntil } from 'rxjs/operators';
import { SmartTableDateTimeRangeFilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { UserGroupModel } from '../../../../models/user-group.model';
import { SalesPriceReportPrintComponent } from '../../price-report/sales-price-report-print/sales-price-report-print.component';

@Component({
  selector: 'ngx-sales-voucher-list',
  templateUrl: './sales-voucher-list.component.html',
  styleUrls: ['./sales-voucher-list.component.scss'],
})
export class SalesVoucherListComponent extends ServerDataManagerListComponent<SalesVoucherModel> implements OnInit {

  componentName: string = 'SalesVoucherListComponent';
  formPath = '/sales/sales-voucher/form';
  apiPath = '/sales/sales-vouchers';
  idKey = 'Code';
  formDialog = SalesVoucherFormComponent;

  reuseDialog = true;
  static _dialog: NbDialogRef<SalesVoucherListComponent>;

  // Smart table
  static filterConfig: any;
  static sortConf: any;
  static pagingConf = { page: 1, perPage: 40 };

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<SalesVoucherListComponent>,
  ) {
    super(apiService, router, commonService, dialogService, toastService, ref);
  }

  async init() {
    return super.init();
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
      No: {
        title: 'No.',
        type: 'string',
        width: '5%',
        filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
      },
      ObjectName: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.Object.title'), 'head-title'),
        type: 'string',
        width: '20%',
        filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
      },
      Title: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.title'), 'head-title'),
        type: 'string',
        width: '50%',
        filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
      },
      // RelationVoucher: {
      //   title: this.commonService.textTransform(this.commonService.translate.instant('Common.relationVoucher'), 'head-title'),
      //   type: 'string',
      //   width: '20%',
      // },
      Code: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.code'), 'head-title'),
        type: 'string',
        width: '10%',
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
      Created: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.created'), 'head-title'),
        type: 'custom',
        width: '10%',
        filter: {
          type: 'custom',
          component: SmartTableDateTimeRangeFilterComponent,
        },
        renderComponent: SmartTableDateTimeComponent,
        onComponentInitFunction: (instance: SmartTableDateTimeComponent) => {
          // instance.format$.next('medium');
        },
      },
      // Amount: {
      //   title: this.commonService.textTransform(this.commonService.translate.instant('Common.numOfMoney'), 'head-title'),
      //   type: 'custom',
      //   class: 'align-right',
      //   width: '10%',
      //   position: 'right',
      //   renderComponent: SmartTableCurrencyComponent,
      //   onComponentInitFunction: (instance: SmartTableCurrencyComponent) => {
      //     // instance.format$.next('medium');
      //     instance.style = 'text-align: right';
      //   },
      // },
      Copy: {
        title: 'Copy',
        type: 'custom',
        width: '10%',
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
          instance.click.subscribe(async (row: SalesVoucherModel) => {

            this.commonService.openDialog(SalesVoucherFormComponent, {
              context: {
                inputMode: 'dialog',
                inputId: [row.Code],
                isDuplicate: true,
                onDialogSave: (newData: SalesVoucherModel[]) => {
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
                resourceName: this.commonService.translateText('Sales.SalesVoucher  .title', { action: '', definition: '' }) + ` ${rowData.Title || ''}`,
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
  }

  async getFormData(ids: string[]) {
    return this.apiService.getPromise<SalesVoucherModel[]>('/sales/sales-vouchers', { id: ids, includeContact: true, includeDetails: true, useBaseTimezone: true });
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

  /** Api get funciton */
  // executeGet(params: any, success: (resources: UserGroupModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: UserGroupModel[] | HttpErrorResponse) => void) {
  //   params['includeCategories'] = true;
  //   super.executeGet(params, success, error, complete);
  // }

  getList(callback: (list: UserGroupModel[]) => void) {
    super.getList((rs) => {
      // rs.map((product: any) => {
      //   product['Unit'] = product['Unit']['Name'];
      //   if (product['Categories']) {
      //     product['CategoriesRendered'] = product['Categories'].map(cate => cate['text']).join(', ');
      //   }
      //   return product;
      // });
      if (callback) callback(rs);
    });
  }

  preview(data: SalesVoucherModel[]) {
    this.commonService.openDialog(SalesVoucherPrintComponent, {
      context: {
        showLoadinng: true,
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
