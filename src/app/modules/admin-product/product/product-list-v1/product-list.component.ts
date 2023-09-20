import { IdTextModel } from '../../../../models/common.model';
import { ProductUnitModel } from '../../../../models/product.model';
import { AdminProductService } from '../../admin-product.service';
import { Component, OnInit, EventEmitter, ElementRef, ViewChild, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { ProductModel, ProductCategoryModel, ProductUnitConversoinModel, ProductGroupModel } from '../../../../models/product.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { SmartTableDateTimeComponent, SmartTableTagComponent, SmartTableTagsComponent, SmartTableThumbnailComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableDateRangeFilterComponent, SmartTableFilterComponent, SmartTableSelect2FilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { AssignCategoriesFormComponent } from '../assign-categories-form/assign-categories-form.component';
import { FormGroup } from '@angular/forms';
import { FileModel } from '../../../../models/file.model';
import { UploaderOptions, UploadFile, UploadInput, humanizeBytes, UploadOutput } from '../../../../../vendor/ngx-uploader/src/public_api';
import { UnitModel } from '../../../../models/unit.model';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { filter, take, takeUntil } from 'rxjs/operators';
import { ImagesViewerComponent } from '../../../../lib/custom-element/my-components/images-viewer/images-viewer.component';
// import { _ } from '@ag-grid-community/all-modules';
import { WarehouseGoodsContainerModel } from '../../../../models/warehouse.model';
import { AssignContainerFormComponent } from '../../../warehouse/goods/assign-containers-form/assign-containers-form.component';
import { defaultMaxListeners } from 'stream';
import { ImportProductDialogComponent } from '../import-products-dialog/import-products-dialog.component';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { RootServices } from '../../../../services/root.services';

@Component({
  selector: 'ngx-product-list-v1',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListV1Component extends ServerDataManagerListComponent<ProductModel> implements OnInit, AfterViewInit, OnDestroy {

  componentName: string = 'ProductListComponent';
  formPath = '/admin-product/product/form';
  apiPath = '/admin-product/products';
  idKey: string | string[] = 'Code';
  formDialog = ProductFormComponent;

  @Input() reuseDialog = true;
  static _dialog: NbDialogRef<ProductListV1Component>;

  // Smart table
  static filterConfig: any;
  static sortConf: any;
  static pagingConf = { page: 1, perPage: 40 };

  // Category list for filter
  categoryList: ProductCategoryModel[] = [];
  groupList: ProductGroupModel[] = [];
  unitList: ProductUnitModel[] = [];
  containerList: WarehouseGoodsContainerModel[] = [];

  shelfList: IdTextModel[];
  // @ViewChild('smartTable', { static: false }) smartTable: Ng2SmartTableComponent;

  // private smartTable: Ng2SmartTableComponent;

  @Input() pagingConfig: { display: boolean, perPage: number }

  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<ProductListV1Component>,
    public adminProductService: AdminProductService,
  ) {
    super(rsv, apiService, router, cms, dialogService, toastService, ref);
  }

  ngOnDestroy(): void {
      super.ngOnDestroy();
  }

  /** Config for paging */
  protected configPaging() {
    if (this.pagingConfig) {
      return {
        ...super.configPaging(),
        ...this.pagingConfig,
      };
    }
    return super.configPaging();
  }

  async loadCache() {
    // iniit category
    this.categoryList = (await this.apiService.getPromise<ProductCategoryModel[]>('/admin-product/categories', { limit: 'nolimit' })).map(cate => ({ ...cate, id: cate.Code, text: cate.Name })) as any;
    this.groupList = (await this.apiService.getPromise<ProductGroupModel[]>('/admin-product/groups', { limit: 'nolimit' })).map(cate => ({ ...cate, id: cate.Code, text: cate.Name })) as any;
    // this.unitList = (await this.apiService.getPromise<UnitModel[]>('/admin-product/units', { includeIdText: true, limit: 'nolimit' }));
    this.containerList = (await this.apiService.getPromise<WarehouseGoodsContainerModel[]>('/warehouse/goods-containers', { includePath: true, includeIdText: true, limit: 'nolimit' })).map(container => ({ ...container, text: `${container.FindOrder} - ${container.Path}` })) as any;
    this.shelfList = (await this.apiService.getPromise<WarehouseGoodsContainerModel[]>('/warehouse/goods-containers', { includePath: true, limit: 'nolimit', eq_Type: 'SHELF' })).map(container => ({ id: container.Code, text: `${container.Name}` })) as any;
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    console.log(this.smartTable);
  }

  async init() {
    await this.adminProductService.unitList$.pipe(filter(f => !!f), take(1)).toPromise();
    await this.loadCache();
    return super.init().then(rs => {

      // Load unit list
      this.adminProductService.unitList$.pipe(takeUntil(this.destroy$)).subscribe(unitList => {
        this.unitList = unitList;
      });


      this.actionButtonList.unshift({
        name: 'assignCategories',
        status: 'info',
        label: this.cms.textTransform(this.cms.translate.instant('Common.tag/untag'), 'head-title'),
        icon: 'pricetags',
        title: this.cms.textTransform(this.cms.translate.instant('Common.tag/untag'), 'head-title'),
        size: 'medium',
        disabled: () => this.selectedIds.length === 0,
        hidden: () => false,
        click: () => {
          this.openAssignCategoiesDialplog();
          return false;
        },
      });
      this.actionButtonList.unshift({
        name: 'copyProducts',
        status: 'danger',
        label: this.cms.textTransform(this.cms.translate.instant('Copy'), 'head-title'),
        icon: 'copy-outline',
        title: this.cms.textTransform(this.cms.translate.instant('Copy'), 'head-title'),
        size: 'medium',
        disabled: () => this.selectedIds.length === 0,
        hidden: () => false,
        click: () => {
          this.cms.openDialog(ProductFormComponent, {
            context: {
              showLoadinng: true,
              inputMode: 'dialog',
              inputId: this.selectedItems.map(item => this.makeId(item)),
              isDuplicate: true,
              onDialogSave: (newData: ProductModel[]) => {
                // if (onDialogSave) onDialogSave(row);
                // this.onClose && this.onClose(newData[0]);
                // this.onSaveAndClose && this.onSaveAndClose(newData[0]);
              },
              onDialogClose: () => {
                // if (onDialogClose) onDialogClose();
                this.refresh();
              },
            },
          });
          return false;
        },
      });

      this.actionButtonList.unshift({
        name: 'importProducts',
        status: 'primary',
        label: this.cms.textTransform(this.cms.translate.instant('Import'), 'head-title'),
        icon: 'download-outline',
        title: this.cms.textTransform(this.cms.translate.instant('Import'), 'head-title'),
        size: 'medium',
        disabled: () => false,
        hidden: () => false,
        click: () => {
          this.cms.openDialog(ImportProductDialogComponent, {
            context: {
              // showLoadinng: true,
              inputMode: 'dialog',
              onDialogSave: (newData: ProductModel[]) => {
                // if (onDialogSave) onDialogSave(row);
                // this.onClose && this.onClose(newData[0]);
                // this.onSaveAndClose && this.onSaveAndClose(newData[0]);
              },
              onDialogClose: () => {
                // if (onDialogClose) onDialogClose();
                this.refresh();
              },
            },
            closeOnEsc: false,
            closeOnBackdropClick: false,
          });
          return false;
        },
      });

      // Test
      // this.actionButtonList.unshift({
      //   name: 'test',
      //   status: 'danger',
      //   label: 'Test',
      //   icon: 'download-outline',
      //   title: 'Test',
      //   size: 'medium',
      //   disabled: () => false,
      //   hidden: () => false,
      //   click: () => {
      //     this.apiService.putProgress('/sales/master-price-table-details', {}, [
      //       {
      //         MasterPriceTable: 'default',
      //         Product: '123123123123',
      //         Unit: 'CAI',
      //         Price: 1234123123,
      //       },
      //       {
      //         MasterPriceTable: 'default',
      //         Product: '123123123123',
      //         Unit: 'CAI',
      //         Price: 1234123123,
      //       },
      //       {
      //         MasterPriceTable: 'default',
      //         Product: '123123123123',
      //         Unit: 'CAI',
      //         Price: 1234123123,
      //       },
      //       {
      //         MasterPriceTable: 'default',
      //         Product: '123123123123',
      //         Unit: 'CAI',
      //         Price: 1234123123,
      //       },
      //       {
      //         MasterPriceTable: 'default',
      //         Product: '123123123123',
      //         Unit: 'CAI',
      //         Price: 1234123123,
      //       },
      //     ], (progressInfo) => {
      //       console.log(progressInfo);
      //     }).then(rs => {
      //       console.log(rs);
      //     });
      //     return false;
      //   },
      // });
      return rs;
    });
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
      add: this.configAddButton(),
      edit: this.configEditButton(),
      delete: this.configDeleteButton(),
      pager: this.configPaging(),
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
            instance.uploadAction.subscribe((row: ProductModel) => {
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
          width: '15%',
        },
        Categories: {
          title: 'Danh mục',
          type: 'html',
          width: '10%',
          valuePrepareFunction: (value: string, product: ProductModel) => {
            return product['Categories'] ? ('<span class="tag">' + product['Categories'].map(cate => cate && cate['text'] || '').join('</span><span class="tag">') + '</span>') : '';
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
        Groups: {
          title: 'Nhóm',
          type: 'html',
          width: '10%',
          valuePrepareFunction: (value: string, product: ProductModel) => {
            return product['Groups'] ? ('<span class="tag">' + product['Groups'].map(cate => cate && cate['text'] || '').join('</span><span class="tag">') + '</span>') : '';
          },
          filter: {
            type: 'custom',
            component: SmartTableSelect2FilterComponent,
            config: {
              delay: 0,
              select2Option: {
                placeholder: 'Chọn nhóm...',
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
                      results: this.groupList.filter(cate => !params.term || this.cms.smartFilter(cate.text, params.term)),
                    };
                  },
                },
              },
            },
          },
        },
        Units: {
          title: 'ĐVT',
          type: 'custom',
          renderComponent: SmartTableTagsComponent,
          width: '10%',
          // valuePrepareFunction: (value: string, product: ProductModel) => {
          //   return product.UnitConversions instanceof Array ? (product.UnitConversions.map((uc: UnitModel & ProductUnitConversoinModel) => (uc.Unit === this.cms.getObjectId(product['WarehouseUnit']) ? `<b>${uc.Name}</b>` : uc.Name)).join(', ')) : this.cms.getObjectText(product['WarehouseUnit']);
          // },
          onComponentInitFunction: (component: SmartTableTagsComponent) => {
            component.labelAsText = (tag) => {
              return tag.text + ' (' + tag.ConversionRatio + ')';
            };
            component.renderToolTip = (tag) => {
              return (tag.tip || tag.text) + ((tag.id != this.cms.getObjectId(component.rowData?.WarehouseUnit)) && (', tỷ lệ chuyển đổi: ' + tag.ConversionRatio + ' ' + this.cms.getObjectText(component.rowData?.WarehouseUnit)) || ' ,ĐVT Cơ bản') + (tag.IsAutoAdjustInventory && ', Trừ kho tự động' || '') + (tag.IsExpirationGoods && ', Có hạn sử dụng' || '') + (tag.IsDefaultSales && ', Mặc định mua' || '') + (tag.IsDefaultPurchase && ', Mặc định bán' || '');
            };
            // component.labelAsText = (tag) => {
            //   return tag.Container ? `${tag.text}/${tag.Container.FindOrder} - ${this.cms.getObjectText(tag.Container)}` : `${tag.text}`;
            // };
            // component.renderToolTip = (tag) => {
            //   return tag.Container ? `${tag.text}/${tag.Container.FindOrder} - ${this.cms.getObjectText(tag.Container)}` : `${tag.text} - (đơn vị tính chưa được set vị trí, click vào để set vị trí)`;
            // };
            // component.init.pipe(takeUntil(this.destroy$)).subscribe(row => {

            // });
            // component.click.pipe(takeUntil(this.destroy$)).subscribe((tag: any) => {
            //   if (!tag.Container) {
            //     this.cms.openDialog(AssignContainerFormComponent, {
            //       context: {
            //         inputMode: 'dialog',
            //         inputGoodsList: [{ Code: component.rowData.Code, WarehouseUnit: component.rowData.WarehouseUnit }],
            //         onDialogSave: async (newData: ProductModel[]) => {
            //           // this.refresh();
            //           // this.updateGridItems(editedItems, newData);
            //           const udpateItem = (await this.source.getAll()).find(f => component.rowData.Code == f.Code);
            //           this.source.isLocalUpdate = true;
            //           try {
            //             const newContainer = newData[0].Containers[0];
            //             this.source.update(udpateItem, {
            //               UnitConversions: [
            //                 ...udpateItem.UnitConversions.map(m => ({
            //                   type: m.type,
            //                   id: m.id,
            //                   text: m.text + ' (' + m.ConversionRatio + ')',
            //                   Container: m.id == tag.id ? newContainer : m.Container,
            //                 })),
            //                 { type: 'STATUS', id: 'UPDATED', text: 'Updated' }]
            //             }).then(() => {
            //               this.source.isLocalUpdate = false;
            //             });
            //           } catch (err) {
            //             this.source.isLocalUpdate = false;
            //           }
            //         },
            //         onDialogClose: () => {
            //         },
            //       },
            //       closeOnEsc: false,
            //       closeOnBackdropClick: false,
            //     });
            //   }
            // });
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
                      results: this.unitList.filter(unit => !params.term || this.cms.smartFilter(unit.text, params.term)),
                    };
                  },
                },
              },
            },
          },
        },
        // ContainerPath: {
        //   title: 'Vị trí hàng hóa',
        //   type: 'custom',
        //   renderComponent: SmartTableTagsComponent,
        //   width: '10%',
        //   filter: {
        //     type: 'custom',
        //     component: SmartTableSelect2FilterComponent,
        //     config: {
        //       delay: 0,
        //       condition: 'bleft',
        //       select2Option: {
        //         placeholder: this.cms.translateText('AdminProduct.Unit.title', { action: this.cms.translateText('Common.choose'), definition: '' }),
        //         allowClear: true,
        //         width: '100%',
        //         dropdownAutoWidth: true,
        //         minimumInputLength: 0,
        //         keyMap: {
        //           id: 'id',
        //           text: 'text',
        //         },
        //         // multiple: true,
        //         logic: 'OR',
        //         ajax: {
        //           url: (params: any) => {
        //             return 'data:text/plan,[]';
        //           },
        //           delay: 0,
        //           processResults: (data: any, params: any) => {
        //             return {
        //               results: this.shelfList.filter(shelf => !params.term || this.cms.smartFilter(shelf.text, params.term)),
        //             };
        //           },
        //         },
        //       },
        //     },
        //   },
        //   valuePrepareFunction: (value: string, product: ProductModel) => {
        //     return product.Containers as any;
        //   },
        //   onComponentInitFunction: (component: SmartTableTagsComponent) => {
        //     component.labelAsText = (tag) => {
        //       return tag.text;
        //     };
        //     component.renderToolTip = (tag) => {
        //       return tag.text;
        //     };
        //     component.init.pipe(takeUntil(this.destroy$)).subscribe(row => {

        //     });
        //     component.click.pipe(takeUntil(this.destroy$)).subscribe((tag: any) => {
        //       if (!tag.Container) {
        //         this.cms.openDialog(AssignContainerFormComponent, {
        //           context: {
        //             inputMode: 'dialog',
        //             inputGoodsList: [{ Code: component.rowData.Code, WarehouseUnit: component.rowData.WarehouseUnit }],
        //             onDialogSave: async (newData: ProductModel[]) => {
        //               // this.refresh();
        //               // this.updateGridItems(editedItems, newData);
        //               const udpateItem = (await this.source.getAll()).find(f => component.rowData.Code == f.Code);
        //               this.source.isLocalUpdate = true;
        //               try {
        //                 const newContainer = newData[0].Containers[0];
        //                 this.source.update(udpateItem, {
        //                   UnitConversions: [
        //                     ...udpateItem.UnitConversions.map(m => ({
        //                       type: m.type,
        //                       id: m.id,
        //                       text: m.text,
        //                       Container: m.id == tag.id ? newContainer : m.Container,
        //                     })),
        //                     { type: 'STATUS', id: 'UPDATED', text: 'Updated' }]
        //                 }).then(() => {
        //                   this.source.isLocalUpdate = false;
        //                 });
        //               } catch (err) {
        //                 this.source.isLocalUpdate = false;
        //               }
        //             },
        //             onDialogClose: () => {
        //             },
        //           },
        //           closeOnEsc: false,
        //           closeOnBackdropClick: false,
        //         });
        //       }
        //     });
        //   },
        // },
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
        Creator: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.creator'), 'head-title'),
          type: 'string',
          width: '5%',
          valuePrepareFunction: (cell: string, row?: any) => {
            return this.cms.getObjectText(cell);
          },
          filter: {
            type: 'custom',
            component: SmartTableSelect2FilterComponent,
            config: {
              delay: 0,
              condition: 'eq',
              select2Option: {
                logic: 'OR',
                placeholder: 'Chọn người tạo...',
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
                  transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
                    console.log(settings);
                    const params = settings.data;
                    this.apiService.getPromise('/user/users', { 'search': params['term'], includeIdText: true }).then(rs => {
                      success(rs);
                    }).catch(err => {
                      console.error(err);
                      failure();
                    });
                  },
                  delay: 300,
                  processResults: (data: any, params: any) => {
                    // console.info(data, params);
                    return {
                      results: data.map(item => {
                        return item;
                      }),
                    };
                  },
                },
              },
            },
          },
        },
        Created: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.dateOfCreated'), 'head-title'),
          type: 'custom',
          width: '5%',
          filter: {
            type: 'custom',
            component: SmartTableDateRangeFilterComponent,
          },
          renderComponent: SmartTableDateTimeComponent,
          onComponentInitFunction: (instance: SmartTableDateTimeComponent) => {
            // instance.format$.next('medium');
          },
        },
        LastUpdateBy: {
          title: this.cms.textTransform(this.cms.translate.instant('Người cập nhật'), 'head-title'),
          type: 'string',
          width: '5%',
          valuePrepareFunction: (cell: string, row?: any) => {
            return this.cms.getObjectText(cell);
          },
          filter: {
            type: 'custom',
            component: SmartTableSelect2FilterComponent,
            config: {
              delay: 0,
              condition: 'eq',
              select2Option: {
                logic: 'OR',
                placeholder: 'Chọn người cập nhật...',
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
                  transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
                    console.log(settings);
                    const params = settings.data;
                    this.apiService.getPromise('/user/users', { 'search': params['term'], includeIdText: true }).then(rs => {
                      success(rs);
                    }).catch(err => {
                      console.error(err);
                      failure();
                    });
                  },
                  delay: 300,
                  processResults: (data: any, params: any) => {
                    // console.info(data, params);
                    return {
                      results: data.map(item => {
                        return item;
                      }),
                    };
                  },
                },
              },
            },
          },
        },
        LastUpdate: {
          title: this.cms.textTransform(this.cms.translate.instant('Cập nhật'), 'head-title'),
          type: 'custom',
          width: '5%',
          filter: {
            type: 'custom',
            component: SmartTableDateRangeFilterComponent,
          },
          renderComponent: SmartTableDateTimeComponent,
          onComponentInitFunction: (instance: SmartTableDateTimeComponent) => {
            // instance.format$.next('medium');
          },
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
    source.prepareData = (data: ProductModel[]) => {
      data.map((product: ProductModel) => {
        if (product.WarehouseUnit && product.WarehouseUnit.Name) {
          product.WarehouseUnit.text = product.WarehouseUnit.Name;
        }

        if (product.Units && product.Units.length > 0) {
          product.Containers = product.Units.filter(f => !!f['Container']).map(m => m['Container']);
          for (const unitConversion of product.Units) {
            if (unitConversion.IsManageByAccessNumber) {
              unitConversion['status'] = 'danger';
              unitConversion['tip'] = unitConversion['text'] + ' (QL theo số truy xuất)';
            }
          }
        }

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
      params['includeCategories'] = true;
      params['includeGroups'] = true;
      params['includeWarehouseUnit'] = true;
      params['includeUnits'] = true;
      params['includeCreator'] = true;
      params['includeLastUpdateBy'] = true;

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
  async openAssignCategoiesDialplog() {
    if (this.selectedIds.length > 0) {
      const editedItems = await this.convertIdsToItems(this.selectedIds);
      this.cms.openDialog(AssignCategoriesFormComponent, {
        context: {
          inputMode: 'dialog',
          inputProducts: this.selectedItems,
          onDialogSave: (newData: ProductModel[]) => {
            // this.refresh();
            this.updateGridItems(editedItems, newData);
          },
          onDialogClose: () => {
          },
        },
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    }
  }

  /** ngx-uploader */
  options: UploaderOptions = { concurrency: 1, maxUploads: 0, maxFileSize: 1024 * 1024 * 1024 };
  formData: FormData;
  files: UploadFile[] = [];
  uploadInput: EventEmitter<UploadInput> = new EventEmitter<UploadInput>();
  humanizeBytes: Function = humanizeBytes;
  dragOver: { [key: string]: boolean } = {};
  filesIndex: { [key: string]: UploadFile } = {};
  pictureFormIndex: { [key: string]: FormGroup } = {};
  uploadForProduct: ProductModel;
  @ViewChild('uploadBtn') uploadBtn: ElementRef;

  async onUploadOutput(output: UploadOutput): Promise<void> {
    // console.log(output);
    // console.log(this.files);
    switch (output.type) {
      case 'allAddedToQueue':
        // uncomment this if you want to auto upload files when added
        this.cms.getAvailableFileStores().then(fileStores => {
          if (fileStores && fileStores.length > 0) {
            const event: UploadInput = {
              type: 'uploadAll',
              url: this.apiService.buildApiUrl(fileStores[0].Path + '/v1/file/files', { token: fileStores[0]['UploadToken'] }),
              method: 'POST',
              data: { foo: 'bar' },
            };
            this.uploadInput.emit(event);
          } else {
            this.cms.toastService.show('Không tìm thấy file store nào !', 'File Store', { status: 'warning' });
          }
        });
        break;
      case 'addedToQueue':
        if (typeof output.file !== 'undefined') {
          this.files.push(output.file);
          this.filesIndex[output.file.id] = output.file;
        }
        break;
      case 'uploading':
        if (typeof output.file !== 'undefined') {
          // update current data in files array for uploading file
          const index = this.files.findIndex((file) => typeof output.file !== 'undefined' && file.id === output.file.id);
          this.files[index] = output.file;
          console.log(`[${output.file.progress.data.percentage}%] Upload file ${output.file.name}`);
        }
        break;
      case 'removed':
        // remove file from array when removed
        this.files = this.files.filter((file: UploadFile) => file !== output.file);
        break;
      case 'dragOver':
        // this.dragOver[formItemIndex] = true;
        break;
      case 'dragOut':
      case 'drop':
        // this.dragOver[formItemIndex] = false;
        break;
      case 'done':
        // The file is downloaded
        console.log('Upload complete');
        const fileResponse: FileModel = output.file.response[0];

        try {

          if (fileResponse) {

            // get product
            const product = (await this.apiService.getPromise<ProductModel[]>('/admin-product/products', { id: [this.uploadForProduct.Code], includePictures: true }))[0];
            if (product) {
              if (!Array.isArray(product.Pictures)) product.Pictures = [];
              product.Pictures.push(fileResponse);
              await this.apiService.putPromise<ProductModel[]>('/admin-product/products', {}, [{
                Code: this.uploadForProduct.Code,
                FeaturePicture: fileResponse,
                Pictures: product.Pictures,
              }]);

              this.source['isLocalUpdate'] = true; // local reload
              await this.source.update(this.uploadForProduct, { ...this.uploadForProduct, FeaturePicture: fileResponse });
              this.source['isLocalUpdate'] = true;

              this.files = [];
              this.uploadBtn.nativeElement.value = '';

            } else {
              throw Error('Get product failed');
            }

          } else {
            throw Error('upload failed');
          }

          console.log(output);
        } catch (e) {
          this.files = [];
          this.uploadBtn.nativeElement.value = '';
        }

        break;
    }
  }

  startUpload(): void {
    const event: UploadInput = {
      type: 'uploadAll',
      url: this.apiService.buildApiUrl('/file/files'),
      method: 'POST',
      data: { foo: 'bar' },
    };

    this.uploadInput.emit(event);
  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id: id });
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }
  /** End ngx-uploader */

}
