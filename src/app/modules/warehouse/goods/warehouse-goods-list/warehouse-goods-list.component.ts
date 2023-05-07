import { WarehouseGoodsInContainerModel } from './../../../../models/warehouse.model';
import { DynamicListDialogComponent } from './../../../dialog/dynamic-list-dialog/dynamic-list-dialog.component';
import { SmartTableTagComponent } from './../../../../lib/custom-element/smart-table/smart-table.component';
import { WarehouseGoodsFindOrderTempPrintComponent } from './../warehouse-goods-find-order-temp-print/warehouse-goods-find-order-temp-print.component';
import { Component, OnInit } from '@angular/core';
import { ProductListV1Component } from '../../../admin-product/product/product-list-v1/product-list.component';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { WarehouseGoodsFormComponent } from '../warehouse-goods-form/warehouse-goods-form.component';
import { AssignContainerFormComponent } from '../assign-containers-form/assign-containers-form.component';
import { ProductModel, ProductUnitConversoinModel } from '../../../../models/product.model';
import { SmartTableButtonComponent, SmartTableTagsComponent, SmartTableThumbnailComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableFilterComponent, SmartTableSelect2FilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { UnitModel } from '../../../../models/unit.model';
import { GoodsModel, WarehouseGoodsContainerModel } from '../../../../models/warehouse.model';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { ShowcaseDialogComponent } from '../../../dialog/showcase-dialog/showcase-dialog.component';
import { WarehouseGoodsPrintComponent } from '../warehouse-goods-print/warehouse-goods-print.component';
import { takeUntil } from 'rxjs/operators';
import { ImagesViewerComponent } from '../../../../lib/custom-element/my-components/images-viewer/images-viewer.component';
import { AdminProductService } from '../../../admin-product/admin-product.service';
import { WarehouseGoodsReceiptNoteDetailAccessNumberPrintComponent } from './../../goods-receipt-note/warehouse-goods-access-number-print/warehouse-goods-access-number-print.component';
import { AssignNewContainerFormComponent } from '../assign-new-containers-form/assign-new-containers-form.component';
import { DialogFormComponent } from '../../../dialog/dialog-form/dialog-form.component';
import { FormGroup } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'ngx-warehouse-goods-list',
  templateUrl: './warehouse-goods-list.component.html',
  styleUrls: ['./warehouse-goods-list.component.scss'],
  providers: [DecimalPipe]
})
export class WarehouseGoodsListComponent extends ProductListV1Component implements OnInit {

  componentName: string = 'WarehouseGoodsListComponent';
  formPath = '/warehouse/goods/form';
  apiPath = '/warehouse/goods';
  idKey: string | string[] = ['Code', 'WarehouseUnit', 'Container'];
  formDialog = WarehouseGoodsFormComponent;

  containerList: WarehouseGoodsContainerModel[] = [];

  constructor(
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<WarehouseGoodsListComponent>,
    public adminProductService: AdminProductService,
    public decimalPipe: DecimalPipe,
  ) {
    super(apiService, router, cms, dialogService, toastService, _http, ref, adminProductService);
  }

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
              condition: 'eq',
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
        ContainerFindOrder: {
          title: this.cms.translateText('Số nhận thức', { action: '', definition: '' }),
          type: 'html',
          width: '15%',
          // valuePrepareFunction: (value: any, product: GoodsModel) => {
          //   return value && (this.cms.getObjectText(value)) || '';
          // },
          // filter: {
          //   type: 'custom',
          //   component: SmartTableSelect2FilterComponent,
          //   config: {
          //     delay: 0,
          //     select2Option: {
          //       placeholder: this.cms.translateText('Warehouse.GoodsContainer.title', { action: this.cms.translateText('Common.choose'), definition: '' }),
          //       allowClear: true,
          //       width: '100%',
          //       dropdownAutoWidth: true,
          //       minimumInputLength: 0,
          //       keyMap: {
          //         id: 'id',
          //         text: 'text',
          //       },
          //       multiple: true,
          //       logic: 'OR',
          //       ajax: {
          //         url: (params: any) => {
          //           return 'data:text/plan,[]';
          //         },
          //         delay: 0,
          //         processResults: (data: any, params: any) => {
          //           return {
          //             results: this.containerList.filter(cate => !params.term || this.cms.smartFilter(cate.text, params.term)),
          //           };
          //         },
          //       },
          //     },
          //   },
          // },
        },
        // ContainerPath: {
        //   title: this.cms.translateText('Warehouse.GoodsContainer.path', { action: '', definition: '' }),
        //   type: 'html',
        //   width: '15%',
        //   filter: {
        //     type: 'custom',
        //     component: SmartTableFilterComponent,
        //     config: {
        //       condition: 'bleft',
        //     }
        //   },
        //   valuePrepareFunction: (value: any, product: GoodsModel) => {
        //     return product?.Container?.ContainerPath;
        //   },
        // },

        ContainerShelf: {
          title: 'Kệ hàng hóa',
          type: 'html',
          // renderComponent: SmartTableTagsComponent,
          width: '10%',
          filter: {
            type: 'custom',
            component: SmartTableSelect2FilterComponent,
            config: {
              delay: 0,
              condition: 'eq',
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
                // multiple: true,
                logic: 'OR',
                ajax: {
                  url: (params: any) => {
                    return 'data:text/plan,[]';
                  },
                  delay: 0,
                  processResults: (data: any, params: any) => {
                    return {
                      results: this.shelfList.filter(shelf => !params.term || this.cms.smartFilter(shelf.text, params.term)),
                    };
                  },
                },
              },
            },
          },
          valuePrepareFunction: (value: string, product: ProductModel) => {
            return product.ContainerShelfName as any;
          },
          // onComponentInitFunction: (component: SmartTableTagsComponent) => {
          //   component.labelAsText = (tag) => {
          //     return tag.text;
          //   };
          //   component.renderToolTip = (tag) => {
          //     return tag.text;
          //   };
          //   component.init.pipe(takeUntil(this.destroy$)).subscribe(row => {

          //   });
          //   component.click.pipe(takeUntil(this.destroy$)).subscribe((tag: any) => {
          //     if (!tag.Container) {
          //       this.cms.openDialog(AssignContainerFormComponent, {
          //         context: {
          //           inputMode: 'dialog',
          //           inputGoodsList: [{ Code: component.rowData.Code, WarehouseUnit: component.rowData.WarehouseUnit }],
          //           onDialogSave: async (newData: ProductModel[]) => {
          //             // this.refresh();
          //             // this.updateGridItems(editedItems, newData);
          //             const udpateItem = (await this.source.getAll()).find(f => component.rowData.Code == f.Code);
          //             this.source.isLocalUpdate = true;
          //             try {
          //               const newContainer = newData[0].Containers[0];
          //               this.source.update(udpateItem, {
          //                 UnitConversions: [
          //                   ...udpateItem.UnitConversions.map(m => ({
          //                     type: m.type,
          //                     id: m.id,
          //                     text: m.text,
          //                     Container: m.id == tag.id ? newContainer : m.Container,
          //                   })),
          //                   { type: 'STATUS', id: 'UPDATED', text: 'Updated' }]
          //               }).then(() => {
          //                 this.source.isLocalUpdate = false;
          //               });
          //             } catch (err) {
          //               this.source.isLocalUpdate = false;
          //             }
          //           },
          //           onDialogClose: () => {
          //           },
          //         },
          //         closeOnEsc: false,
          //         closeOnBackdropClick: false,
          //       });
          //     }
          //   });
          // },
        },
        // Goods: {
        //   title: this.cms.translateText('Hàng hóa', { action: '', definition: '' }),
        //   type: 'html',
        //   width: '15%',
        //   valuePrepareFunction: (value: string, product: GoodsModel) => {
        //     return this.cms.getObjectText(value);
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
        //         placeholder: this.cms.translateText('Warehouse.GoodsContainer.title', { action: this.cms.translateText('Common.choose'), definition: '' }),
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
        //               results: this.containerList.filter(cate => !params.term || this.cms.smartFilter(cate.text, params.term)),
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
        LastAdjust: {
          title: 'Kiểm kho',
          type: 'datetime',
          width: '10%',
        },
        Inventory: {
          title: this.cms.translateText('Warehouse.inventory'),
          type: 'custom',
          width: '5%',
          renderComponent: SmartTableTagComponent,
          onComponentInitFunction: (component: SmartTableTagComponent) => {
            component.renderToolTip = (tag) => {
              return component.rowData?.AccessNumbers?.join(', ') || '';
            };
            component.labelAsText = (tag) => {
              return this.decimalPipe.transform(tag.id);
            }
            component.click.pipe(takeUntil(this.destroy$)).subscribe(tag => {
              const filter = { eq_AccessNumber: '[' + component.rowData?.AccessNumbers?.join(',') + ']' };
              this.cms.openDialog(DynamicListDialogComponent, {
                context: {
                  inputMode: 'dialog',
                  choosedMode: true,
                  onDialogChoose: async (choosedItems: any[]) => {
                    console.log(choosedItems);
                    this.cms.openDialog(WarehouseGoodsReceiptNoteDetailAccessNumberPrintComponent, {
                      context: {
                        id: choosedItems.map(m => this.cms.getObjectId(m['AccessNumber']))
                      }
                    });
                  },
                  title: 'Các số truy xuất đang có mặt tại: ' + this.cms.getObjectText(component.rowData.Container),
                  apiPath: '/warehouse/goods-receipt-note-detail-access-numbers',
                  idKey: ['Product'],
                  params: {
                    includeWarehouse: true,
                    includeContainer: true,
                    includeProduct: true,
                    includeUnit: true,
                    renderBarCode: true,
                    includeVoucherInfo: true,
                    // renderQrCode: true,
                    includePrice: true,
                    sort_DateOfReceipted: 'desc',
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
                      DateOfReceipted: {
                        title: this.cms.textTransform(this.cms.translate.instant('Warehouse.dateOfReceipted'), 'head-title'),
                        type: 'datetime',
                        width: '10%',
                      },
                      Voucher: {
                        title: this.cms.translateText('Common.voucher'),
                        type: 'custom',
                        renderComponent: SmartTableTagsComponent,
                        valuePrepareFunction: (cell: string, row: any) => {
                          return [{ id: cell, text: row['Title'], type: /^124/.test(cell) ? 'INVENTORYADJUST' : 'GOODSRECEIPT' }] as any;
                        },
                        onComponentInitFunction: (instance: SmartTableTagsComponent) => {
                          instance.click.subscribe((tag: { id: string, text: string, type: string }) => tag.type && this.cms.previewVoucher(tag.type, tag.id));
                        },
                        width: '20%',
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
                      AccessNumber: {
                        title: this.cms.textTransform(this.cms.translate.instant('Số truy xuất'), 'head-title'),
                        type: 'text',
                        renderComponent: SmartTableTagsComponent,
                        width: '20%',
                      },
                      // Product: {
                      //   title: this.cms.textTransform(this.cms.translate.instant('Hàng hóa'), 'head-title'),
                      //   type: 'string',
                      //   width: '80%',
                      //   filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
                      //   valuePrepareFunction: (cell: any, row: any) => {
                      //     return this.cms.getObjectText(cell);
                      //   }
                      // },
                      // Unit: {
                      //   title: this.cms.textTransform(this.cms.translate.instant('Đơn vị tính'), 'head-title'),
                      //   type: 'string',
                      //   width: '10%',
                      //   filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
                      //   valuePrepareFunction: (cell, row) => {
                      //     return this.cms.getObjectText(cell);
                      //   }
                      // },
                      // Container: {
                      //   title: this.cms.textTransform(this.cms.translate.instant('Vị trí'), 'head-title'),
                      //   type: 'string',
                      //   width: '50%',
                      //   filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
                      //   valuePrepareFunction: (cell) => {
                      //     return this.cms.getObjectText(cell);
                      //   }
                      // },
                    }
                  }
                }
              });
            })
          },
          valuePrepareFunction: (cell: any, row: any) => {
            return { id: cell, text: cell, type: 'Tồn kho' } as any;
          }
        },
        PrintFindOrder: {
          title: this.cms.translateText('In số nhận thức'),
          type: 'custom',
          width: '5%',
          // class: 'align-right',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'grid-outline';
            instance.display = true;
            instance.status = 'success';
            instance.disabled = this.ref && Object.keys(this.ref).length > 0;
            // instance.style = 'text-align: right';
            // instance.class = 'align-right';
            instance.status = 'primary';
            instance.title = this.cms.translateText('In tem nhận thức');
            instance.label = this.cms.translateText('In tem nhận thức');
            instance.init.pipe(takeUntil(this.destroy$)).subscribe(value => {
              if (!this.cms.getObjectId(value.Container)) {
                instance.disabled = true;
                instance.title = 'Chưa set vị trí';
              }
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: ProductModel) => {
              if (this.cms.getObjectId(rowData.Container)) {
                this.cms.openDialog(WarehouseGoodsFindOrderTempPrintComponent, {
                  context: {
                    priceTable: 'default',
                    id: [this.makeId(rowData)],
                  }
                });
              } else {
                this.cms.toastService.show('Hàng hóa chứa được cài đặt vị trí', 'In tem nhận thức', { status: 'warning' })
              }
            });
          },
        },
        Action: {
          title: this.cms.translateText('Common.action'),
          type: 'custom',
          width: '5%',
          // class: 'align-right',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'grid-outline';
            instance.display = true;
            instance.status = 'success';
            instance.disabled = this.ref && Object.keys(this.ref).length > 0;
            // instance.style = 'text-align: right';
            // instance.class = 'align-right';
            instance.status = 'primary';
            instance.title = this.cms.translateText('Gán/gở vị trí');
            instance.label = this.cms.translateText('Gán/gở vị trí');
            instance.valueChange.subscribe(value => {
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: ProductModel) => {
              const editedItems = rowData;
              this.cms.openDialog(AssignContainerFormComponent, {
                context: {
                  inputMode: 'dialog',
                  inputGoodsList: [editedItems],
                  onDialogSave: (newData: ProductModel[]) => {
                    // this.refresh();
                    this.apiService.getPromise<ProductModel[]>(this.apiPath + '/' + editedItems.Code, { includeContainer: true, includeUnit: true }).then(rs => {
                      this.updateGridItems([editedItems], [{ ...editedItems, Container: rs[0]['Container'] || [], ContainerPath: rs[0]['Container'] && rs[0]['Container']['ContainerPath'] || null }]);
                    });
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
        NewContainer: {
          title: this.cms.translateText('Vị trí mới'),
          type: 'custom',
          width: '5%',
          // class: 'align-right',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'pricetags-outline';
            instance.display = true;
            // instance.status = 'success';
            instance.disabled = this.ref && Object.keys(this.ref).length > 0;
            // instance.style = 'text-align: right';
            // instance.class = 'align-right';
            instance.status = 'success';
            instance.title = this.cms.translateText('Gán/gở vị trí');
            instance.label = this.cms.translateText('Gán/gở vị trí');
            instance.valueChange.subscribe(value => {
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: ProductModel) => {
              const editedItems = rowData;
              this.cms.openDialog(AssignNewContainerFormComponent, {
                context: {
                  inputMode: 'dialog',
                  inputGoodsList: [editedItems],
                  onDialogSave: (newData: ProductModel[]) => {
                    if (rowData.Container) {
                      this.refresh();
                    } else {
                      this.apiService.getPromise<ProductModel[]>(this.apiPath + '/' + editedItems.Code, { includeContainer: true, includeUnit: true }).then(rs => {
                        this.updateGridItems([editedItems], [{ ...editedItems, Container: rs[0]['Container'] || [], ContainerPath: rs[0]['Container'] && rs[0]['Container']['ContainerPath'] || null }]);
                      });
                    }
                    // 
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
        //   title: this.cms.translateText('Warehouse.costOfGoodsSold'),
        //   type: 'currency',
        //   width: '10%',
        // },
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
    this.containerList = (await this.apiService.getPromise<WarehouseGoodsContainerModel[]>('/warehouse/goods-containers', { includePath: true, includeIdText: true, limit: 'nolimit' })).map(container => ({ ...container, text: `${container.FindOrder} - ${container.Path} - ${container.Description}` })) as any;
    return super.init().then(rs => {
      this.actionButtonList.map(button => {
        if (button.name === 'assignCategories') {
          button.name = 'assginContainer';
          button.label = this.cms.translateText('Warehouse.assign/unassignContainer');
          button.title = this.cms.translateText('Warehouse.assign/unassignContainer');
          button.click = (event, option) => {
            this.openAssignContainersDialog();
          };
        }
        return button;
      });

      this.actionButtonList.unshift({
        name: 'printFindOrderTem',
        status: 'primary',
        label: 'In tem nhận thức',
        title: 'In tem nhận thức',
        icon: 'grid-outline',
        size: 'medium',
        click: () => {
          // const editedItems = this.selectedItems;
          this.cms.openDialog(WarehouseGoodsFindOrderTempPrintComponent, {
            context: {
              priceTable: 'default',
              id: this.selectedItems.map(item => this.makeId(item)),
            }
          });
        }
      });

      this.actionButtonList.unshift({
        name: 'reprintAccessNumbers',
        status: 'success',
        label: 'In lại số truy xuất',
        title: 'Thêm vào sanh sách in lại',
        icon: 'pricetags-outline',
        size: 'medium',
        click: () => {
          this.cms.openDialog(DialogFormComponent, {
            context: {
              title: 'Thêm số truy xuất vào danh sách in lại',
              controls: [
                {
                  name: 'AccessNumbers',
                  label: 'Số truy xuất',
                  initValue: '',
                  placeholder: 'Mỗi dòng 1 số truy xuất',
                  type: 'textarea',
                },
              ],
              actions: [
                {
                  label: 'Trở về',
                  icon: 'back',
                  status: 'info',
                  action: async () => true,
                },
                {
                  label: 'In',
                  icon: 'printer-outline',
                  status: 'success',
                  action: async (form: FormGroup) => {

                    let accessNumbersText: string = form.get('AccessNumbers').value;
                    accessNumbersText = accessNumbersText.trim();
                    let accessNumbers = accessNumbersText.split('\n');

                    accessNumbers = accessNumbers.filter(f => {
                      f = f.trim();
                      return f && !/[^0-9]/.test(f) && /^127/.test(f);
                    })
                    
                    console.log(accessNumbers);

                    this.cms.openDialog(WarehouseGoodsReceiptNoteDetailAccessNumberPrintComponent, {
                      context: {
                        id: accessNumbers,
                      }
                    });

                    // this.apiService.putPromise(this.apiPath + '/settings', {}, [{
                    //   Name: 'MINIERP_RELEASE_VERSION',
                    //   Value: form.value['Version'],
                    // }]).then(rs => {
                    //   this.refresh();
                    // });
                    
                    return false; // do not close dialog after action
                  },
                },
              ],
            },
          });
        }
      });

      // const previewBtn = this.actionButtonList.find(f => f.name == 'preview');
      // previewBtn.label = 'Print QR Code';
      // previewBtn.icon = 'grid-outline';
      // previewBtn.disabled = () => false;
      // previewBtn.click = () => {
      //   this.cms.openDialog(ShowcaseDialogComponent, {
      //     context: {
      //       title: 'Print Bar Code',
      //       content: 'Chọn hàng hóa cần in Bar Code:',
      //       actions: [
      //         {
      //           status: 'basic',
      //           label: 'Trở về',
      //           action: () => { },
      //         },
      //         {
      //           status: 'success',
      //           label: 'In QRCode',
      //           action: () => {
      //             this.cms.openDialog(WarehouseGoodsPrintComponent, {
      //               context: {
      //                 id: this.selectedItems.map(item => this.makeId(item)),
      //                 // printForType: 'DRAWERS',
      //               }
      //             });
      //           },
      //         },
      //       ]
      //     }
      //   })
      // };

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
      params['includeLastInventoryAdjust'] = true;
      params['includeAccessNumbers'] = true;
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
      this.cms.openDialog(AssignContainerFormComponent, {
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
    this.cms.showDialog(this.cms.translateText('Warehouse.calculateCostOfGoodsSold'), this.cms.translateText('Warehouse.calculateCostOfGoodsSoldConfirm'), [
      {
        label: this.cms.translateText('Common.goback'),
        status: 'primary',
        action: () => {

        }
      },
      {
        label: this.cms.translateText('Warehouse.calculateCostOfGoodsSold'),
        status: 'danger',
        action: () => {
          this.toastService.show(
            this.cms.translateText('Tiến trình tính giá vốn đang thực thi, bạn hãy chờ trong giây lát...'),
            this.cms.translateText('Warehouse.calculateCostOfGoodsSold'), {
            status: 'warning',
            duration: 15000
          })
          this.apiService.putPromise(this.apiPath, { calculateCostOfGoodsSold: true }, []).then(rs => {
            this.refresh();
            this.toastService.show(
              this.cms.translateText('Tiến trình tính giá vốn đang thực thi, bạn hãy chờ trong giây lát...'),
              this.cms.translateText('Warehouse.calculateCostOfGoodsSold'), {
              status: 'success',
              duration: 5000
            })
          });
        }
      },
    ])
  }

  /** Config for paging */
  protected configPaging() {
    return {
      display: true,
      perPage: 100,
    };
  }
}
