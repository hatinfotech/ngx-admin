import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { takeUntil } from 'rxjs/operators';
import { SmartTableCurrencyComponent, SmartTableDateTimeComponent, SmartTableBaseComponent, SmartTableButtonComponent } from '../../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableDateTimeRangeFilterComponent } from '../../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { ServerDataManagerListComponent } from '../../../../../lib/data-manager/server-data-manger-list.component';
import { ResourcePermissionEditComponent } from '../../../../../lib/lib-system/components/resource-permission-edit/resource-permission-edit.component';
import { CashVoucherModel } from '../../../../../models/accounting.model';
import { UserGroupModel } from '../../../../../models/user-group.model';
import { ApiService } from '../../../../../services/api.service';
import { CommonService } from '../../../../../services/common.service';
import { AccountingModule } from '../../../accounting.module';
import { CashReceiptVoucherFormComponent } from '../cash-receipt-voucher-form/cash-receipt-voucher-form.component';
import { CashReceiptVoucherPrintComponent } from '../cash-receipt-voucher-print/cash-receipt-voucher-print.component';

@Component({
  selector: 'ngx-cash-receipt-voucher-list',
  templateUrl: './cash-receipt-voucher-list.component.html',
  styleUrls: ['./cash-receipt-voucher-list.component.scss']
})
export class CashReceiptVoucherListComponent extends ServerDataManagerListComponent<CashVoucherModel> implements OnInit {

  componentName: string = 'CashReceiptVoucherListComponent';
  formPath = '/accounting/cash-receipt-voucher/form';
  apiPath = '/accounting/cash-vouchers';
  idKey = 'Code';
  formDialog = CashReceiptVoucherFormComponent;

  reuseDialog = true;
  static _dialog: NbDialogRef<CashReceiptVoucherListComponent>;

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
    public ref: NbDialogRef<CashReceiptVoucherListComponent>,
  ) {
    super(apiService, router, commonService, dialogService, toastService, ref);
  }

  // async loadCache() {
  //   // iniit category
  //   // this.categoryList = (await this.apiService.getPromise<ProductCategoryModel[]>('/admin-product/categories', {})).map(cate => ({ ...cate, id: cate.Code, text: cate.Name })) as any;
  // }

  async init() {
    // await this.loadCache();
    return super.init();
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
      Description: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.description'), 'head-title'),
        type: 'string',
        width: '20%',
        filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
      },
      RelativeVouchers: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.relationVoucher'), 'head-title'),
        type: 'html',
        width: '20%',
        valuePrepareFunction: (cell: any, row?: any) => {
          return cell?.map(m => `<div class="tag" title="${m?.text}  "><nb-icon icon="pricetags-outline" pack="ion"></nb-icon> ${m?.id}</div></div>`).join('');
        }
      },
      Code: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.code'), 'head-title'),
        type: 'string',
        width: '10%',
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
      Amount: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.numOfMoney'), 'head-title'),
        type: 'custom',
        class: 'align-right',
        width: '10%',
        position: 'right',
        renderComponent: SmartTableCurrencyComponent,
        onComponentInitFunction: (instance: SmartTableCurrencyComponent) => {
          // instance.format$.next('medium');
          instance.style = 'text-align: right';
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
          instance.title = this.commonService.translateText('Common.approved');
          instance.label = this.commonService.translateText('Common.approved');
          instance.valueChange.subscribe(value => {
            const processMap = AccountingModule.processMaps.cashVoucher[value || ''];
            instance.label = this.commonService.translateText(processMap?.label);
            instance.status = processMap?.status;
            instance.outline = processMap?.outline;
          });
          instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: CashVoucherModel) => {
            this.apiService.getPromise<CashVoucherModel[]>(this.apiPath, { id: [rowData.Code], includeContact: true, includeDetails: true, useBaseTimezone: true }).then(rs => {
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
          instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: CashVoucherModel) => {

            this.commonService.openDialog(ResourcePermissionEditComponent, {
              context: {
                inputMode: 'dialog',
                inputId: [rowData.Code],
                note: 'Click vào nút + để thêm 1 phân quyền, mỗi phân quyền bao gồm người được phân quyền và các quyền mà người đó được thao tác',
                resourceName: this.commonService.translateText('Accounting.PaymentVoucher.title', { action: '', definition: '' }) + ` ${rowData.Description || ''}`,
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
          instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: CashVoucherModel) => {
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

  initDataSource() {
    const source = super.initDataSource();

    // Set DataSource: prepareData
    // source.prepareData = (data: UserGroupModel[]) => {
    //   // const paging = source.getPaging();
    //   // data.map((product: any, index: number) => {
    //   //   product['No'] = (paging.page - 1) * paging.perPage + index + 1;
    //   //   return product;
    //   // });
    //   return data;
    // };

    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {
      params['includeParent'] = true;
      params['sort_Created'] = 'desc';
      params['eq_Type'] = 'RECEIPT';
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

  async getFormData(ids: string[]) {
    return this.apiService.getPromise<CashVoucherModel[]>('/accounting/cash-vouchers', { id: ids, includeContact: true, includeDetails: true, eq_Type: 'RECEIPT' });
  }

  preview(data: CashVoucherModel[]) {
    this.commonService.openDialog(CashReceiptVoucherPrintComponent, {
      context: {
        showLoadinng: true,
        title: 'Xem trước',
        data: data,
        idKey: ['Code'],
        // approvedConfirm: true,
        onClose: (data: CashVoucherModel) => {
          this.refresh();
        },
      },
    });
    return false;
  }

}
