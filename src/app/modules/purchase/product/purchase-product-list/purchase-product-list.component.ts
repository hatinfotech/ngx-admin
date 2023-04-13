import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent, SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { ProductCategoryModel } from '../../../../models/product.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PurchaseProductFormComponent } from '../purchase-product-form/purchase-product-form.component';
import { SmartTableDateRangeFilterComponent, SmartTableSelect2FilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { SmartTableDateTimeComponent, SmartTableTagsComponent, SmartTableThumbnailComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { ImagesViewerComponent } from '../../../../lib/custom-element/my-components/images-viewer/images-viewer.component';
import { PurchaseProductModel } from '../../../../models/purchase.model';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'ngx-purchase-product-list',
  templateUrl: './purchase-product-list.component.html',
  styleUrls: ['./purchase-product-list.component.scss'],
  providers: [DecimalPipe],
})
export class PurchaseProductListComponent extends ServerDataManagerListComponent<PurchaseProductModel> implements OnInit {

  componentName: string = 'PurchaseProductListComponent';
  formPath = '/purchase/product/form';
  apiPath = '/purchase/products';
  idKey = ['Id'];
  formDialog = PurchaseProductFormComponent;

  constructor(
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public decimalPipe: DecimalPipe,
    public _http: HttpClient,
  ) {
    super(apiService, router, cms, dialogService, toastService);
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
        Id: {
          title: 'ID',
          type: 'string',
          width: '2%',
        },
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
            instance.click.subscribe((row: PurchaseProductModel) => {
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
                this.cms.openDialog(ImagesViewerComponent, {
                  context: {
                    images: pictureList.map(m => m['OriginImage']),
                    imageIndex: 0,
                  }
                });
              }
            });
            instance.title = this.cms.translateText('click to change main product picture');
          },
        },
        Product: {
          title: 'Sản phẩm',
          type: 'string',
          width: '20%',
          valuePrepareFunction: (cell, row: PurchaseProductModel) => {
            return `${row.Product}/${row.OriginalSku} - ${row.OriginalName}`;
          },
          filter: {
            type: 'custom',
            component: SmartTableSelect2FilterComponent,
            config: {
              delay: 0,
              condition: 'eq',
              select2Option: {
                ...this.cms.makeSelect2AjaxOption('/admin-product/products', { includeIdText: true }, {
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
        Supplier: {
          title: 'Đối tượng',
          type: 'string',
          width: '20%',
          valuePrepareFunction: (cell, row: PurchaseProductModel) => {
            return row.SupplierName;
          },
          filter: {
            type: 'custom',
            component: SmartTableSelect2FilterComponent,
            config: {
              delay: 0,
              condition: 'eq',
              select2Option: {
                ...this.cms.makeSelect2AjaxOption('/contact/contacts', { includeIdText: true, includeGroups: true }, {
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
        Name: {
          title: 'Tên theo NCC',
          type: 'string',
          width: '15%',
        },
        Sku: {
          title: 'Sku NCC',
          type: 'string',
          width: '5%',
        },
        TaxName: {
          title: 'Tên thuế',
          type: 'string',
          width: '15%',
        },
        TaxValue: {
          title: 'Thuế',
          type: 'string',
          width: '5%',
          valuePrepareFunction: (cell, row: PurchaseProductModel) => {
            return this.decimalPipe.transform(cell) + '%';
          },
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
        ReferenceVoucher: {
          title: 'Chứng từ liên quan',
          type: 'custom',
          renderComponent: SmartTableTagsComponent,
          valuePrepareFunction: (cell: string, row: PurchaseProductModel) => {
            return [{ id: cell, text: cell, type: row.ReferenceVoucher.replace(/^(\d{3})(.*)/, '$1') }] as any;
          },
          onComponentInitFunction: (instance: SmartTableTagsComponent) => {
            instance.click.subscribe((tag: { id: string, text: string, type: string }) => {
              tag.type && this.cms.previewVoucher(tag.type, tag.id, null, (data, printComponent) => {
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
    source.prepareData = (data: PurchaseProductModel[]) => {
      data.map((product: PurchaseProductModel) => {
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
  executeGet(params: any, success: (resources: PurchaseProductModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: PurchaseProductModel[] | HttpErrorResponse) => void) {
    params['includeCategories'] = true;
    super.executeGet(params, success, error, complete);
  }

  getList(callback: (list: PurchaseProductModel[]) => void) {
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

