import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent } from '../../../../lib/data-manager/data-manger-list.component';
import { ProductModel } from '../../../../models/product.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/searver-data-manger-list.component';
import { SmartTableThumbnailComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';

@Component({
  selector: 'ngx-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent extends ServerDataManagerListComponent<ProductModel> implements OnInit {

  componentName: string = 'ProductListComponent';
  formPath = '/admin-product/product/form';
  apiPath = '/admin-product/products';
  idKey = 'Code';

  constructor(
    protected apiService: ApiService,
    public router: Router,
    protected commonService: CommonService,
    protected dialogService: NbDialogService,
    protected toastService: NbToastrService,
    protected _http: HttpClient,
  ) {
    super(apiService, router, commonService, dialogService, toastService);
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
      FeaturePictureThumbnail: {
        title: 'Hình',
        type: 'custom',
        width: '5%',
        renderComponent: SmartTableThumbnailComponent,
        onComponentInitFunction: (instance: SmartTableThumbnailComponent) => {
          instance.valueChange.subscribe(value => {
          });
          instance.click.subscribe(async (row: ProductModel) => {
          });
        },
      },
      Name: {
        title: 'Tên',
        type: 'string',
        width: '40%',
      },
      Categories: {
        title: 'Danh mục',
        type: 'string',
        width: '25%',
      },
      WarehouseUnit: {
        title: 'ĐVT',
        type: 'string',
        width: '10%',
      },
      Code: {
        title: 'Code',
        type: 'string',
        width: '10%',
      },
      //   Copy: {
      //     title: 'Copy',
      //     type: 'custom',
      //     width: '10%',
      //     renderComponent: SmartTableButtonComponent,
      //     onComponentInitFunction: (instance: SmartTableButtonComponent) => {
      //       instance.iconPack = 'eva';
      //       instance.icon = 'copy';
      //       instance.label = 'Copy nội dung sang site khác';
      //       instance.display = true;
      //       instance.status = 'success';
      //       instance.valueChange.subscribe(value => {
      //         // if (value) {
      //         //   instance.disabled = false;
      //         // } else {
      //         //   instance.disabled = true;
      //         // }
      //       });
      //       instance.click.subscribe(async (row: ProductModel) => {

      //         this.dialogService.open(SyncFormComponent, {
      //           context: {
      //             inputMode: 'dialog',
      //             inputId: [row.Code],
      //             onDialogSave: (newData: ProductModel[]) => {
      //               // if (onDialogSave) onDialogSave(row);
      //             },
      //             onDialogClose: () => {
      //               // if (onDialogClose) onDialogClose();
      //               this.refresh();
      //             },
      //           },
      //         });

      //       });
      //     },
      //   },
    },
  });

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  initDataSource() {
    const source = super.initDataSource();

    // Set DataSource: prepareData
    source.prepareData = (data: ProductModel[]) => {
      data.map((product: any) => {
        product['WarehouseUnit'] = product['WarehouseUnit']['Name'];
        if (product['Categories']) {
          product['Categories'] = product['Categories'].map(cate => cate['text']).join(', ');
        }
        if (product['FeaturePictureThumbnail']) {
          product['FeaturePictureThumbnail'] += '?token=' + this.apiService.getAccessToken();
        } else {
          delete product['FeaturePictureThumbnail'];
        }
        return product;
      });
      return data;
    };

    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {
      params['includeCategories'] = true;
      params['includeUnit'] = true;
      params['includeFeaturePicture'] = true;
      return params;
    };

    return source;
  }

  /** Api get funciton */
  executeGet(params: any, success: (resources: ProductModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: ProductModel[] | HttpErrorResponse) => void) {
    params['includeCategories'] = true;
    super.executeGet(params, success, error, complete);
  }

  getList(callback: (list: ProductModel[]) => void) {
    super.getList((rs) => {
      rs.map((product: any) => {
        product['Unit'] = product['Unit']['Name'];
        if (product['Categories']) {
          product['Categories'] = product['Categories'].map(cate => cate['text']).join(', ');
        }
        return product;
      });
      if (callback) callback(rs);
    });
  }

  /** Implement required */
  openFormDialplog(ids?: string[], onDialogSave?: (newData: ProductModel[]) => void, onDialogClose?: () => void) {
    this.dialogService.open(ProductFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: ids,
        onDialogSave: (newData: ProductModel[]) => {
          if (onDialogSave) onDialogSave(newData);
        },
        onDialogClose: () => {
          if (onDialogClose) onDialogClose();
          this.refresh();
        },
      },
      closeOnEsc: false,
      closeOnBackdropClick: false,
    });
  }

  /** Go to form */
  gotoForm(id?: string): false {
    this.openFormDialplog(id ? decodeURIComponent(id).split('&') : null);
    return false;
  }

}
