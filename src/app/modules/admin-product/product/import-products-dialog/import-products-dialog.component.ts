import { ShowcaseDialogComponent } from './../../../dialog/showcase-dialog/showcase-dialog.component';
import { ProductUnitModel } from '../../../../models/product.model';
import { WarehouseGoodsContainerModel, WarehouseInventoryAdjustNoteDetailModel, WarehouseInventoryAdjustNoteModel } from '../../../../models/warehouse.model';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService, NbDialogRef, NbGlobalPhysicalPosition, NbThemeService } from '@nebular/theme';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { environment } from '../../../../../environments/environment';
import { ActionControlListOption } from '../../../../lib/custom-element/action-control-list/action-control.interface';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { ContactModel } from '../../../../models/contact.model';
import { ProductModel } from '../../../../models/product.model';
import { SalesVoucherModel } from '../../../../models/sales.model';
import { TaxModel } from '../../../../models/tax.model';
import { UnitModel } from '../../../../models/unit.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { Module, AllCommunityModules, GridApi, ColumnApi, IDatasource, IGetRowsParams, ColDef, RowNode, CellClickedEvent, CellDoubleClickedEvent, SuppressKeyboardEventParams, ICellRendererParams } from '@ag-grid-community/all-modules';
import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
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
        field: 'Image',
        width: 100,
        filter: 'agTextColumnFilter',
        // pinned: 'left',
        autoHeight: true,
        cellRenderer: 'imageRender',
      },
      {
        headerName: 'Import',
        field: 'import',
        width: 110,
        filter: 'agTextColumnFilter',
        pinned: 'left',
        cellRenderer: 'ckbCellRenderer',
        cellRendererParams: {
          changed: (checked: boolean, params: { node: RowNode, data: ProductModel, api: GridApi } & { [key: string]: any }) => {
            // alert(`${field} was clicked`);
            console.log(params);

            // Remove row
            // params.api.applyTransaction({ remove: [params.node.data] });
            if(checked) {
              params.node.setDataValue('Sku', null);
            } else {
              params.node.setDataValue('Sku', params.data.OldSku);
            }
          },
        },
      },
      {
        headerName: 'Duplicate',
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
      {
        headerName: 'Old Sku',
        field: 'OldSku',
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
        headerName: 'Đơn vị tính cơ bản',
        field: 'WarehouseUnit',
        width: 150,
        filter: 'agTextColumnFilter',
        cellRenderer: 'textRender',
        // pinned: 'right',
      },
      {
        headerName: 'Đơn vị chuyển đổi 1',
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
        headerName: 'Đơn vị chuyển đổi 2',
        field: 'UnitConversion2',
        width: 150,
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
        headerName: 'Đơn vị chuyển đổi 3',
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
        headerName: 'Giá EU',
        field: 'Price',
        width: 110,
        filter: 'agTextColumnFilter',
        cellRenderer: 'textRender',
        // pinned: 'right',
      },
      {
        headerName: 'ID',
        field: 'Product',
        width: 110,
        filter: 'agTextColumnFilter',
        // pinned: 'left',
        cellRenderer: 'idRender',
      },
      {
        headerName: 'Action',
        field: 'id',
        width: 110,
        filter: 'agTextColumnFilter',
        pinned: 'right',
        cellRenderer: 'btnCellRenderer',
        cellRendererParams: {
          clicked: (params: { node: RowNode, data: ProductModel, api: GridApi } & { [key: string]: any }) => {
            // alert(`${field} was clicked`);
            console.log(params);

            // Remove row
            params.api.applyTransaction({ remove: [params.node.data] });

          },
        },
      },
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
      this.actionButtonList.unshift({
        name: 'chooseFile',
        status: 'primary',
        label: this.commonService.textTransform(this.commonService.translate.instant('Choose file'), 'head-title'),
        icon: 'copy-outline',
        title: this.commonService.textTransform(this.commonService.translate.instant('Choose file'), 'head-title'),
        size: 'medium',
        disabled: () => false,
        hidden: () => false,
        click: () => {

          return false;
        },
      });
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
    return this.commonService.getObjectId(item.Product) + '-' + this.commonService.getObjectId(item.Unit);
  }
  public getRowStyle = (params: { node: RowNode }) => {
    // if (params.node.rowIndex == this.activeDetailIndex) {
    //   return { background: '#ffc107' };
    // }
  };

  public cellDoubleClicked = (params: CellDoubleClickedEvent) => {
    console.log(params);
    // const shelf = this.commonService.getObjectId(this.array.controls[0].get('Shelf').value);
    // if (params.colDef.field == 'Shelf' || params.colDef.field == 'Container') {
    //   if (!params.data.Containers || params.data.Containers.length == 0) {


    //   } else {
    //   }
    // }
    // if (params.colDef.field == 'AccessNumbers') {
    //   this.commonService.showDialog('Số truy xuất', Array.isArray(params.data.AccessNumbers) ? params.data.AccessNumbers.join(', ') : '', []);
    // }
    if (params.colDef.field == 'duplicate') {
      this.commonService.showDialog('Xử lý trùng', 'Bạn có muốn xác nhận lại trạng thái trùng không ?', [
        {
          label: 'Trùng',
          action: () => {
            params.data.duplicate = true;
            params.api.applyTransaction({update: [params.data]});
          }
        },
        {
          label: 'Không trùng',
          action: () => {
            params.data.duplicate = false;
            params.api.applyTransaction({update: [params.data]});

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
      // if (params.colDef.field == 'Shelf' || params.colDef.field == 'Container') {
      //   if (!this.commonService.getObjectId(params.value) || typeof this.commonService.getObjectId(params.value) == 'undefined') {
      //     return 'Double click để thay đổi vị trí';
      //   }
      // }
      // if (params.colDef.field == 'Warehouse') {
      //   return this.commonService.getObjectText(params.data.Warehouse);
      // }
      // if (params.colDef.field == 'Sku') {
      //   return params.data.Product?.Sku;
      // }
      // if (Array.isArray(params.value)) {
      //   return params.value.map(m => this.commonService.getObjectText(m)).join(', ');
      // } else {
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
    // btnCellRenderer: (params) => {
    //   return `<button onClick={this.btnClickedHandler}>Remove</button>`;
    // },
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
      // this.commonService.takeUntil('reload-contact-list', 500, () => this.gridApi.setDatasource(this.dataSource));

      let details: ProductModel[] = (this.array || []).map((detail: ProductModel) => {
        // if (detail.Container) {
        //   detail.Shelf = { id: detail.Container.Shelf, text: detail.Container.ShelfName };
        // }
        // detail.AccessNumbers = detail.AccessNumbers ? detail.AccessNumbers.map(m => this.commonService.getObjectId(m)) : [];
        return detail;
      });
      this.gridApi.setRowData(details);
      // this.gridApi.applyTransaction({
      //   add: details
      // });

    }

  }

  initDataSource() {
    this.dataSource = {
      rowCount: null,
      getRows: (getRowParams: IGetRowsParams) => {
        console.info('asking for ' + getRowParams.startRow + ' to ' + getRowParams.endRow);

        // const query = { limit: this.paginationPageSize, offset: getRowParams.startRow };
        // getRowParams.sortModel.forEach(sortItem => {
        //   query['sort_' + sortItem['colId']] = sortItem['sort'];
        // });
        // Object.keys(getRowParams.filterModel).forEach(key => {
        //   const condition: { filter: string, filterType: string, type: string } = getRowParams.filterModel[key];
        //   query['filter_' + key] = condition.filter;
        // });

        // query['noCount'] = true;
        // query['filter_AddressList'] = this.id[0] ? this.id[0] : 'X';

        // new Promise<(ProductModel & { Message?: string })[]>((resolve2, reject2) => {
        //   // if (this.updateMode === 'live' || this.smsSendList.length === 0) {
        //   this.apiService.getPromise<ProductModel[]>('/email-marketing/address-list-details', query).then(emailAddressListDetails => {
        //     emailAddressListDetails.forEach((item, index) => {
        //       item['No'] = (getRowParams.startRow + index + 1);
        //       item['id'] = item[this.idKey];
        //     });

        //     this.emailAddressListDetails = emailAddressListDetails;
        //     resolve2(emailAddressListDetails);

        //   }).catch(e => reject2(e));
        // }).then(details => {
        let details: ProductModel[] = (this.array as []).slice(getRowParams.startRow, getRowParams.endRow);
        // for (let i = 0; i < 100; i++) {
        //   // for (const detail of details) {
        //   details.push({ Code: new Date().getTime() + i, No: details.length + 1, Description: '23432432432' });
        //   // }
        // }
        let lastRow = -1;
        if (details.length < this.paginationPageSize) {
          lastRow = getRowParams.startRow + details.length;
        }
        getRowParams.successCallback(details, lastRow);
        this.gridApi.resetRowHeights();
        // const allColumnIds: string[] = [];
        // this.gridColumnApi.getAllColumns()!.forEach((column) => {
        //   allColumnIds.push(column.getId());
        // });
        // this.gridColumnApi.sizeColumnsToFit(allColumnIds);
        // });

      },
    };
  }
  /** End AG-Grid */

  onFileChange(ev: any) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = async (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      // const objectCode = formItem.get('Supplier').value.id;
      // if (!objectCode) {
      //   this.commonService.toastService.show('Bạn cần chọn nhà cung cấp trước để xác định chính xác SKU', 'Chưa đủ thông tin', {
      //     status: 'warning',
      //     hasIcon: true,
      //     position: NbGlobalPhysicalPosition.TOP_RIGHT,
      //     duration: 0,
      //   });
      //   return false;
      // }
      const sheets = Object.keys(jsonData);
      let sheet: any[] = null;
      if (sheets.length > 1) {
        sheet = await new Promise((resove, reject) => {
          this.commonService.openDialog(DialogFormComponent, {
            context: {
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
                  initValue: sheets[0],
                  // focus: true,
                  option: {
                    data: sheets.map(m => ({ id: m, text: m })),
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
                    resove(jsonData[this.commonService.getObjectId(form.get('Sheet').value)]);

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
        sheet = jsonData[sheets[0]];
      }

      // const productList: any[] = sheet;

      // Confirm mapping
      const columnList = Object.keys(sheet[0]).map(m => ({ id: m, text: m }));
      this.commonService.openDialog(DialogFormComponent, {
        context: {
          cardStyle: { width: '500px' },
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
              placeholder: 'Chọn sku...',
              type: 'select2',
              initValue: 'Sku',
              // focus: true,
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
              placeholder: 'Chọn tên sản phẩm...',
              type: 'select2',
              initValue: 'Name',
              // focus: true,
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
              placeholder: 'Chọn đơn vị tính cơ bản...',
              type: 'select2',
              initValue: 'WarehouseUnit',
              // focus: true,
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
              name: 'UnitConversion1',
              label: 'Đơn vị tính chuyển đổi 1',
              placeholder: 'Chọn đơn vị tính chuyển đổi 1...',
              type: 'select2',
              initValue: 'UnitConversion1',
              // focus: true,
              option: {
                data: columnList,
                placeholder: 'Chọn đơn vị tính chuyển đổi 1...',
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
              name: 'ConversionRatio1',
              label: 'Tỷ lệ chuyển đổi 1',
              placeholder: 'Chọn tỷ lệ chuyển đổi 1...',
              type: 'select2',
              initValue: 'ConversionRatio1',
              // focus: true,
              option: {
                data: columnList,
                placeholder: 'Chọn tỷ lệ chuyển đổi 1...',
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
              name: 'UnitConversion2',
              label: 'Đơn vị tính chuyển đổi 2',
              placeholder: 'Chọn đơn vị tính chuyển đổi 2...',
              type: 'select2',
              initValue: 'UnitConversion2',
              // focus: true,
              option: {
                data: columnList,
                placeholder: 'Chọn đơn vị tính chuyển đổi 2...',
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
              name: 'ConversionRatio2',
              label: 'Tỷ lệ chuyển đổi 2',
              placeholder: 'Chọn tỷ lệ chuyển đổi 2...',
              type: 'select2',
              initValue: 'ConversionRatio2',
              // focus: true,
              option: {
                data: columnList,
                placeholder: 'Chọn tỷ lệ chuyển đổi 2...',
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
              name: 'Price',
              label: 'Giá EU',
              placeholder: 'Chọn giá EU...',
              type: 'select2',
              initValue: 'Price',
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

                const mapping = form.value;
                for (const column in columnList) {
                  mapping[column] = this.commonService.getObjectId(mapping[mapping]);
                }

                console.log(form.value);


                this.array = sheet.map((row: any, index: number) => {
                  const mappedRow = {
                    No: index + 1,
                    Sku: row[mapping['Sku']],
                    Name: row[mapping['Name']],
                    WarehouseUnit: row[mapping['WarehouseUnit']],
                    UnitConversion1: row[mapping['UnitConversion1']],
                    ConversionRatio1: row[mapping['ConversionRatio1']],
                    UnitConversion2: row[mapping['UnitConversion2']],
                    ConversionRatio2: row[mapping['ConversionRatio2']],
                    UnitConversion3: row[mapping['UnitConversion3']],
                    ConversionRatio3: row[mapping['ConversionRatio3']],
                    Price: row[mapping['Price']],
                  };

                  return mappedRow;

                });

                // Confirm unit mapping
                const unitList = await this.apiService.getPromise<any[]>('/admin-product/units', { includeIdText: true, limit: 'nolimit' });
                let importUnitsUnique = new Set([
                  ...this.array.map(m => m.WarehouseUnit),
                  ...this.array.map(m => m.UnitConversion1),
                  ...this.array.map(m => m.UnitConversion2),
                  ...this.array.map(m => m.UnitConversion3),
                ]);
                let unitMapping: { [key: string]: any[] } = {};
                for (const unit of importUnitsUnique) {
                  if (!unitMapping[unit]) {
                    unitMapping[unit] = [];
                  }
                  unitMapping[unit] = [
                    ...unitMapping[unit],
                    ...unitList.filter(f => f.Name == unit) || [unit],
                  ];
                }

                const currentProductList = await this.apiService.getPromise<ProductModel[]>('/admin-product/products', { limit: 'nolimit' });
                for (const newProduct of this.array) {
                  let duplicate = false;
                  for (const oldProduct of currentProductList) {
                    if (newProduct.Sku) {
                      if (oldProduct.Sku == newProduct.Sku) {
                        newProduct.duplicate = true;
                        newProduct.import = false;
                        newProduct.OldName = oldProduct.Name;
                        duplicate = true
                        break;
                      }
                    } else {
                      if (oldProduct.Name && newProduct.Name && (this.commonService.smartFilter(oldProduct.Name, newProduct.Name) || this.commonService.smartFilter(newProduct.Name, oldProduct.Name))) {
                        newProduct.duplicate = true;
                        newProduct.import = false;
                        newProduct.OldName = oldProduct.Name;
                        newProduct.Sku = oldProduct.Sku;
                        newProduct.OldSku = oldProduct.Sku;
                        duplicate = true;
                        break;
                      }
                    }
                  }
                  if (!duplicate) {
                    newProduct.duplicate = false;
                    newProduct.import = true;
                  }
                }

                // return;
                // this.commonService.openDialog(DialogFormComponent, {
                //   context: {
                //     cardStyle: { width: '500px' },
                //     title: 'Mời bạn chọn đơn vị tính cho khớp và xác nhận',
                //     onInit: async (form, dialog) => {
                //       // const sku = form.get('Sku');
                //       // sheet.setValue('Sku');
                //       return true;
                //     },
                //     controls: [
                //       {
                //         name: 'Sku',
                //         label: 'Sku',
                //         placeholder: 'Chọn sku...',
                //         type: 'select2',
                //         initValue: 'Sku',
                //         // focus: true,
                //         option: {
                //           data: columnList,
                //           placeholder: 'Chọn sku...',
                //           allowClear: true,
                //           width: '100%',
                //           dropdownAutoWidth: true,
                //           minimumInputLength: 0,
                //           withThumbnail: false,
                //           keyMap: {
                //             id: 'id',
                //             text: 'text',
                //           },
                //         }
                //       },
                //     ],
                //     actions: [
                //       {
                //         label: 'Esc - Trở về',
                //         icon: 'back',
                //         status: 'basic',
                //         keyShortcut: 'Escape',
                //         action: () => { return true; },
                //       },
                //       {
                //         label: 'Xác nhận',
                //         icon: 'generate',
                //         status: 'success',
                //         // keyShortcut: 'Enter',
                //         action: (form: FormGroup, formDialogConpoent: DialogFormComponent) => {
                //           return true;
                //         },
                //       },
                //     ],
                //   },
                //   closeOnEsc: false,
                //   closeOnBackdropClick: false,
                // });

                console.log(this.array);
                this.loadList();


                // formDialogConpoent.dismiss();

                return true;
              },
            },
          ],
        },
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    };
    reader.readAsBinaryString(file);
  }

  close() {
    this.ref.close();
  }

}
