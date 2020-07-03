import { Component, OnInit } from '@angular/core';
import { ProductModel } from '../../../../models/product.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { SmartTableThumbnailComponent, SmartTableCheckboxComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableFilterComponent, SmartTableSelect2FilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { ProductFormDialogComponent } from '../product-form-dialog/product-form-dialog.component';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { takeUntil } from 'rxjs/operators';
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

  constructor(
    protected apiService: ApiService,
    public router: Router,
    protected commonService: CommonService,
    protected dialogService: NbDialogService,
    protected toastService: NbToastrService,
    protected _http: HttpClient,
    protected ref?: NbDialogRef<ProductListComponent>,
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
        type: 'string',
        width: '25%',
        filter: {
          type: 'custom',
          component: SmartTableSelect2FilterComponent,
          config: {
            delay: 1000,
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
              ajax: {
                url: (params: any) => {
                  return this.apiService.buildApiUrl('/admin-product/categories', { 'filter_Name': params['term'] ? params['term'] : '', select: 'id=>Code,text=>Name' });
                },
                delay: 300,
                processResults: (data: any, params: any) => {
                  console.info(data, params);
                  return {
                    results: data.map(item => {
                      // item['id'] = item['Code'];
                      // item['text'] = item['Name'];
                      delete item['Id'];
                      return item;
                    }),
                  };
                },
              },
            }

          }
        },
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
        if (product['WarehouseUnit']) {
          product['WarehouseUnit'] = product['WarehouseUnit']['Name'];
        }
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

  /** Implement required */
  openAssignCategoiesDialplog() {
    if (this.selectedIds.length > 0) {
      this.dialogService.open(AssignCategoriesFormComponent, {
        context: {
          inputMode: 'dialog',
          inputProducts: this.selectedItems,
          onDialogSave: (newData: ProductModel[]) => {

          },
          onDialogClose: () => {

            this.refresh();
          },
        },
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    }
  }

}
