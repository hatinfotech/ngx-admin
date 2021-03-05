import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { SmartTableCurrencyComponent } from '../../../../../lib/custom-element/smart-table/smart-table.component';
import { ServerDataManagerListComponent } from '../../../../../lib/data-manager/server-data-manger-list.component';
import { UserGroupModel } from '../../../../../models/user-group.model';
import { ApiService } from '../../../../../services/api.service';
import { CommonService } from '../../../../../services/common.service';
import { ProductListComponent } from '../../../../admin-product/product/product-list/product-list.component';
import { CashReceiptVoucherFormComponent } from '../cash-receipt-voucher-form/cash-receipt-voucher-form.component';

@Component({
  selector: 'ngx-cash-receipt-voucher-list',
  templateUrl: './cash-receipt-voucher-list.component.html',
  styleUrls: ['./cash-receipt-voucher-list.component.scss']
})
export class CashReceiptVoucherListComponent extends ServerDataManagerListComponent<UserGroupModel> implements OnInit {

  componentName: string = 'CashReceiptVoucherListComponent';
  formPath = '/accounting/cash-receipt-voucher/form';
  apiPath = '/accounting/cash-vouchers';
  idKey = 'Code';
  formDialog = CashReceiptVoucherFormComponent;

  reuseDialog = true;
  static _dialog: NbDialogRef<ProductListComponent>;

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
    public ref: NbDialogRef<ProductListComponent>,
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
        title: 'Object',
        type: 'string',
        width: '20%',
        filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
      },
      Description: {
        title: 'Description',
        type: 'string',
        width: '30%',
        filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
      },
      RelationVoucher: {
        title: 'Relation Voucher',
        type: 'string',
        width: '20%',
      },
      Code: {
        title: 'Mã',
        type: 'string',
        width: '10%',
      },
      Amount: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.amount'), 'head-title'),
        type: 'custom',
        width: '10%',
        position: 'right',
        renderComponent: SmartTableCurrencyComponent,
        onComponentInitFunction: (instance: SmartTableCurrencyComponent) => {
          // instance.format$.next('medium');
        },
      },
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

}
