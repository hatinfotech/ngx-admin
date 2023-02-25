import { ProductObjectReferenceModel } from './../../../../models/product.model';
import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent, SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { ProductCategoryModel } from '../../../../models/product.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ProductObjectReferenceFormComponent } from '../product-object-reference-form/product-object-reference-form.component';
import { SmartTableDateRangeFilterComponent, SmartTableSelect2FilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { SmartTableDateTimeComponent, SmartTableTagsComponent, SmartTableThumbnailComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { ImagesViewerComponent } from '../../../../lib/custom-element/my-components/images-viewer/images-viewer.component';

@Component({
  selector: 'ngx-product-object-reference-list',
  templateUrl: './product-object-reference-list.component.html',
  styleUrls: ['./product-object-reference-list.component.scss'],
})
export class ProductObjectReferenceListComponent extends ServerDataManagerListComponent<ProductObjectReferenceModel> implements OnInit {

  componentName: string = 'ProductObjectReferenceListComponent';
  formPath = '/admin-product/product-object-reference/form';
  apiPath = '/admin-product/product-object-references';
  idKey = ['Id'];
  formDialog = ProductObjectReferenceFormComponent;

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
  ) {
    super(apiService, router, commonService, dialogService, toastService);
  }

  editing = {};
  rows = [];

  typeList = [
    { id: 'SUPPLIERPRODUCT', text: 'Tên sản phẩm theo NCC' },
    { id: 'SUPPLIERPRODUCTSKU', text: 'Sku sản phẩm theo NCC' },
    { id: 'SUPPLIERPRODUCTTAX', text: 'Tên thuế sản phẩm theo NCC' },
    { id: 'SUPPLIERPRODUCTAXVALUE', text: 'Thuế theo NCC' },
  ];
  typeMap = {
    SUPPLIERPRODUCT: { id: 'SUPPLIERPRODUCT', text: 'Tên sản phẩm theo NCC' },
    SUPPLIERPRODUCTSKU: { id: 'SUPPLIERPRODUCTSKU', text: 'Sku sản phẩm theo NCC' },
    SUPPLIERPRODUCTTAX: { id: 'SUPPLIERPRODUCTTAX', text: 'Tên thuế sản phẩm theo NCC' },
    SUPPLIERPRODUCTAXVALUE: { id: 'SUPPLIERPRODUCTAXVALUE', text: 'Thuế theo NCC' },
  };

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
        FeaturePicture: {
          title: 'Hình',
          type: 'custom',
          width: '5%',
          // valuePrepareFunction: (value: any, product: ProductModel) => {
          //   return value['Thumbnail'];
          // },
          renderComponent: SmartTableThumbnailComponent,
          onComponentInitFunction: (instance: SmartTableThumbnailComponent) => {
            instance.valueChange.subscribe(value => {
            });
            instance.click.subscribe((row: ProductObjectReferenceModel) => {
              const pictureList = row?.Pictures || [];
              if ((pictureList.length == 0 && row.FeaturePicture?.OriginImage)) {
                pictureList.push(row.FeaturePicture);
              }
              if (pictureList.length > 0) {
                const currentIndex = pictureList.findIndex(f => f.Id == row.FeaturePicture.Id) || 0;
                if (pictureList.length > 1) {
                  const currentItems = pictureList.splice(currentIndex, 1);
                  pictureList.unshift(currentItems[0]);
                }
                this.commonService.openDialog(ImagesViewerComponent, {
                  context: {
                    images: pictureList.map(m => m['OriginImage']),
                    imageIndex: 0,
                  }
                });
              }
            });
            instance.title = this.commonService.translateText('click to change main product picture');
          },
        },
        Product: {
          title: 'Sản phẩm',
          type: 'string',
          width: '20%',
          valuePrepareFunction: (cell, row: ProductObjectReferenceModel) => {
            return `${row.Product} - ${row.ProductOriginName}`;
          },
          filter: {
            type: 'custom',
            component: SmartTableSelect2FilterComponent,
            config: {
              delay: 0,
              condition: 'eq',
              select2Option: {
                ...this.commonService.makeSelect2AjaxOption('/admin-product/products', { includeIdText: true }, {
                  placeholder: 'Chọn sản phẩm...', limit: 10, prepareReaultItem: (item) => {
                    // item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
                    return item;
                  }
                }),
                multiple: true,
                logic: 'OR',
                allowClear: true,
              },
            },
          },
        },
        Object: {
          title: 'Đối tượng',
          type: 'string',
          width: '20%',
          valuePrepareFunction: (cell, row: ProductObjectReferenceModel) => {
            return row.ObjectName;
          },
          filter: {
            type: 'custom',
            component: SmartTableSelect2FilterComponent,
            config: {
              delay: 0,
              condition: 'eq',
              select2Option: {
                ...this.commonService.makeSelect2AjaxOption('/contact/contacts', { includeIdText: true, includeGroups: true }, {
                  placeholder: 'Chọn liên hệ...', limit: 10, prepareReaultItem: (item) => {
                    item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
                    return item;
                  }
                }),
                multiple: true,
                logic: 'OR',
                allowClear: true,
              },
            },
          },
        },
        Type: {
          title: 'Loại',
          type: 'string',
          width: '10%',
          valuePrepareFunction: (cell, row: ProductObjectReferenceModel) => {
            return this.typeMap[cell] && this.commonService.getObjectText(this.typeMap[cell]) || cell;
          },
          filter: {
            type: 'custom',
            component: SmartTableSelect2FilterComponent,
            config: {
              delay: 0,
              condition: 'eq',
              select2Option: {
                placeholder: 'Chọn...',
                allowClear: true,
                width: '100%',
                dropdownAutoWidth: true,
                minimumInputLength: 0,
                withThumbnail: false,
                multiple: true,
                keyMap: {
                  id: 'id',
                  text: 'text',
                },
                logic: 'OR',
                data: this.typeList
              },
            },
          },
        },
        ReferenceValue: {
          title: 'Giá trị theo đối tượng',
          type: 'string',
          width: '20%',
        },
        LastUpdate: {
          title: 'Cập nhật cuối',
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
        ReferenceCode: {
          title: 'Chứng từ liên quan',
          type: 'custom',
          renderComponent: SmartTableTagsComponent,
          valuePrepareFunction: (cell: string, row: ProductObjectReferenceModel) => {
            return [{ id: cell, text: cell, type: row.ReferenceCode.replace(/^(\d{3})(.*)/, '$1') }] as any;
          },
          onComponentInitFunction: (instance: SmartTableTagsComponent) => {
            instance.click.subscribe((tag: { id: string, text: string, type: string }) => {
              tag.type && this.commonService.previewVoucher(tag.type, tag.id, null, (data, printComponent) => {
                // this.refresh();
              });
            });
          },
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
    source.prepareData = (data: ProductObjectReferenceModel[]) => {
      data.map((product: ProductObjectReferenceModel) => {
        // if (product.WarehouseUnit && product.WarehouseUnit.Name) {
        //   product.WarehouseUnit.text = product.WarehouseUnit.Name;
        // }

        // if (product.Units && product.Units.length > 0) {
        //   product.Containers = product.Units.filter(f => !!f['Container']).map(m => m['Container']);
        //   for (const unitConversion of product.Units) {
        //     if (unitConversion.IsManageByAccessNumber) {
        //       unitConversion['status'] = 'danger';
        //       unitConversion['tip'] = unitConversion['text'] + ' (QL theo số truy xuất)';
        //     }
        //   }
        // }

        // if (product.Container || product.Container.length > 0) {
        //   // product.Container = [product.Container];
        // } else {
        //   product.Container = { type: 'NEWCONTAINER', id: 'Gán vị trí', text: 'Gán vị trí' };
        // }

        return product;
      });
      return data;
    };

    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {
      // params['includeCategories'] = true;
      // params['includeGroups'] = true;
      // params['includeWarehouseUnit'] = true;
      // params['includeUnits'] = true;
      // params['includeCreator'] = true;
      // params['includeLastUpdateBy'] = true;

      params['sort_Id'] = 'desc';
      return params;
    };

    return source;
  }

  /** Api get funciton */
  executeGet(params: any, success: (resources: ProductObjectReferenceModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: ProductObjectReferenceModel[] | HttpErrorResponse) => void) {
    params['includeCategories'] = true;
    super.executeGet(params, success, error, complete);
  }

  getList(callback: (list: ProductObjectReferenceModel[]) => void) {
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

