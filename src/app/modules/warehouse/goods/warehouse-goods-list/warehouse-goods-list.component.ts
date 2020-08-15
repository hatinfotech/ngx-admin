import { Component, OnInit } from '@angular/core';
import { ProductListComponent } from '../../../admin-product/product/product-list/product-list.component';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { WarehouseGoodsFormComponent } from '../warehouse-goods-form/warehouse-goods-form.component';
import { AssignContainerFormComponent } from '../assign-containers-form/assign-containers-form.component';
import { ProductModel, ProductUnitConversoinModel } from '../../../../models/product.model';
import { SmartTableThumbnailComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableSelect2FilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { UnitModel } from '../../../../models/unit.model';
import { GoodsModel } from '../../../../models/warehouse.model';

@Component({
  selector: 'ngx-warehouse-goods-list',
  templateUrl: './warehouse-goods-list.component.html',
  styleUrls: ['./warehouse-goods-list.component.scss'],
})
export class WarehouseGoodsListComponent extends ProductListComponent implements OnInit {

  componentName: string = 'WarehouseGoodsListComponent';
  formPath = '/warehouse/goods/form';
  apiPath = '/warehouse/goods';
  idKey: string | string[] = ['Code', 'WarehouseUnit'];
  formDialog = WarehouseGoodsFormComponent;

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
            if (this.files.length === 0) {
              this.uploadForProduct = row;
              this.uploadBtn.nativeElement.click();
            } else {
              this.commonService.toastService.show(
                this.commonService.translateText('Common.uploadInProcess'),
                this.commonService.translateText('Common.upload'),
                {
                  status: 'warning',
                });
              // this.commonService.openDialog(ShowcaseDialogComponent, {
              //   context: {
              //     title: this.commonService.translateText('Common.upload'),
              //     content: this.commonService.translateText('Common.uploadInProcess'),
              //   },
              // });
            }
          });
          instance.title = this.commonService.translateText('click to change main product picture');
        },
      },
      Name: {
        title: 'Tên',
        type: 'string',
        width: '15%',
      },
      Categories: {
        title: 'Danh mục',
        type: 'html',
        width: '20%',
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
      Container: {
        title: this.commonService.translateText('Warehouse.GoodsContainer.title', { action: '', definition: '' }),
        type: 'html',
        width: '15%',
        valuePrepareFunction: (value: string, product: GoodsModel) => {
          return  this.commonService.getObjectText(value);
          // try {
          //   return product['Containers'] ? ('<span class="tag">' + product['Containers'].filter(container => !!container['Container']).map(container => container['Container']['Path']).join('</span><span class="tag">') + '</span>') : '';
          // } catch (e) {
          //   return '';
          // }
        },
        filter: {
          type: 'custom',
          component: SmartTableSelect2FilterComponent,
          config: {
            delay: 0,
            select2Option: {
              placeholder: this.commonService.translateText('Warehouse.GoodsContainer.title', {action: this.commonService.translateText('Common.choose'), definition: ''}),
              allowClear: true,
              width: '100%',
              dropdownAutoWidth: true,
              minimumInputLength: 0,
              keyMap: {
                id: 'id',
                text: 'text',
              },
              multiple: true,
              logic: 'OR',
              ajax: {
                url: (params: any) => {
                  return 'data:text/plan,[]';
                },
                delay: 0,
                processResults: (data: any, params: any) => {
                  return {
                    results: this.containerList.filter(cate => !params.term || this.commonService.smartFilter(cate.text, params.term)),
                  };
                },
              },
            },
          },
        },
      },
      ConversionUnit: {
        title: 'ĐVT',
        type: 'html',
        width: '10%',
        valuePrepareFunction: (value: string, product: ProductModel) => {
          return product.UnitConversions instanceof Array ? (product.UnitConversions.map((uc: UnitModel & ProductUnitConversoinModel) => (uc.Unit === this.commonService.getObjectId(product['WarehouseUnit']) ? `<b>${uc.Name}</b>` : uc.Name)).join(', ')) : this.commonService.getObjectText(product['WarehouseUnit']);
        },
        filter: {
          type: 'custom',
          component: SmartTableSelect2FilterComponent,
          config: {
            delay: 0,
            select2Option: {
              placeholder: this.commonService.translateText('AdminProduct.Unit.title', {action: this.commonService.translateText('Common.choose'), definition: ''}),
              allowClear: true,
              width: '100%',
              dropdownAutoWidth: true,
              minimumInputLength: 0,
              keyMap: {
                id: 'id',
                text: 'text',
              },
              multiple: true,
              logic: 'OR',
              ajax: {
                url: (params: any) => {
                  return 'data:text/plan,[]';
                },
                delay: 0,
                processResults: (data: any, params: any) => {
                  return {
                    results: this.unitList.filter(cate => !params.term || this.commonService.smartFilter(cate.text, params.term)),
                  };
                },
              },
            },
          },
        },
      },
      Code: {
        title: 'Code',
        type: 'string',
        width: '5%',
      },
      Sku: {
        title: 'Sku',
        type: 'string',
        width: '10%',
      },
      Inventory: {
        title: this.commonService.translateText('Warehouse.inventory'),
        type: 'string',
        width: '10%',
      },
    },
  });

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<WarehouseGoodsListComponent>,
  ) {
    super(apiService, router, commonService, dialogService, toastService, _http, ref);
    this.actionButtonList.map(button => {
      if (button.name === 'assignCategories') {
        button.name = 'assginContainer';
        button.label = this.commonService.translateText('Warehouse.assignContainer');
        button.title = this.commonService.translateText('Warehouse.assignContainer');
        button.click = (event, option) => {
          this.openAssignContainersDialog();
        };
      }
      return button;
    });
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  initDataSource() {
    const source = super.initDataSource();

    // Set DataSource: prepareData
    source.prepareData = (data: ProductModel[]) => {
      data.map((product: ProductModel) => {
        if (product.WarehouseUnit && product.WarehouseUnit.Name) {
          product.WarehouseUnit.text = product.WarehouseUnit.Name;
        }
        return product;
      });
      return data;
    };

    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {
      params['includeCategories'] = true;
      params['includeFeaturePicture'] = true;
      params['includeUnit'] = true;
      params['includeContainer'] = true;
      params['includeInventory'] = true;
      // params['includeUnitConversions'] = true;
      params['sort_Id'] = 'desc';
      return params;
    };

    return source;
  }

  /** Implement required */
  async openAssignContainersDialog() {
    if (this.selectedIds.length > 0) {
      const editedItems = await this.convertIdsToItems(this.selectedIds);
      this.commonService.openDialog(AssignContainerFormComponent, {
        context: {
          inputMode: 'dialog',
          inputGoodsList: this.selectedItems,
          onDialogSave: (newData: ProductModel[]) => {
            this.refresh();
            // this.updateGridItems(editedItems, newData);
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
