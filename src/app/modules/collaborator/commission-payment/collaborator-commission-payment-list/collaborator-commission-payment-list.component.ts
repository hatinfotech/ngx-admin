import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { takeUntil } from 'rxjs/operators';
import { AppModule } from '../../../../app.module';
import { SmartTableDateTimeComponent, SmartTableCurrencyComponent, SmartTableButtonComponent, SmartTableTagsComponent, SmartTableRelativeVouchersComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableDateTimeRangeFilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { ResourcePermissionEditComponent } from '../../../../lib/lib-system/components/resource-permission-edit/resource-permission-edit.component';
import { CashVoucherModel } from '../../../../models/accounting.model';
import { UserGroupModel } from '../../../../models/user-group.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { CashPaymentVoucherListComponent } from '../../../accounting/cash/payment/cash-payment-voucher-list/cash-payment-voucher-list.component';
import { CashPaymentVoucherPrintComponent } from '../../../accounting/cash/payment/cash-payment-voucher-print/cash-payment-voucher-print.component';
import { CollaboratorCommissionPaymentFormComponent } from '../collaborator-commission-payment-form/collaborator-commission-payment-form.component';
import { CollaboratorCommissionPaymentPrintComponent } from '../collaborator-commission-payment-print/collaborator-commission-payment-print.component';

@Component({
  selector: 'ngx-collaborator-commission-payment-list',
  templateUrl: './collaborator-commission-payment-list.component.html',
  styleUrls: ['./collaborator-commission-payment-list.component.scss']
})
export class CollaboratorCommissionPaymentListComponent extends ServerDataManagerListComponent<CashVoucherModel> implements OnInit {

  componentName: string = 'CollaboratorCommissionPaymentListComponent';
  formPath = '/collaborator/commission-voucher/form';
  apiPath = '/collaborator/commission-payment-vouchers';
  idKey = 'Code';
  formDialog = CollaboratorCommissionPaymentFormComponent;

  reuseDialog = true;
  static _dialog: NbDialogRef<CollaboratorCommissionPaymentListComponent>;

  // Smart table
  static filterConfig: any;
  static sortConf: any;
  static pagingConf = { page: 1, perPage: 40 };

  constructor(
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<CollaboratorCommissionPaymentListComponent>,
  ) {
    super(apiService, router, cms, dialogService, toastService, ref);
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

  loadListSetting(): SmartTableSetting {
    return this.configSetting({
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
          filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
        },
        ObjectName: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.Object.title'), 'head-title'),
          type: 'string',
          width: '20%',
          filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
        },
        Description: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.description'), 'head-title'),
          type: 'string',
          width: '25%',
          filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
        },
        RelativeVouchers: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.relationVoucher'), 'head-title'),
          type: 'custom',
          renderComponent: SmartTableRelativeVouchersComponent,
          width: '20%',
        },
        Code: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.code'), 'head-title'),
          type: 'string',
          width: '10%',
        },
        Created: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.created'), 'head-title'),
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
          title: this.cms.textTransform(this.cms.translate.instant('Common.numOfMoney'), 'head-title'),
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
          title: this.cms.translateText('Common.approve'),
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
            instance.title = this.cms.translateText('Common.approved');
            instance.label = this.cms.translateText('Common.approved');
            instance.valueChange.subscribe(value => {
              const processMap = AppModule.processMaps.commissionPaymentVoucher[value || ''];
              instance.label = this.cms.translateText(processMap?.label);
              instance.status = processMap?.status;
              instance.outline = processMap?.outline;
              instance.disabled = !this.cms.checkPermission(this.componentName, processMap.nextState);
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: CashVoucherModel) => {
              this.apiService.getPromise<CashVoucherModel[]>(this.apiPath, { id: [rowData.Code], includeContact: true, includeDetails: true, useBaseTimezone: true }).then(rs => {
                this.preview(rs);
              });
            });
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
              // instance.icon = value ? 'unlock' : 'lock';
              // instance.status = value === 'REQUEST' ? 'warning' : 'success';
              // instance.disabled = value !== 'REQUEST';
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: CashVoucherModel) => {

              this.cms.openDialog(ResourcePermissionEditComponent, {
                context: {
                  inputMode: 'dialog',
                  inputId: [rowData.Code],
                  note: 'Click vào nút + để thêm 1 phân quyền, mỗi phân quyền bao gồm người được phân quyền và các quyền mà người đó được thao tác',
                  resourceName: this.cms.translateText('Purchase.PurchaseVoucher  .title', { action: '', definition: '' }) + ` ${rowData.Description || ''}`,
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
        //   State: {
        //     title: this.cms.translateText('Common.approve'),
        //     type: 'custom',
        //     width: '5%',
        //     class: 'align-right',
        //     renderComponent: SmartTableButtonComponent,
        //     onComponentInitFunction: (instance: SmartTableButtonComponent) => {
        //       instance.iconPack = 'eva';
        //       instance.icon = 'checkmark-circle';
        //       instance.display = true;
        //       instance.status = 'warning';
        //       instance.style = 'text-align: right';
        //       instance.class = 'align-right';
        //       instance.title = this.cms.translateText('Common.approve');
        //       instance.valueChange.subscribe(value => {
        //         // instance.icon = value ? 'unlock' : 'lock';
        //         // instance.status = value === 'REQUEST' ? 'warning' : 'success';
        //         instance.disabled = value !== 'REQUEST';
        //       });
        //       instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: CashVoucherModel) => {
        //         // this.cms.openDialog(ShowcaseDialogComponent, {
        //         //   context: {
        //         //     title: this.cms.translateText('Common.confirm'),
        //         //     content: 'Accounting.CashPayment.approveConfirmText',
        //         //     actions: [
        //         //       {
        //         //         label: this.cms.translateText('Common.close'),
        //         //         status: 'primary',
        //         //       },
        //         //       {
        //         //         label: this.cms.translateText('Common.approve'),
        //         //         status: 'danger',
        //         //         action: () => {
        //         //           this.apiService.putPromise<CashVoucherModel[]>('/accounting/cash-vouchers', { id: [rowData.Code], approve: true }, [{ Code: rowData.Code }]).then(rs => {
        //         //             this.refresh();
        //         //           });
        //         //         }
        //         //       },
        //         //     ],
        //         //   },
        //         // });

        //         this.apiService.getPromise('/accounting/cash-vouchers', { id: [rowData.Code], includeDetails: true, includeContact: true }).then(rs => {
        //           this.preview(rs[0]);
        //         });


        //       });
        //     },
        //   }
      },
    });
  }

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
      params['includeRelativeVouchers'] = true;
      params['sort_Created'] = 'desc';
      params['eq_Type'] = 'PAYMENT';
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
    return this.apiService.getPromise<CashVoucherModel[]>(this.apiPath, { id: ids, includeContact: true, includeDetails: true, eq_Type: 'PAYMENT' });
  }

  async preview(data: CashVoucherModel[]) {
    this.cms.openDialog(CollaboratorCommissionPaymentPrintComponent, {
      context: {
        showLoadinng: true,
        title: 'Xem trước',
        data: data,
        idKey: ['Code'],
        sourceOfDialog: 'list',
        // approvedConfirm: true,
        onClose: (data: CashVoucherModel) => {
          this.refresh();
        },
      },
    });
    return false;
  }

}
