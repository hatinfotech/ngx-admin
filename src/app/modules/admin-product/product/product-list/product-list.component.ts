import { Component, OnInit } from '@angular/core';
import { ProductModel, ProductCategoryModel } from '../../../../models/product.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { SmartTableThumbnailComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableSelect2FilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { AssignCategoriesFormComponent } from '../assign-categories-form/assign-categories-form.component';

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
  formDialog = ProductFormComponent;

  reuseDialog = true;
  static _dialog: NbDialogRef<ProductListComponent>;

  // Smart table
  static filterConfig: any;
  static sortConf: any;
  static pagingConf = { page: 1, perPage: 40 };

  // Category list for filter
  categoryList: (ProductCategoryModel & { id?: string, text?: string })[] = [];

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

    // Append assign category buton
    this.actionButtonList.unshift({
      name: 'assign',
      status: 'info',
      label: this.commonService.textTransform(this.commonService.translate.instant('Common.tag'), 'head-title'),
      icon: 'pricetags',
      title: this.commonService.textTransform(this.commonService.translate.instant('Common.tag'), 'head-title'),
      size: 'medium',
      disabled: () => this.selectedIds.length === 0,
      hidden: () => false,
      click: () => {
        this.openAssignCategoiesDialplog();
        return false;
      },
    });
  }

  async loadCache() {
    // iniit category
    this.categoryList = (await this.apiService.getPromise<ProductCategoryModel[]>('/admin-product/categories', {})).map(cate => ({ ...cate, id: cate.Code, text: cate.Name })) as any;
  }

  async init() {
    await this.loadCache();
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
      FeaturePictureThumbnail: {
        title: 'Hình',
        type: 'custom',
        width: '5%',
        valuePrepareFunction: (value: string, product: ProductModel) => {
          return product['FeaturePictureThumbnail'] ? product['FeaturePictureThumbnail'] + '?token=' + this.apiService.getAccessToken() : '';
        },
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
        width: '25%',
        // filter: {
        //   type: 'custom',
        //   component: SmartTableFilterComponent,
        //   config: {
        //     delay: 3000,
        //   },
        // },
      },
      Categories: {
        title: 'Danh mục',
        type: 'html',
        width: '25%',
        valuePrepareFunction: (value: string, product: ProductModel) => {
          return product['Categories'] ? ('<span class="tag">' + product['Categories'].map(cate => cate['text']).join('</span><span class="tag">') + '</span>') : '';
        },
        filter: {
          type: 'custom',
          component: SmartTableSelect2FilterComponent,
          config: {
            delay: 0,
            select2Option: {
              placeholder: 'Chọn danh mục...',
              allowClear: true,
              width: '100%',
              dropdownAutoWidth: true,
              minimumInputLength: 0,
              keyMap: {
                id: 'id',
                text: 'text',
              },
              multiple: true,
              // code template: smart-table fiter with data update
              ajax: {
                url: (params: any) => {
                  return 'data:text/plan,[]';
                },
                delay: 0,
                processResults: (data: any, params: any) => {
                  return {
                    results: this.categoryList.filter(cate => !params.term || this.commonService.smartFilter(cate.text, params.term)),
                  };
                },
              },
            },
          },
        },
      },
      WarehouseUnit: {
        title: 'ĐVT',
        type: 'string',
        width: '10%',
        valuePrepareFunction: (value: string, product: ProductModel) => {
          return product['WarehouseUnit'] ? product['WarehouseUnit']['Name'] : '';
        },
      },
      Code: {
        title: 'Code',
        type: 'string',
        width: '10%',
      },
      Sku: {
        title: 'Sku',
        type: 'string',
        width: '15%',
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
        // if (product['WarehouseUnit']) {
        //   product['WarehouseUnit'] = product['WarehouseUnit']['Name'];
        // }
        // if (product['Categories']) {
        //   product['Categories'] = product['Categories'].map(cate => cate['text']).join(', ');
        // }
        // if (product['FeaturePictureThumbnail']) {
        //   product['FeaturePictureThumbnail'] += '?token=' + this.apiService.getAccessToken();
        // } else {
        //   delete product['FeaturePictureThumbnail'];
        // }
        return product;
      });
      return data;
    };

    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {
      params['includeCategories'] = true;
      params['includeUnit'] = true;
      params['includeFeaturePicture'] = true;
      params['includeUnitConversions'] = true;
      params['sort_Id'] = 'desc';
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

  /** Implement required */
  // openFormDialplog(ids?: string[], onDialogSave?: (newData: ProductModel[]) => void, onDialogClose?: () => void) {
  //   this.dialogService.open(ProductFormComponent, {
  //     context: {
  //       inputMode: 'dialog',
  //       inputId: ids,
  //       onDialogSave: (newData: ProductModel[]) => {
  //         if (onDialogSave) onDialogSave(newData);
  //         this.loadCache();
  //       },
  //       onDialogClose: () => {
  //         if (onDialogClose) onDialogClose();
  //         this.refresh();
  //       },
  //     },
  //     closeOnEsc: false,
  //     closeOnBackdropClick: false,
  //   });
  // }

  // /** Go to form */
  // gotoForm(id?: string): false {
  //   this.openFormDialplog(id ? decodeURIComponent(id).split('&') : null);
  //   return false;
  // }

  /** Implement required */
  openAssignCategoiesDialplog() {
    if (this.selectedIds.length > 0) {
      this.dialogService.open(AssignCategoriesFormComponent, {
        context: {
          inputMode: 'dialog',
          inputProducts: this.selectedItems,
          onDialogSave: (newData: ProductModel[]) => {
            this.refresh();
          },
          onDialogClose: () => {
          },
        },
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    }
  }

}
