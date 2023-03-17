import { DynamicListDialogComponent } from './../../../dialog/dynamic-list-dialog/dynamic-list-dialog.component';
import { filter, take, takeUntil } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ProductListComponent } from '../../../admin-product/product/product-list/product-list.component';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { PurchaseGoodsFormComponent } from '../purchase-goods-form/warehouse-goods-form.component';
import { ProductModel, ProductUnitConversoinModel } from '../../../../models/product.model';
import { SmartTableTagComponent, SmartTableTagsComponent, SmartTableThumbnailComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableSelect2FilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { UnitModel } from '../../../../models/unit.model';
import { GoodsModel, WarehouseGoodsContainerModel } from '../../../../models/warehouse.model';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { AdminProductService } from '../../../admin-product/admin-product.service';
import { ImagesViewerComponent } from '../../../../lib/custom-element/my-components/images-viewer/images-viewer.component';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'ngx-warehouse-goods-list',
  templateUrl: './purchase-goods-list.component.html',
  styleUrls: ['./purchase-goods-list.component.scss'],
  providers: [CurrencyPipe]
})
export class PurchaseGoodsListComponent extends ProductListComponent implements OnInit {

  componentName: string = 'PurchaseGoodsListComponent';
  formPath = '/purchase/goods/form';
  apiPath = '/purchase/goods';
  idKey: string | string[] = ['Code', 'WarehouseUnit'];
  formDialog = PurchaseGoodsFormComponent;

  containerList: WarehouseGoodsContainerModel[] = [];

  constructor(
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<PurchaseGoodsListComponent>,
    public adminProductService: AdminProductService,
    public currencyPipe: CurrencyPipe,
  ) {
    super(apiService, router, cms, dialogService, toastService, _http, ref, adminProductService);
    // this.actionButtonList.map(button => {
    //   if (button.name === 'assignCategories') {
    //     button.name = 'assginContainer';
    //     button.label = this.cms.translateText('Warehouse.assign/unassignContainer');
    //     button.title = this.cms.translateText('Warehouse.assign/unassignContainer');
    //     button.click = (event, option) => {
    //       this.openAssignContainersDialog();
    //     };
    //   }
    //   return button;
    // });

  }

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
            instance.previewAction.subscribe((row: ProductModel) => {
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
            instance.uploadAction.subscribe(async (row: ProductModel) => {
              if (this.files.length === 0) {
                this.uploadForProduct = row;
                this.uploadBtn.nativeElement.click();
              } else {
                this.cms.toastService.show(
                  this.cms.translateText('Common.uploadInProcess'),
                  this.cms.translateText('Common.upload'),
                  {
                    status: 'warning',
                  });
                // this.cms.openDialog(ShowcaseDialogComponent, {
                //   context: {
                //     title: this.cms.translateText('Common.upload'),
                //     content: this.cms.translateText('Common.uploadInProcess'),
                //   },
                // });
              }
            });
            instance.title = this.cms.translateText('click to change main product picture');
          },
        },
        Name: {
          title: 'Tên',
          type: 'string',
          width: '30%',
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
                      results: this.categoryList.filter(cate => !params.term || this.cms.smartFilter(cate.text, params.term)),
                    };
                  },
                },
              },
            },
          },
        },
        Container: {
          title: this.cms.translateText('Warehouse.GoodsContainer.title', { action: '', definition: '' }),
          type: 'html',
          width: '15%',
          valuePrepareFunction: (value: string, product: GoodsModel) => {
            return this.cms.getObjectText(value);
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
                placeholder: this.cms.translateText('Warehouse.GoodsContainer.title', { action: this.cms.translateText('Common.choose'), definition: '' }),
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
                      results: this.containerList.filter(cate => !params.term || this.cms.smartFilter(cate.text, params.term)),
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
          width: '7%',
          valuePrepareFunction: (value: string, product: ProductModel) => {
            return product.UnitConversions instanceof Array ? (product.UnitConversions.map((uc: UnitModel & ProductUnitConversoinModel) => (uc.Unit === this.cms.getObjectId(product['WarehouseUnit']) ? `<b>${uc.Name}</b>` : uc.Name)).join(', ')) : this.cms.getObjectText(product['WarehouseUnit']);
          },
          filter: {
            type: 'custom',
            component: SmartTableSelect2FilterComponent,
            config: {
              delay: 0,
              select2Option: {
                placeholder: this.cms.translateText('AdminProduct.Unit.title', { action: this.cms.translateText('Common.choose'), definition: '' }),
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
                      results: this.unitList.filter(cate => !params.term || this.cms.smartFilter(cate.text, params.term)),
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
        // Inventory: {
        //   title: this.cms.translateText('Warehouse.inventory'),
        //   type: 'string',
        //   width: '5%',
        // },
        // CostOfGoodsSold: {
        //   title: this.cms.translateText('Purchase.costOfGoodsSold'),
        //   type: 'currency',
        //   width: '10%',
        // },
        CostOfGoodsSold: {
          title: this.cms.translateText('Purchase.costOfGoodsSold'),
          type: 'custom',
          width: '10%',
          renderComponent: SmartTableTagComponent,
          onComponentInitFunction: (component: SmartTableTagComponent) => {
            component.renderToolTip = (tag) => {
              return 'Xem chi tiết các lần mua hàng';
            };
            component.labelAsText = (tag) => {
              return this.currencyPipe.transform(tag.id, 'VND');
            }
            component.click.pipe(takeUntil(this.destroy$)).subscribe(tag => {
              const filter = { id: component.rowData?.AccessNumbers };
              this.cms.openDialog(DynamicListDialogComponent, {
                context: {
                  inputMode: 'dialog',
                  choosedMode: false,
                  onDialogChoose: async (choosedItems: any[]) => {
                    console.log(choosedItems);
                    // this.cms.openDialog(WarehouseGoodsReceiptNoteDetailAccessNumberPrintComponent, {
                    //   context: {
                    //     id: choosedItems.map(m => this.cms.getObjectId(m['AccessNumber']))
                    //   }
                    // });
                  },
                  title: 'Chi tiết giá nhập của: ' + component.rowData.Name,
                  apiPath: '/purchase/voucher-details',
                  idKey: ['Product'],
                  params: {
                    // includeWarehouse: true,
                    // includeContainer: true,
                    // includeProduct: true,
                    // includeUnit: true,
                    // renderBarCode: true,
                    // // renderQrCode: true,
                    // includePrice: true,
                    includeUnit: true,
                    includeVoucherInfo: true,
                    sort_DateOfPurchase: 'desc',
                    eq_Product: component.rowData.Code,
                    eq_Unit: this.cms.getObjectId(component.rowData.WarehouseUnit),
                    eq_State: 'APPROVED',
                    ...filter
                  },
                  // actionButtonList: [],
                  listSettings: {
                    // pager: {
                    //   display: true,
                    //   perPage: 10,
                    // },
                    actions: false,
                    columns: {
                      DateOfPurchase: {
                        title: this.cms.textTransform(this.cms.translate.instant('Purchase.dateOfPurchase'), 'head-title'),
                        type: 'datetime',
                        width: '10%',
                      },
                      Voucher: {
                        title: this.cms.translateText('Common.voucher'),
                        type: 'custom',
                        renderComponent: SmartTableTagsComponent,
                        valuePrepareFunction: (cell: string, row: any) => {
                          return [{ id: cell, text: row['Title'], type: 'PURCHASE' }] as any;
                        },
                        onComponentInitFunction: (instance: SmartTableTagsComponent) => {
                          instance.click.subscribe((tag: { id: string, text: string, type: string }) => tag.type && this.cms.previewVoucher(tag.type, tag.id));
                        },
                        width: '10%',
                      },
                      Object: {
                        title: this.cms.textTransform(this.cms.translate.instant('Common.supplier'), 'head-title'),
                        type: 'text',
                        renderComponent: SmartTableTagsComponent,
                        width: '20%',
                        valuePrepareFunction: (cell, row: any) => { return row.ObjectName; }
                      },
                      Title: {
                        title: this.cms.textTransform(this.cms.translate.instant('Common.title'), 'head-title'),
                        type: 'text',
                        renderComponent: SmartTableTagsComponent,
                        width: '20%',
                      },
                      Product: {
                        title: this.cms.textTransform(this.cms.translate.instant('Hàng hóa'), 'head-title'),
                        type: 'string',
                        width: '20%',
                        filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
                        // valuePrepareFunction: (cell: any, row: any) => {
                        //   return this.cms.getObjectText(cell);
                        // }
                      },
                      Quantity: {
                        title: this.cms.textTransform(this.cms.translate.instant('Common.quantity'), 'head-title'),
                        type: 'number',
                        width: '10%',
                        filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
                        // valuePrepareFunction: (cell, row) => {
                        //   return this.cms.getObjectText(cell);
                        // }
                      },
                      Unit: {
                        title: this.cms.textTransform(this.cms.translate.instant('Đơn vị tính'), 'head-title'),
                        type: 'string',
                        width: '10%',
                        filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
                        valuePrepareFunction: (cell, row) => {
                          return this.cms.getObjectText(cell);
                        }
                      },
                      Price: {
                        title: this.cms.textTransform(this.cms.translate.instant('Common.price'), 'head-title'),
                        type: 'currency',
                        width: '10%',
                        filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
                        // valuePrepareFunction: (cell) => {
                        //   return this.cms.getObjectText(cell);
                        // }
                      },
                    }
                  }
                },
                closeOnBackdropClick: false,
              });
            })
          },
          valuePrepareFunction: (cell: any, row: any) => {
            return { icon: '', id: cell, text: cell, type: 'Giá nhập' } as any;
          }
        },
        // InventoryCost: {
        //   title: this.cms.translateText('Warehouse.inventoryCost'),
        //   type: 'currency',
        //   width: '12%',
        //   valuePrepareFunction: (value: string, goods: GoodsModel) => {
        //     return (goods['Inventory'] * goods['CostOfGoodsSold']).toString();
        //   },
        // },
      },
    });
  }

  async init() {
    this.containerList = (await this.apiService.getPromise<WarehouseGoodsContainerModel[]>('/warehouse/goods-containers', { includePath: true, includeIdText: true })).map(container => ({ ...container, text: container.Path })) as any;
    return super.init().then(rs => {
      this.actionButtonList.unshift({
        name: 'calculateCostOfGoodsSold',
        status: 'danger',
        label: this.cms.textTransform(this.cms.translate.instant('Warehouse.calculateCostOfGoodsSold'), 'head-title'),
        icon: 'checkmark-square',
        title: this.cms.textTransform('Giá vốn sẽ được tính tự động cho mỗi lần nhập kho, nếu có sai lệch về số liệu thì có thể tính lại giá vốn cho tất cả hàng hóa trong kho bằng lệnh này. Phương thức tính giá vốn hiện tại là bình quân gia quyền.', 'head-title'),
        size: 'medium',
        disabled: () => false,
        hidden: () => this.isChoosedMode,
        click: () => {
          this.calculateCostOfGoodsSold();
          return false;
        },
      });
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
  // async openAssignContainersDialog() {
  //   if (this.selectedIds.length > 0) {
  //     const editedItems = await this.convertIdsToItems(this.selectedIds);
  //     this.cms.openDialog(AssignContainerFormComponent, {
  //       context: {
  //         inputMode: 'dialog',
  //         inputGoodsList: this.selectedItems,
  //         onDialogSave: (newData: ProductModel[]) => {
  //           this.refresh();
  //           // this.updateGridItems(editedItems, newData);
  //         },
  //         onDialogClose: () => {
  //         },
  //       },
  //       closeOnEsc: false,
  //       closeOnBackdropClick: false,
  //     });
  //   }
  // }

  async calculateCostOfGoodsSold() {
    this.cms.showDialog(this.cms.translateText('Warehouse.calculateCostOfGoodsSold'), this.cms.translateText('Warehouse.calculateCostOfGoodsSoldConfirm') + ' Phương thức tính giá vốn hiện tại là bình quân gia quyền.', [
      {
        label: this.cms.translateText('Common.goback'),
        status: 'primary',
        action: () => {

        }
      },
      {
        label: this.cms.translateText('Warehouse.calculateCostOfGoodsSold'),
        status: 'danger',
        action: async () => {
          this.toastService.show(
            this.cms.translateText('Tiến trình tính giá vốn đang thực thi, bạn hãy chờ trong giây lát...'),
            this.cms.translateText('Warehouse.calculateCostOfGoodsSold'), {
            status: 'warning',
            duration: 5000
          });

          let offset = 9;
          while (true) {
            const productList = await this.apiService.getPromise<ProductModel[]>('/admin-product/products', { includeUnitConversions: true, eq_IsStopBusiness: false, limit: 40, offset: offset });
            for (const product of productList) {
              for (const unit of product.UnitConversions) {
                await this.apiService.putPromise(this.apiPath, { calculateCostOfGoodsSoldForProduct: true }, [{ Code: product.Code, Unit: this.cms.getObjectId(unit.Unit) }]).then(rs => {
                  // this.refresh();
                  this.toastService.show(
                    'đã tính xong giá vốn',
                    product.Name, {
                    status: 'success',
                    // duration: 4000
                  });
                  console.log(rs);
                }).catch(err => {
                  console.error(err);
                  return null;
                });
                // break;
              }
            }
            if (productList.length < 40) {
              break;
            }
            offset += 40;
          }

        }
      },
    ])
  }
}
