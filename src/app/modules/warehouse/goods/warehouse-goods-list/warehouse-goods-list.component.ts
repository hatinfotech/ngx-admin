import { Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { RootServices } from '../../../../services/root.services';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService, NbDialogRef, NbThemeService } from '@nebular/theme';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AdminProductService } from '../../../admin-product/admin-product.service';
import { DecimalPipe } from '@angular/common';
import { ProductListComponent } from '../../../admin-product/product/product-list/product-list.component';
import { AppModule } from '../../../../app.module';
import { agMakeSelectionColDef } from '../../../../lib/custom-element/ag-list/column-define/selection.define';
import { agMakeImageColDef } from '../../../../lib/custom-element/ag-list/column-define/image.define';
import { AgTextCellRenderer } from '../../../../lib/custom-element/ag-list/cell/text.component';
import { AgSelect2Filter } from '../../../../lib/custom-element/ag-list/filter/select2.component.filter';
import { AgDateCellRenderer } from '../../../../lib/custom-element/ag-list/cell/date.component';
import { ColDef, IGetRowsParams } from '@ag-grid-community/core';
import { ProductCategoryModel, ProductGroupModel, ProductModel, ProductUnitModel } from '../../../../models/product.model';
import { AgGridDataManagerListComponent } from '../../../../lib/data-manager/ag-grid-data-manger-list.component';
import { FormGroup } from '@angular/forms';
import { filter, take, takeUntil } from 'rxjs/operators';
import { UploaderOptions, UploadFile, UploadInput, humanizeBytes, UploadOutput } from '../../../../../vendor/ngx-uploader/src/public_api';
import { IdTextModel } from '../../../../models/common.model';
import { FileModel } from '../../../../models/file.model';
import { WarehouseGoodsContainerModel } from '../../../../models/warehouse.model';
import { AssignCategoriesFormComponent } from '../../../admin-product/product/assign-categories-form/assign-categories-form.component';
import { ProductFormComponent } from '../../../admin-product/product/product-form/product-form.component';
import { agMakeNumberColDef } from '../../../../lib/custom-element/ag-list/column-define/number.define';
import { agMakeButtonsColDef } from '../../../../lib/custom-element/ag-list/column-define/buttons.define';
import { AssignNewContainerFormComponent } from '../assign-new-containers-form/assign-new-containers-form.component';
import { WarehouseGoodsFindOrderTempPrintComponent } from '../warehouse-goods-find-order-temp-print/warehouse-goods-find-order-temp-print.component';
import { DialogFormComponent } from '../../../dialog/dialog-form/dialog-form.component';
import { WarehouseGoodsReceiptNoteDetailAccessNumberPrintComponent } from '../../goods-receipt-note/warehouse-goods-access-number-print/warehouse-goods-access-number-print.component';
import { AgDynamicListComponent } from '../../../general/ag-dymanic-list/ag-dymanic-list.component';
import { agMakeCurrencyColDef } from '../../../../lib/custom-element/ag-list/column-define/currency.define';
import { agMakeCommandColDef } from '../../../../lib/custom-element/ag-list/column-define/command.define';

@Component({
  selector: 'ngx-warehouse-goods-list',
  templateUrl: './warehouse-goods-list.component.html',
  styleUrls: ['./warehouse-goods-list.component.scss'],
  providers: [DecimalPipe]
})
export class WarehouseGoodsListComponent extends AgGridDataManagerListComponent<ProductModel, ProductFormComponent> implements OnInit {

  componentName: string = 'WarehouseGoodsListComponent';
  formPath = '/warehouse/goods/form';
  apiPath = '/warehouse/goods';
  idKey: string | string[] = ['Code', 'WarehouseUnit', 'Container'];
  formDialog = ProductFormComponent;

  // Use for load settings menu for context
  feature = {
    Module: { id: 'Warehouse', text: 'Kho bãi' },
    Feature: { id: 'Goods', text: 'Hàng hóa' }
  };

  @Input() reuseDialog = true;
  static _dialog: NbDialogRef<ProductListComponent>;

  // Smart table
  static filterConfig: any;
  static sortConf: any;
  static pagingConf = { page: 1, perPage: 40 };

  // Category list for filter
  categoryList: ProductCategoryModel[] = [];
  groupList: ProductGroupModel[] = [];
  unitList: ProductUnitModel[] = [];
  containerList: WarehouseGoodsContainerModel[] = [];
  // @Input() rowMultiSelectWithClick = true;
  // @Input() suppressRowClickSelection = false;

  @Input() width = '100%';
  @Input() height = '100%';

  shelfList: IdTextModel[];
  // @ViewChild('smartTable', { static: false }) smartTable: Ng2SmartTableComponent;

  // private smartTable: Ng2SmartTableComponent;

  @Input() pagingConfig: { display: boolean, perPage: number }
  @Input() paginationPageSize = 20;
  @Input() cacheBlockSize = this.paginationPageSize;
  @Input() getRowNodeId = (item: any) => {
    return item.Code + '-' + this.cms.getObjectId(item.Unit) + this.cms.getObjectId(item.Container);
  }

  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<WarehouseGoodsListComponent>,
    public prds: AdminProductService,
    public themeService: NbThemeService,
  ) {
    super(rsv, apiService, router, cms, dialogService, toastService, themeService, ref);
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

  prepareApiParams(params: any, getRowParams: IGetRowsParams) {
    params['includeCategories'] = true;
    params['includeFeaturePicture'] = true;
    params['includeUnit'] = true;
    params['includeContainer'] = true;
    params['includeInventory'] = true;
    params['includeLastInventoryAdjust'] = true;
    params['includeAccessNumbers'] = true;
    return params;
  }

  async init() {
    await this.prds.unitList$.pipe(filter(f => !!f), take(1)).toPromise();
    await this.loadCache();
    return super.init().then(async rs => {

      // Load unit list
      this.prds.unitList$.pipe(takeUntil(this.destroy$)).subscribe(unitList => {
        this.unitList = unitList;
      });


      // this.actionButtonList.unshift({
      //   name: 'assignCategories',
      //   status: 'info',
      //   label: this.cms.textTransform(this.cms.translate.instant('Common.tag/untag'), 'head-title'),
      //   icon: 'pricetags',
      //   title: this.cms.textTransform(this.cms.translate.instant('Common.tag/untag'), 'head-title'),
      //   size: 'medium',
      //   disabled: () => this.selectedIds.length === 0,
      //   hidden: () => false,
      //   click: () => {
      //     this.openAssignCategoiesDialplog();
      //     return false;
      //   },
      // });
      // this.actionButtonList.unshift({
      //   name: 'copyProducts',
      //   status: 'danger',
      //   label: this.cms.textTransform(this.cms.translate.instant('Copy'), 'head-title'),
      //   icon: 'copy-outline',
      //   title: this.cms.textTransform(this.cms.translate.instant('Copy'), 'head-title'),
      //   size: 'medium',
      //   disabled: () => this.selectedIds.length === 0,
      //   hidden: () => false,
      //   click: () => {
      //     this.cms.openDialog(ProductFormComponent, {
      //       context: {
      //         showLoadinng: true,
      //         inputMode: 'dialog',
      //         inputId: this.selectedItems.map(item => this.makeId(item)),
      //         isDuplicate: true,
      //         onDialogSave: (newData: ProductModel[]) => {
      //           // if (onDialogSave) onDialogSave(row);
      //           // this.onClose && this.onClose(newData[0]);
      //           // this.onSaveAndClose && this.onSaveAndClose(newData[0]);
      //         },
      //         onDialogClose: () => {
      //           // if (onDialogClose) onDialogClose();
      //           this.refresh();
      //         },
      //       },
      //     });
      //     return false;
      //   },
      // });

      // this.actionButtonList.unshift({
      //   name: 'importProducts',
      //   status: 'primary',
      //   label: this.cms.textTransform(this.cms.translate.instant('Import'), 'head-title'),
      //   icon: 'download-outline',
      //   title: this.cms.textTransform(this.cms.translate.instant('Import'), 'head-title'),
      //   size: 'medium',
      //   disabled: () => false,
      //   hidden: () => false,
      //   click: () => {
      //     this.cms.openDialog(ImportProductDialogComponent, {
      //       context: {
      //         // showLoadinng: true,
      //         inputMode: 'dialog',
      //         onDialogSave: (newData: ProductModel[]) => {
      //           // if (onDialogSave) onDialogSave(row);
      //           // this.onClose && this.onClose(newData[0]);
      //           // this.onSaveAndClose && this.onSaveAndClose(newData[0]);
      //         },
      //         onDialogClose: () => {
      //           // if (onDialogClose) onDialogClose();
      //           this.refresh();
      //         },
      //       },
      //       closeOnEsc: false,
      //       closeOnBackdropClick: false,
      //     });
      //     return false;
      //   },
      // });

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



      const processingMap = AppModule.processMaps['commercePos'];
      await this.cms.waitForLanguageLoaded();

      this.actionButtonList = this.actionButtonList.filter(f => ['add', 'edit', 'delete', 'preview'].indexOf(f.name) < 0)

      this.actionButtonList.unshift({
        name: 'printFindOrderTem',
        status: 'primary',
        label: 'In tem nhận thức',
        title: 'In tem nhận thức',
        icon: 'grid-outline',
        size: 'medium',
        disabled: () => this.selectedIds.length == 0,
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
              width: '500px',
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
                    return false; // do not close dialog after action
                  },
                },
              ],
            },
          });
        }
      });

      this.columnDefs = this.configSetting([
        {
          ...agMakeSelectionColDef(this.cms),
          headerName: 'STT',
          field: 'Id',
          width: 100,
          valueGetter: 'node.data.Id',
          // sortingOrder: ['desc', 'asc'],
          initialSort: 'desc',
          headerCheckboxSelection: true,
        },
        {
          ...agMakeImageColDef(this.cms, null, (rowData) => {
            return rowData.Pictures?.map(m => m['LargeImage']);
          }),
          headerName: 'Hình',
          pinned: 'left',
          field: 'FeaturePicture',
          width: 100,
        },
        {
          headerName: 'ID',
          field: 'Code',
          width: 140,
          filter: 'agTextColumnFilter',
          pinned: 'left',
          // initialSort: 'desc',
        },
        {
          headerName: 'Sku',
          field: 'Sku',
          pinned: 'left',
          width: 120,
          filter: 'agTextColumnFilter',
        },
        {
          headerName: 'Tên',
          field: 'Name',
          pinned: 'left',
          width: 350,
          filter: 'agTextColumnFilter',
          cellRenderer: AgTextCellRenderer,
        },
        // {
        //   headerName: 'DS ',
        //   field: 'Units',
        //   // pinned: 'left',
        //   width: 200,
        //   cellRenderer: AgTextCellRenderer,
        //   filter: AgSelect2Filter,
        //   filterParams: {
        //     select2Option: {
        //       ...this.cms.makeSelect2AjaxOption('/admin-product/units', { includeIdText: true, includeGroups: true, sort_Name: 'asc' }, {
        //         placeholder: 'Chọn liên hệ...', limit: 10, prepareReaultItem: (item) => {
        //           item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
        //           return item;
        //         }
        //       }),
        //       multiple: true,
        //       logic: 'OR',
        //       allowClear: true,
        //     }
        //   },
        // },
        {
          headerName: 'Vị trí',
          field: 'Container',
          // pinned: 'left',
          width: 300,
          cellRenderer: AgTextCellRenderer,
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.makeSelect2AjaxOption('/warehouse/goods-containers', { onlyIdText: true }, {
                placeholder: 'Chọn vị trí...', limit: 10, prepareReaultItem: (item) => {
                  item['text'] = '[' + item['FindOrder'] + ']' + item['text'] + ' (' + item['id'] + ')';
                  return item;
                }
              }),
              multiple: true,
              logic: 'OR',
              allowClear: true,
            }
          },
        },
        {
          headerName: 'Kho',
          field: 'Warehouse',
          // pinned: 'left',
          width: 200,
          cellRenderer: AgTextCellRenderer,
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.makeSelect2AjaxOption('/warehouse/warehouses', { onlyIdText: true }, {
                placeholder: 'Chọn kho...', limit: 10, prepareReaultItem: (item) => {
                  // item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
                  return item;
                }
              }),
              multiple: true,
              logic: 'OR',
              allowClear: true,
            }
          },
        },
        {
          headerName: 'Kệ',
          field: 'ContainerShelf',
          // pinned: 'left',
          width: 200,
          cellRenderer: AgTextCellRenderer,
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.makeSelect2AjaxOption('/warehouse/goods-containers', { onlyIdText: true, eq_Type: 'SHELF' }, {
                placeholder: 'Chọn kệ...', limit: 10, prepareReaultItem: (item) => {
                  // item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
                  return item;
                }
              }),
              multiple: true,
              logic: 'OR',
              allowClear: true,
            }
          },
        },
        {
          headerName: 'Danh mục',
          field: 'Categories',
          // pinned: 'left',
          width: 200,
          cellRenderer: AgTextCellRenderer,
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.makeSelect2AjaxOption('/admin-product/categories', { includeIdText: true, includeGroups: true, sort_Name: 'asc' }, {
                placeholder: 'Chọn danh mục...', limit: 10, prepareReaultItem: (item) => {
                  item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
                  return item;
                }
              }),
              multiple: true,
              logic: 'OR',
              allowClear: true,
            }
          },
        },
        {
          headerName: 'Nhóm',
          field: 'Groups',
          // pinned: 'left',
          width: 200,
          cellRenderer: AgTextCellRenderer,
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.makeSelect2AjaxOption('/admin-product/groups', { includeIdText: true, includeGroups: true, sort_Name: 'asc' }, {
                placeholder: 'Chọn nhóm...', limit: 10, prepareReaultItem: (item) => {
                  item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
                  return item;
                }
              }),
              multiple: true,
              logic: 'OR',
              allowClear: true,
            }
          },
        },
        {
          headerName: 'Ngày tạo',
          field: 'Created',
          width: 180,
          filter: 'agDateColumnFilter',
          filterParams: {
            inRangeFloatingFilterDateFormat: 'DD/MM/YY',
          },
          cellRenderer: AgDateCellRenderer,
        },
        {
          ...agMakeNumberColDef(this.cms),
          headerName: 'Tồn kho',
          field: 'Inventory',
          pinned: 'right',
          width: 120,
        },
        {
          headerName: 'ĐVT',
          field: 'Unit',
          pinned: 'right',
          width: 100,
          cellRenderer: AgTextCellRenderer,
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              placeholder: 'Chọn ĐVT...',
              allowClear: true,
              width: '100%',
              dropdownAutoWidth: true,
              minimumInputLength: 0,
              withThumbnail: false,
              keyMap: {
                id: 'id',
                text: 'text',
              },
              multiple: true,
              logic: 'OR',
              data: this.prds.unitList$.value,
            }
          },
        },
        // {
        //   ...agMakeNumberColDef(this.cms),
        //   headerName: 'Giá trị tồn',
        //   field: 'InventoryCost',
        //   pinned: 'right',
        //   width: 120,
        // },
        {
          ...agMakeButtonsColDef(this.cms, [
            {
              name: 'assignNewContainer',
              label: 'Tạo vị trí',
              status: 'success',
              outline: false,
              icon: 'archive-outline',
              action: async (params: any, data: ProductModel) => {
                let editedItem = data;
                this.cms.openDialog(AssignNewContainerFormComponent, {
                  context: {
                    inputMode: 'dialog',
                    inputGoodsList: [editedItem],
                    onDialogSave: (newData: ProductModel[]) => {
                      this.refresh();
                    },
                    onDialogClose: () => {
                    },
                  },
                  closeOnEsc: false,
                  closeOnBackdropClick: false,
                });
                return true;
              }
            },
            {
              name: 'printFindOrderTem',
              // label: 'In tem',
              status: 'info',
              outline: false,
              icon: 'printer-outline',
              action: async (params: any, buttonConfig: ProductModel) => {
                if (this.cms.getObjectId(params.data.Container)) {
                  this.cms.openDialog(WarehouseGoodsFindOrderTempPrintComponent, {
                    context: {
                      priceTable: 'default',
                      id: [this.makeId(params.data)],
                    }
                  });
                } else {
                  this.cms.toastService.show('Hàng hóa chứa được cài đặt vị trí', 'In tem nhận thức', { status: 'warning' })
                }
                return true
              }
            },
            {
              name: 'showDetails',
              // label: '',
              status: 'danger',
              outline: false,
              icon: 'external-link-outline',
              // disabled: (data: any) => !data.IsManageByAccessNumber,
              action: async (nodeParams: any, buttonConfig: ProductModel) => {
                if (!nodeParams.data.Container) {
                  this.cms.showToast('Bạn chỉ có thể in tem nhận thức cho các hàng hóa đã cài đặt vị trí.', 'Hàng hóa chưa được cài đặt vị trí !', { status: 'warning' });
                  return;
                }
                if (!nodeParams.data.IsManageByAccessNumber) {
                  // this.cms.showToast('Hàng hóa này không được quản lý theo số truy xuất.', 'Hàng hóa không quản lý theo số truy xuất !', { status: 'warning' });
                  // this.cms.openDialog(AgDynamicListComponent, {
                  //   context: {
                  //     title: 'Lịch sử nhập kho',
                  //     width: '90%',
                  //     height: '95vh',
                  //     apiPath: '/warehouse/reports',
                  //     idKey: 'Voucher',
                  //     rowMultiSelectWithClick: true,
                  //     suppressRowClickSelection: false,
                  //     // rowModelType: 'clientSide',
                  //     // rowData: data.AccessNumbers?.map(accessNumber => ({
                  //     //   ...data,
                  //     //   AccessNumber: accessNumber,
                  //     // })),
                  //     getRowNodeId: (item: any) => {
                  //       return item.AccessNumber
                  //     },
                  //     prepareApiParams: (params, getRowParams) => {
                  //       // const sites = formGroup.get('Sites').value;
                  //       // params['id'] = nodeParams.data.AccessNumbers && nodeParams.data.AccessNumbers.length > 0 ? nodeParams.data.AccessNumbers : '-1';
                  //       params['reportVoucherByAccountAndGoods'] = true;
                  //       return params;
                  //     },
                  //     onDialogChoose: (chooseItems) => {
                  //       console.log(chooseItems);
                  //       if (chooseItems && chooseItems.length > 0) {
                  //         // this.loading = true;
                  //         this.cms.openDialog(WarehouseGoodsReceiptNoteDetailAccessNumberPrintComponent, {
                  //           context: {
                  //             id: chooseItems.map(m => this.cms.getObjectId(m['AccessNumber']))
                  //           }
                  //         });
                  //       }

                  //     },
                  //     columnDefs: [
                  //       {
                  //         ...agMakeSelectionColDef(this.cms),
                  //         headerName: 'STT',
                  //         // width: 52,
                  //         field: 'Id',
                  //         valueGetter: 'node.data.Id',
                  //         // cellRenderer: 'loadingCellRenderer',
                  //         // sortable: true,
                  //         // pinned: 'left',
                  //       },
                  //       {
                  //         headerName: this.cms.textTransform(this.cms.translate.instant('Warehouse.dateOfReceipted'), 'head-title'),
                  //         field: 'DateOfReceipted',
                  //         width: 180,
                  //         pinned: 'left',
                  //         filter: 'agDateColumnFilter',
                  //         filterParams: {
                  //           inRangeFloatingFilterDateFormat: 'DD/MM/YY',
                  //         },
                  //         cellRenderer: AgDateCellRenderer,
                  //       },
                  //       {
                  //         headerName: this.cms.translateText('Common.voucher'),
                  //         field: 'Voucher',
                  //         width: 150,
                  //         filter: 'agTextColumnFilter',
                  //         headerComponentParams: { enableMenu: true, menuIcon: 'fa-external-link-alt' },
                  //         filterParams: {
                  //           filterOptions: ['contains'],
                  //           textMatcher: ({ value, filterText }) => {
                  //             var literalMatch = this.cms.smartFilter(value, filterText);
                  //             return literalMatch;
                  //           },
                  //           trimInput: true,
                  //           debounceMs: 1000,
                  //         },
                  //         cellRenderer: AgTextCellRenderer,
                  //         pinned: 'left',
                  //       },
                  //       {
                  //         headerName: 'Nhà cung cấp',
                  //         field: 'Object',
                  //         pinned: 'left',
                  //         width: 400,
                  //         cellRenderer: AgTextCellRenderer,
                  //         filter: AgSelect2Filter,
                  //         valueGetter: 'node.data.ObjectName',
                  //         filterParams: {
                  //           select2Option: {
                  //             ...this.cms.makeSelect2AjaxOption('/contact/contacts', { includeIdText: true, includeGroups: true, sort_SearchRank: 'desc' }, {
                  //               placeholder: 'Chọn liên hệ...', limit: 10, prepareReaultItem: (item) => {
                  //                 item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
                  //                 return item;
                  //               }
                  //             }),
                  //             multiple: true,
                  //             logic: 'OR',
                  //             allowClear: true,
                  //           }
                  //         },
                  //       },
                  //       {
                  //         headerName: 'Tiêu đề',
                  //         field: 'Title',
                  //         width: 500,
                  //         filter: 'agTextColumnFilter',
                  //         autoHeight: true,
                  //       },
                  //       {
                  //         headerName: 'Số truy xuất',
                  //         field: 'AccessNumber',
                  //         width: 300,
                  //         pinned: 'right',
                  //         filter: 'agTextColumnFilter',
                  //         autoHeight: true,
                  //       },
                  //       {
                  //         ...agMakeButtonsColDef(this.cms, [
                  //           {
                  //             name: 'print',
                  //             // label: 'In',
                  //             status: 'success',
                  //             outline: false,
                  //             icon: 'printer-outline',
                  //             action: async (params: any, data: ProductModel) => {
                  //               let editedItem = params.data;
                  //               this.cms.openDialog(WarehouseGoodsReceiptNoteDetailAccessNumberPrintComponent, {
                  //                 context: {
                  //                   id: params.data.AccessNumber
                  //                 }
                  //               });
                  //               return true;
                  //             }
                  //           },
                  //         ]),
                  //         headerName: 'Action'
                  //       }
                  //     ],
                  //     onInit: (component) => {

                  //     }
                  //   }
                  // });

                  this.cms.openDialog(AgDynamicListComponent, {
                    context: {
                      title: 'Lịch sử nhập hàng',
                      width: '90%',
                      height: '95vh',
                      apiPath: '/accounting/reports',
                      idKey: ['Voucher', 'WriteNo'],
                      getRowNodeId: (item) => {
                        return item.Voucher + '-' + item.WriteNo;
                      },
                      // rowMultiSelectWithClick: true,
                      // suppressRowClickSelection: false,
                      prepareApiParams: (exParams, getRowParams) => {
                        exParams['eq_VoucherType'] = 'PURCHASE';
                        exParams['eq_Accounts'] = [632, 151, 152, 153, 154, 155, 156, 157, 158];
                        exParams['reportDetailByAccountAndObject'] = true;
                        exParams['groupBy'] = 'Voucher,WriteNo';
                        exParams['eq_Product'] = `[${nodeParams.node.data.Code}]`;
                        return exParams;
                      },
                      onDialogChoose: (chooseItems) => {

                      },
                      columnDefs: [
                        {
                          ...agMakeSelectionColDef(this.cms),
                          headerName: 'STT',
                          // width: 52,
                          field: 'Id',
                          valueGetter: 'node.data.Voucher',
                        },
                        {
                          headerName: 'Ngày nhập',
                          field: 'VoucherDate',
                          width: 180,
                          filter: 'agDateColumnFilter',
                          filterParams: {
                            inRangeFloatingFilterDateFormat: 'DD/MM/YY',
                          },
                          cellRenderer: AgDateCellRenderer,
                          // initialSort: 'desc'
                        },
                        {
                          headerName: 'Voucher',
                          field: 'Voucher',
                          width: 200,
                          filter: 'agTextColumnFilter',
                          headerComponentParams: { enableMenu: true, menuIcon: 'fa-external-link-alt' },
                          filterParams: {
                            filterOptions: ['contains'],
                            textMatcher: ({ value, filterText }) => {
                              var literalMatch = this.cms.smartFilter(value, filterText);
                              return literalMatch;
                            },
                            trimInput: true,
                            debounceMs: 1000,
                          },
                          cellRenderer: AgTextCellRenderer,
                          pinned: 'left',
                        },
                        {
                          headerName: this.cms.textTransform(this.cms.translate.instant('Common.supplier'), 'head-title'),
                          field: 'Object',
                          pinned: 'left',
                          width: 250,
                          cellRenderer: AgTextCellRenderer,
                          valueGetter: 'node.data.ObjectName',
                          filter: AgSelect2Filter,
                          filterParams: {
                            select2Option: {
                              ...this.cms.makeSelect2AjaxOption('/contact/contacts', { includeIdText: true, includeGroups: true, sort_SearchRank: 'desc' }, {
                                placeholder: 'Chọn liên hệ...', limit: 10, prepareReaultItem: (item) => {
                                  item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
                                  return item;
                                }
                              }),
                              multiple: true,
                              logic: 'OR',
                              allowClear: true,
                            }
                          },
                        },
                        {
                          headerName: 'Tiêu đề',
                          field: 'VoucherDescription',
                          width: 400,
                          filter: 'agTextColumnFilter',
                          headerComponentParams: { enableMenu: true, menuIcon: 'fa-external-link-alt' },
                          filterParams: {
                            filterOptions: ['contains'],
                            textMatcher: ({ value, filterText }) => {
                              var literalMatch = this.cms.smartFilter(value, filterText);
                              return literalMatch;
                            },
                            trimInput: true,
                            debounceMs: 1000,
                          }
                        },
                        {
                          headerName: 'Tên sản phẩm',
                          field: 'Product',
                          width: 400,
                          valueGetter: 'node.data.Description',
                          filter: 'agTextColumnFilter',
                          headerComponentParams: { enableMenu: true, menuIcon: 'fa-external-link-alt' },
                          filterParams: {
                            filterOptions: ['contains'],
                            textMatcher: ({ value, filterText }) => {
                              var literalMatch = this.cms.smartFilter(value, filterText);
                              return literalMatch;
                            },
                            trimInput: true,
                            debounceMs: 1000,
                          }
                        },
                        {
                          ...agMakeNumberColDef(this.cms),
                          headerName: 'Số lượng',
                          field: 'Quantity',
                          pinned: 'right',
                          width: 120,
                        },
                        {
                          headerName: 'ĐVT',
                          field: 'ProductUnit',
                          width: 100,
                          pinned: 'right',
                          // cellRenderer: AgTextCellRenderer,
                          valueFormatter: 'node.data.ProductUnitLabel',
                          filter: AgSelect2Filter,
                          filterParams: {
                            select2Option: {
                              placeholder: 'Chọn...',
                              allowClear: true,
                              width: '100%',
                              dropdownAutoWidth: true,
                              minimumInputLength: 0,
                              withThumbnail: false,
                              keyMap: {
                                id: 'id',
                                text: 'text',
                              },
                              data: this.prds.unitList$.value,
                              multiple: true,
                              logic: 'OR',
                            }
                          },
                        },
                        // {
                        //   ...agMakeCurrencyColDef(this.cms),
                        //   headerName: 'Giá',
                        //   field: 'Price',
                        //   pinned: 'right',
                        //   width: 150,
                        // },
                        // {
                        //   ...agMakeCommandColDef(this, this.cms, false, false, false, [
                        //     {
                        //       name: 'extend',
                        //       // label: 'In',
                        //       status: 'danger',
                        //       outline: false,
                        //       icon: 'external-link-outline',
                        //       action: async (params: any) => {
                        //         this.cms.previewVoucher(null, params.node.data.Voucher);
                        //         return true;
                        //       }
                        //     }])
                        // }
                      ],
                      onInit: (component) => {
                        component.actionButtonList = component.actionButtonList.filter(f => ['close', 'choose', 'preview', 'refresh'].indexOf(f.name) > -1);
                      }
                    }
                  });

                  return true;
                }
                this.cms.openDialog(AgDynamicListComponent, {
                  context: {
                    title: 'Số truy xuất',
                    width: '90%',
                    height: '95vh',
                    apiPath: '/warehouse/goods-receipt-note-detail-access-numbers',
                    idKey: 'Code',
                    rowMultiSelectWithClick: true,
                    suppressRowClickSelection: false,
                    // rowModelType: 'clientSide',
                    // rowData: data.AccessNumbers?.map(accessNumber => ({
                    //   ...data,
                    //   AccessNumber: accessNumber,
                    // })),
                    getRowNodeId: (item: any) => {
                      return item.AccessNumber
                    },
                    prepareApiParams: (params, getRowParams) => {
                      // const sites = formGroup.get('Sites').value;
                      params['id'] = nodeParams.data.AccessNumbers && nodeParams.data.AccessNumbers.length > 0 ? nodeParams.data.AccessNumbers : '-1';
                      params['includeVoucherInfo'] = true;
                      return params;
                    },
                    onDialogChoose: (chooseItems) => {
                      console.log(chooseItems);
                      if (chooseItems && chooseItems.length > 0) {
                        // this.loading = true;
                        this.cms.openDialog(WarehouseGoodsReceiptNoteDetailAccessNumberPrintComponent, {
                          context: {
                            id: chooseItems.map(m => this.cms.getObjectId(m['AccessNumber']))
                          }
                        });
                      }

                    },
                    columnDefs: [
                      {
                        ...agMakeSelectionColDef(this.cms),
                        headerName: 'STT',
                        // width: 52,
                        field: 'Id',
                        valueGetter: 'node.data.Id',
                        // cellRenderer: 'loadingCellRenderer',
                        // sortable: true,
                        // pinned: 'left',
                      },
                      {
                        headerName: this.cms.textTransform(this.cms.translate.instant('Warehouse.dateOfReceipted'), 'head-title'),
                        field: 'DateOfReceipted',
                        width: 180,
                        pinned: 'left',
                        filter: 'agDateColumnFilter',
                        filterParams: {
                          inRangeFloatingFilterDateFormat: 'DD/MM/YY',
                        },
                        cellRenderer: AgDateCellRenderer,
                      },
                      {
                        headerName: this.cms.translateText('Common.voucher'),
                        field: 'Voucher',
                        width: 150,
                        filter: 'agTextColumnFilter',
                        headerComponentParams: { enableMenu: true, menuIcon: 'fa-external-link-alt' },
                        filterParams: {
                          filterOptions: ['contains'],
                          textMatcher: ({ value, filterText }) => {
                            var literalMatch = this.cms.smartFilter(value, filterText);
                            return literalMatch;
                          },
                          trimInput: true,
                          debounceMs: 1000,
                        },
                        cellRenderer: AgTextCellRenderer,
                        pinned: 'left',
                      },
                      {
                        headerName: 'Nhà cung cấp',
                        field: 'Object',
                        pinned: 'left',
                        width: 400,
                        cellRenderer: AgTextCellRenderer,
                        filter: AgSelect2Filter,
                        valueGetter: 'node.data.ObjectName',
                        filterParams: {
                          select2Option: {
                            ...this.cms.makeSelect2AjaxOption('/contact/contacts', { includeIdText: true, includeGroups: true, sort_SearchRank: 'desc' }, {
                              placeholder: 'Chọn liên hệ...', limit: 10, prepareReaultItem: (item) => {
                                item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
                                return item;
                              }
                            }),
                            multiple: true,
                            logic: 'OR',
                            allowClear: true,
                          }
                        },
                      },
                      {
                        headerName: 'Tiêu đề',
                        field: 'Title',
                        width: 500,
                        filter: 'agTextColumnFilter',
                        autoHeight: true,
                      },
                      {
                        headerName: 'Số truy xuất',
                        field: 'AccessNumber',
                        width: 300,
                        pinned: 'right',
                        filter: 'agTextColumnFilter',
                        autoHeight: true,
                      },
                      {
                        ...agMakeButtonsColDef(this.cms, [
                          {
                            name: 'print',
                            // label: 'In',
                            status: 'success',
                            outline: false,
                            icon: 'printer-outline',
                            action: async (params: any, data: ProductModel) => {
                              let editedItem = params.data;
                              this.cms.openDialog(WarehouseGoodsReceiptNoteDetailAccessNumberPrintComponent, {
                                context: {
                                  id: params.data.AccessNumber
                                }
                              });
                              return true;
                            }
                          },
                        ]),
                        headerName: 'Action'
                      }
                    ],
                    onInit: (component) => {

                    }
                  }
                });
              }
            },
          ]),
          headerName: 'Action',
          width: 200,
        },
      ] as ColDef[]);

      return rs;
    });
  }

  editing = {};
  rows = [];

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  // initDataSource() {
  //   const source = super.initDataSource();

  //   // Set DataSource: prepareData
  //   source.prepareData = (data: ProductModel[]) => {
  //     data.map((product: ProductModel) => {
  //       if (product.WarehouseUnit && product.WarehouseUnit.Name) {
  //         product.WarehouseUnit.text = product.WarehouseUnit.Name;
  //       }

  //       if (product.Units && product.Units.length > 0) {
  //         product.Containers = product.Units.filter(f => !!f['Container']).map(m => m['Container']);
  //         for (const unitConversion of product.Units) {
  //           if (unitConversion.IsManageByAccessNumber) {
  //             unitConversion['status'] = 'danger';
  //             unitConversion['tip'] = unitConversion['text'] + ' (QL theo số truy xuất)';
  //           }
  //         }
  //       }

  //       // if (product.Container || product.Container.length > 0) {
  //       //   // product.Container = [product.Container];
  //       // } else {
  //       //   product.Container = { type: 'NEWCONTAINER', id: 'Gán vị trí', text: 'Gán vị trí' };
  //       // }

  //       return product;
  //     });
  //     return data;
  //   };

  //   // Set DataSource: prepareParams
  //   source.prepareParams = (params: any) => {
  //     params['includeCategories'] = true;
  //     params['includeGroups'] = true;
  //     params['includeWarehouseUnit'] = true;
  //     params['includeUnits'] = true;
  //     params['includeCreator'] = true;
  //     params['includeLastUpdateBy'] = true;

  //     params['sort_Id'] = 'desc';
  //     return params;
  //   };

  //   return source;
  // }

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

  openFormDialplog(ids?: string[], onDialogSave?: (newData: ProductModel[]) => void, onDialogClose?: () => void): void {
    throw new Error('Method not implemented.');
  }
}
