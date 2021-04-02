import { Component, OnInit } from '@angular/core';
import { SalesPriceReportModel, SalesVoucherModel } from '../../../../models/sales.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { SalesPriceReportFormComponent } from '../sales-price-report-form/sales-price-report-form.component';
import { SmartTableButtonComponent, SmartTableDateTimeComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { takeUntil } from 'rxjs/operators';
import { SmartTableDateTimeRangeFilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { UserGroupModel } from '../../../../models/user-group.model';
import { SalesPriceReportPrintComponent } from '../sales-price-report-print/sales-price-report-print.component';

@Component({
  selector: 'ngx-sales-price-report-list',
  templateUrl: './sales-price-report-list.component.html',
  styleUrls: ['./sales-price-report-list.component.scss'],
})
export class SalesPriceReportListComponent extends ServerDataManagerListComponent<SalesPriceReportModel> implements OnInit {

  componentName: string = 'SalesPriceReportListComponent';
  formPath = '/sales/price-report/form';
  apiPath = '/sales/price-reports';
  idKey = 'Code';
  formDialog = SalesPriceReportFormComponent;

  reuseDialog = true;
  static _dialog: NbDialogRef<SalesPriceReportListComponent>;

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
    public ref: NbDialogRef<SalesPriceReportListComponent>,
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

  stateDic = { APPROVE: { label: this.commonService.translateText('Common.approved'), status: 'success' }, COMPLETE: { label: this.commonService.translateText('Common.completed'), status: 'danger' } };

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
          instance.label = this.commonService.translateText('Common.copy');
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

            this.commonService.openDialog(SalesPriceReportFormComponent, {
              context: {
                inputMode: 'dialog',
                inputId: [row.Code],
                isDuplicate: true,
                onDialogSave: (newData: SalesPriceReportModel[]) => {
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
            instance.disable = (value === 'APPROVE');
            // instance.icon = value ? 'unlock' : 'lock';
            // instance.status = value === 'REQUEST' ? 'warning' : 'success';
            // instance.disabled = value !== 'REQUEST';
          });
          instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: SalesVoucherModel) => {
            this.apiService.getPromise('/sales/price-reports', { id: [rowData.Code], includeContact: true, includeDetails: true, useBaseTimezone: true }).then(rs => {
              this.preview(rs[0]);
            });
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
          instance.status = 'success';
          instance.style = 'text-align: right';
          instance.class = 'align-right';
          instance.title = this.commonService.translateText('Common.preview');
          instance.valueChange.subscribe(value => {
            // instance.icon = value ? 'unlock' : 'lock';
            // instance.status = value === 'REQUEST' ? 'warning' : 'success';
            // instance.disabled = value !== 'REQUEST';
          });
          instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: SalesVoucherModel) => {
            this.apiService.getPromise('/sales/price-reports', { id: [rowData.Code], includeContact: true, includeDetails: true, useBaseTimezone: true }).then(rs => {
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
      // params['includeParent'] = true;
      params['sort_Created'] = 'desc';
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

  preview(data: SalesPriceReportModel) {
    // data.Details.forEach(detail => {
    //   // if (typeof detail['Tax'] === 'string') {
    //   //   detail['Tax'] = this.taxList.filter(t => t.Code === detail['Tax'])[0] as any;
    //   // }
    // });
    this.commonService.openDialog(SalesPriceReportPrintComponent, {
      context: {
        title: 'Xem trước',
        data: data,
        // approvedConfirm: true,
        onClose: (id: string) => {
          this.refresh();
        },
      },
    });
    return false;
  }

}
