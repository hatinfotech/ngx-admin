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
import { SmartTableButtonComponent, SmartTableThumbnailComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableSelect2FilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { UnitModel } from '../../../../models/unit.model';
import { GoodsModel, WarehouseGoodsContainerModel } from '../../../../models/warehouse.model';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { ShowcaseDialogComponent } from '../../../dialog/showcase-dialog/showcase-dialog.component';
import { WarehouseGoodsPrintComponent } from '../warehouse-goods-print/warehouse-goods-print.component';
import { takeUntil } from 'rxjs/operators';

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

  containerList: WarehouseGoodsContainerModel[] = [];

  loadListSetting(): SmartTableSetting {
    return this.configSetting({
      mode: 'external',
      selectMode: 'multi',
      actions: false,
      add: this.configAddButton(),
      edit: this.configEditButton(),
      delete: this.configDeleteButton(),
      pager: this.configPaging(),
      columns: {
        FeaturePicture: {
          title: 'Hình',
          type: 'custom',
          width: '5%',
          valuePrepareFunction: (value: string, product: ProductModel) => {
            return product['FeaturePicture'] ? product['FeaturePicture']['Thumbnail'] : '';
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
          width: '20%',
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
          valuePrepareFunction: (value: any, product: GoodsModel) => {
            // return value && value.map(container => '[' + container.ContainerFindOrder + '] ' + this.commonService.getObjectText(container)).join('<br>') || '';
            return value && ('[' + value.ContainerFindOrder + '] ' + this.commonService.getObjectText(value)) || '';
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
                placeholder: this.commonService.translateText('Warehouse.GoodsContainer.title', { action: this.commonService.translateText('Common.choose'), definition: '' }),
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
        // Goods: {
        //   title: this.commonService.translateText('Hàng hóa', { action: '', definition: '' }),
        //   type: 'html',
        //   width: '15%',
        //   valuePrepareFunction: (value: string, product: GoodsModel) => {
        //     return this.commonService.getObjectText(value);
        //     // try {
        //     //   return product['Containers'] ? ('<span class="tag">' + product['Containers'].filter(container => !!container['Container']).map(container => container['Container']['Path']).join('</span><span class="tag">') + '</span>') : '';
        //     // } catch (e) {
        //     //   return '';
        //     // }
        //   },
        //   filter: {
        //     type: 'custom',
        //     component: SmartTableSelect2FilterComponent,
        //     config: {
        //       delay: 0,
        //       select2Option: {
        //         placeholder: this.commonService.translateText('Warehouse.GoodsContainer.title', { action: this.commonService.translateText('Common.choose'), definition: '' }),
        //         allowClear: true,
        //         width: '100%',
        //         dropdownAutoWidth: true,
        //         minimumInputLength: 0,
        //         keyMap: {
        //           id: 'id',
        //           text: 'text',
        //         },
        //         multiple: true,
        //         logic: 'OR',
        //         ajax: {
        //           url: (params: any) => {
        //             return 'data:text/plan,[]';
        //           },
        //           delay: 0,
        //           processResults: (data: any, params: any) => {
        //             return {
        //               results: this.containerList.filter(cate => !params.term || this.commonService.smartFilter(cate.text, params.term)),
        //             };
        //           },
        //         },
        //       },
        //     },
        //   },
        // },
        ConversionUnit: {
          title: 'ĐVT',
          type: 'html',
          width: '7%',
          valuePrepareFunction: (value: string, product: ProductModel) => {
            return product.UnitConversions instanceof Array ? (product.UnitConversions.map((uc: UnitModel & ProductUnitConversoinModel) => (uc.Unit === this.commonService.getObjectId(product['WarehouseUnit']) ? `<b>${uc.Name}</b>` : uc.Name)).join(', ')) : this.commonService.getObjectText(product['WarehouseUnit']);
          },
          filter: {
            type: 'custom',
            component: SmartTableSelect2FilterComponent,
            config: {
              delay: 0,
              select2Option: {
                placeholder: this.commonService.translateText('AdminProduct.Unit.title', { action: this.commonService.translateText('Common.choose'), definition: '' }),
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
          width: '8%',
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
        Action: {
          title: this.commonService.translateText('Common.action'),
          type: 'custom',
          width: '5%',
          // class: 'align-right',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'pricetags';
            instance.display = true;
            instance.status = 'success';
            instance.disabled = this.ref && Object.keys(this.ref).length > 0;
            // instance.style = 'text-align: right';
            // instance.class = 'align-right';
            instance.status = 'primary';
            instance.title = this.commonService.translateText('Gán/gở hàng hóa vào chỗ chứa');
            instance.label = this.commonService.translateText('Gán/gở chỗ chứa');
            instance.valueChange.subscribe(value => {
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: ProductModel) => {
              const editedItems = rowData;
              this.commonService.openDialog(AssignContainerFormComponent, {
                context: {
                  inputMode: 'dialog',
                  inputGoodsList: [editedItems],
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
            });
          },
        },
        // CostOfGoodsSold: {
        //   title: this.commonService.translateText('Warehouse.costOfGoodsSold'),
        //   type: 'currency',
        //   width: '10%',
        // },
        // InventoryCost: {
        //   title: this.commonService.translateText('Warehouse.inventoryCost'),
        //   type: 'currency',
        //   width: '12%',
        //   valuePrepareFunction: (value: string, goods: GoodsModel) => {
        //     return (goods['Inventory'] * goods['CostOfGoodsSold']).toString();
        //   },
        // },
      },
    });
  }

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
  }

  async init() {
    this.containerList = (await this.apiService.getPromise<WarehouseGoodsContainerModel[]>('/warehouse/goods-containers', { includePath: true, includeIdText: true, limit: 'nolimit' })).map(container => ({ ...container, text: container.Path })) as any;
    return super.init().then(rs => {
      this.actionButtonList.map(button => {
        if (button.name === 'assignCategories') {
          button.name = 'assginContainer';
          button.label = this.commonService.translateText('Warehouse.assign/unassignContainer');
          button.title = this.commonService.translateText('Warehouse.assign/unassignContainer');
          button.click = (event, option) => {
            this.openAssignContainersDialog();
          };
        }
        return button;
      });

      const previewBtn = this.actionButtonList.find(f => f.name == 'preview');
      previewBtn.label = 'Print QR Code';
      previewBtn.icon = 'grid-outline';
      previewBtn.disabled = () => false;
      previewBtn.click = () => {
        this.commonService.openDialog(ShowcaseDialogComponent, {
          context: {
            title: 'Print Bar Code',
            content: 'Chọn hàng hóa cần in Bar Code:',
            actions: [
              {
                status: 'basic',
                label: 'Trở về',
                action: () => { },
              },
              {
                status: 'success',
                label: 'In QRCode',
                action: () => {
                  this.commonService.openDialog(WarehouseGoodsPrintComponent, {
                    context: {
                      id: this.selectedItems.map(item => this.makeId(item)),
                      // printForType: 'DRAWERS',
                    }
                  });
                },
              },
            ]
          }
        })
      };

      return rs;
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

  async calculateCostOfGoodsSold() {
    this.commonService.showDialog(this.commonService.translateText('Warehouse.calculateCostOfGoodsSold'), this.commonService.translateText('Warehouse.calculateCostOfGoodsSoldConfirm'), [
      {
        label: this.commonService.translateText('Common.goback'),
        status: 'primary',
        action: () => {

        }
      },
      {
        label: this.commonService.translateText('Warehouse.calculateCostOfGoodsSold'),
        status: 'danger',
        action: () => {
          this.toastService.show(
            this.commonService.translateText('Tiến trình tính giá vốn đang thực thi, bạn hãy chờ trong giây lát...'),
            this.commonService.translateText('Warehouse.calculateCostOfGoodsSold'), {
            status: 'warning',
            duration: 15000
          })
          this.apiService.putPromise(this.apiPath, { calculateCostOfGoodsSold: true }, []).then(rs => {
            this.refresh();
            this.toastService.show(
              this.commonService.translateText('Tiến trình tính giá vốn đang thực thi, bạn hãy chờ trong giây lát...'),
              this.commonService.translateText('Warehouse.calculateCostOfGoodsSold'), {
              status: 'success',
              duration: 5000
            })
          });
        }
      },
    ])
  }
}
