import { ProductKeywordModel } from '../../../../models/product.model';
import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent, SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { ProductCategoryModel } from '../../../../models/product.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ProductKeywordFormComponent } from '../product-keyword-form/product-keyword-form.component';
import { SmartTableDateRangeFilterComponent, SmartTableSelect2FilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { SmartTableDateTimeComponent, SmartTableTagsComponent, SmartTableThumbnailComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { ImagesViewerComponent } from '../../../../lib/custom-element/my-components/images-viewer/images-viewer.component';

@Component({
  selector: 'ngx-product-keyword-list',
  templateUrl: './product-keyword-list.component.html',
  styleUrls: ['./product-keyword-list.component.scss'],
})
export class ProductKeywordListComponent extends ServerDataManagerListComponent<ProductKeywordModel> implements OnInit {

  componentName: string = 'ProductKeywordListComponent';
  formPath = '/admin-product/product-keyword/form';
  apiPath = '/admin-product/keywords';
  idKey = 'Id';
  formDialog = ProductKeywordFormComponent;

  constructor(
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
  ) {
    super(apiService, router, cms, dialogService, toastService);
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
      // add: this.configAddButton(),
      // edit: this.configEditButton(),
      // delete: this.configDeleteButton(),
      // pager: this.configPaging(),
      columns: {
        Id: {
          title: 'ID',
          type: 'string',
          width: '10%',
        },
        Keyword: {
          title: 'Từ khóa',
          type: 'string',
          width: '90%',
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
    source.prepareData = (data: ProductKeywordModel[]) => {
      data.map((product: ProductKeywordModel) => {
        return product;
      });
      return data;
    };

    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {
      params['sort_Id'] = 'desc';
      return params;
    };

    return source;
  }

  /** Api get funciton */
  executeGet(params: any, success: (resources: ProductKeywordModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: ProductKeywordModel[] | HttpErrorResponse) => void) {
    params['includeCategories'] = true;
    super.executeGet(params, success, error, complete);
  }

  getList(callback: (list: ProductKeywordModel[]) => void) {
    super.getList((rs) => {
      if (callback) callback(rs);
    });
  }
}

