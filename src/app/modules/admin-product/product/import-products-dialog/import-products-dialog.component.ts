import { takeUntil } from 'rxjs/operators';
import { AdminProductService } from './../../admin-product.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogRef, NbThemeService } from '@nebular/theme';
import { ProductModel } from '../../../../models/product.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { Module, AllCommunityModules, GridApi, ColumnApi, IDatasource, IGetRowsParams, ColDef, RowNode, CellDoubleClickedEvent, SuppressKeyboardEventParams } from '@ag-grid-community/all-modules';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { BtnCellRenderer, CkbCellRenderer, CustomHeader } from '../../../../lib/custom-element/ag-list/ag-list.lib';
import { BaseComponent } from '../../../../lib/base-component';
import * as XLSX from 'xlsx';
import { DialogFormComponent } from '../../../dialog/dialog-form/dialog-form.component';
import { ImportProductMapFormComponent } from '../import-product-map-form/import-product-map-form.component';
var CryptoJS = require("crypto-js");

@Component({
  selector: 'ngx-import-products-dialog',
  templateUrl: './import-products-dialog.component.html',
  styleUrls: ['./import-products-dialog.component.scss'],
})
export class ImportProductDialogComponent extends BaseComponent implements OnInit, AfterViewInit {

  componentName: string = 'ProductListComponent';
  @Input() inputMode: 'dialog' | 'page' | 'inline';
  @Input() inputProducts: ProductModel[];
  @Input() onDialogSave: (newData: ProductModel[]) => void;
  @Input() onDialogClose: () => void;

  constructor(
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public themeService: NbThemeService,
    public formBuilder: FormBuilder,
    public adminProductService: AdminProductService,
    public ref?: NbDialogRef<ImportProductDialogComponent>,
  ) {
    super(commonService, router, apiService);

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
    return super.init().then(rs => {
      // this.actionButtonList.unshift({
      //   name: 'chooseFile',
      //   status: 'primary',
      //   label: this.commonService.textTransform(this.commonService.translate.instant('Choose file'), 'head-title'),
      //   icon: 'copy-outline',
      //   title: this.commonService.textTransform(this.commonService.translate.instant('Choose file'), 'head-title'),
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
  public modules: Module[] = AllCommunityModules;
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
          const selectedNodes: RowNode[] = params.api.getSelectedNodes();
          const currentIndex = selectedNodes[0].rowIndex;
          let prevNode: RowNode, prevIndex: number, nextNode: RowNode, nextIndex: number, wasFoundCurrnet = false, wasFoundPrevNode = false;

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
    return this.commonService.getObjectId(item.Code) + '-' + this.commonService.getObjectId(item.Unit);
  }
  public getRowStyle = (params: { node: RowNode }) => {
    // if (params.node.rowIndex == this.activeDetailIndex) {
    //   return { background: '#ffc107' };
    // }
  };

  public cellDoubleClicked = (params: CellDoubleClickedEvent) => {
    console.log(params);

    if (params.colDef.field == 'duplicate') {
      this.commonService.showDialog('Xử lý trùng', 'Bạn có muốn xác nhận lại trạng thái trùng không ?', [
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
        return params.value.map(m => this.commonService.getObjectText(m)).join(', ');
      }
      return this.commonService.getObjectText(params.value);
      // }
    },
    idRender: (params) => {
      if (Array.isArray(params.value)) {
        return params.value.map(m => this.commonService.getObjectId(m)).join(', ');
      } else {
        return this.commonService.getObjectId(params.value);
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

    btnCellRenderer: BtnCellRenderer,
    ckbCellRenderer: CkbCellRenderer,
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
            filter: 'agTextColumnFilter',
            cellRenderer: 'textRender',
            pinned: 'right',
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
      ];
    }
  }

  generateUnitConversionControls(index: number, columnList: any[]) {
    return [
      {
        name: 'UnitConversion' + index,
        label: 'Đơn vị tính chuyển đổi (' + index + ')',
        placeholder: '',
        type: 'select2',
        initValue: columnList.find(f => this.commonService.getObjectId(f) == 'UnitConversion' + index),
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
        initValue: columnList.find(f => this.commonService.getObjectId(f) == 'ConversionRatio' + index),
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
        initValue: columnList.find(f => this.commonService.getObjectId(f) == 'IsDefaultSales' + index),
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
        initValue: columnList.find(f => this.commonService.getObjectId(f) == 'IsDefaultPurchase' + index),
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
        initValue: columnList.find(f => this.commonService.getObjectId(f) == 'IsManageByAccessNumber' + index),
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
        initValue: columnList.find(f => this.commonService.getObjectId(f) == 'IsAutoAdjustInventory' + index),
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
        initValue: columnList.find(f => this.commonService.getObjectId(f) == 'IsExpirationGoods' + index),
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
          && (this.commonService.smartFilter(oldProduct.Name, newProduct.Name) || this.commonService.smartFilter(newProduct.Name, oldProduct.Name)));
    } else {
      return (oldProduct.Sku && newProduct.Sku) ? (oldProduct.Sku.trim().toLowerCase() == newProduct.Sku.trim().toLowerCase()) : (!oldProduct.Name && newProduct.Name && this.commonService.convertUnicodeToNormal(oldProduct.Name).toLowerCase() == this.commonService.convertUnicodeToNormal(newProduct.Name).toLowerCase());
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
    this.fileName = file.name;
    reader.onload = async (event) => {
      try {
        this.processing = true;
        const data = reader.result;
        this.workBook = XLSX.read(data, { type: 'binary' });
        this.jsonData = this.workBook.SheetNames.reduce((initial, name) => {
          const sheet = this.workBook.Sheets[name];
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          return initial;
        }, {});
        this.processing = false;

        this.sheets = Object.keys(this.jsonData);
        if (this.sheets.length > 1) {
          this.sheet = await new Promise((resove, reject) => {
            this.commonService.openDialog(DialogFormComponent, {
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
                    action: () => { return true; },
                  },
                  {
                    label: 'Chọn',
                    icon: 'generate',
                    status: 'success',
                    // keyShortcut: 'Enter',
                    action: (form: FormGroup, formDialogConpoent: DialogFormComponent) => {

                      console.log(form.value);
                      this.chooseSheet = this.commonService.getObjectId(form.get('Sheet').value);
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
        }

        // const productList: any[] = sheet;

        // Confirm mapping
        const tmpSheet: string[][] = XLSX.utils.sheet_to_json(this.workBook.Sheets[this.chooseSheet], { header: 1 });
        const columnList = tmpSheet[0].map((m: string) => {
          const id = m.split('/')[0];
          const text = m;
          return { id, text };
        });

        this.commonService.openDialog(ImportProductMapFormComponent, {
          context: {
            columnList: columnList,
            onDialogSave: async dataMappiing => {
              try {

                this.mapping = dataMappiing[0];
                for (const i in this.mapping) {
                  this.mapping[i] = this.commonService.getObjectText(this.mapping[i]);
                  if (this.mapping['UnitConversions']) {
                    for (const unitConverion of this.mapping['UnitConversions']) {
                      for (const r in unitConverion) {
                        unitConverion[r] = this.commonService.getObjectText(unitConverion[r]);
                      }
                    }
                  }
                  if (this.mapping['Properties']) {
                    for (const property of this.mapping['Properties']) {
                      for (const r in property) {
                        property[r] = this.commonService.getObjectText(property[r]);
                      }
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
                this.array = this.sheet.map((row: any, index: number) => {
                  const mappedRow: any = {
                    No: index + 1,
                    IsUpdatePrice: false,
                  };

                  for (const column in this.mapping) {
                    mappedRow[column] = row[this.mapping[column]] || null;
                    if (typeof mappedRow[column] == 'string') {
                      mappedRow[column] = mappedRow[column].trim();
                    }
                  }
                  mappedRow['Type'] = mappedRow['Type'] || 'PRODUCT';
                  if (mappedRow['Brand']) {
                    mappedRow['Brand'] = this.adminProductService.brandList$.value.find(f => this.commonService.getObjectId(f) == mappedRow['Brand']);
                  }
                  if (mappedRow['Categories']) {
                    mappedRow['Categories'] = new String(mappedRow['Categories'] || '').split(',').map(m => {
                      return this.adminProductService.categoryList$.value.find(f => this.commonService.getObjectId(f) == m.trim());
                    });
                  }
                  if (mappedRow['Groups']) {
                    mappedRow['Groups'] = new String(mappedRow['Groups'] || '').split(',').map(m => {
                      return this.adminProductService.groupList$.value.find(f => this.commonService.getObjectId(f) == m.trim());
                    });
                  }
                  if (mappedRow['Keywords']) {
                    mappedRow['Keywords'] = new String(mappedRow['Keywords'] || '').split(',').map(m => m.trim());
                  }

                  mappedRow['WarehouseUnit'] = mappedRow.WarehouseUnit && unitMapping[mappedRow.WarehouseUnit]
                  mappedRow['WarehouseUnitName'] = this.commonService.getObjectText(mappedRow['WarehouseUnit']);
                  if (this.mapping['UnitConversions']) {
                    for (let index = 0; index < this.mapping['UnitConversions'].length; index++) {
                      for (const r in this.mapping['UnitConversions'][index]) {
                        mappedRow[r + (index + 1)] = row[this.mapping['UnitConversions'][index][r]];
                      }
                      mappedRow['Unit' + (index + 1)] = mappedRow['Unit' + (index + 1)] && unitMapping[mappedRow['Unit' + (index + 1)]];
                      mappedRow['UnitName' + (index + 1)] = this.commonService.getObjectText(mappedRow['Unit' + (index + 1)]);
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
                  for (const oldProduct of currentProductList) {
                    // if (mappedRow.Sku) {
                    // if (mappedRow.Sku && (oldProduct.Sku?.toLowerCase() == mappedRow.Sku?.toLowerCase()) || (oldProduct.Name && mappedRow.Name && this.commonService.convertUnicodeToNormal(oldProduct.Name).toLowerCase() == this.commonService.convertUnicodeToNormal(mappedRow.Name).toLowerCase())) {
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
                    //   // if (oldProduct.Name && newProduct.Name && (this.commonService.smartFilter(oldProduct.Name, newProduct.Name) || this.commonService.smartFilter(newProduct.Name, oldProduct.Name))) {
                    //   if (oldProduct.Name && mappedRow.Name && this.commonService.convertUnicodeToNormal(oldProduct.Name).toLowerCase() == this.commonService.convertUnicodeToNormal(mappedRow.Name).toLowerCase()) {
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
                  if (!duplicate) {
                    mappedRow.duplicate = false;
                    mappedRow.Status = 'Mới';
                    // if (this.commonService.getObjectId(mappedRow.WarehouseUnit)) {
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

        if (false) this.commonService.openDialog(DialogFormComponent, {
          context: {
            cardStyle: { width: '100%' },
            width: '99w',
            title: 'Mời bạn chọn cột tương ứng với các trường thông tin sản phẩm',
            onInit: async (form, dialog) => {
              // const sku = form.get('Sku');
              // sheet.setValue('Sku');
              return true;
            },
            controls: [
              {
                name: 'Code',
                label: 'Code',
                placeholder: '',
                type: 'select2',
                initValue: columnList.find(f => this.commonService.getObjectId(f) == 'Code'),
                // focus: true,
                class: 'col-md-1',
                option: {
                  data: columnList,
                  placeholder: 'Chọn cột ID sản phẩm...',
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
                name: 'Sku',
                label: 'Sku',
                placeholder: '',
                type: 'select2',
                initValue: columnList.find(f => this.commonService.getObjectId(f) == 'Sku'),
                // focus: true,
                class: 'col-md-2',
                option: {
                  data: columnList,
                  placeholder: 'Chọn sku...',
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
                name: 'Name',
                label: 'Tên sản phẩm',
                placeholder: '',
                type: 'select2',
                initValue: columnList.find(f => this.commonService.getObjectId(f) == 'Name'),
                // focus: true,
                class: 'col-md-3',
                option: {
                  data: columnList,
                  placeholder: 'Chọn tên sản phẩm...',
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
                name: 'WarehouseUnit',
                label: 'Đơn vị tính cơ bản',
                placeholder: '',
                type: 'select2',
                initValue: columnList.find(f => this.commonService.getObjectId(f) == 'WarehouseUnit'),
                // focus: true,
                class: 'col-md-3',
                option: {
                  data: columnList,
                  placeholder: 'Chọn đơn vị tính cơ bản...',
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
                name: 'WarehouseUnitName',
                label: 'Tên đơn vị tính cơ bản',
                placeholder: '',
                type: 'select2',
                initValue: columnList.find(f => this.commonService.getObjectId(f) == 'WarehouseUnitName'),
                // focus: true,
                class: 'col-md-3',
                option: {
                  data: columnList,
                  placeholder: 'Chọn tên đơn vị tính cơ bản...',
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
              // Unit Conversion
              ...this.generateUnitConversionControls(1, columnList),
              ...this.generateUnitConversionControls(2, columnList),
              ...this.generateUnitConversionControls(3, columnList),
              ...this.generateUnitConversionControls(4, columnList),
              ...this.generateUnitConversionControls(5, columnList),
              // End Unit Conversion
              {
                name: 'SalesPrice',
                label: 'Giá EU',
                placeholder: 'Chọn giá EU...',
                type: 'select2',
                initValue: columnList.find(f => this.commonService.getObjectId(f) == 'SalesPrice'),
                // focus: true,
                option: {
                  data: columnList,
                  placeholder: 'Chọn giá EU...',
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
                action: () => { return true; },
              },
              {
                label: 'Xác nhận',
                icon: 'generate',
                status: 'success',
                // keyShortcut: 'Enter',
                action: async (form: FormGroup, formDialogConpoent: DialogFormComponent) => {
                  try {
                    this.mapping = {
                      ...form.value,
                      // UnitConversionName0: columnList.find(f => this.commonService.getObjectId(f) == 'UnitConversionName0'),
                      UnitConversionName1: columnList.find(f => this.commonService.getObjectId(f) == 'UnitConversionName1'),
                      UnitConversionName2: columnList.find(f => this.commonService.getObjectId(f) == 'UnitConversionName2'),
                      UnitConversionName3: columnList.find(f => this.commonService.getObjectId(f) == 'UnitConversionName3'),
                      UnitConversionName4: columnList.find(f => this.commonService.getObjectId(f) == 'UnitConversionName4'),
                      UnitConversionName5: columnList.find(f => this.commonService.getObjectId(f) == 'UnitConversionName5'),
                      // UnitConversionName5: columnList.find(f => this.commonService.getObjectId(f) == 'UnitConversionName5'),
                    };
                    for (const i in this.mapping) {
                      this.mapping[i] = this.commonService.getObjectText(this.mapping[i]);
                    }

                    console.log(form.value);

                    this.processing = true;
                    this.array = this.sheet.map((row: any, index: number) => {
                      const mappedRow = {
                        No: index + 1,
                        Type: 'PRODUCT',
                        Sku: row[this.mapping['Sku']],
                        Name: row[this.mapping['Name']],
                        WarehouseUnit: row[this.mapping['WarehouseUnit']],
                        WarehouseUnitName: row[this.mapping['WarehouseUnitName']],

                        UnitConversion1: row[this.mapping['UnitConversion1']],
                        UnitConversionName1: row[this.mapping['UnitConversionName1']],
                        ConversionRatio1: row[this.mapping['ConversionRatio1']],
                        IsDefaultSales1: row[this.mapping['IsDefaultSales1']] && true || false,
                        IsDefaultPurchase1: row[this.mapping['IsDefaultPurchase1']] && true || false,
                        IsManageByAccessNumber1: row[this.mapping['IsManageByAccessNumber1']] && true || false,
                        IsAutoAdjustInventory1: row[this.mapping['IsAutoAdjustInventory1']] && true || false,
                        IsExpirationGoods1: row[this.mapping['IsExpirationGoods1']] && true || false,

                        UnitConversion2: row[this.mapping['UnitConversion2']],
                        UnitConversionName2: row[this.mapping['UnitConversionName2']],
                        ConversionRatio2: row[this.mapping['ConversionRatio2']],
                        IsDefaultSales2: row[this.mapping['IsDefaultSales2']] && true || false,
                        IsDefaultPurchase2: row[this.mapping['IsDefaultPurchase2']] && true || false,
                        IsManageByAccessNumber2: row[this.mapping['IsManageByAccessNumber2']] && true || false,
                        IsAutoAdjustInventory2: row[this.mapping['IsAutoAdjustInventory2']] && true || false,
                        IsExpirationGoods2: row[this.mapping['IsExpirationGoods2']] && true || false,

                        UnitConversion3: row[this.mapping['UnitConversion3']],
                        UnitConversionName3: row[this.mapping['UnitConversionName3']],
                        ConversionRatio3: row[this.mapping['ConversionRatio3']],
                        IsDefaultSales3: row[this.mapping['IsDefaultSales3']] && true || false,
                        IsDefaultPurchase3: row[this.mapping['IsDefaultPurchase3']] && true || false,
                        IsManageByAccessNumber3: row[this.mapping['IsManageByAccessNumber3']] && true || false,
                        IsAutoAdjustInventory3: row[this.mapping['IsAutoAdjustInventory3']] && true || false,
                        IsExpirationGoods3: row[this.mapping['IsExpirationGoods3']] && true || false,

                        UnitConversion4: row[this.mapping['UnitConversion4']],
                        UnitConversionName4: row[this.mapping['UnitConversionName4']],
                        ConversionRatio4: row[this.mapping['ConversionRatio4']],
                        IsDefaultSales4: row[this.mapping['IsDefaultSales4']] && true || false,
                        IsDefaultPurchase4: row[this.mapping['IsDefaultPurchase4']] && true || false,
                        IsManageByAccessNumber4: row[this.mapping['IsManageByAccessNumber4']] && true || false,
                        IsAutoAdjustInventory4: row[this.mapping['IsAutoAdjustInventory4']] && true || false,
                        IsExpirationGoods4: row[this.mapping['IsExpirationGoods4']] && true || false,

                        UnitConversion5: row[this.mapping['UnitConversion5']],
                        UnitConversionName5: row[this.mapping['UnitConversionName5']],
                        ConversionRatio5: row[this.mapping['ConversionRatio5']],
                        IsDefaultSales5: row[this.mapping['IsDefaultSales5']] && true || false,
                        IsDefaultPurchase5: row[this.mapping['IsDefaultPurchase5']] && true || false,
                        IsManageByAccessNumber5: row[this.mapping['IsManageByAccessNumber5']] && true || false,
                        IsAutoAdjustInventory5: row[this.mapping['IsAutoAdjustInventory5']] && true || false,
                        IsExpirationGoods5: row[this.mapping['IsExpirationGoods5']] && true || false,

                        SalesPrice: row[this.mapping['SalesPrice']],
                        IsUpdatePrice: true,
                      };

                      return mappedRow;

                    });

                    // Confirm unit mapping
                    const unitList = await this.apiService.getPromise<any[]>('/admin-product/units', { includeIdText: true, limit: 'nolimit' });
                    const unitMapping = {};
                    for (const unit of unitList) {
                      unitMapping[unit.Code] = unit;
                    }
                    let importUnitsUnique = new Set([
                      ...this.array.map(m => m.WarehouseUnitName),
                      ...this.array.map(m => m.UnitConversionName1),
                      ...this.array.map(m => m.UnitConversionName2),
                      ...this.array.map(m => m.UnitConversionName3),
                      ...this.array.map(m => m.UnitConversionName4),
                      ...this.array.map(m => m.UnitConversionName5),
                    ]);
                    let importUnitMapping: { [key: string]: any[] } = {};
                    for (const unit of importUnitsUnique) {
                      if (!importUnitMapping[unit]) {
                        importUnitMapping[unit] = [];
                      }
                      importUnitMapping[unit] = [
                        ...importUnitMapping[unit],
                        ...unitList.filter(f => unit && f.Name?.toLowerCase() == unit?.toLowerCase()) || [unit],
                      ];
                    }

                    const currentProductList = await this.apiService.getPromise<ProductModel[]>('/admin-product/products', { limit: 'nolimit' });
                    for (const newProduct of this.array) {
                      let duplicate = false;
                      newProduct.IsNew = false;
                      newProduct.WarehouseUnit = newProduct.WarehouseUnit && unitMapping[newProduct.WarehouseUnit] || importUnitMapping[newProduct['WarehouseUnitName']][0];
                      newProduct.WarehouseUnitName = this.commonService.getObjectText(newProduct.WarehouseUnit);

                      newProduct.UnitConversion1 = newProduct.UnitConversion1 && unitMapping[newProduct.UnitConversion1] || importUnitMapping[newProduct['UnitConversionName1']][0];
                      newProduct.UnitConversion2 = newProduct.UnitConversion2 && unitMapping[newProduct.UnitConversion2] || importUnitMapping[newProduct['UnitConversionName2']][0];
                      newProduct.UnitConversion3 = newProduct.UnitConversion3 && unitMapping[newProduct.UnitConversion3] || importUnitMapping[newProduct['UnitConversionName3']][0];
                      newProduct.UnitConversion4 = newProduct.UnitConversion4 && unitMapping[newProduct.UnitConversion4] || importUnitMapping[newProduct['UnitConversionName4']][0];
                      newProduct.UnitConversion5 = newProduct.UnitConversion5 && unitMapping[newProduct.UnitConversion5] || importUnitMapping[newProduct['UnitConversionName5']][0];

                      // newProduct.UnitConversionName0 = this.commonService.getObjectText(newProduct.WarehouseUnit);
                      newProduct.UnitConversionName1 = this.commonService.getObjectText(newProduct.UnitConversion1);
                      newProduct.UnitConversionName2 = this.commonService.getObjectText(newProduct.UnitConversion2);
                      newProduct.UnitConversionName3 = this.commonService.getObjectText(newProduct.UnitConversion3);
                      newProduct.UnitConversionName4 = this.commonService.getObjectText(newProduct.UnitConversion4);
                      newProduct.UnitConversionName5 = this.commonService.getObjectText(newProduct.UnitConversion5);

                      for (const oldProduct of currentProductList) {
                        if (newProduct.Sku) {
                          if (oldProduct.Sku?.toLowerCase() == newProduct.Sku?.toLowerCase()) {
                            newProduct.Code = oldProduct.Code;
                            newProduct.duplicate = true;
                            newProduct.OldName = oldProduct.Name;
                            newProduct.FeaturePicture = oldProduct.FeaturePicture;
                            duplicate = true
                            // newProduct.IsImport = true;
                            // newProduct.IsUpdate = true;
                            // newProduct.IsNew = false;
                            break;
                          }
                        } else {
                          // if (oldProduct.Name && newProduct.Name && (this.commonService.smartFilter(oldProduct.Name, newProduct.Name) || this.commonService.smartFilter(newProduct.Name, oldProduct.Name))) {
                          if (oldProduct.Name && newProduct.Name && this.commonService.convertUnicodeToNormal(oldProduct.Name).toLowerCase() == this.commonService.convertUnicodeToNormal(newProduct.Name).toLowerCase()) {
                            newProduct.duplicate = true;
                            newProduct.IsNew = false;
                            newProduct.OldName = oldProduct.Name;
                            newProduct.Sku = oldProduct.Sku;
                            newProduct.Code = oldProduct.Code;
                            newProduct.OldSku = oldProduct.Sku;
                            newProduct.OldCode = oldProduct.Code;
                            newProduct.FeaturePicture = oldProduct.FeaturePicture;
                            duplicate = true;
                            break;
                          }
                        }
                      }
                      if (!duplicate) {
                        newProduct.duplicate = false;
                        newProduct.Status = 'Mới';
                        if (this.commonService.getObjectId(newProduct.WarehouseUnit)) {
                          newProduct.IsImport = true;
                        }
                      } else {
                        newProduct.Status = 'Trùng ?';
                      }
                    }

                    console.log(this.array);
                    this.loadList();

                    this.processing = false;
                  } catch (err) {
                    console.error(err);
                    this.processing = false;
                  }
                  return true;
                },
              },
            ],
          },
          closeOnEsc: false,
          closeOnBackdropClick: false,
        });
      } catch (err) {
        this.processing = false;
      }
    };
    reader.readAsBinaryString(file);
  }

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
        if (newProduct.WarehouseUnit && this.commonService.getObjectId(newProduct.WarehouseUnit)) {
          newProduct.UnitConversions = [];
          newProduct.Properties = [];

          if (this.mapping['UnitConversions']) {
            for (let r = 0; r < this.mapping['UnitConversions'].length; r++) {
              if (this.commonService.getObjectId(newProduct['Unit' + (r + 1)])) {
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
              if (this.commonService.getObjectId(newProduct['Property' + (r + 1)]) && newProduct['PropertyValues' + (r + 1)]) {
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

      for (const newProduct of allProductList) {

        if (newProduct.IsImport) {
          // var CryptoJS = require("crypto-js");
          // Download iamges
          if (newProduct.FeaturePicture) {
            try {
              if (typeof newProduct.FeaturePicture == 'string') {
                this.commonService.toastService.show(`${newProduct.Name}`, `Upload hình đại diện`, { status: 'primary', duration: 10000 });
                const tag = CryptoJS.MD5(newProduct.FeaturePicture as any).toString();
                const file = await this.apiService.uploadFileByLink(newProduct.FeaturePicture);
                file.Tag = tag;

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
                this.commonService.toastService.show(`${newProduct.Name}`, `Upload danh sách hình`, { status: 'primary', duration: 10000 });
                try {
                  const tag = CryptoJS.MD5(newProduct.Pictures[i] as any).toString();
                  const file = await this.apiService.uploadFileByLink(newProduct.Pictures[i] as any);
                  file.Tag = tag;
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
            // for (const i in createdProducts) {
            newProduct.Code = createdProducts[0].Code;
            newProduct.Sku = createdProducts[0].Sku;
            node.setDataValue('Code', newProduct.Code);
            node.setDataValue('Sku', newProduct.Sku);
            node.setDataValue('IsImport', false);
            node.setDataValue('Result', 'Success');
            // }
            this.commonService.toastService.show(newProduct.Name, 'Import thành công', { status: 'success' });
            console.log(createdProducts[0]);
          } catch (err) {
            console.error(err);
            const message = Array.isArray(err?.error?.logs) && err.error.logs.join(',') || err;
            node.setDataValue('Result', 'Error');
            node.setDataValue('Message', message);
            this.commonService.toastService.show(newProduct.Name + message, 'Import thất bại', { status: 'danger', duration: 60000 });
          }
        }

      }

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
        // this.commonService.toastService.show('Đã import thông tin sản phẩm', 'Import thành công', { status: 'success' });
        // console.log(newProductList);
      }

      // Update price
      if (updatePriceProductList.length > 0) {
        this.commonService.toastService.show('Đang cập nhật giá mới', 'Cập nhật giá', { status: 'primary', duration: 30000 });
        await this.apiService.putPromise('/sales/master-price-table-details', {}, updatePriceProductList.map(m => {
          return {
            MasterPriceTable: 'default',
            Product: this.commonService.getObjectId(m.Code),
            Unit: this.commonService.getObjectId(m.WarehouseUnit),
            Price: m.SalesPrice,
          };
        }));
        for(const updatePriceProduct of updatePriceProductList) {
          const node = this.gridApi.getDisplayedRowAtIndex(updatePriceProduct.index);
          if(node) node.setDataValue('IsUpdatePrice', false);
        }
        this.commonService.toastService.show('Đã cập nhật giá mới', 'Cập nhật giá', { status: 'success' });
      }

      // Export update data
      for (const i in allProductList) {
        this.sheet[i][this.mapping['Sku']] = allProductList[i].Sku;
        this.sheet[i][this.mapping['Code']] = allProductList[i].Code;

        this.sheet[i][this.mapping['WarehouseUnit']] = this.commonService.getObjectId(allProductList[i].WarehouseUnit);
        this.sheet[i][this.mapping['WarehouseUnitName']] = allProductList[i].WarehouseUnitName;

        if (this.mapping['UnitConversions']) {
          for (let r = 0; r < this.mapping['UnitConversions'].length; r++) {
            this.sheet[i][this.mapping['UnitConversions'][r]['Unit']] = this.commonService.getObjectId(allProductList[i]['Unit' + (r + 1)]);
          }
        }
        if (this.mapping['Properties']) {
          for (let r = 0; r < this.mapping['Properties'].length; r++) {
            if (this.sheet[i][this.mapping['Properties'][r]['Property']]) this.sheet[i][this.mapping['Properties'][r]['Property']] = this.commonService.getObjectId(allProductList[i]['Property' + (r + 1)]);
            if (allProductList[i]['PropertyValues' + (r + 1)]) this.sheet[i][this.mapping['Properties'][r]['PropertyValues']] = allProductList[i]['PropertyValues' + (r + 1)].map(m => this.commonService.getObjectId(m)).join(', ');
          }
        }
      }

      // Include column name into header
      // Export mapping file
      this.workBook.Sheets[this.chooseSheet] = XLSX.utils.json_to_sheet(this.sheet);
      XLSX.writeFile(this.workBook, this.fileName);


      this.processing = false;
    } catch (err) {
      this.processing = false;
      console.error(err);
      this.commonService.toastService.show('Đã xảy ra lỗi trong quá trình import', 'Lỗi import', { status: 'danger' });
    }
  }

  close() {
    this.ref.close();
  }

}
