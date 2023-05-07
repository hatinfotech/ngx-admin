import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { SmartTableDateTimeComponent, SmartTableCurrencyComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableDateTimeRangeFilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { UserGroupModel } from '../../../../models/user-group.model';
import { ZaloOaTemplateModel } from '../../../../models/zalo-oa.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { CashReceiptVoucherPrintComponent } from '../../../accounting/cash/receipt/cash-receipt-voucher-print/cash-receipt-voucher-print.component';
import { ProductListV1Component } from '../../../admin-product/product/product-list-v1/product-list.component';
import { ZaloOaTemplateFormComponent } from '../zalo-oa-template-form/zalo-oa-template-form.component';

@Component({
  selector: 'ngx-zalo-oa-template-list',
  templateUrl: './zalo-oa-template-list.component.html',
  styleUrls: ['./zalo-oa-template-list.component.scss']
})
export class ZaloOaTemplateListComponent extends ServerDataManagerListComponent<ZaloOaTemplateModel> implements OnInit {

  componentName: string = 'ZaloOaTemplateListComponent';
  formPath = '/zalo-oa/template/form';
  apiPath = '/zalo-oa/templates';
  idKey = 'Code';
  formDialog = ZaloOaTemplateFormComponent;

  reuseDialog = true;
  static _dialog: NbDialogRef<ZaloOaTemplateListComponent>;

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
    public ref: NbDialogRef<ZaloOaTemplateListComponent>,
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
        Name: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.name'), 'head-title'),
          type: 'string',
          width: '20%',
          filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
        },
        Description: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.description'), 'head-title'),
          type: 'string',
          width: '20%',
          filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
        },
        TemplateId: {
          title: this.cms.textTransform(this.cms.translate.instant('ZaloOa.Tempalte.id'), 'head-title'),
          type: 'string',
          width: '20%',
        },
        ZaloOa: {
          title: this.cms.textTransform(this.cms.translate.instant('ZaloOa.Oa.name'), 'head-title'),
          type: 'string',
          width: '10%',
          renderComponent: SmartTableDateTimeComponent,
          onComponentInitFunction: (instance: SmartTableDateTimeComponent) => {
            // instance.format$.next('medium');
          },
        },
        Code: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.code'), 'head-title'),
          type: 'string',
          width: '10%',
        },
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
      // params['includeParent'] = true;
      // params['sort_Created'] = 'desc';
      // params['eq_Type'] = 'RECEIPT';
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
    return this.apiService.getPromise<ZaloOaTemplateModel[]>(this.apiPath, { id: ids });
  }

  async preview(data: ZaloOaTemplateModel[]) {
    this.cms.openDialog(CashReceiptVoucherPrintComponent, {
      context: {
        showLoadinng: true,
        title: 'Xem trước',
        data: data,
        idKey: ['Code'],
        // approvedConfirm: true,
        onClose: (data: ZaloOaTemplateModel) => {
          this.refresh();
        },
      },
    });
    return false;
  }

}
