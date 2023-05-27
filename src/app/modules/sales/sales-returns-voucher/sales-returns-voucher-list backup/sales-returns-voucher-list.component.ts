import { Type } from '@angular/core';
// import { SalesModule } from './../../sales.module';
import { Component, OnInit } from '@angular/core';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { SalesReturnsVoucherModel } from '../../../../models/sales.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { SmartTableButtonComponent, SmartTableDateTimeComponent, SmartTableRelativeVouchersComponent, SmartTableTagsComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SalesReturnsVoucherFormComponent } from '../sales-returns-voucher-form/sales-returns-voucher-form.component';
import { SalesReturnsVoucherPrintComponent } from '../sales-returns-voucher-print/sales-returns-voucher-print.component';
import { ResourcePermissionEditComponent } from '../../../../lib/lib-system/components/resource-permission-edit/resource-permission-edit.component';
import { takeUntil } from 'rxjs/operators';
import { SmartTableDateRangeFilterComponent, SmartTableSelect2FilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { UserGroupModel } from '../../../../models/user-group.model';
import { AppModule } from '../../../../app.module';

@Component({
  selector: 'ngx-sales-returns-voucher-list',
  templateUrl: './sales-returns-voucher-list.component.html',
  styleUrls: ['./sales-returns-voucher-list.component.scss'],
})
export class SalesReturnsVoucherListComponent extends ServerDataManagerListComponent<SalesReturnsVoucherModel> implements OnInit {

  componentName: string = 'SalesReturnsVoucherListComponent';
  formPath = '/sales/sales-returns-voucher/form';
  apiPath = '/sales/sales-returns-vouchers';
  idKey = 'Code';
  formDialog = SalesReturnsVoucherFormComponent;
  printDialog = SalesReturnsVoucherPrintComponent;

  reuseDialog = true;
  static _dialog: NbDialogRef<SalesReturnsVoucherListComponent>;

  // Smart table
  static filterConfig: any;
  static sortConf: any;
  static pagingConf = { page: 1, perPage: 40 };
  loaded = false;

  constructor(
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<SalesReturnsVoucherListComponent>,
  ) {
    super(apiService, router, cms, dialogService, toastService, ref);
  }

  async init() {
    return super.init();
  }

  editing = {};
  rows = [];

  stateDic = {
    APPROVE: { label: this.cms.translateText('Common.approved'), status: 'success', outline: false },
    IMPLEMENT: { label: this.cms.translateText('Common.implement'), status: 'warning', outline: false },
    // ACCEPTANCEREQUEST: { label: this.cms.translateText('Common.completeRequest'), status: 'primary', outline: false },
    ACCEPTANCE: { label: this.cms.translateText('Common.acceptance'), status: 'info', outline: false },
    COMPLETE: { label: this.cms.translateText('Common.completed'), status: 'success', outline: true },
    CANCEL: { label: this.cms.translateText('Common.cancel'), status: 'info', outline: true },
  };

  loadListSetting(): SmartTableSetting {
    return this.configSetting({
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
        No: {
          title: 'No.',
          type: 'string',
          width: '1%',
          filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
        },
        Code: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.code'), 'head-title'),
          type: 'string',
          width: '5%',
        },
        Object: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.Object.title'), 'head-title'),
          type: 'string',
          width: '15%',
          // filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
          valuePrepareFunction: (cell: any, row: SalesReturnsVoucherModel) => {
            return row.ObjectName;
          },
          filter: {
            type: 'custom',
            component: SmartTableSelect2FilterComponent,
            config: {
              delay: 0,
              condition: 'eq',
              select2Option: {
                ...this.cms.makeSelect2AjaxOption('/contact/contacts', {includeIdText: true, includeGroups: true}, { placeholder: 'Chọn liên hệ...', limit: 10, prepareReaultItem: (item) => {
                  item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
                  return item;
                }}),
                multiple: true,
                logic: 'OR',
                allowClear: true,
              },
            },
          },
        },
        Title: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.title'), 'head-title'),
          type: 'string',
          width: '24%',
          filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
        },
        Creator: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.creator'), 'head-title'),
          type: 'string',
          width: '10%',
          valuePrepareFunction: (cell: string, row?: any) => {
            return this.cms.getObjectText(cell);
          },
          filter: {
            type: 'custom',
            component: SmartTableSelect2FilterComponent,
            config: {
              delay: 0,
              condition: 'eq',
              select2Option: {
                logic: 'OR',
                placeholder: 'Chọn người tạo...',
                allowClear: true,
                width: '100%',
                dropdownAutoWidth: true,
                minimumInputLength: 0,
                keyMap: {
                  id: 'id',
                  text: 'text',
                },
                multiple: true,
                ajax: {
                  transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
                    console.log(settings);
                    const params = settings.data;
                    this.apiService.getPromise('/user/users', { 'search': params['term'], includeIdText: true }).then(rs => {
                      success(rs);
                    }).catch(err => {
                      console.error(err);
                      failure();
                    });
                  },
                  delay: 300,
                  processResults: (data: any, params: any) => {
                    // console.info(data, params);
                    return {
                      results: data.map(item => {
                        return item;
                      }),
                    };
                  },
                },
              },
            },
          },
        },
        Created: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.dateOfCreated'), 'head-title'),
          type: 'custom',
          width: '15%',
          filter: {
            type: 'custom',
            component: SmartTableDateRangeFilterComponent,
          },
          renderComponent: SmartTableDateTimeComponent,
          onComponentInitFunction: (instance: SmartTableDateTimeComponent) => {
            // instance.format$.next('medium');
          },
        },
        DateOfReturn: {
          title: this.cms.textTransform(this.cms.translate.instant('Sales.dateOfReturns'), 'head-title'),
          type: 'custom',
          width: '15%',
          filter: {
            type: 'custom',
            component: SmartTableDateRangeFilterComponent,
          },
          renderComponent: SmartTableDateTimeComponent,
          onComponentInitFunction: (instance: SmartTableDateTimeComponent) => {
            // instance.format$.next('medium');
          },
        },
        RelativeVouchers: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.relationVoucher'), 'head-title'),
          type: 'custom',
          renderComponent: SmartTableRelativeVouchersComponent,
          width: '10%',
        },
        Amount: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.amount'), 'head-title'),
          type: 'currency',
          width: '5%',
          class: 'align-right',
          position: 'right',
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
            instance.display = true;
            instance.status = 'warning';
            instance.valueChange.subscribe(value => {
            });
            instance.click.subscribe(async (row: SalesReturnsVoucherModel) => {

              this.cms.openDialog(SalesReturnsVoucherFormComponent, {
                context: {
                  inputMode: 'dialog',
                  inputId: [row.Code],
                  isDuplicate: true,
                  onDialogSave: (newData: SalesReturnsVoucherModel[]) => {
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
          title: this.cms.translateText('Common.state'),
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
            instance.title = this.cms.translateText('Common.approved');
            instance.label = this.cms.translateText('Common.approved');
            instance.valueChange.subscribe(value => {
              const processMap = AppModule.processMaps.salesVoucher[value || ''];
              instance.label = this.cms.translateText(processMap?.label);
              instance.status = processMap?.status;
              instance.outline = processMap?.outline;
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: SalesReturnsVoucherModel) => {
              this.preview([rowData]);
            });
          },
          filter: {
            type: 'custom',
            component: SmartTableSelect2FilterComponent,
            config: {
              delay: 0,
              condition: 'eq',
              select2Option: {
                logic: 'OR',
                placeholder: 'Chọn trạng thái...',
                allowClear: true,
                width: '100%',
                dropdownAutoWidth: true,
                minimumInputLength: 0,
                keyMap: {
                  id: 'id',
                  text: 'text',
                },
                multiple: true,
                data: Object.keys(AppModule.processMaps.salesVoucher).map(stateId => ({
                  id: stateId,
                  text: this.cms.translateText(AppModule.processMaps.salesVoucher[stateId].label)
                })).filter(f => f.id != '')
              },
            },
          },
        },
        Permission: {
          title: this.cms.translateText('Common.permission'),
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
            instance.title = this.cms.translateText('Common.preview');
            instance.valueChange.subscribe(value => {
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: SalesReturnsVoucherModel) => {

              this.cms.openDialog(ResourcePermissionEditComponent, {
                context: {
                  inputMode: 'dialog',
                  inputId: [rowData.Code],
                  note: 'Click vào nút + để thêm 1 phân quyền, mỗi phân quyền bao gồm người được phân quyền và các quyền mà người đó được thao tác',
                  resourceName: this.cms.translateText('Sales.SalesReturnsVoucher  .title', { action: '', definition: '' }) + ` ${rowData.Title || ''}`,
                  // resrouce: rowData,
                  apiPath: '/sales/sales-vouchers',
                }
              });
            });
          },
        },
        Preview: {
          title: this.cms.translateText('Common.show'),
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
            instance.title = this.cms.translateText('Common.preview');
            instance.valueChange.subscribe(value => {
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: SalesReturnsVoucherModel) => {
              this.preview([rowData]);
            });
          },
        }
      },
    });
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async getFormData(ids: string[]) {
    return this.apiService.getPromise<SalesReturnsVoucherModel[]>('/sales/sales-vouchers', { id: ids, includeContact: true, includeDetails: true, useBaseTimezone: true });
  }

  initDataSource() {
    const source = super.initDataSource();

    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {
      params['includeCreator'] = true;
      params['includeContact'] = true;
      params['includeRelativeVouchers'] = true;
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

  // async preview(data: SalesReturnsVoucherModel[]) {
  //   this.cms.openDialog(SalesReturnsVoucherPrintComponent, {
  //     context: {
  //       showLoadinng: true,
  //       title: 'Xem trước',
  //       id: data.map(m => m[this.idKey]),
  //       mode: 'print',
  //       idKey: ['Code'],
  //       // approvedConfirm: true,
  //       onClose: (data: SalesReturnsVoucherModel) => {
  //         this.refresh();
  //       },
  //     },
  //   });
  //   return false;
  // }

}
