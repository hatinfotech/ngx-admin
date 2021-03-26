import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { takeUntil } from 'rxjs/operators';
import { SmartTableDateTimeComponent, SmartTableCurrencyComponent, SmartTableButtonComponent } from '../../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableDateTimeRangeFilterComponent } from '../../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { ServerDataManagerListComponent } from '../../../../../lib/data-manager/server-data-manger-list.component';
import { CashVoucherModel } from '../../../../../models/accounting.model';
import { UserGroupModel } from '../../../../../models/user-group.model';
import { ApiService } from '../../../../../services/api.service';
import { CommonService } from '../../../../../services/common.service';
import { CashPaymentVoucherFormComponent } from '../cash-payment-voucher-form/cash-payment-voucher-form.component';
import { CashPaymentVoucherPrintComponent } from '../cash-payment-voucher-print/cash-payment-voucher-print.component';

@Component({
  selector: 'ngx-cash-payment-voucher-list',
  templateUrl: './cash-payment-voucher-list.component.html',
  styleUrls: ['./cash-payment-voucher-list.component.scss']
})
export class CashPaymentVoucherListComponent extends ServerDataManagerListComponent<UserGroupModel> implements OnInit {

  componentName: string = 'CashPaymentVoucherListComponent';
  formPath = '/accounting/cash-payment-voucher/form';
  apiPath = '/accounting/cash-vouchers';
  idKey = 'Code';
  formDialog = CashPaymentVoucherFormComponent;

  reuseDialog = true;
  static _dialog: NbDialogRef<CashPaymentVoucherListComponent>;

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
    public ref: NbDialogRef<CashPaymentVoucherListComponent>,
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
      RelationVoucher: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.relationVoucher'), 'head-title'),
        type: 'string',
        width: '20%',
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
        class: 'align-right',
        renderComponent: SmartTableButtonComponent,
        onComponentInitFunction: (instance: SmartTableButtonComponent) => {
          instance.iconPack = 'eva';
          instance.icon = 'checkmark-circle';
          instance.display = true;
          instance.status = 'warning';
          instance.style = 'text-align: right';
          instance.class = 'align-right';
          instance.title = this.commonService.translateText('Common.approve');
          instance.valueChange.subscribe(value => {
            // instance.icon = value ? 'unlock' : 'lock';
            // instance.status = value === 'REQUEST' ? 'warning' : 'success';
            instance.disabled = value !== 'REQUEST';
          });
          instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: CashVoucherModel) => {
            // this.commonService.openDialog(ShowcaseDialogComponent, {
            //   context: {
            //     title: this.commonService.translateText('Common.confirm'),
            //     content: 'Accounting.CashPayment.approveConfirmText',
            //     actions: [
            //       {
            //         label: this.commonService.translateText('Common.close'),
            //         status: 'primary',
            //       },
            //       {
            //         label: this.commonService.translateText('Common.approve'),
            //         status: 'danger',
            //         action: () => {
            //           this.apiService.putPromise<CashVoucherModel[]>('/accounting/cash-vouchers', { id: [rowData.Code], approve: true }, [{ Code: rowData.Code }]).then(rs => {
            //             this.refresh();
            //           });
            //         }
            //       },
            //     ],
            //   },
            // });

            this.apiService.getPromise('/accounting/cash-vouchers', { id: [rowData.Code], includeDetails: true, includeContact: true }).then(rs => {
              this.preview(rs[0]);
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

  preview(data: CashVoucherModel) {
    // data.Details.forEach(detail => {
    //   // if (typeof detail['Tax'] === 'string') {
    //   //   detail['Tax'] = this.taxList.filter(t => t.Code === detail['Tax'])[0] as any;
    //   // }
    // });
    this.commonService.openDialog(CashPaymentVoucherPrintComponent, {
      context: {
        title: 'Xem trước',
        data: data,
        approvedConfirm: true,
        onClose: (id: string) => {
          this.refresh();
        },
      },
    });
    return false;
  }

}
