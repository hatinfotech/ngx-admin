import { FileModel } from './../../../../models/file.model';
import { CurrencyPipe } from '@angular/common';
import { filter, take, takeUntil } from 'rxjs/operators';
import { AdminProductService } from './../../admin-product.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogRef, NbThemeService } from '@nebular/theme';
import { ProductModel } from '../../../../models/product.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
// import { Module, AllCommunityModules, GridApi, ColumnApi, IDatasource, IGetRowsParams, ColDef, RowNode, CellDoubleClickedEvent, SuppressKeyboardEventParams, ValueFormatterParams } from '@ag-grid-community/all-modules';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { AgButtonCellRenderer, AgCheckboxCellRenderer, CustomHeader } from '../../../../lib/custom-element/ag-list/ag-list.lib';
import { BaseComponent } from '../../../../lib/base-component';
import * as XLSX from 'xlsx';
import { DialogFormComponent } from '../../../dialog/dialog-form/dialog-form.component';
import { ImportProductMapFormComponent } from '../import-product-map-form/import-product-map-form.component';
import { CellDoubleClickedEvent, ColDef, ColumnApi, GridApi, IDatasource, IGetRowsParams, IRowNode, Module, RowNode, SuppressKeyboardEventParams, ValueFormatterParams } from '@ag-grid-community/core';
// import { AgGridColumn } from '@ag-grid-community/angular';
var CryptoJS = require("crypto-js");

@Component({
  selector: 'ngx-import-products-dialog',
  templateUrl: './import-products-dialog.component.html',
  styleUrls: ['./import-products-dialog.component.scss'],
  providers: [CurrencyPipe],
})
export class ImportProductDialogComponent extends BaseComponent implements OnInit, AfterViewInit {

  componentName: string = 'ProductListComponent';
  @Input() inputMode: 'dialog' | 'page' | 'inline';
  @Input() inputProducts: ProductModel[];
  @Input() onDialogSave: (newData: ProductModel[]) => void;
  @Input() onDialogClose: () => void;

  constructor(
    public cms: CommonService,
    public router: Router,
    public apiService: ApiService,
    public themeService: NbThemeService,
    public formBuilder: FormBuilder,
    public adminProductService: AdminProductService,
    public currencyPipe: CurrencyPipe,
    public ref?: NbDialogRef<ImportProductDialogComponent>,
  ) {
    super(cms, router, apiService);

    /** AG-Grid */
    this.updateGridColumn();

    this.pagination = false;
    this.maxBlocksInCache = 5;
    this.paginationPageSize = this.cacheBlockSize = 1000;
    /** End AG-Grid */

    // this.array = this.formBuilder.control([]);

  }

  configFormGroup: FormGroup = null;
  config = { IsMapByProductName: false };
  themeName = this.themeService.currentTheme == 'default' ? '' : this.themeService.currentTheme;
  processing = false;
  array: ProductModel[];

  ngOnInit() {
    super.ngOnInit();
    this.configFormGroup = this.formBuilder.group({
      IsMapByProductName: [false],
    });
    this.configFormGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(config => this.config = config);
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  async init() {
    await this.adminProductService.unitList$.pipe(filter(f => !!f), take(1)).toPromise();
    return super.init().then(rs => {
      // this.actionButtonList.unshift({
      //   name: 'chooseFile',
      //   status: 'primary',
      //   label: this.cms.textTransform(this.cms.translate.instant('Choose file'), 'head-title'),
      //   icon: 'copy-outline',
      //   title: this.cms.textTransform(this.cms.translate.instant('Choose file'), 'head-title'),
      //   size: 'medium',
      //   disabled: () => false,
      //   hidden: () => false,
      //   click: () => {

      //     return false;
      //   },
      // });
      return rs;
    });
  }

  /** AG-Grid */
  public gridApi: GridApi;
  public gridColumnApi: ColumnApi;
  public modules: Module[] = [];
  public dataSource: IDatasource;
  public columnDefs: ColDef[];
  public rowSelection = 'single';
  // public rowModelType = 'infinite';
  public rowModelType = 'clientSide';
  public paginationPageSize: number;
  public cacheOverflowSize = 2;
  public maxConcurrentDatasourceRequests = 2;
  public infiniteInitialRowCount = 1;
  public maxBlocksInCache: number;
  public cacheBlockSize: number;
  public rowData: ProductModel[];
  public gridParams;
  public multiSortKey = 'ctrl';
  public rowDragManaged = false;
  public getRowHeight;
  public rowHeight: number = 50;
  public hadRowsSelected = false;
  public pagination: boolean;
  public emailAddressListDetails: ProductModel[] = [];
  // public suppressKeyboardEvent = (event) => {
  //   console.log(event);
  // };
  public defaultColDef = {
    sortable: true,
    resizable: true,
    // suppressSizeToFit: true,

    suppressKeyboardEvent: (params: SuppressKeyboardEventParams) => {
      if (!params.editing) {

        let isDeleteKey = params.event.key === 'Delete';

        // Delete selected rows with back space
        if (isDeleteKey) {
          // const selectedRows: RowNode[] = params.api.getSelectedRows();
          const selectedNodes: IRowNode[] = params.api.getSelectedNodes();
          const currentIndex = selectedNodes[0].rowIndex;
          let prevNode: IRowNode, prevIndex: number, nextNode: IRowNode, nextIndex: number, wasFoundCurrnet = false, wasFoundPrevNode = false;

          // Find Next and Prev Node
          params.api.forEachNode((node, index) => {
            if (wasFoundCurrnet === true) {
              nextNode = node;
              nextIndex = index;
              wasFoundCurrnet = null;
              // wasFoundPrevNode = true;
            }
            if (index === currentIndex) {
              wasFoundCurrnet = true;
            }
            if (wasFoundCurrnet === false) {
              prevNode = node;
              prevIndex = index;
            }
            // nextId = index;
          });

          // Remove
          params.api.applyTransaction({ remove: [selectedNodes[0].data] });

          // Select alternate node
          if (nextNode) {
            nextNode.setSelected(true, true);
            params.api.ensureIndexVisible(nextIndex);
          } else if (prevNode) {
            prevNode.setSelected(true, true);
            params.api.ensureIndexVisible(prevIndex);
          }
          return true;
        }

        // Barcode scan detative
        // this.barcodeScanDetective(params.event.key, barcode => {
        //   this.barcodeProcess(barcode);
        // });

        return false;
      }
    }

  };
  public getRowNodeId = (item: ProductModel) => {
    return this.cms.getObjectId(item.Code) + '-' + this.cms.getObjectId(item.Unit);
  }
  public getRowStyle = (params: { node: RowNode }) => {
    // if (params.node.rowIndex == this.activeDetailIndex) {
    //   return { background: '#ffc107' };
    // }
  };

  public cellDoubleClicked = (params: CellDoubleClickedEvent) => {
    console.log(params);

    if (params.colDef.field == 'duplicate') {
      this.cms.showDialog('Xử lý trùng', 'Bạn có muốn xác nhận lại trạng thái trùng không ?', [
        {
          label: 'Trùng',
          action: () => {
            params.data.duplicate = true;
            params.api.applyTransaction({ update: [params.data] });
          }
        },
        {
          label: 'Không trùng',
          action: () => {
            params.data.duplicate = false;
            params.api.applyTransaction({ update: [params.data] });

          }
        }
      ]);
    }
  };


  public components = {
    loadingCellRenderer: (params) => {
      if (params.value) {
        return params.value;
      } else {
        return '<img src="assets/images/loading.gif">';
      }
    },
    textRender: (params) => {

      if (params.colDef.field == 'duplicate') {
        return params.value && 'Trùng ?' || '';
      }
      if (Array.isArray(params.value)) {
        return params.value.map(m => this.cms.getObjectText(m)).join(', ');
      }
      return this.cms.getObjectText(params.value);
      // }
    },
    idRender: (params) => {
      if (Array.isArray(params.value)) {
        return params.value.map(m => this.cms.getObjectId(m)).join(', ');
      } else {
        return this.cms.getObjectId(params.value);
      }
    },
    numberRender: (params) => {
      return params.value;
    },
    imageRender: (params) => {
      let image = params.value;
      if (Array.isArray(params.value)) {
        image = params.value[0];
      }
      if (typeof image == 'string') {
        return '<img style="height: 45px" src="' + image + '">';
      }
      return image && image?.Thumbnail ? ('<img style="height: 45px" src="' + image?.Thumbnail + '">') : '';
    },

    btnCellRenderer: AgButtonCellRenderer,
    ckbCellRenderer: AgCheckboxCellRenderer,
    agColumnHeader: CustomHeader,
  };
  onGridReady(params) {
    this.gridParams = params;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.loadList();

  }
  onColumnResized() {
    this.gridApi.resetRowHeights();
  }
  onRowSelected() {
    this.updateActionState();
  }
  updateActionState() {
    this.hadRowsSelected = this.getSelectedRows().length > 0;
  }
  getSelectedRows() {
    return this.gridApi.getSelectedRows();
  }

  autoSizeAll(skipHeader: boolean) {
    const allColumnIds: string[] = [];
    this.gridColumnApi.getAllColumns()!.forEach((column) => {
      allColumnIds.push(column.getId());
    });

    this.gridColumnApi!.autoSizeColumns(allColumnIds, skipHeader);
  }

  loadList(callback?: (list: ProductModel[]) => void) {

    if (this.gridApi) {


      let details: ProductModel[] = (this.array || []).map((detail: ProductModel) => {

        return detail;
      });
      this.gridApi.setRowData(details);

      this.autoSizeAll(false)

    }

  }

  initDataSource() {
    this.dataSource = {
      rowCount: null,
      getRows: (getRowParams: IGetRowsParams) => {
        console.info('asking for ' + getRowParams.startRow + ' to ' + getRowParams.endRow);

        let details: ProductModel[] = (this.array as []).slice(getRowParams.startRow, getRowParams.endRow);

        let lastRow = -1;
        if (details.length < this.paginationPageSize) {
          lastRow = getRowParams.startRow + details.length;
        }
        getRowParams.successCallback(details, lastRow);
        this.gridApi.resetRowHeights();

      },
    };
  }
  /** End AG-Grid */

  updateGridColumn() {
    this.columnDefs = [
      {
        headerName: '#',
        width: 52,
        valueGetter: 'node.data.No',
        cellRenderer: 'loadingCellRenderer',
        sortable: false,
        pinned: 'left',
      },
      {
        headerName: 'Hình',
        field: 'FeaturePicture',
        width: 100,
        filter: 'agTextColumnFilter',
        // pinned: 'left',
        autoHeight: true,
        cellRenderer: 'imageRender',
      },
      {
        headerName: 'DS Hình',
        field: 'Pictures',
        width: 100,
        filter: 'agTextColumnFilter',
        // pinned: 'left',
        autoHeight: true,
        cellRenderer: 'imageRender',
      },
      {
        headerName: 'Import',
        field: 'IsImport',
        width: 90,
        filter: 'agTextColumnFilter',
        pinned: 'left',
        cellRenderer: 'ckbCellRenderer',
        cellRendererParams: {
          changed: (checked: boolean, params: { node: RowNode, data: ProductModel, api: GridApi } & { [key: string]: any }) => {
            // alert(`${field} was clicked`);
            console.log(params);

            if (checked) {
            } else {
            }
          },
        },
        headerComponentParams: { enabledCheckbox: true }
      },
      {
        headerName: 'Nghi vấn trùng',
        field: 'Status',
        width: 110,
        filter: 'agTextColumnFilter',
        pinned: 'left',
        cellRenderer: 'textRender',
      },
      {
        headerName: 'Sku',
        field: 'Sku',
        width: 100,
        filter: 'agTextColumnFilter',
        cellRenderer: 'textRender',
        pinned: 'left',
      },
      {
        headerName: 'Tên sản phẩm',
        field: 'Name',
        width: 400,
        filter: 'agTextColumnFilter',
        // pinned: 'left',
      },
      {
        headerName: 'Tên cũ',
        field: 'OldName',
        width: 400,
        filter: 'agTextColumnFilter',
        // pinned: 'left',
      },
      {
        headerName: 'Thương hiệu',
        field: 'Brand',
        width: 150,
        filter: 'agTextColumnFilter',
        cellRenderer: 'textRender',
        // pinned: 'right',
      },
      {
        headerName: 'ĐVT cơ bản',
        field: 'WarehouseUnit',
        width: 150,
        filter: 'agTextColumnFilter',
        cellRenderer: 'textRender',
        // pinned: 'right',
      },
      {
        headerName: 'Danh mục',
        field: 'Categories',
        width: 200,
        filter: 'agTextColumnFilter',
        // pinned: 'right',
        cellRenderer: 'textRender',
      },
      {
        headerName: 'Nhóm',
        field: 'Groups',
        width: 200,
        filter: 'agTextColumnFilter',
        // pinned: 'right',
        cellRenderer: 'textRender',
      },
      {
        headerName: 'Từ khóa',
        field: 'Keywords',
        width: 100,
        filter: 'agTextColumnFilter',
        // pinned: 'right',
        cellRenderer: 'textRender',
      },
    ];

    if (this.mapping && this.mapping['UnitConversions'] && this.mapping['UnitConversions'].length > 0) {
      let extendColumns: ColDef[] = [];
      if (this.mapping['UnitConversions'] && this.mapping['UnitConversions'].length > 0) {
        for (const i in this.mapping['UnitConversions']) {
          const no = parseInt(i) + 1;
          extendColumns = extendColumns.concat([
            {
              headerName: 'ĐVT ' + no,
              field: 'Unit' + no,
              width: 150,
              filter: 'agTextColumnFilter',
              cellRenderer: 'textRender',
              // pinned: 'right',
            },
            {
              headerName: 'Tỷ lệ chuyển đổi ' + no,
              field: 'ConversionRatio' + no,
              width: 150,
              filter: 'agTextColumnFilter',
              cellRenderer: 'textRender',
              // pinned: 'right',
            },
            {
              headerName: 'Mặc định bán ' + no,
              field: 'IsDefaultSales' + no,
              width: 100,
              filter: 'agTextColumnFilter',
              // pinned: 'right',
              cellRenderer: 'ckbCellRenderer',
              cellRendererParams: {
                changed: (checked: boolean, params: { node: RowNode, data: ProductModel, api: GridApi } & { [key: string]: any }) => {
                },
              },
            },
            {
              headerName: 'Mặc định mua ' + no,
              field: 'IsDefaultPurchase' + no,
              width: 100,
              filter: 'agTextColumnFilter',
              // pinned: 'right',
              cellRenderer: 'ckbCellRenderer',
              cellRendererParams: {
                changed: (checked: boolean, params: { node: RowNode, data: ProductModel, api: GridApi } & { [key: string]: any }) => {
                },
              },
            },
            {
              headerName: 'Số truy xuất ' + no,
              field: 'IsManageByAccessNumber' + no,
              width: 100,
              filter: 'agTextColumnFilter',
              // pinned: 'right',
              cellRenderer: 'ckbCellRenderer',
              cellRendererParams: {
                changed: (checked: boolean, params: { node: RowNode, data: ProductModel, api: GridApi } & { [key: string]: any }) => {
                },
              },
            },
            {
              headerName: 'Trừ kho tự động ' + no,
              field: 'IsAutoAdjustInventory' + no,
              width: 100,
              filter: 'agTextColumnFilter',
              // pinned: 'right',
              cellRenderer: 'ckbCellRenderer',
              cellRendererParams: {
                changed: (checked: boolean, params: { node: RowNode, data: ProductModel, api: GridApi } & { [key: string]: any }) => {
                },
              },
            },
            {
              headerName: 'Có hạn sử dụng ' + no,
              field: 'IsExpirationGoods' + no,
              width: 100,
              filter: 'agTextColumnFilter',
              // pinned: 'right',
              cellRenderer: 'ckbCellRenderer',
              cellRendererParams: {
                changed: (checked: boolean, params: { node: RowNode, data: ProductModel, api: GridApi } & { [key: string]: any }) => {
                },
              },
            },
          ]);
        }
      }

      if (this.mapping && this.mapping['Properties'] && this.mapping['Properties'].length > 0) {
        for (const i in this.mapping['Properties']) {
          const no = parseInt(i) + 1;
          extendColumns = extendColumns.concat([
            {
              headerName: 'Thuộc tính ' + no,
              field: 'Property' + no,
              width: 150,
              filter: 'agTextColumnFilter',
              cellRenderer: 'textRender',
              // pinned: 'right',
            },
            {
              headerName: 'Giá trị thuộc tính ' + no,
              field: 'PropertyValues' + no,
              width: 150,
              filter: 'agTextColumnFilter',
              cellRenderer: 'textRender',
              // pinned: 'right',
            },
          ]);
        }
      }

      this.columnDefs = [
        ...this.columnDefs,
        ...extendColumns,
        ...[
          {
            headerName: 'Ngừng kinh doanh',
            field: 'IsStopBusiness',
            width: 110,
            filter: 'agTextColumnFilter',
            cellRenderer: 'ckbCellRenderer',
          },
          {
            headerName: 'Update giá',
            field: 'IsUpdatePrice',
            width: 80,
            filter: 'agTextColumnFilter',
            pinned: 'right',
            cellRenderer: 'ckbCellRenderer',
            cellRendererParams: {
              // changed: (checked: boolean, params: { node: RowNode, data: ProductModel, api: GridApi } & { [key: string]: any }) => {
              //   // alert(`${field} was clicked`);
              //   console.log(params);

              //   // Remove row
              //   // params.api.applyTransaction({ remove: [params.node.data] });
              //   if (checked) {
              //     params.node.setDataValue('Sku', null);
              //     params.node.setDataValue('Code', null);
              //   } else {
              //     params.node.setDataValue('Sku', params.data.OldSku);
              //     params.node.setDataValue('Code', params.data.OldCode);
              //   }
              // },
            },
            headerComponentParams: { enabledCheckbox: true }
          },
          {
            headerName: 'Giá EU',
            field: 'SalesPrice',
            width: 110,
            // cellStyle: { justifyContent: 'flex-end' },
            filter: 'agTextColumnFilter',
            // cellRenderer: 'textRender',
            pinned: 'right',
            valueFormatter: (cell: ValueFormatterParams) => {
              return cell && cell.value && /\d+/.test(cell.value) && this.currencyPipe.transform(cell.value, 'VND') || cell?.value;
            }
          },
          {
            headerName: 'ID',
            field: 'Code',
            width: 110,
            filter: 'agTextColumnFilter',
            // pinned: 'left',
            cellRenderer: 'idRender',
          },
          {
            headerName: 'Result',
            field: 'Result',
            width: 110,
            filter: 'agTextColumnFilter',
            pinned: 'right',
            cellRenderer: 'textRender',
          },
          {
            headerName: 'Message',
            field: 'Message',
            width: 150,
            filter: 'agTextColumnFilter',
            // pinned: 'right',
            cellRenderer: 'textRender',
          },
        ],
      ] as any[];
    }
  }

  generateUnitConversionControls(index: number, columnList: any[]) {
    return [
      {
        name: 'UnitConversion' + index,
        label: 'Đơn vị tính chuyển đổi (' + index + ')',
        placeholder: '',
        type: 'select2',
        initValue: columnList.find(f => this.cms.getObjectId(f) == 'UnitConversion' + index),
        // focus: true,
        class: 'col-md-2',
        option: {
          data: columnList,
          placeholder: 'Chọn đơn vị tính chuyển đổi (' + index + ')...',
          allowClear: true,
          width: '100%',
          dropdownAutoWidth: true,
          minimumInputLength: 0,
          withThumbnail: false,
          keyMap: {
            id: 'id',
            text: 'text',
          },
        }
      },
      {
        name: 'ConversionRatio' + index,
        label: 'Tỷ lệ chuyển đổi (' + index + ')',
        placeholder: '',
        type: 'select2',
        initValue: columnList.find(f => this.cms.getObjectId(f) == 'ConversionRatio' + index),
        // focus: true,
        class: 'col-md-2',
        option: {
          data: columnList,
          placeholder: 'Chọn tỷ lệ chuyển đổi (' + index + ')...',
          allowClear: true,
          width: '100%',
          dropdownAutoWidth: true,
          minimumInputLength: 0,
          withThumbnail: false,
          keyMap: {
            id: 'id',
            text: 'text',
          },
        }
      },
      {
        name: 'IsDefaultSales' + index,
        label: 'Mặc định bán (' + index + ')',
        placeholder: '',
        type: 'select2',
        initValue: columnList.find(f => this.cms.getObjectId(f) == 'IsDefaultSales' + index),
        // focus: true,
        class: 'col-md-2',
        option: {
          data: columnList,
          placeholder: 'Chọn cột mặc định bán (' + index + ')...',
          allowClear: true,
          width: '100%',
          dropdownAutoWidth: true,
          minimumInputLength: 0,
          withThumbnail: false,
          keyMap: {
            id: 'id',
            text: 'text',
          },
        }
      },
      {
        name: 'IsDefaultPurchase' + index,
        label: 'Mặc định mua (' + index + ')',
        placeholder: '',
        type: 'select2',
        initValue: columnList.find(f => this.cms.getObjectId(f) == 'IsDefaultPurchase' + index),
        // focus: true,
        class: 'col-md-2',
        option: {
          data: columnList,
          placeholder: 'Chọn cột mặc định mua (' + index + ')...',
          allowClear: true,
          width: '100%',
          dropdownAutoWidth: true,
          minimumInputLength: 0,
          withThumbnail: false,
          keyMap: {
            id: 'id',
            text: 'text',
          },
        }
      },
      {
        name: 'IsManageByAccessNumber' + index,
        label: 'Quản lý theo số truy xuất (' + index + ')',
        placeholder: '',
        type: 'select2',
        initValue: columnList.find(f => this.cms.getObjectId(f) == 'IsManageByAccessNumber' + index),
        // focus: true,
        class: 'col-md-2',
        option: {
          data: columnList,
          placeholder: 'Chọn cột quản lý theo số truy xuất (' + index + ')...',
          allowClear: true,
          width: '100%',
          dropdownAutoWidth: true,
          minimumInputLength: 0,
          withThumbnail: false,
          keyMap: {
            id: 'id',
            text: 'text',
          },
        }
      },
      {
        name: 'IsAutoAdjustInventory' + index,
        label: 'Tự trừ kho tự động (' + index + ')',
        placeholder: '',
        type: 'select2',
        initValue: columnList.find(f => this.cms.getObjectId(f) == 'IsAutoAdjustInventory' + index),
        // focus: true,
        class: 'col-md-1',
        option: {
          data: columnList,
          placeholder: 'Chọn cột trừ kho tự động (' + index + ')...',
          allowClear: true,
          width: '100%',
          dropdownAutoWidth: true,
          minimumInputLength: 0,
          withThumbnail: false,
          keyMap: {
            id: 'id',
            text: 'text',
          },
        }
      },
      {
        name: 'IsExpirationGoods' + index,
        label: 'Có hạn sử dụng (' + index + ')',
        placeholder: '',
        type: 'select2',
        initValue: columnList.find(f => this.cms.getObjectId(f) == 'IsExpirationGoods' + index),
        // focus: true,
        class: 'col-md-1',
        option: {
          data: columnList,
          placeholder: 'Chọn cột có hạn sử dụng (' + index + ')...',
          allowClear: true,
          width: '100%',
          dropdownAutoWidth: true,
          minimumInputLength: 0,
          withThumbnail: false,
          keyMap: {
            id: 'id',
            text: 'text',
          },
        }
      },
    ];
  }

  compareProduct(oldProduct: ProductModel, newProduct: ProductModel) {
    if (this.config.IsMapByProductName) {
      return newProduct.Sku &&
        (oldProduct.Sku?.toLowerCase() == newProduct.Sku?.toLowerCase())
        || (oldProduct.Name && newProduct.Name
          && (this.cms.smartFilter(oldProduct.Name, newProduct.Name) || this.cms.smartFilter(newProduct.Name, oldProduct.Name)));
    } else {
      return (oldProduct.Sku && newProduct.Sku) ? (oldProduct.Sku.trim().toLowerCase() == newProduct.Sku.trim().toLowerCase()) : (!oldProduct.Name && newProduct.Name && this.cms.convertUnicodeToNormal(oldProduct.Name).toLowerCase() == this.cms.convertUnicodeToNormal(newProduct.Name).toLowerCase());
    }
  }

  workBook: XLSX.WorkBook = null;
  jsonData = null;
  sheets: string[] = null;
  sheet: any[] = null;
  chooseSheet: string = null;
  fileName: string;
  mapping: { [key: string]: any };
  onFileChange(ev: any) {
    const reader = new FileReader();
    const file = ev.target.files[0];
    if (!file) return;
    this.fileName = file.name;
    reader.onload = async (event) => {
      try {
        this.processing = true;
        const data = reader.result;
        this.workBook = XLSX.read(data, { type: 'binary' });
        this.jsonData = this.workBook.SheetNames.reduce((initial, name) => {
          const sheet = this.workBook.Sheets[name];
          initial[name] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          return initial;
        }, {});
        this.processing = false;

        this.sheets = Object.keys(this.jsonData);
        if (this.sheets.length > 1) {
          this.sheet = await new Promise((resove, reject) => {
            this.cms.openDialog(DialogFormComponent, {
              context: {
                cardStyle: { width: '500px' },
                title: 'File excel có nhiều hơn 1 sheet, mời bạn chọn sheet cần import',
                onInit: async (form, dialog) => {
                  // const sheet = form.get('Sheet');
                  // const description = form.get('Description');
                  // sheet.setValue(null);
                  // description.setValue(parseFloat(activeDetail.get('Description').value));
                  return true;
                },
                onClose: async (form, dialog) => {
                  // ev.target.
                  return true;
                },
                controls: [
                  {
                    name: 'Sheet',
                    label: 'Sheet',
                    placeholder: 'Chọn sheet...',
                    type: 'select2',
                    initValue: this.sheets[0],
                    // focus: true,
                    option: {
                      data: this.sheets.map(m => ({ id: m, text: m })),
                      placeholder: 'Chọn sheet...',
                      allowClear: true,
                      width: '100%',
                      dropdownAutoWidth: true,
                      minimumInputLength: 0,
                      withThumbnail: false,
                      keyMap: {
                        id: 'id',
                        text: 'text',
                      },
                    }
                  },
                ],
                actions: [
                  {
                    label: 'Esc - Trở về',
                    icon: 'back',
                    status: 'basic',
                    keyShortcut: 'Escape',
                    action: async () => { return true; },
                  },
                  {
                    label: 'Chọn',
                    icon: 'generate',
                    status: 'success',
                    // keyShortcut: 'Enter',
                    action: async (form: FormGroup, formDialogConpoent: DialogFormComponent) => {

                      console.log(form.value);
                      this.chooseSheet = this.cms.getObjectId(form.get('Sheet').value);
                      resove(this.jsonData[this.chooseSheet]);

                      // formDialogConpoent.dismiss();

                      return true;
                    },
                  },
                ],
              },
              closeOnEsc: false,
              closeOnBackdropClick: false,
            });

          });
        } else {
          this.sheet = this.jsonData[this.sheets[0]];
          this.chooseSheet = this.sheets[0];
        }

        // const productList: any[] = sheet;

        // Confirm mapping
        const tmpSheet: string[][] = XLSX.utils.sheet_to_json(this.workBook.Sheets[this.chooseSheet], { header: 1 });
        const columnList = tmpSheet[0].map((m: string, index) => {
          const id = m.split('/')[0];
          const colindex = index;
          const text = m;
          return { id, text, colindex };
        });

        this.cms.openDialog(ImportProductMapFormComponent, {
          context: {
            columnList: columnList,
            onDialogSave: async dataMappiing => {
              try {

                this.mapping = dataMappiing[0];
                for (const i in this.mapping) {
                  // this.mapping[i] = this.cms.getObjectText(this.mapping[i]);
                  if (i !== 'UnitConversions' && i !== 'Properties') {
                    this.mapping[i] = this.mapping[i]?.colindex;
                  }
                }
                if (Array.isArray(this.mapping['UnitConversions'])) {
                  for (const unitConverion of this.mapping['UnitConversions']) {
                    for (const r in unitConverion) {
                      // unitConverion[r] = this.cms.getObjectText(unitConverion[r]);
                      unitConverion[r] = unitConverion[r]?.colindex;
                    }
                  }
                }
                if (Array.isArray(this.mapping['Properties'])) {
                  for (const property of this.mapping['Properties']) {
                    for (const r in property) {
                      // property[r] = this.cms.getObjectText(property[r]);
                      property[r] = property[r]?.colindex;
                    }
                  }
                }

                console.log(dataMappiing[0]);

                this.processing = true;

                // Confirm unit mapping
                const unitList = await this.apiService.getPromise<any[]>('/admin-product/units', { includeIdText: true, limit: 'nolimit' });
                const unitMapping = {};
                for (const unit of unitList) {
                  unitMapping[unit.Code] = unit;
                }
                const propertyMapping = {};
                for (const property of this.adminProductService.propertyList$?.value) {
                  propertyMapping[property.Code] = property;
                }
                const currentProductList = await this.apiService.getPromise<ProductModel[]>('/admin-product/products', { limit: 'nolimit' });
                this.array = this.sheet.filter((f, index) => index > 0).map((row: any, index: number) => {
                  const mappedRow: any = {
                    No: index + 1,
                    IsUpdatePrice: false,
                  };

                  for (const column in this.mapping) {
                    // if (typeof this.mapping[column] == 'string') {
                    mappedRow[column] = row[this.mapping[column]] || null;
                    if (typeof mappedRow[column] == 'string') {
                      mappedRow[column] = mappedRow[column].trim();
                    }
                    // }
                  }
                  mappedRow['Type'] = mappedRow['Type'] || 'PRODUCT';
                  if (mappedRow['Brand']) {
                    mappedRow['Brand'] = this.adminProductService.brandList$.value.find(f => this.cms.getObjectId(f) == mappedRow['Brand']);
                  }
                  if (mappedRow['Categories']) {
                    mappedRow['Categories'] = new String(mappedRow['Categories'] || '').split(',').map(m => {
                      return this.adminProductService.categoryList$.value.find(f => this.cms.getObjectId(f) == m.trim());
                    }).filter(f => !!f);
                  }
                  if (mappedRow['Groups']) {
                    mappedRow['Groups'] = new String(mappedRow['Groups'] || '').split(',').map(m => {
                      return this.adminProductService.groupList$.value.find(f => this.cms.getObjectId(f) == m.trim());
                    }).filter(f => !!f);
                  }
                  if (mappedRow['Keywords']) {
                    mappedRow['Keywords'] = new String(mappedRow['Keywords'] || '').split(',').map(m => m.trim());
                  }

                  mappedRow['WarehouseUnit'] = mappedRow.WarehouseUnit && unitMapping[mappedRow.WarehouseUnit]
                  mappedRow['WarehouseUnitName'] = this.cms.getObjectText(mappedRow['WarehouseUnit']);
                  if (this.mapping['UnitConversions']) {
                    for (let index = 0; index < this.mapping['UnitConversions'].length; index++) {
                      for (const r in this.mapping['UnitConversions'][index]) {
                        mappedRow[r + (index + 1)] = row[this.mapping['UnitConversions'][index][r]];
                      }
                      mappedRow['Unit' + (index + 1)] = mappedRow['Unit' + (index + 1)] && unitMapping[mappedRow['Unit' + (index + 1)]];
                      mappedRow['UnitName' + (index + 1)] = this.cms.getObjectText(mappedRow['Unit' + (index + 1)]);
                    }
                  }
                  if (this.mapping['Properties']) {
                    for (let index = 0; index < this.mapping['Properties'].length; index++) {
                      for (const r in this.mapping['Properties'][index]) {
                        mappedRow[r + (index + 1)] = row[this.mapping['Properties'][index][r]] || null;
                      }
                      if (mappedRow['Property' + (index + 1)]) mappedRow['Property' + (index + 1)] = mappedRow['Property' + (index + 1)] && propertyMapping[mappedRow['Property' + (index + 1)]];
                      if (mappedRow['PropertyValues' + (index + 1)]) mappedRow['PropertyValues' + (index + 1)] = (mappedRow['PropertyValues' + new String(index + 1)]).split(',').map(m => new String(m).trim());
                    }
                  }


                  let duplicate = false;
                  mappedRow.IsNew = false;
                  mappedRow.IsImport = true;
                  mappedRow.Pictures = new String(mappedRow.Pictures || '').replace('\r\n', '\n').split('\n').filter(f => !!f);
                  mappedRow.SameProducts = []
                  if ((mappedRow.Name || '').trim().length == 0 || !mappedRow.WarehouseUnit) {
                    mappedRow.IsImport = false;
                  } else {
                    for (const oldProduct of currentProductList) {
                      // if (mappedRow.Sku) {
                      // if (mappedRow.Sku && (oldProduct.Sku?.toLowerCase() == mappedRow.Sku?.toLowerCase()) || (oldProduct.Name && mappedRow.Name && this.cms.convertUnicodeToNormal(oldProduct.Name).toLowerCase() == this.cms.convertUnicodeToNormal(mappedRow.Name).toLowerCase())) {
                      if (this.compareProduct(oldProduct, mappedRow)) {
                        mappedRow.Code = oldProduct.Code;
                        mappedRow.Sku = oldProduct.Sku;
                        mappedRow.duplicate = true;
                        mappedRow.OldName = ((oldProduct.OldName && (oldProduct.OldName + '\n') || '') + oldProduct.Name);
                        if (oldProduct.FeaturePicture) {
                          if (!mappedRow.FeaturePicture) {
                            mappedRow.FeaturePicture = oldProduct.FeaturePicture;
                          } else {
                            const tag = CryptoJS.MD5(mappedRow.FeaturePicture as any).toString();
                            if (oldProduct.FeaturePicture.Tag == tag) {
                              mappedRow.FeaturePicture = oldProduct.FeaturePicture;
                            }
                          }
                        }

                        if (oldProduct.Pictures) {
                          if ((!mappedRow.Pictures || mappedRow.Pictures.length == 0)) {
                            mappedRow.Pictures = oldProduct.Pictures;
                          } else {
                            for (const p in mappedRow.Pictures) {
                              const tag = CryptoJS.MD5(mappedRow.Pictures[p] as any).toString();
                              const samePicture = (Array.isArray(oldProduct.Pictures) && oldProduct.Pictures || []).find(f => f.Tag == tag);
                              if (samePicture) {
                                mappedRow.Pictures[p] = samePicture;
                              }
                            }
                          }
                        }
                        duplicate = true
                        mappedRow.IsImport = false;
                        mappedRow.SameProducts.push(oldProduct);

                        // newProduct.IsImport = true;
                        // newProduct.IsUpdate = true;
                        // newProduct.IsNew = false;
                        // break;
                      }
                      // }
                      // else {
                      //   // if (oldProduct.Name && newProduct.Name && (this.cms.smartFilter(oldProduct.Name, newProduct.Name) || this.cms.smartFilter(newProduct.Name, oldProduct.Name))) {
                      //   if (oldProduct.Name && mappedRow.Name && this.cms.convertUnicodeToNormal(oldProduct.Name).toLowerCase() == this.cms.convertUnicodeToNormal(mappedRow.Name).toLowerCase()) {
                      //     mappedRow.duplicate = true;
                      //     mappedRow.IsNew = false;
                      //     mappedRow.OldName = oldProduct.Name;
                      //     mappedRow.Sku = oldProduct.Sku;
                      //     mappedRow.Code = oldProduct.Code;
                      //     mappedRow.OldSku = oldProduct.Sku;
                      //     mappedRow.OldCode = oldProduct.Code;
                      //     if (oldProduct.FeaturePicture && !mappedRow.FeaturePicture) {
                      //       mappedRow.FeaturePicture = oldProduct.FeaturePicture;
                      //     }
                      //     if (oldProduct.Pictures && (!mappedRow.Pictures || mappedRow.Pictures.length == 0)) {
                      //       mappedRow.Pictures = oldProduct.Pictures;
                      //     }
                      //     duplicate = true;
                      //     break;
                      //   }
                      // }
                    }
                  }
                  if (!duplicate) {
                    mappedRow.duplicate = false;
                    mappedRow.Status = 'Mới';
                    // if (this.cms.getObjectId(mappedRow.WarehouseUnit)) {
                    //   mappedRow.IsImport = true;
                    // } else {
                    //   mappedRow.IsImport = false;
                    // }
                  } else {
                    mappedRow.Status = 'Trùng ?';
                    if (!mappedRow.FeaturePicture && mappedRow.Pictures.length > 0) {
                      mappedRow.FeaturePicture = mappedRow.Pictures[0];
                    }
                  }

                  return mappedRow;

                });

                console.log(this.array);
                this.updateGridColumn();
                setTimeout(() => {
                  this.loadList();
                }, 300);

                this.processing = false;
              } catch (err) {
                console.error(err);
                this.processing = false;
              }
            }
          },
        });
      } catch (err) {
        this.processing = false;
      }
    };
    reader.readAsBinaryString(file);
  }

  progress = 0;
  progressStatus = 'primary';
  progressLabel = '';
  uploadedImages: { [key: string]: FileModel } = {};
  async importProducts() {
    this.processing = true;
    try {
      const newProductList: ProductModel[] = [];
      const updatePriceProductList: ProductModel[] = [];
      const allProductList: ProductModel[] = [];
      this.gridApi.forEachNode(async (rowNode, index) => {
        // console.log(rowNode, index);
        const newProduct: ProductModel = rowNode.data;
        newProduct.index = index;
        allProductList.push(newProduct);
        if (newProduct.WarehouseUnit && this.cms.getObjectId(newProduct.WarehouseUnit)) {
          newProduct.UnitConversions = [];
          newProduct.Properties = [];

          if (this.mapping['UnitConversions']) {
            for (let r = 0; r < this.mapping['UnitConversions'].length; r++) {
              if (this.cms.getObjectId(newProduct['Unit' + (r + 1)])) {
                newProduct.UnitConversions.push({
                  Unit: newProduct['Unit' + (r + 1)],
                  ConversionRatio: newProduct['ConversionRatio' + (r + 1)],
                  IsManageByAccessNumber: newProduct['IsManageByAccessNumber' + (r + 1)] && true || false,
                  IsDefaultSales: newProduct['IsDefaultSales' + (r + 1)] && true || false,
                  IsDefaultPurchase: newProduct['IsDefaultPurchase' + (r + 1)] && true || false,
                  IsAutoAdjustInventory: newProduct['IsAutoAdjustInventory' + (r + 1)] && true || false,
                  IsExpirationGoods: newProduct['IsExpirationGoods' + (r + 1)] && true || false,
                });
              }
            }
          }

          if (this.mapping['Properties']) {
            for (let r = 0; r < this.mapping['Properties'].length; r++) {
              if (this.cms.getObjectId(newProduct['Property' + (r + 1)]) && newProduct['PropertyValues' + (r + 1)]) {
                newProduct.Properties.push({
                  Property: newProduct['Property' + (r + 1)],
                  PropertyValues: newProduct['PropertyValues' + (r + 1)],
                });
              }
            }
          }
          if (newProduct.IsImport) {
            newProductList.push(newProduct);
          }
        }

        if (newProduct.IsUpdatePrice) {
          updatePriceProductList.push(newProduct);
        }
      });

      const total = allProductList.length;
      let loaded = 0;
      this.progressStatus = 'success';
      for (const newProduct of allProductList) {
        loaded++;
        this.progress = loaded / total * 100;
        this.progressLabel = newProduct.Name + ' (' + this.progress.toFixed(2) + '%)';
        if (newProduct.IsImport) {
          // var CryptoJS = require("crypto-js");
          // Download iamges
          if (newProduct.FeaturePicture) {
            try {
              if (typeof newProduct.FeaturePicture == 'string') {
                const tag = CryptoJS.MD5(newProduct.FeaturePicture as any).toString();
                // const file = await this.apiService.uploadFileByLink(newProduct.FeaturePicture);
                let file = this.uploadedImages[tag];
                if (!file) {
                  this.cms.toastService.show(`${newProduct.Name}`, `Upload hình đại diện`, { status: 'primary', duration: 10000 });
                  file = file || await this.apiService.uploadFileByLink(newProduct.FeaturePicture as any);
                  file.Tag = tag;
                  this.uploadedImages[tag] = file;
                }

                newProduct.FeaturePicture = file;
              }
              if (!newProduct.Pictures) newProduct.Pictures = [];
              if (newProduct.Pictures.findIndex(f => f.Tag == newProduct.FeaturePicture.Tag) < 0) {
                newProduct.Pictures.unshift(newProduct.FeaturePicture);
              }
            } catch (err) {
              console.error(err);
              delete newProduct.FeaturePicture;
            }
          }

          if (newProduct.Pictures && newProduct.Pictures.length > 0) {
            for (let i = 0; i < newProduct.Pictures.length; i++) {
              if (typeof newProduct.Pictures[i] == 'string') {
                try {
                  const tag = CryptoJS.MD5(newProduct.Pictures[i] as any).toString();
                  let file = this.uploadedImages[tag];
                  if (!file) {
                    this.cms.toastService.show(`${newProduct.Name}`, `Upload danh sách hình`, { status: 'primary', duration: 10000 });
                    file = file || await this.apiService.uploadFileByLink(newProduct.Pictures[i] as any);
                    file.Tag = tag;
                    this.uploadedImages[tag] = file;
                  }
                  console.log(file);

                  newProduct.Pictures[i] = file;
                } catch (err) {
                  console.error(err);
                  newProduct.Pictures.splice(i, 1);
                }
              }
            }
            if (!newProduct.FeaturePicture) {
              newProduct.FeaturePicture = newProduct.Pictures[0];
            }
          }
          const node = this.gridApi.getDisplayedRowAtIndex(newProduct.index);
          try {
            const createdProducts = await this.apiService.putPromise<ProductModel[]>('/admin-product/products', {}, [newProduct]);
            // this.progress = 0;
            // for (const i in createdProducts) {
            newProduct.Code = createdProducts[0].Code;
            newProduct.Sku = createdProducts[0].Sku;
            node.setDataValue('Code', newProduct.Code);
            node.setDataValue('Sku', newProduct.Sku);
            node.setDataValue('IsImport', false);
            node.setDataValue('Result', 'Success');
            // }
            // this.cms.toastService.show(newProduct.Name, 'Import thành công', { status: 'success' });
            console.log(createdProducts[0]);
          } catch (err) {
            console.error(err);
            const message = Array.isArray(err?.error?.logs) && err.error.logs.join(',') || err;
            node.setDataValue('Result', 'Error');
            node.setDataValue('Message', message);
            this.cms.toastService.show(newProduct.Name + message, 'Import thất bại', { status: 'danger', duration: 60000 });
          }
        }

      }
      this.progress = 0;

      // console.log(newProductList);
      if (newProductList.length > 0) {
        // const createdProducts = await this.apiService.putPromise<ProductModel[]>('/admin-product/products', {}, newProductList);
        // for (const i in createdProducts) {
        //   newProductList[i].Code = createdProducts[i].Code;
        //   newProductList[i].Sku = createdProducts[i].Sku;
        //   const node = this.gridApi.getDisplayedRowAtIndex(newProductList[i].index);
        //   node.setDataValue('Sku', createdProducts[i].Sku);
        //   node.setDataValue('Code', createdProducts[i].Code);
        //   node.setDataValue('IsImport', false);
        // }
        // this.cms.toastService.show('Đã import thông tin sản phẩm', 'Import thành công', { status: 'success' });
        // console.log(newProductList);
      }

      // Update price
      this.progressStatus = 'primary';
      if (updatePriceProductList.length > 0) {
        this.cms.toastService.show('Đang cập nhật giá mới', 'Cập nhật giá', { status: 'primary', duration: 30000 });
        await this.apiService.putProgress('/sales/master-price-table-details', {}, updatePriceProductList.map(m => {
          return {
            MasterPriceTable: 'default',
            Product: this.cms.getObjectId(m.Code),
            ProductName: this.cms.getObjectId(m.Name),
            Unit: this.cms.getObjectId(m.WarehouseUnit),
            Price: m.SalesPrice,
          };
        }), progressInfo => {
          console.log(progressInfo);
          this.progress = progressInfo.progress;
          this.progressLabel = progressInfo['item']['ProductName'] + ' (' + progressInfo.progress.toFixed(2) + '%)';
        });
        this.progress = 0;
        for (const updatePriceProduct of updatePriceProductList) {
          const node = this.gridApi.getDisplayedRowAtIndex(updatePriceProduct.index);
          if (node) node.setDataValue('IsUpdatePrice', false);
        }
        this.cms.toastService.show('Đã cập nhật giá mới', 'Cập nhật giá', { status: 'success' });
      }

      // Export update data
      for (const i in allProductList) {
        const realIndex = parseInt(i) + 1;
        this.sheet[realIndex][this.mapping['Sku']] = allProductList[i].Sku;
        this.sheet[realIndex][this.mapping['Code']] = allProductList[i].Code;

        this.sheet[realIndex][this.mapping['WarehouseUnit']] = this.cms.getObjectId(allProductList[i].WarehouseUnit);
        this.sheet[realIndex][this.mapping['WarehouseUnitName']] = allProductList[i].WarehouseUnitName;

        if (this.mapping['UnitConversions']) {
          for (let r = 0; r < this.mapping['UnitConversions'].length; r++) {
            this.sheet[realIndex][this.mapping['UnitConversions'][r]['Unit']] = this.cms.getObjectId(allProductList[i]['Unit' + (r + 1)]);
          }
        }
        if (this.mapping['Properties']) {
          for (let r = 0; r < this.mapping['Properties'].length; r++) {
            if (this.sheet[realIndex][this.mapping['Properties'][r]['Property']]) this.sheet[realIndex][this.mapping['Properties'][r]['Property']] = this.cms.getObjectId(allProductList[i]['Property' + (r + 1)]);
            if (allProductList[i]['PropertyValues' + (r + 1)]) this.sheet[realIndex][this.mapping['Properties'][r]['PropertyValues']] = allProductList[i]['PropertyValues' + (r + 1)].map(m => this.cms.getObjectId(m)).join(', ');
          }
        }
      }

      // Include column name into header
      // Export mapping file
      this.workBook.Sheets[this.chooseSheet] = XLSX.utils.json_to_sheet(this.sheet, { skipHeader: true });
      XLSX.writeFile(this.workBook, this.fileName);


      this.processing = false;
    } catch (err) {
      this.processing = false;
      console.error(err);
      this.cms.toastService.show('Đã xảy ra lỗi trong quá trình import', 'Lỗi import', { status: 'danger' });
    }
  }

  close() {
    this.ref.close();
  }

}
