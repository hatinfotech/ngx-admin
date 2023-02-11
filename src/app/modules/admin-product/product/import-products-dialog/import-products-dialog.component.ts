import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogRef, NbThemeService } from '@nebular/theme';
import { ProductModel } from '../../../../models/product.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { Module, AllCommunityModules, GridApi, ColumnApi, IDatasource, IGetRowsParams, ColDef, RowNode, CellDoubleClickedEvent, SuppressKeyboardEventParams } from '@ag-grid-community/all-modules';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { BtnCellRenderer, CkbCellRenderer } from '../../../../lib/custom-element/ag-list/ag-list.lib';
import { BaseComponent } from '../../../../lib/base-component';
import * as XLSX from 'xlsx';
import { DialogFormComponent } from '../../../dialog/dialog-form/dialog-form.component';

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
    public ref?: NbDialogRef<ImportProductDialogComponent>,
  ) {
    super(commonService, router, apiService);

    /** AG-Grid */
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
        headerName: 'Import',
        field: 'import',
        width: 80,
        filter: 'agTextColumnFilter',
        pinned: 'left',
        cellRenderer: 'ckbCellRenderer',
        cellRendererParams: {
          changed: (checked: boolean, params: { node: RowNode, data: ProductModel, api: GridApi } & { [key: string]: any }) => {
            // alert(`${field} was clicked`);
            console.log(params);

            // Remove row
            if (checked) {
              params.node.setDataValue('Sku', null);
              params.node.setDataValue('Code', null);
            } else {
              params.node.setDataValue('Sku', params.data.OldSku);
              params.node.setDataValue('Code', params.data.OldCode);
            }
          },
        },
      },
      {
        headerName: 'Nghi vấn trùng',
        field: 'duplicate',
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
      // {
      //   headerName: 'Old Sku',
      //   field: 'OldSku',
      //   width: 100,
      //   filter: 'agTextColumnFilter',
      //   cellRenderer: 'textRender',
      //   pinned: 'left',
      // },
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
        headerName: 'ĐVT cơ bản',
        field: 'WarehouseUnit',
        width: 150,
        filter: 'agTextColumnFilter',
        cellRenderer: 'textRender',
        // pinned: 'right',
      },
      {
        headerName: 'ĐVT chuyển đổi 1',
        field: 'UnitConversion1',
        width: 150,
        filter: 'agTextColumnFilter',
        cellRenderer: 'textRender',
        // pinned: 'right',
      },
      {
        headerName: 'Tỷ lệ chuyển đổi 1',
        field: 'ConversionRatio1',
        width: 150,
        filter: 'agTextColumnFilter',
        cellRenderer: 'textRender',
        // pinned: 'right',
      },
      {
        headerName: 'Mặc định bán 1',
        field: 'IsDefaultSales1',
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
        headerName: 'Mặc định mua 1',
        field: 'IsDefaultPurchase1',
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
        headerName: 'Số truy xuất 1',
        field: 'IsManageByAccessNumber1',
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
        headerName: 'Trừ kho tự động 1',
        field: 'IsAutoAdjustInventory1',
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
        headerName: 'Có hạn sử dụng 1',
        field: 'IsExpirationGoods1',
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
        headerName: 'ĐVT chuyển đổi 2',
        field: 'UnitConversion2',
        width: 100,
        filter: 'agTextColumnFilter',
        cellRenderer: 'textRender',
        // pinned: 'right',
      },
      {
        headerName: 'Tỷ lệ chuyển đổi 2',
        field: 'ConversionRatio2',
        width: 150,
        filter: 'agTextColumnFilter',
        cellRenderer: 'textRender',
        // pinned: 'right',
      },
      {
        headerName: 'Mặc định bán 2',
        field: 'IsDefaultSales2',
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
        headerName: 'Mặc định mua 2',
        field: 'IsDefaultPurchase2',
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
        headerName: 'Số truy xuất 2',
        field: 'IsManageByAccessNumber2',
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
        headerName: 'Trừ kho tự động 2',
        field: 'IsAutoAdjustInventory2',
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
        headerName: 'Có hạn sử dụng 2',
        field: 'IsExpirationGoods2',
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
        headerName: 'ĐVT chuyển đổi 3',
        field: 'UnitConversion3',
        width: 150,
        filter: 'agTextColumnFilter',
        cellRenderer: 'textRender',
        // pinned: 'right',
      },
      {
        headerName: 'Tỷ lệ chuyển đổi 3',
        field: 'ConversionRatio3',
        width: 150,
        filter: 'agTextColumnFilter',
        cellRenderer: 'textRender',
        // pinned: 'right',
      },
      {
        headerName: 'Mặc định bán 3',
        field: 'IsDefaultSales3',
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
        headerName: 'Mặc định mua 3',
        field: 'IsDefaultPurchase3',
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
        headerName: 'Số truy xuất 3',
        field: 'IsManageByAccessNumber3',
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
        headerName: 'Trừ kho tự động 3',
        field: 'IsAutoAdjustInventory3',
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
        headerName: 'Có hạn sử dụng 3',
        field: 'IsExpirationGoods3',
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
        headerName: 'ĐVT chuyển đổi 4',
        field: 'UnitConversion4',
        width: 150,
        filter: 'agTextColumnFilter',
        cellRenderer: 'textRender',
        // pinned: 'right',
      },
      {
        headerName: 'Tỷ lệ chuyển đổi 4',
        field: 'ConversionRatio4',
        width: 150,
        filter: 'agTextColumnFilter',
        cellRenderer: 'textRender',
        // pinned: 'right',
      },
      {
        headerName: 'Mặc định bán 4',
        field: 'IsDefaultSales4',
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
        headerName: 'Mặc định mua 4',
        field: 'IsDefaultPurchase4',
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
        headerName: 'Số truy xuất 4',
        field: 'IsManageByAccessNumber4',
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
        headerName: 'Trừ kho tự động 4',
        field: 'IsAutoAdjustInventory4',
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
        headerName: 'Có hạn sử dụng 4',
        field: 'IsExpirationGoods4',
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
        headerName: 'ĐVT chuyển đổi 5',
        field: 'UnitConversion5',
        width: 150,
        filter: 'agTextColumnFilter',
        cellRenderer: 'textRender',
        // pinned: 'right',
      },
      {
        headerName: 'Tỷ lệ chuyển đổi 5',
        field: 'ConversionRatio5',
        width: 150,
        filter: 'agTextColumnFilter',
        cellRenderer: 'textRender',
        // pinned: 'right',
      },
      {
        headerName: 'Mặc định bán 5',
        field: 'IsDefaultSales5',
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
        headerName: 'Mặc định mua 5',
        field: 'IsDefaultPurchase5',
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
        headerName: 'Số truy xuất 5',
        field: 'IsManageByAccessNumber5',
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
        headerName: 'Trừ kho tự động 5',
        field: 'IsAutoAdjustInventory5',
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
        headerName: 'Có hạn sử dụng 5',
        field: 'IsExpirationGoods5',
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
        headerName: 'Update giá',
        field: 'updatePrice',
        width: 80,
        filter: 'agTextColumnFilter',
        pinned: 'right',
        cellRenderer: 'ckbCellRenderer',
        cellRendererParams: {
          changed: (checked: boolean, params: { node: RowNode, data: ProductModel, api: GridApi } & { [key: string]: any }) => {
            // alert(`${field} was clicked`);
            console.log(params);

            // Remove row
            // params.api.applyTransaction({ remove: [params.node.data] });
            if (checked) {
              params.node.setDataValue('Sku', null);
              params.node.setDataValue('Code', null);
            } else {
              params.node.setDataValue('Sku', params.data.OldSku);
              params.node.setDataValue('Code', params.data.OldCode);
            }
          },
        },
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
      // {
      //   headerName: 'Action',
      //   field: 'id',
      //   width: 110,
      //   filter: 'agTextColumnFilter',
      //   pinned: 'right',
      //   cellRenderer: 'btnCellRenderer',
      //   cellRendererParams: {
      //     clicked: (params: { node: RowNode, data: ProductModel, api: GridApi } & { [key: string]: any }) => {
      //       // alert(`${field} was clicked`);
      //       console.log(params);

      //       // Remove row
      //       params.api.applyTransaction({ remove: [params.node.data] });

      //     },
      //   },
      // },
    ];

    this.pagination = false;
    this.maxBlocksInCache = 5;
    this.paginationPageSize = this.cacheBlockSize = 1000;
    /** End AG-Grid */

    // this.array = this.formBuilder.control([]);

  }

  themeName = this.themeService.currentTheme == 'default' ? '' : this.themeService.currentTheme;
  processing = false;
  array: ProductModel[];

  ngOnInit() {
    super.ngOnInit();
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
      return image?.Thumbnail ? '<img style="height: 45px" src="' + image?.Thumbnail + '">' : '';
    },
    
    btnCellRenderer: BtnCellRenderer,
    ckbCellRenderer: CkbCellRenderer
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
  loadList(callback?: (list: ProductModel[]) => void) {

    if (this.gridApi) {

      
      let details: ProductModel[] = (this.array || []).map((detail: ProductModel) => {
        
        return detail;
      });
      this.gridApi.setRowData(details);
      
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

  workBook: XLSX.WorkBook = null;
  jsonData = null;
  sheets: string[] = null;
  sheet: any[] = null;
  chooseSheet: string = null;
  fileName: string;
  mapping: { [key: string]: string };
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
        const columnList = Object.keys(this.sheet[0]).map(m => {
          const id = m.split('/')[0];
          const text = m;
          return { id, text };
        });
        this.commonService.openDialog(DialogFormComponent, {
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
                name: 'Sku',
                label: 'Sku',
                placeholder: '',
                type: 'select2',
                initValue: columnList.find(f => this.commonService.getObjectId(f) == 'Sku'),
                // focus: true,
                class: 'col-md-3',
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
                      UnitConversionName1: columnList.find(f => this.commonService.getObjectId(f) == 'UnitConversionName1'),
                      UnitConversionName2: columnList.find(f => this.commonService.getObjectId(f) == 'UnitConversionName2'),
                      UnitConversionName3: columnList.find(f => this.commonService.getObjectId(f) == 'UnitConversionName3'),
                      UnitConversionName4: columnList.find(f => this.commonService.getObjectId(f) == 'UnitConversionName4'),
                      UnitConversionName5: columnList.find(f => this.commonService.getObjectId(f) == 'UnitConversionName5'),
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
                        UnitConversion1Name: row[this.mapping['UnitConversion1Name']],
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
                        updatePrice: true,
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
                      newProduct.import = false;
                      newProduct.WarehouseUnit = newProduct.WarehouseUnit && unitMapping[newProduct.WarehouseUnit] || importUnitMapping[newProduct['WarehouseUnitName']][0];
                      newProduct.WarehouseUnitName = this.commonService.getObjectText(newProduct.WarehouseUnit);

                      newProduct.UnitConversion1 = newProduct.UnitConversion1 && unitMapping[newProduct.UnitConversion1] || importUnitMapping[newProduct['UnitConversionName1']][0];
                      newProduct.UnitConversion2 = newProduct.UnitConversion2 && unitMapping[newProduct.UnitConversion2] || importUnitMapping[newProduct['UnitConversionName2']][0];
                      newProduct.UnitConversion3 = newProduct.UnitConversion3 && unitMapping[newProduct.UnitConversion3] || importUnitMapping[newProduct['UnitConversionName3']][0];
                      newProduct.UnitConversion4 = newProduct.UnitConversion4 && unitMapping[newProduct.UnitConversion4] || importUnitMapping[newProduct['UnitConversionName4']][0];
                      newProduct.UnitConversion5 = newProduct.UnitConversion5 && unitMapping[newProduct.UnitConversion5] || importUnitMapping[newProduct['UnitConversionName5']][0];

                      newProduct.UnitConversionName1 = this.commonService.getObjectText(newProduct.UnitConversion1);
                      newProduct.UnitConversionName2 = this.commonService.getObjectText(newProduct.UnitConversion2);
                      newProduct.UnitConversionName3 = this.commonService.getObjectText(newProduct.UnitConversion3);
                      newProduct.UnitConversionName4 = this.commonService.getObjectText(newProduct.UnitConversion4);
                      newProduct.UnitConversionName5 = this.commonService.getObjectText(newProduct.UnitConversion5);

                      for (const oldProduct of currentProductList) {
                        if (newProduct.Sku) {
                          if (oldProduct.Sku == newProduct.Sku) {
                            newProduct.Code = oldProduct.Code;
                            newProduct.duplicate = true;
                            newProduct.OldName = oldProduct.Name;
                            newProduct.FeaturePicture = oldProduct.FeaturePicture;
                            duplicate = true
                            break;
                          }
                        } else {
                          if (oldProduct.Name && newProduct.Name && (this.commonService.smartFilter(oldProduct.Name, newProduct.Name) || this.commonService.smartFilter(newProduct.Name, oldProduct.Name))) {
                            newProduct.duplicate = true;
                            newProduct.import = false;
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
                        if (this.commonService.getObjectId(newProduct.WarehouseUnit)) {
                          newProduct.import = true;
                        }
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
      const newProductList = [];
      const updatePriceProductList = [];
      const allProductList = [];
      this.gridApi.forEachNode((rowNode, index) => {
        // console.log(rowNode, index);
        const newProduct = rowNode.data;
        allProductList.push(newProduct);
        if (newProduct.WarehouseUnit && this.commonService.getObjectId(newProduct.WarehouseUnit)) {
          newProduct.UnitConversions = [];
          newProduct.UnitConversions.push({
            Unit: newProduct.WarehouseUnit,
            ConversionRatio: 1,
            IsManageByAccessNumber: newProduct.IsManageByAccessNumber,
          });
          if (newProduct.UnitConversion1) {
            newProduct.UnitConversions.push({
              Unit: newProduct.UnitConversion1,
              ConversionRatio: newProduct.ConversionRatio1,
              IsManageByAccessNumber: newProduct.IsManageByAccessNumber1 || false,
            });
          }
          if (newProduct.UnitConversion2) {
            newProduct.UnitConversions.push({
              Unit: newProduct.UnitConversion2,
              ConversionRatio: newProduct.ConversionRatio2,
              IsManageByAccessNumber: newProduct.IsManageByAccessNumber2 || false,
            });
          }
          if (newProduct.UnitConversion3) {
            newProduct.UnitConversions.push({
              Unit: newProduct.UnitConversion3,
              ConversionRatio: newProduct.ConversionRatio3,
              IsManageByAccessNumber: newProduct.IsManageByAccessNumber3 || false,
            });
          }
          if (newProduct.import) {
            // console.log(newProduct);
            delete newProduct.UnitConversion1;
            delete newProduct.UnitConversion2;
            delete newProduct.UnitConversion3;
            delete newProduct.ConversionRatio1;
            delete newProduct.ConversionRatio2;
            delete newProduct.ConversionRatio3;
            newProduct.index = index;
            newProductList.push(newProduct);
          } else {

          }
        }

        if (newProduct.updatePrice) {
          updatePriceProductList.push(newProduct);
        }
      });

      // console.log(newProductList);
      if (newProductList.length > 0) {
        const createdProducts = await this.apiService.putPromise<ProductModel[]>('/admin-product/products', {}, newProductList);
        for (const i in createdProducts) {
          newProductList[i].Code = createdProducts[i].Code;
          newProductList[i].Sku = createdProducts[i].Sku;
          const node = this.gridApi.getDisplayedRowAtIndex(newProductList[i].index);
          node.setDataValue('Sku', createdProducts[i].Sku);
          node.setDataValue('Code', createdProducts[i].Code);
          node.setDataValue('import', false);
        }
        this.commonService.toastService.show('Đã import thông tin sản phẩm', 'Import thành công', { status: 'success' });
        console.log(newProductList);
      }

      // Update price
      if (updatePriceProductList.length > 0) {
        await this.apiService.putPromise('/sales/master-price-table-details', {}, updatePriceProductList.map(m => {
          return {
            MasterPriceTable: 'default',
            Product: this.commonService.getObjectId(m.Code),
            Unit: this.commonService.getObjectId(m.WarehouseUnit),
            Price: m.SalesPrice,
          };
        }));
        this.commonService.toastService.show('Đã cập nhật giá mới', 'Cập nhật giá', { status: 'success' });
      }

      // Export update data
      for (const i in allProductList) {
        this.sheet[i][this.mapping['Sku']] = allProductList[i].Sku;
        this.sheet[i][this.mapping['Code']] = allProductList[i].Code;

        this.sheet[i][this.mapping['WarehouseUnit']] = this.commonService.getObjectId(allProductList[i].WarehouseUnit);
        this.sheet[i][this.mapping['WarehouseUnitName']] = allProductList[i].WarehouseUnitName;

        this.sheet[i][this.mapping['UnitConversion1']] = this.commonService.getObjectId(allProductList[i].UnitConversion1);
        this.sheet[i][this.mapping['UnitConversionName1']] = allProductList[i].UnitConversion1Name;
        this.sheet[i][this.mapping['ConversionRatio1']] = allProductList[i].ConversionRatio1;
        this.sheet[i][this.mapping['IsDefaultSales1']] = allProductList[i].IsDefaultSales1 && 1 || 0;
        this.sheet[i][this.mapping['IsDefaultPurchase1']] = allProductList[i].IsDefaultPurchase1 && 1 || 0;
        this.sheet[i][this.mapping['IsManageByAccessNumber1']] = allProductList[i].IsManageByAccessNumber1 && 1 || 0;
        this.sheet[i][this.mapping['IsAutoAdjustInventory1']] = allProductList[i].IsAutoAdjustInventory1 && 1 || 0;
        this.sheet[i][this.mapping['IsExpirationGoods1']] = allProductList[i].IsExpirationGoods1 && 1 || 0;

        this.sheet[i][this.mapping['UnitConversion2']] = this.commonService.getObjectId(allProductList[i].UnitConversion2);
        this.sheet[i][this.mapping['UnitConversionName2']] = allProductList[i].UnitConversionName2;
        this.sheet[i][this.mapping['ConversionRatio2']] = allProductList[i].ConversionRatio2;
        this.sheet[i][this.mapping['IsDefaultSales2']] = allProductList[i].IsDefaultSales2 && 1 || 0;
        this.sheet[i][this.mapping['IsDefaultPurchase2']] = allProductList[i].IsDefaultPurchase2 && 1 || 0;
        this.sheet[i][this.mapping['IsManageByAccessNumber2']] = allProductList[i].IsManageByAccessNumber2 && 1 || 0;
        this.sheet[i][this.mapping['IsAutoAdjustInventory2']] = allProductList[i].IsAutoAdjustInventory2 && 1 || 0;
        this.sheet[i][this.mapping['IsExpirationGoods2']] = allProductList[i].IsExpirationGoods2 && 1 || 0;

        this.sheet[i][this.mapping['UnitConversion3']] = this.commonService.getObjectId(allProductList[i].UnitConversion3);
        this.sheet[i][this.mapping['UnitConversionName3']] = allProductList[i].UnitConversionName3;
        this.sheet[i][this.mapping['ConversionRatio3']] = allProductList[i].ConversionRatio3;
        this.sheet[i][this.mapping['IsDefaultSales3']] = allProductList[i].IsDefaultSales3 && 1 || 0;
        this.sheet[i][this.mapping['IsDefaultPurchase3']] = allProductList[i].IsDefaultPurchase3 && 1 || 0;
        this.sheet[i][this.mapping['IsManageByAccessNumber3']] = allProductList[i].IsManageByAccessNumber3 && 1 || 0;
        this.sheet[i][this.mapping['IsAutoAdjustInventory3']] = allProductList[i].IsAutoAdjustInventory3 && 1 || 0;
        this.sheet[i][this.mapping['IsExpirationGoods3']] = allProductList[i].IsExpirationGoods3 && 1 || 0;

        this.sheet[i][this.mapping['UnitConversion4']] = this.commonService.getObjectId(allProductList[i].UnitConversion4);
        this.sheet[i][this.mapping['UnitConversionName4']] = allProductList[i].UnitConversionName4;
        this.sheet[i][this.mapping['ConversionRatio4']] = allProductList[i].ConversionRatio4;
        this.sheet[i][this.mapping['IsDefaultSales4']] = allProductList[i].IsDefaultSales4 && 1 || 0;
        this.sheet[i][this.mapping['IsDefaultPurchase4']] = allProductList[i].IsDefaultPurchase4 && 1 || 0;
        this.sheet[i][this.mapping['IsManageByAccessNumber4']] = allProductList[i].IsManageByAccessNumber4 && 1 || 0;
        this.sheet[i][this.mapping['IsAutoAdjustInventory4']] = allProductList[i].IsAutoAdjustInventory4 && 1 || 0;
        this.sheet[i][this.mapping['IsExpirationGoods4']] = allProductList[i].IsExpirationGoods4 && 1 || 0;

        this.sheet[i][this.mapping['UnitConversion5']] = this.commonService.getObjectId(allProductList[i].UnitConversion5);
        this.sheet[i][this.mapping['UnitConversionName5']] = allProductList[i].UnitConversionName5;
        this.sheet[i][this.mapping['ConversionRatio5']] = allProductList[i].ConversionRatio5;
        this.sheet[i][this.mapping['IsDefaultSales5']] = allProductList[i].IsDefaultSales5 && 1 || 0;
        this.sheet[i][this.mapping['IsDefaultPurchase5']] = allProductList[i].IsDefaultPurchase5 && 1 || 0;
        this.sheet[i][this.mapping['IsManageByAccessNumber5']] = allProductList[i].IsManageByAccessNumber5 && 1 || 0;
        this.sheet[i][this.mapping['IsAutoAdjustInventory5']] = allProductList[i].IsAutoAdjustInventory5 && 1 || 0;
        this.sheet[i][this.mapping['IsExpirationGoods5']] = allProductList[i].IsExpirationGoods5 && 1 || 0;
      }

      // Include column name into header

      // Export mapping file
      this.workBook.Sheets[this.chooseSheet] = XLSX.utils.json_to_sheet(this.sheet);
      XLSX.writeFile(this.workBook, this.fileName);


      this.processing = false;
    } catch (err) {
      this.processing = false;
      this.commonService.toastService.show('Đã xảy ra lỗi trong quá trình import', 'Lỗi import', { status: 'danger' });
    }
  }

  close() {
    this.ref.close();
  }

}
