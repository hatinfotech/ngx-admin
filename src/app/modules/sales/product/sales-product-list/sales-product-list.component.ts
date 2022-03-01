import { MasterPriceTablePrintComponent } from './../../master-price-table/master-price-table-print/master-price-table-print.component';
import { Component, OnInit } from '@angular/core';
import { ProductListComponent } from '../../../admin-product/product/product-list/product-list.component';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { ProductModel, ProductUnitConversoinModel } from '../../../../models/product.model';
import { SmartTableButtonComponent, SmartTableCurrencyEditableComponent, SmartTableTagsComponent, SmartTableThumbnailComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableFilterComponent, SmartTableSelect2FilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { UnitModel } from '../../../../models/unit.model';
import { GoodsModel, WarehouseGoodsContainerModel } from '../../../../models/warehouse.model';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { takeUntil } from 'rxjs/operators';
import { ImagesViewerComponent } from '../../../../lib/custom-element/my-components/images-viewer/images-viewer.component';
import { AssignContainerFormComponent } from '../../../warehouse/goods/assign-containers-form/assign-containers-form.component';
import { SalesMasterPriceTableDetailModel } from '../../../../models/sales.model';
import { ShowcaseDialogComponent } from '../../../dialog/showcase-dialog/showcase-dialog.component';
import { SalesProductQrCodePrintComponent } from '../sales-product-qrcode-print/sales-product-qrcode-print.component';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { SalesProductDemoTemPrintComponent } from '../product-demo-tem-print/product-demo-tem-print.component';

@Component({
  selector: 'ngx-sales-product-list',
  templateUrl: './sales-product-list.component.html',
  styleUrls: ['./sales-product-list.component.scss'],
})
export class SalesProductListComponent extends ProductListComponent implements OnInit {

  componentName: string = 'SalesProductListComponent';
  // formPath = '/warehouse/goods/form';
  apiPath = '/sales/master-price-table-details';
  idKey: string | string[] = ['Code', 'WarehouseUnit'];
  // formDialog = SalesProductFormComponent;

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
            return product['FeaturePicture']['Thumbnail'];
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
                this.commonService.openDialog(ImagesViewerComponent, {
                  context: {
                    images: pictureList.map(m => m['OriginImage']),
                    imageIndex: 0,
                  }
                });
              }
            });
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
          width: '15%',
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
                logic: 'OR',
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
        Groups: {
          title: 'Nhóm',
          type: 'html',
          width: '5%',
          valuePrepareFunction: (value: string, product: ProductModel) => {
            return product['Groups'] ? ('<span class="tag">' + product['Groups'].map(cate => cate['text']).join('</span><span class="tag">') + '</span>') : '';
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
                // code template: smart-table fiter with data update
                ajax: {
                  url: (params: any) => {
                    return 'data:text/plan,[]';
                  },
                  delay: 0,
                  processResults: (data: any, params: any) => {
                    return {
                      results: this.groupList.filter(cate => !params.term || this.commonService.smartFilter(cate.text, params.term)),
                    };
                  },
                },
              },
            },
          },
        },
        Unit: {
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
              condition: 'eq',
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
        Containers: {
          title: this.commonService.textTransform(this.commonService.translate.instant('Warehouse.container'), 'head-title'),
          type: 'html',
          onComponentInitFunction: (instance: SmartTableTagsComponent) => {
            // instance.click.subscribe((tag: { id: string, text: string, type: string }) => this.commonService.previewVoucher(tag.type, tag.id));
          },
          valuePrepareFunction: (cell: any, row) => {
            return cell ? (cell.map(container => this.commonService.getObjectText(container)).join('<br>')) : '';
          },
          width: '15%',
        },
        Code: {
          title: 'Code',
          type: 'string',
          width: '10%',
        },
        Sku: {
          title: 'Sku',
          type: 'string',
          width: '10%',
        },
        Price: {
          title: 'Price',
          width: '10%',
          type: 'currency',
          editable: true,
          delay: 3000,
          // onChange: (value: number, row: ProductModel, instance: SmartTableCurrencyEditableComponent) => {
          //   const masterPriceTable = 'default';
          //   if (value) {
          //     if (row.WarehouseUnit.Code) {
          //       // if (!instance.isPatchingValue) {
          //       instance.status = 'primary';
          //       console.log(instance.rowData.Code);
          //       this.apiService.putPromise<SalesMasterPriceTableDetailModel[]>('/sales/master-price-table-details', {}, [{
          //         MasterPriceTable: masterPriceTable as any,
          //         Product: row.Code,
          //         Unit: row.WarehouseUnit.Code,
          //         Price: value,
          //       }]).then(rs => {
          //         // console.log(rs);
          //         console.log(instance.rowData.Code);
          //         instance.status = 'success';
          //         // setTimeout(() => {
          //         //   console.log(instance.rowData.Code);
          //         //   instance.status = '';
          //         // }, 15000);
          //       });
          //       // }
          //     } else {
          //       instance.status = 'danger';
          //       this.commonService.openDialog(ShowcaseDialogComponent, {
          //         context: {
          //           title: 'Cảnh báo',
          //           content: 'Sản phẩm này không có đơn vị tính, để cập nhật giá cho sản phẩm vui lòng cài đặt đơn vị tính trước !',
          //           actions: [
          //             {
          //               label: 'Trở về',
          //               icon: 'back',
          //               status: 'info',
          //               action: () => { },
          //             },
          //           ],
          //         },
          //       });
          //     }
          //   }
          // }
          // },
        },
        PriceTemDemo: {
          title: this.commonService.translateText('Tem demo'),
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
            instance.title = this.commonService.translateText('In Tem Demo');
            instance.label = this.commonService.translateText('In Tem Demo');
            instance.init.subscribe(value => {
              if (!value.Sku || !value.Price || !this.commonService.getObjectId(value.Unit)) {
                instance.disabled = true;
              }
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: WarehouseGoodsContainerModel) => {
              const editedItems = rowData;
              this.commonService.openDialog(SalesProductDemoTemPrintComponent, {
                context: {
                  priceTable: 'default',
                  id: [this.makeId(editedItems)],
                  // printForType: 'DRAWERS',
                }
              });
            });
          },
        },
      }
    });
  }

  listControl: FormGroup;

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<SalesProductListComponent>,
    public formBuilder: FormBuilder,
  ) {
    super(apiService, router, commonService, dialogService, toastService, _http, ref);
    this.listControl = this.formBuilder.group({
      Limit: [],
    });
    // this.listControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
    //   console.log(value);
    //   this.source.setPaging(1, parseInt(value), true);
    // });
  }

  // protected configPaging() {
  //   return {
  //     display: true,
  //     perPage: parseInt(this.listControl.get('Limit').value) || 40,
  //   };
  // }



  async init() {
    this.containerList = (await this.apiService.getPromise<WarehouseGoodsContainerModel[]>('/warehouse/goods-containers', { includePath: true, includeIdText: true, limit: 'nolimit' })).map(container => ({ ...container, text: `${container.FindOrder} - ${container.Path} - ${container.Description}` })) as any;
    return super.init().then(rs => {
      this.actionButtonList.map(button => {
        if (button.name === 'preview') {
          button.name = 'printQrCode';
          button.icon = 'grid-outline';
          button.label = this.commonService.translateText('In tem demo');
          button.title = this.commonService.translateText('In tem demo');
          button.click = (event, option) => {
            this.commonService.openDialog(SalesProductDemoTemPrintComponent, {
              context: {
                priceTable: 'default',
                id: this.selectedItems.map(item => this.makeId(item)),
              }
            });
          };
        }
        return button;
      });

      this.actionButtonList.unshift({
        name: 'printPriceTable',
        icon: 'grid-outline',
        status: 'primary',
        label: 'In bảng giá nội bộ',
        title: 'In bảng giá nội bộ',
        size: 'medium',
        click: (event, option) => {
          const filter = this.source.getFilter();

          const params: any = {};
          for (const fieldConf of filter.filters) {
            if (fieldConf['search']) {
              // params[`filter_${fieldConf['field']}`] = fieldConf['search'];
              if (typeof fieldConf['search'] === 'object') {
                if (fieldConf['search']['searchType'] === 'range') {
                  if (fieldConf['search']['dataType'] === 'date') {
                    if (!(fieldConf['search']['range'][0] instanceof Date)) {
                      throw new Error('Search from not instance of date');
                    }
                    if (!(fieldConf['search']['range'][1] instanceof Date)) {
                      throw new Error('Search to not instance of date');
                    }
                  }
                  params[`ge_${fieldConf['field']}`] = this.encodeFilterQuery(this.commonService.getBeginOfDate(fieldConf['search']['range'][0]).toISOString());
                  params[`le_${fieldConf['field']}`] = this.encodeFilterQuery(this.commonService.getEndOfDate(fieldConf['search']['range'][1]).toISOString());
                } else {
                  if (fieldConf['search']['value']) {
                    params[`${fieldConf?.search?.condition || 'filter'}_${fieldConf?.field}`] = this.encodeFilterQuery(fieldConf['search']['value']);
                  }
                }
              } else {
                if (fieldConf['search'] !== null) {
                  params[`filter_${fieldConf['field']}`] = this.encodeFilterQuery(fieldConf['search']);
                }

              }
            }
          }

          params.includeShelf = true;
          params.sort_Name = 'desc';

          params.selectedProducts = this.selectedIds.map(m => this.makeId(m));

          this.commonService.openDialog(MasterPriceTablePrintComponent, {
            context: {
              id: [],
              params: params,
            }
          })
        }
      });

      // const previewBtn = this.actionButtonList.find(f => f.name == 'preview');
      // previewBtn.label = 'Print QR Code';
      // previewBtn.icon = 'grid-outline';
      // previewBtn.disabled = () => false;
      // previewBtn.click = () => {
      //   this.commonService.openDialog(ShowcaseDialogComponent, {
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
      //             this.commonService.openDialog(SalesProductPrintComponent, {
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

  encodeFilterQuery(query: { instance: any, value: any } | any) {
    if (typeof query === 'object' && query?.instance) {
      return query.instance.encodeFilterQuery(query.value);
    } else {
      return query;
    }
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  initDataSource() {
    const source = super.initDataSource();

    // Set DataSource: prepareData
    source.prepareData = (data: ProductModel[]) => {
      data.map((product: ProductModel) => {
        if (product['WarehouseUnit']) {
          product['UnitLabel'] = product['WarehouseUnit']['Name'];
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
      params['masterPriceTable'] = 'default';
      params['includeCategories'] = true;
      params['includeGroups'] = true;
      params['includeUnit'] = true;
      params['includeFeaturePicture'] = true;
      params['sort_Id'] = 'desc';
      params['group_Unit'] = true;
      params['includeContainers'] = true;
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
