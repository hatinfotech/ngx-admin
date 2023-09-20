import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService, NbDialogRef, NbThemeService } from '@nebular/theme';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { ProductModel } from '../../../../models/product.model';
import { AgGridDataManagerListComponent } from '../../../../lib/data-manager/ag-grid-data-manger-list.component';
import { DatePipe } from '@angular/common';
import { ColDef, IGetRowsParams } from '@ag-grid-community/core';
import { AgDateCellRenderer } from '../../../../lib/custom-element/ag-list/cell/date.component';
import { AgTextCellRenderer } from '../../../../lib/custom-element/ag-list/cell/text.component';
import { agMakeCommandColDef } from '../../../../lib/custom-element/ag-list/column-define/command.define';
import { agMakeImageColDef } from '../../../../lib/custom-element/ag-list/column-define/image.define';
import { agMakeSelectionColDef } from '../../../../lib/custom-element/ag-list/column-define/selection.define';
import { agMakeTagsColDef } from '../../../../lib/custom-element/ag-list/column-define/tags.define';
import { AgSelect2Filter } from '../../../../lib/custom-element/ag-list/filter/select2.component.filter';
import { WpSiteModel } from '../../../../models/wordpress.model';
import { AgCurrencyCellInput } from '../../../../lib/custom-element/ag-list/cell/input/curency.component';
import { MasterPriceTableFormComponent } from '../master-price-table-form/master-price-table-form.component';
import { SalesMasterPriceTableModel } from '../../../../models/sales.model';
import { AgDynamicListComponent } from '../../../general/ag-dymanic-list/ag-dymanic-list.component';
import { agMakeCurrencyColDef } from '../../../../lib/custom-element/ag-list/column-define/currency.define';
import { AgCurrencyCellRenderer } from '../../../../lib/custom-element/ag-list/cell/currency.component';
import { MasterPriceTableUpdateNoteFormComponent } from '../../master-price-table-update-note/master-price-table-update-note-form/master-price-table-update-note-form.component';
import { RootServices } from '../../../../services/root.services';

@Component({
  selector: 'ngx-master-price-table',
  templateUrl: './master-price-table.component.html',
  styleUrls: ['./master-price-table.component.scss']
})
export class SalesMasterPriceTableComponent extends AgGridDataManagerListComponent<ProductModel, MasterPriceTableFormComponent> implements OnInit {

  componentName: string = 'SalesMasterPriceTableComponent';
  formPath = '';
  apiPath = '/sales/master-price-table-details';
  idKey = ['Code', 'Unit'];
  // formDialog = WordpressProductFormComponent;

  // AG-Grid config
  public rowHeight: number = 50;
  // @Input() suppressRowClickSelection = false;

  @Input() gridHeight = '100%';
  refCategoryList = [];
  siteList: WpSiteModel[];
  refCategoriesLoading = false;

  masterPriceTable: SalesMasterPriceTableModel;
  masterPriceTableList: SalesMasterPriceTableModel[] = [];

  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public themeService: NbThemeService,
    public ref: NbDialogRef<SalesMasterPriceTableComponent>,
    public datePipe: DatePipe,
  ) {
    super(rsv, apiService, router, cms, dialogService, toastService, themeService, ref);

    this.defaultColDef = {
      ...this.defaultColDef,
      cellClass: 'ag-cell-items-center',
    }

    this.pagination = false;
    // this.maxBlocksInCache = 5;
    this.paginationPageSize = 100;
    this.cacheBlockSize = 100;
  }

  async init() {
    return super.init().then(async state => {

      // const processingMap = AppModule.processMaps['purchaseOrder'];
      this.masterPriceTableList = await this.apiService.getPromise<SalesMasterPriceTableModel[]>('/sales/master-price-tables', { includeIdText: true });
      if (this.masterPriceTableList.length > 0) {
        this.masterPriceTable = this.masterPriceTableList[0];
      }
      await this.cms.waitForLanguageLoaded();

      this.columnDefs = this.configSetting([
        {
          ...agMakeSelectionColDef(this.cms),
          headerName: 'ID',
          field: 'Id',
          width: 100,
          valueGetter: 'node.data.Id',
          // sortingOrder: ['desc', 'asc'],
          initialSort: 'desc',
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
          pinned: 'left',
          width: 150,
          filter: 'agTextColumnFilter',
          autoHeight: true,
        },
        {
          headerName: 'Sku',
          field: 'Sku',
          pinned: 'left',
          width: 120,
          filter: 'agTextColumnFilter',
          autoHeight: true,
        },
        {
          headerName: 'Sản phẩm',
          field: 'Name',
          width: 400,
          // pinned: 'left',
          filter: 'agTextColumnFilter',
          autoHeight: true,
        },
        {
          headerName: 'ĐVT',
          field: 'Unit',
          width: 130,
          // filter: 'agTextColumnFilter',
          cellRenderer: AgTextCellRenderer,
          autoHeight: true,
          // valueGetter: (params: { data: ProductModel }) => {
          //   const baseUnitId = this.cms.getObjectId(params.data?.WarehouseUnit);
          //   const baseUnitText = this.cms.getObjectText(params.data?.WarehouseUnit);
          //   return params.data?.Units?.map(unit => {
          //     let text = '';
          //     if (baseUnitId == unit?.id) {
          //       text = unit.text;
          //     } else {
          //       text = `${unit.text} = ${unit.ConversionRatio} ${baseUnitText}`;
          //     }
          //     unit.toolTip = `${text} (${unit.IsAutoAdjustInventory ? 'Trừ kho tự động' : 'Không tự động trừ kho'}, ${unit.IsManageByAccessNumber ? 'Quản lý theo số truy xuất' : 'Không quản lý theo số truy xuất'})`;
          //     if (unit.IsManageByAccessNumber) {
          //       unit.status = 'danger';
          //     }
          //     if (!unit.IsAutoAdjustInventory) {
          //       unit.status = 'warning';
          //     }
          //     unit.label = `${unit.text} (${unit.ConversionRatio})`;
          //     return unit;
          //   });
          // },
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.makeSelect2AjaxOption('/admin-product/units', { includeIdText: true, sort_Name: 'asc' }, {
                placeholder: 'Chọn ĐVT...', limit: 10, prepareReaultItem: (item) => {
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
          width: 350,
          cellRenderer: AgTextCellRenderer,
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.makeSelect2AjaxOption('/admin-product/categories', { includeIdText: true, sort_Name: 'asc' }, {
                placeholder: 'Chọn danh mục...', limit: 10, prepareReaultItem: (item) => {
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
          width: 250,
          cellRenderer: AgTextCellRenderer,
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.makeSelect2AjaxOption('/admin-product/groups', { includeIdText: true, sort_Name: 'asc' }, {
                placeholder: 'Chọn nhóm...', limit: 10, prepareReaultItem: (item) => {
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
          headerName: 'Cập nhật cuối',
          field: 'LastUpdate',
          width: 180,
          filter: 'agDateColumnFilter',
          pinned: 'right',
          filterParams: {
            inRangeFloatingFilterDateFormat: 'DD/MM/YY',
          },
          cellRenderer: AgDateCellRenderer,
        },
        {
          ...agMakeCurrencyColDef(this.cms),
          headerName: 'Giá EU',
          field: 'Price',
          pinned: 'right',
          width: 150,
        },
        // {
        //   headerName: 'Giá bán',
        //   field: 'SalePrice',
        //   width: 150,
        //   filter: 'agTextColumnFilter',
        //   pinned: 'right',
        //   type: 'rightAligned',
        //   cellClass: ['ag-cell-items-center', 'ag-cell-justify-end'],
        //   cellRenderer: AgCurrencyCellInput,
        //   cellStyle: { border: "none" },
        //   cellRendererParams: {
        //     changed: (value, params) => {
        //       // this.apiService.putPromise<any[]>('/wordpress/products/' + params.node.data.Id, {}, [{
        //       //   Id: params.node.data.Id,
        //       //   SalePrice: value,
        //       // }]).then(rs => {
        //       //   params.status = 'success';
        //       // });
        //     }
        //   }
        // },
        {
          ...agMakeCommandColDef(this, this.cms, false, false, false, [
            {
              name: 'historyUpdate',
              // label: 'Lịch sử cập nhật',
              status: 'info',
              outline: false,
              icon: 'external-link-outline',
              appendTo: 'tail',
              action: async (params) => {
                this.cms.openDialog(AgDynamicListComponent, {
                  context: {
                    title: 'Lịch sử cập nhật giá',
                    width: '90%',
                    height: '95vh',
                    apiPath: '/sales/master-price-table-entries',
                    idKey: ['Id'],
                    // getRowNodeId: (item) => {
                    //   return item.Product + '-' + item.Unit;
                    // },
                    // rowMultiSelectWithClick: true,
                    // suppressRowClickSelection: false,
                    prepareApiParams: (exParams, getRowParams) => {
                      exParams['eq_MasterPriceTable'] = this.cms.getObjectId(this.masterPriceTable);
                      exParams['eq_Product'] = params.node.data.Code;
                      exParams['eq_Unit'] = this.cms.getObjectId(params.node.data.Unit);
                      exParams['includeUnit'] = true;
                      exParams['includeProduct'] = true;
                      exParams['includeRequestBy'] = true;
                      exParams['includeApprovedBy'] = true;
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
                        valueGetter: 'node.data.Id',
                      },
                      {
                        headerName: 'Ngày cập nhật',
                        field: 'NoteDate',
                        pinned: 'left',
                        width: 180,
                        filterParams: {
                          inRangeFloatingFilterDateFormat: 'DD/MM/YY',
                        },
                        cellRenderer: AgDateCellRenderer,
                        filter: 'agDateColumnFilter',
                        initialSort: 'asc'
                      },
                      {
                        headerName: 'Sản phẩm',
                        field: 'Product',
                        pinned: 'left',
                        width: 400,
                        filter: 'agTextColumnFilter',
                        cellRenderer: AgTextCellRenderer,
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
                        headerName: 'ĐVT',
                        field: 'Unit',
                        width: 150,
                        pinned: 'left',
                        cellRenderer: AgTextCellRenderer,
                        // valueFormatter: 'node.data.Unit',
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
                            // data: this.prds.unitList$.value,
                            multiple: true,
                            logic: 'OR',
                          }
                        },
                      },
                      {
                        headerName: 'Phiếu cập nhật giá',
                        field: 'Note',
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
                      },
                      {
                        headerName: 'Yêu cầu bởi',
                        field: 'RequestBy',
                        pinned: 'left',
                        width: 250,
                        cellRenderer: AgTextCellRenderer,
                        filter: AgSelect2Filter,
                        filterParams: {
                          select2Option: {
                            ...this.cms.makeSelect2AjaxOption('/user/users', { includeIdText: true }, {
                              placeholder: 'Chọn...', limit: 10, prepareReaultItem: (item) => {
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
                        headerName: 'Phê duyệt bởi',
                        field: 'ApprovedBy',
                        pinned: 'left',
                        width: 250,
                        cellRenderer: AgTextCellRenderer,
                        filter: AgSelect2Filter,
                        filterParams: {
                          select2Option: {
                            ...this.cms.makeSelect2AjaxOption('/user/users', { includeIdText: true }, {
                              placeholder: 'Chọn...', limit: 10, prepareReaultItem: (item) => {
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
                              this.cms.previewVoucher(null, params.node.data.Note);
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
            }
          ]),
          headerName: 'Lệnh',
        },
      ] as ColDef[]);

      this.actionButtonList.unshift({
        type: 'button',
        name: 'createMasterPriceTableUpdateNote',
        status: 'danger',
        label: 'Tạo phiếu cập nhật giá',
        title: 'Tạo phiếu cập nhật giá',
        size: 'medium',
        icon: 'file-text-outline',
        disabled: () => {
          return this.selectedIds.length == 0;
        },
        click: () => {
          this.cms.openDialog(MasterPriceTableUpdateNoteFormComponent, {
            context: {
              data: [
                {
                  Title: 'Cập nhật giá ' + new Date().toUTCString(),
                  Details: this.selectedItems.map(m => ({
                    Image: m.Pictures,
                    Product: { id: m.Code, text: m.Name },
                    Unit: m.Unit as any,
                    Description: m.Name,
                    Price: m.Price,
                    // PurchasePrice: m.PurchasePrice
                  })) as any
                }
              ],
              onDialogSave: (newData) => {
                if (newData[0].State === 'APPROVED') {
                  this.apiService.putPromise<any>('/sales/master-price-tables/' + this.cms.getObjectId(this.masterPriceTable), { rebuildCache: true }, [{ Code: this.cms.getObjectId(this.masterPriceTable) }]).then(rs => {
                    this.cms.showToast('Đã cập nhật cache bảng giá !', 'Cập nhật cache bảng giá thành công', { status: 'success' });
                    this.refresh();
                  });
                }
              },
            }
          });
        }
      });

      this.actionButtonList.unshift({
        type: 'button',
        name: 'rebuildCache',
        status: 'primary',
        label: 'Cập nhật cache',
        title: 'Bảng giá sử dụng bộ nhớ cache để tăng tốc độ truy vấn, nếu có sai lệch về giá bạn hãy cập nhật lại cache !',
        size: 'medium',
        icon: 'sync-outline',
        disabled: () => !this.masterPriceTable,
        click: () => {
          this.cms.showDialog('Cập nhật cache bảng giá', 'Bạn có muốn cập nhật cache cho bảng giá ' + this.cms.getObjectText(this.masterPriceTable) + '?\n Bảng giá sử dụng bộ nhớ cache để tăng tốc độ truy vấn, nếu có sai lệch về giá bạn hãy cập nhật lại cache !', [
            {
              label: 'Trở về',
              status: 'basic',
              action: () => {
                return true;
              }
            },
            {
              label: 'Cập nhật',
              status: 'primary',
              action: () => {
                this.apiService.putPromise<any>('/sales/master-price-tables/' + this.cms.getObjectId(this.masterPriceTable), { rebuildCache: true }, [{ Code: this.cms.getObjectId(this.masterPriceTable) }]).then(rs => {
                  this.cms.showToast('Đã cập nhật cache bảng giá !', 'Cập nhật cache bảng giá thành công', { status: 'success' });
                  this.refresh();
                });
              }
            },
          ]);
        }
      });

      this.actionButtonList.unshift({
        type: 'select2',
        name: 'masterpriceTable',
        status: 'success',
        label: 'Select page',
        icon: 'plus',
        title: 'Site',
        size: 'medium',
        select2: {
          option: {
            placeholder: 'Chọn bảng giá...',
            allowClear: false,
            width: '100%',
            dropdownAutoWidth: true,
            minimumInputLength: 0,
            keyMap: {
              id: 'id',
              text: 'text',
            },
            data: this.masterPriceTableList,
          }
        },
        value: this.masterPriceTable,
        change: async (value: any, option: any) => {
          this.refresh();

        },
        disabled: () => {
          return this.loading;
        },
        click: () => {
          // this.gotoForm();
          return false;
        },
      });

      return state;
    });
  }

  ngOnInit() {
    super.ngOnInit();
  }

  // @Input() getRowHeight = (params: RowHeightParams<CommercePosOrderModel>) => {
  //   return 123;
  // }

  prepareApiParams(params: any, getRowParams: IGetRowsParams) {
    params['masterPriceTable'] = this.masterPriceTable ? this.cms.getObjectId(this.masterPriceTable) : '-1';
    params['includeCategories'] = true;
    params['includeGroups'] = true;
    params['includeUnit'] = true;
    params['includeFeaturePicture'] = true;
    params['sort_Id'] = 'desc';
    // params['group_Unit'] = true;
    params['includeContainers'] = true;
    params['includeNumberOfProducts'] = true;
    // params['sort_Id'] = 'desc';
    return params;
  }

  /** Implement required */
  openFormDialplog(ids?: string[], onDialogSave?: (newData: ProductModel[]) => void, onDialogClose?: () => void) {
    // this.cms.openDialog(MasterPriceTableFormComponent, {
    //   context: {
    //     inputMode: 'dialog',
    //     inputId: ids,
    //     onDialogSave: (newData: ProductModel[]) => {
    //       if (onDialogSave) onDialogSave(newData);
    //     },
    //     onDialogClose: () => {
    //       if (onDialogClose) onDialogClose();
    //     },
    //   },
    // });
    return false;
  }

  onGridReady(params) {
    super.onGridReady(params);
  }
}
