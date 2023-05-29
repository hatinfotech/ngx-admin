import { filter, take, takeUntil } from 'rxjs/operators';
import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService, NbDialogRef, NbThemeService } from '@nebular/theme';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ProductCategoryModel, ProductGroupModel, ProductModel, ProductUnitModel } from '../../../../models/product.model';
import { WarehouseGoodsContainerModel } from '../../../../models/warehouse.model';
import { AdminProductService } from '../../../admin-product/admin-product.service';
import { CurrencyPipe } from '@angular/common';
import { ProductFormComponent } from '../../../admin-product/product/product-form/product-form.component';
import { IdTextModel } from '../../../../models/common.model';
import { AgGridDataManagerListComponent } from '../../../../lib/data-manager/ag-grid-data-manger-list.component';
import { ColDef, IGetRowsParams } from '@ag-grid-community/core';
import { AppModule } from '../../../../app.module';
import { agMakeSelectionColDef } from '../../../../lib/custom-element/ag-list/column-define/selection.define';
import { agMakeImageColDef } from '../../../../lib/custom-element/ag-list/column-define/image.define';
import { AgTextCellRenderer } from '../../../../lib/custom-element/ag-list/cell/text.component';
import { AgSelect2Filter } from '../../../../lib/custom-element/ag-list/filter/select2.component.filter';
import { AgDateCellRenderer } from '../../../../lib/custom-element/ag-list/cell/date.component';
import { agMakeNumberColDef } from '../../../../lib/custom-element/ag-list/column-define/number.define';
import { AssignCategoriesFormComponent } from '../../../admin-product/product/assign-categories-form/assign-categories-form.component';
import { ProductListComponent } from '../../../admin-product/product/product-list/product-list.component';
import { agMakeCurrencyColDef } from '../../../../lib/custom-element/ag-list/column-define/currency.define';
import { agMakeCommandColDef } from '../../../../lib/custom-element/ag-list/column-define/command.define';
import { AgDynamicListComponent } from '../../../general/ag-dymanic-list/ag-dymanic-list.component';

@Component({
  selector: 'ngx-warehouse-goods-list',
  templateUrl: './purchase-goods-list.component.html',
  styleUrls: ['./purchase-goods-list.component.scss'],
  providers: [CurrencyPipe]
})
export class PurchaseGoodsListComponent extends AgGridDataManagerListComponent<ProductModel, ProductFormComponent> implements OnInit {

  componentName: string = 'PurchaseGoodsListComponent';
  formPath = '/warehouse/goods/form';
  apiPath = '/purchase/goods';
  idKey: string | string[] = ['Code', 'WarehouseUnit', 'Container'];
  formDialog = ProductFormComponent;

  @Input() reuseDialog = true;
  static _dialog: NbDialogRef<ProductListComponent>;

  @Input() gridHeight = '100%';

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
  // @Input() getRowNodeId = (item: any) => {
  //   return item.Code + '-' + this.cms.getObjectId(item.Unit) + '-' + this.cms.getObjectId(item.Container);
  // }

  // currentRowClass = '';
  // @Input() getRowClass = (params: any) => {
  //   if (params.rowIndex > 0) {
  //     const prevNode = this.gridApi.getDisplayedRowAtIndex(params.rowIndex - 1);
  //     if (prevNode && prevNode?.data && params.node?.data) {
  //       let rowClass = prevNode.data['Class'];
  //       if (params.node.data.Code != prevNode.data.Code) {
  //         if (prevNode.data['Class'] == 'ag-row-even-override') {
  //           rowClass = 'ag-row-odd-override';
  //         } else {
  //           // params.node['class'] = 'ag-row-even-override';
  //           rowClass = 'ag-row-even-override';
  //         }
  //         params.node.setDataValue('Class', rowClass);
  //         // if (params.node?.data) {
  //         //   params.node.data['__class'] = params.node['class'];
  //         // }
  //         // return rowClass;
  //       }
  //       return rowClass;
  //     }
  //   } else {
  //     // this.currentRowClass = 'ag-row-even-override';
  //     // if(params.node?.data) {
  //     //   params.node.data['__class'] = 'ag-row-even-override';

  //     // }
  //     // if (params.node.data) {
  //     //   params.node.setDataValue('Class', 'ag-row-even-override');
  //     // }
  //     // params.node['class'] = 'ag-row-even-override';
  //     return 'ag-row-even-override';
  //   }
  //   // return 'unkow';
  // }

  // @Input() rowClassRules = {
  //   'ag-row-': params => {
  //     if (params.rowIndex > 0) {
  //       const prevNode = this.gridApi.getDisplayedRowAtIndex(params.rowIndex - 1);
  //       if (prevNode && prevNode?.data && params.node?.data) {
  //         if (params.node.data.Code != prevNode.data.Code) {
  //           return true;
  //         }
  //       }
  //     }
  //     return false;
  //   }
  // }

  constructor(
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<PurchaseGoodsListComponent>,
    public prds: AdminProductService,
    public themeService: NbThemeService,
  ) {
    super(apiService, router, cms, dialogService, toastService, themeService, ref);
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


      this.columnDefs = this.configSetting([
        {
          headerName: 'Class',
          field: 'Class',
          width: 10,
          valueGetter: 'node.data.Class',
          // sortingOrder: ['desc', 'asc'],
          // initialSort: 'desc',
          // headerCheckboxSelection: true,
          hide: true,
        },
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
        {
          ...agMakeCurrencyColDef(this.cms),
          headerName: 'Giá vốn',
          field: 'CostOfGoodsSold',
          pinned: 'right',
          width: 120,
        },
        {
          ...agMakeCurrencyColDef(this.cms),
          headerName: 'Giá trị kho',
          field: 'InventoryCost',
          pinned: 'right',
          width: 120,
        },
        {
          ...agMakeCommandColDef(this, this.cms, false, false, false, [
            {
              name: 'extend',
              // label: 'In',
              status: 'danger',
              outline: false,
              icon: 'external-link-outline',
              action: async (params: any) => {
                // const filter = { id: params.node.data?.AccessNumbers };
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
                      exParams['eq_Product'] = `[${params.node.data.Code}]`;
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
                        cellRenderer: 'textRender',
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
                        width: 150,
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
                      {
                        ...agMakeCurrencyColDef(this.cms),
                        headerName: 'Giá',
                        field: 'Price',
                        pinned: 'right',
                        width: 150,
                      },
                      {
                        ...agMakeCommandColDef(this, this.cms, false, false, false, [
                          {
                            name: 'extend',
                            // label: 'In',
                            status: 'danger',
                            outline: false,
                            icon: 'external-link-outline',
                            action: async (params: any) => {
                              this.cms.previewVoucher(null, params.node.data.Voucher);
                              return true;
                            }
                          }])
                      }
                    ],
                    onInit: (component) => {
                      component.actionButtonList = component.actionButtonList.filter(f => ['close', 'choose', 'preview', 'refresh'].indexOf(f.name) > -1);
                    }
                  }
                });
                return true;
              }
            },
          ]),
          headerName: 'Lệnh',
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
  /** Api get funciton */
  executeGet(params: any, success: (resources: ProductModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: ProductModel[] | HttpErrorResponse) => void) {
    params['includeCategories'] = true;
    super.executeGet(params, success, error, complete);
  }

  getList(callback: (list: ProductModel[]) => void) {
    super.getList((rs) => {
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

  openFormDialplog(ids?: string[], onDialogSave?: (newData: ProductModel[]) => void, onDialogClose?: () => void): void {
    throw new Error('Method not implemented.');
  }

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
