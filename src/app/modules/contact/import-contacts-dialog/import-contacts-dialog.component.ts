import { FileModel } from '../../../models/file.model';
import { CurrencyPipe } from '@angular/common';
import { filter, take, takeUntil } from 'rxjs/operators';
import { AdminProductService } from '../../admin-product/admin-product.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogRef, NbThemeService } from '@nebular/theme';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
// import { Module, AllCommunityModules, GridApi, ColumnApi, IDatasource, IGetRowsParams, ColDef, RowNode, CellDoubleClickedEvent, SuppressKeyboardEventParams, ValueFormatterParams } from '@ag-grid-community/all-modules';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../lib/base-component';
import * as XLSX from 'xlsx';
import { DialogFormComponent } from '../../dialog/dialog-form/dialog-form.component';
import { ImportProductMapFormComponent } from '../../admin-product/product/import-product-map-form/import-product-map-form.component';
import { CellDoubleClickedEvent, ColDef, ColumnApi, GridApi, IDatasource, IGetRowsParams, IRowNode, Module, RowNode, SuppressKeyboardEventParams, ValueFormatterParams } from '@ag-grid-community/core';
import { AgCheckboxCellRenderer } from '../../../lib/custom-element/ag-list/cell/checkbox.component';
import { CustomHeader } from '../../../lib/custom-element/ag-list/header/custom.component';
import { AgDynamicListComponent } from '../../general/ag-dymanic-list/ag-dymanic-list.component';
import { agMakeSelectionColDef } from '../../../lib/custom-element/ag-list/column-define/selection.define';
import { agMakeImageColDef } from '../../../lib/custom-element/ag-list/column-define/image.define';
import { agMakeCommandColDef } from '../../../lib/custom-element/ag-list/column-define/command.define';
import { ActionControl } from '../../../lib/custom-element/action-control-list/action-control.interface';
import { AgTextCellRenderer } from '../../../lib/custom-element/ag-list/cell/text.component';
import { agMakeCurrencyColDef } from '../../../lib/custom-element/ag-list/column-define/currency.define';
import { RootServices } from '../../../services/root.services';
import { AgDateCellRenderer } from '../../../lib/custom-element/ag-list/cell/date.component';
import { AgSelect2Filter } from '../../../lib/custom-element/ag-list/filter/select2.component.filter';
import { ContactGroupModel, ContactModel } from '../../../models/contact.model';
// import { AgGridColumn } from '@ag-grid-community/angular';
var CryptoJS = require("crypto-js");

@Component({
  selector: 'ngx-import-contacts-dialog',
  templateUrl: './import-contacts-dialog.component.html',
  styleUrls: ['./import-contacts-dialog.component.scss'],
  providers: [CurrencyPipe],
})
export class ImportContactsDialogComponent extends BaseComponent implements OnInit, AfterViewInit {

  componentName: string = 'ImportContactsDialogComponent';
  @Input() inputMode: 'dialog' | 'page' | 'inline';
  @Input() inputProducts: ContactModel[];
  @Input() onDialogSave: (newData: ContactModel[]) => void;
  @Input() onDialogClose: () => void;

  @ViewChild('agProductList') agProductList: AgDynamicListComponent<any>;

  constructor(
    public rsv: RootServices,
    public cms: CommonService,
    public router: Router,
    public apiService: ApiService,
    public themeService: NbThemeService,
    public formBuilder: FormBuilder,
    public adminProductService: AdminProductService,
    public currencyPipe: CurrencyPipe,
    public ref?: NbDialogRef<ImportContactsDialogComponent>,
  ) {
    super(rsv, cms, router, apiService);

    /** AG-Grid */
    this.updateGridColumn();

    this.pagination = false;
    this.maxBlocksInCache = 5;
    this.paginationPageSize = this.cacheBlockSize = 1000;
    /** End AG-Grid */

    // this.array = this.formBuilder.control([]);

  }

  configFormGroup: FormGroup = null;
  config = { IsMapByContactName: false };
  themeName = this.themeService.currentTheme == 'default' ? '' : this.themeService.currentTheme;
  processing = false;
  array: ContactModel[];

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

  contactGroupList: ContactGroupModel[] = [];
  async init() {
    await this.adminProductService.unitList$.pipe(filter(f => !!f), take(1)).toPromise();
    this.contactGroupList = await this.apiService.getPromise<ContactGroupModel[]>('/contact/groups', { includeIdText: true });
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
  productActionButtonList: ActionControl[] = [];
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
  public rowData: ContactModel[];
  public gridParams;
  public multiSortKey = 'ctrl';
  public rowDragManaged = false;
  public getRowHeight;
  public rowHeight: number = 50;
  public hadRowsSelected = false;
  public pagination: boolean;
  public emailAddressListDetails: ContactModel[] = [];
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
  public getRowNodeId = (item: ContactModel) => {
    // return this.cms.getObjectId(item.Sku) + '-' + this.cms.getObjectId(item.WarehouseUnit);
    return item.No;
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
    // loadingCellRenderer: (params) => {
    //   if (params.value) {
    //     return params.value;
    //   } else {
    //     return '<img src="assets/images/loading.gif">';
    //   }
    // },
    // textRender: (params) => {

    //   if (params.colDef.field == 'duplicate') {
    //     return params.value && 'Trùng ?' || '';
    //   }
    //   if (Array.isArray(params.value)) {
    //     return params.value.map(m => this.cms.getObjectText(m)).join(', ');
    //   }
    //   return this.cms.getObjectText(params.value);
    //   // }
    // },
    // idRender: (params) => {
    //   if (Array.isArray(params.value)) {
    //     return params.value.map(m => this.cms.getObjectId(m)).join(', ');
    //   } else {
    //     return this.cms.getObjectId(params.value);
    //   }
    // },
    // numberRender: (params) => {
    //   return params.value;
    // },
    // imageRender: (params) => {
    //   let image = params.value;
    //   if (Array.isArray(params.value)) {
    //     image = params.value[0];
    //   }
    //   if (typeof image == 'string') {
    //     return '<img style="height: 45px" src="' + image + '">';
    //   }
    //   return image && image?.Thumbnail ? ('<img style="height: 45px" src="' + image?.Thumbnail + '">') : '';
    // },

    // btnCellRenderer: AgButtonCellRenderer,
    // ckbCellRenderer: AgCheckboxCellRenderer,
    // agColumnHeader: CustomHeader,
  };
  onGridReady(params) {
    this.gridParams = params;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // this.updateGridColumn();
    this.productActionButtonList = [];
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

  loadList(callback?: (list: ContactModel[]) => void) {

    if (this.gridApi) {


      let details: ContactModel[] = (this.array || []).map((detail: ContactModel) => {

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

        let details: ContactModel[] = (this.array as []).slice(getRowParams.startRow, getRowParams.endRow);

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
        ...agMakeSelectionColDef(this.cms),
        headerName: 'ID',
        field: 'Id',
        width: 100,
        valueGetter: 'node.data.Id',
        // sortingOrder: ['desc', 'asc'],
        initialSort: 'desc',
      },
      {
        headerName: 'Mã',
        field: 'Code',
        width: 200,
        filter: 'agTextColumnFilter',
        // pinned: 'left',
      },
      {
        headerName: 'Tên',
        field: 'Name',
        width: 200,
        filter: 'agTextColumnFilter',
        autoHeight: true,
        // pinned: 'left',
      },
      {
        headerName: 'Số điện thoại',
        field: 'Phone',
        width: 200,
        filter: 'agTextColumnFilter',
        autoHeight: true,
        // pinned: 'left',
      },
      {
        headerName: 'Email',
        field: 'Email',
        width: 200,
        filter: 'agTextColumnFilter',
        autoHeight: true,
        // pinned: 'left',
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
            ...this.cms.makeSelect2AjaxOption('/contact/groups', { includeIdText: true, includeGroups: true, sort_Name: 'asc' }, {
              placeholder: 'Chọn nhóm...', limit: 10, prepareReaultItem: (item) => {
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
        headerName: 'Address',
        field: 'Address',
        width: 200,
        filter: 'agTextColumnFilter',
        autoHeight: true,
        // pinned: 'left',
      },
      {
        headerName: 'Full Address',
        field: 'FullAddress',
        width: 200,
        filter: 'agTextColumnFilter',
        autoHeight: true,
        // pinned: 'left',
      },
      {
        headerName: 'Ghi chú',
        field: 'Note',
        width: 300,
        filter: 'agTextColumnFilter',
        autoHeight: true,
      },
      {
        headerName: 'Import',
        field: 'IsImport',
        width: 90,
        filter: 'agTextColumnFilter',
        pinned: 'right',
        // headerCheckboxSelection: true,
        // agColumnHeader: CustomHeader,
        cellRenderer: AgCheckboxCellRenderer,
        cellRendererParams: {
          changed: (checked: boolean, params: { node: RowNode, data: ContactModel, api: GridApi } & { [key: string]: any }) => {
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
        width: 150,
        filter: 'agTextColumnFilter',
        pinned: 'right',
        autoHeight: true,
      },
      {
        headerName: 'Result',
        field: 'Result',
        width: 150,
        filter: 'agTextColumnFilter',
        pinned: 'right',
        autoHeight: true,
      },
      {
        headerName: 'Message',
        field: 'Message',
        width: 150,
        filter: 'agTextColumnFilter',
        pinned: 'right',
        autoHeight: true,
      },
      // {
      //   headerName: 'Người tạo',
      //   field: 'Creator',
      //   // pinned: 'left',
      //   width: 200,
      //   cellRenderer: AgTextCellRenderer,
      //   filter: AgSelect2Filter,
      //   filterParams: {
      //     select2Option: {
      //       ...this.cms.makeSelect2AjaxOption('/user/users', { includeIdText: true, includeGroups: true, sort_SearchRank: 'desc' }, {
      //         placeholder: 'Chọn người tạo...', limit: 10, prepareReaultItem: (item) => {
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
      // {
      //   headerName: 'Ngày tạo',
      //   field: 'Created',
      //   width: 180,
      //   filter: 'agDateColumnFilter',
      //   filterParams: {
      //     inRangeFloatingFilterDateFormat: 'DD/MM/YY',
      //   },
      //   cellRenderer: AgDateCellRenderer,
      // },
    ];

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

  compareContact(oldProduct: ContactModel, newProduct: ContactModel) {
    if (this.config.IsMapByContactName) {
      return newProduct.Code &&
        (oldProduct.Code?.toLowerCase() == newProduct.Code?.toLowerCase())
        || (oldProduct.Name && newProduct.Name
          && (this.cms.smartFilter(oldProduct.Name, newProduct.Name) || this.cms.smartFilter(newProduct.Name, oldProduct.Name)));
    } else {
      return (oldProduct.Code && newProduct.Code) ? (oldProduct.Code.trim().toLowerCase() == newProduct.Code.trim().toLowerCase()) : (
        (oldProduct.Phone && newProduct.Phone) ? (oldProduct.Phone.replace(/[^0-9]/, '').toLowerCase() == newProduct.Phone.replace(/[^0-9]/, '').toLowerCase()) : false
      );
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
        // const dataMappiing = columnList;

        // this.cms.openDialog(ImportProductMapFormComponent, {
        //   context: {
        //     columnList: columnList,
        //     onDialogSave: async dataMappiing => {
        try {

          this.mapping = columnList;
          for (const i in this.mapping) {
            // this.mapping[i] = this.cms.getObjectText(this.mapping[i]);
            if (i !== 'UnitConversions' && i !== 'Properties') {
              this.mapping[this.cms.getObjectId(this.mapping[i])] = this.mapping[i]?.colindex;
              delete this.mapping[i];
            }
          }
          // if (Array.isArray(this.mapping['UnitConversions'])) {
          //   for (const unitConverion of this.mapping['UnitConversions']) {
          //     for (const r in unitConverion) {
          //       // unitConverion[r] = this.cms.getObjectText(unitConverion[r]);
          //       unitConverion[r] = unitConverion[r]?.colindex;
          //     }
          //   }
          // }
          // if (Array.isArray(this.mapping['Properties'])) {
          //   for (const property of this.mapping['Properties']) {
          //     for (const r in property) {
          //       // property[r] = this.cms.getObjectText(property[r]);
          //       property[r] = property[r]?.colindex;
          //     }
          //   }
          // }

          // console.log(dataMappiing[0]);

          this.processing = true;

          // Confirm unit mapping
          // const unitList = await this.apiService.getPromise<any[]>('/admin-product/units', { includeIdText: true, limit: 'nolimit' });
          // const unitMapping = {};
          // for (const unit of unitList) {
          //   unitMapping[unit.Code] = unit;
          // }
          // const propertyMapping = {};
          // for (const property of this.adminProductService.propertyList$?.value) {
          //   propertyMapping[property.Code] = property;
          // }
          const currentContactList = await this.apiService.getPromise<ContactModel[]>('/contact/contacts', { limit: 'nolimit' });
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
            // mappedRow['Type'] = mappedRow['Type'] || 'PRODUCT';
            // if (mappedRow['SalesPrice']) {
            //   mappedRow['SalesPrice'] = isNaN(mappedRow['SalesPrice']) ? null : mappedRow['SalesPrice'];
            // }
            // if (mappedRow['Brand']) {
            //   mappedRow['Brand'] = this.adminProductService.brandList$.value.find(f => this.cms.getObjectId(f) == mappedRow['Brand']);
            // }
            // if (mappedRow['Categories']) {
            //   mappedRow['Categories'] = new String(mappedRow['Categories'] || '').split(',').map(m => {
            //     return this.adminProductService.categoryList$.value.find(f => this.cms.getObjectId(f) == m.trim());
            //   }).filter(f => !!f);
            // }
            if (mappedRow['Groups']) {
              mappedRow['Groups'] = new String(mappedRow['Groups'] || '').split(',').map(m => {
                return this.contactGroupList.find(f => this.cms.getObjectId(f) == m.trim());
              }).filter(f => !!f);
            }
            // if (mappedRow['Keywords']) {
            //   mappedRow['Keywords'] = new String(mappedRow['Keywords'] || '').split(',').map(m => m.trim());
            // }

            // mappedRow['WarehouseUnit'] = mappedRow.WarehouseUnit && unitMapping[mappedRow.WarehouseUnit]
            // mappedRow['WarehouseUnitName'] = this.cms.getObjectText(mappedRow['WarehouseUnit']);
            // if (this.mapping['UnitConversions']) {
            //   for (let index = 0; index < this.mapping['UnitConversions'].length; index++) {
            //     for (const r in this.mapping['UnitConversions'][index]) {
            //       mappedRow[r + (index + 1)] = row[this.mapping['UnitConversions'][index][r]];
            //     }
            //     mappedRow['Unit' + (index + 1)] = mappedRow['Unit' + (index + 1)] && unitMapping[mappedRow['Unit' + (index + 1)]];
            //     mappedRow['UnitName' + (index + 1)] = this.cms.getObjectText(mappedRow['Unit' + (index + 1)]);
            //   }
            // }
            // if (this.mapping['Properties']) {
            //   for (let index = 0; index < this.mapping['Properties'].length; index++) {
            //     for (const r in this.mapping['Properties'][index]) {
            //       mappedRow[r + (index + 1)] = row[this.mapping['Properties'][index][r]] || null;
            //     }
            //     if (mappedRow['Property' + (index + 1)]) mappedRow['Property' + (index + 1)] = mappedRow['Property' + (index + 1)] && propertyMapping[mappedRow['Property' + (index + 1)]];
            //     if (mappedRow['PropertyValues' + (index + 1)]) mappedRow['PropertyValues' + (index + 1)] = (mappedRow['PropertyValues' + new String(index + 1)]).split(',').map(m => new String(m).trim());
            //   }
            // }


            let duplicate = false;
            mappedRow.IsNew = false;
            mappedRow.IsImport = true;
            mappedRow.Pictures = new String(mappedRow.Pictures || '').replace('\r\n', '\n').split('\n').filter(f => !!f);
            mappedRow.SameProducts = []
            if ((mappedRow.Name || '').trim().length == 0) {
              mappedRow.IsImport = false;
              mappedRow.Status = 'Rỗng';
            } else {
              for (const oldProduct of currentContactList) {
                // if (mappedRow.Sku) {
                // if (mappedRow.Sku && (oldProduct.Sku?.toLowerCase() == mappedRow.Sku?.toLowerCase()) || (oldProduct.Name && mappedRow.Name && this.cms.convertUnicodeToNormal(oldProduct.Name).toLowerCase() == this.cms.convertUnicodeToNormal(mappedRow.Name).toLowerCase())) {
                if (this.compareContact(oldProduct, mappedRow)) {
                  mappedRow.Code = oldProduct.Code;
                  mappedRow.Phone = oldProduct.Phone;
                  mappedRow.duplicate = true;
                  mappedRow.OldName = ((oldProduct.OldName && (oldProduct.OldName + '\n') || '') + oldProduct.Name);
                  // if (oldProduct.FeaturePicture) {
                  //   if (!mappedRow.FeaturePicture) {
                  //     mappedRow.FeaturePicture = oldProduct.FeaturePicture;
                  //   } else {
                  //     const tag = CryptoJS.MD5(mappedRow.FeaturePicture as any).toString();
                  //     if (oldProduct.FeaturePicture.Tag == tag) {
                  //       mappedRow.FeaturePicture = oldProduct.FeaturePicture;
                  //     }
                  //   }
                  // }

                  // if (oldProduct.Pictures) {
                  //   if ((!mappedRow.Pictures || mappedRow.Pictures.length == 0)) {
                  //     mappedRow.Pictures = oldProduct.Pictures;
                  //   } else {
                  //     for (const p in mappedRow.Pictures) {
                  //       const tag = CryptoJS.MD5(mappedRow.Pictures[p] as any).toString();
                  //       const samePicture = (Array.isArray(oldProduct.Pictures) && oldProduct.Pictures || []).find(f => f.Tag == tag);
                  //       if (samePicture) {
                  //         mappedRow.Pictures[p] = samePicture;
                  //       }
                  //     }
                  //   }
                  // }
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

          // this.array = this.sheet.map(contact => {
          //   contact.Groups = (contact.Groups && contact.Groups.split(',') || []).map(groupId => groupId.trim());
          //   return contact;
          // });

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
        //     }
        //   },
        // });
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
  async importContacts() {
    this.processing = true;
    try {
      const newProductList: ContactModel[] = [];
      const updatePriceProductList: ContactModel[] = [];
      const allProductList: ContactModel[] = [];
      this.gridApi.forEachNode(async (rowNode, index) => {
        // console.log(rowNode, index);
        const newProduct: ContactModel = rowNode.data;
        newProduct.index = index;
        allProductList.push(newProduct);
        if (newProduct.WarehouseUnit && this.cms.getObjectId(newProduct.WarehouseUnit)) {
          newProduct.UnitConversions = [];
          newProduct.Properties = [];

          // if (this.mapping['UnitConversions']) {
          //   for (let r = 0; r < this.mapping['UnitConversions'].length; r++) {
          //     if (this.cms.getObjectId(newProduct['Unit' + (r + 1)])) {
          //       newProduct.UnitConversions.push({
          //         Unit: newProduct['Unit' + (r + 1)],
          //         ConversionRatio: newProduct['ConversionRatio' + (r + 1)],
          //         IsManageByAccessNumber: newProduct['IsManageByAccessNumber' + (r + 1)] && true || false,
          //         IsDefaultSales: newProduct['IsDefaultSales' + (r + 1)] && true || false,
          //         IsDefaultPurchase: newProduct['IsDefaultPurchase' + (r + 1)] && true || false,
          //         IsAutoAdjustInventory: newProduct['IsAutoAdjustInventory' + (r + 1)] && true || false,
          //         IsExpirationGoods: newProduct['IsExpirationGoods' + (r + 1)] && true || false,
          //         UnitPrice: newProduct['UnitPrice' + (r + 1)],
          //       });
          //     }
          //   }
          // }

          // if (this.mapping['Properties']) {
          //   for (let r = 0; r < this.mapping['Properties'].length; r++) {
          //     if (this.cms.getObjectId(newProduct['Property' + (r + 1)]) && newProduct['PropertyValues' + (r + 1)]) {
          //       newProduct.Properties.push({
          //         Property: newProduct['Property' + (r + 1)],
          //         PropertyValues: newProduct['PropertyValues' + (r + 1)],
          //       });
          //     }
          //   }
          // }
          if (newProduct.IsImport) {
            newProductList.push(newProduct);
          }
        }

        // if (newProduct.IsUpdatePrice) {
        //   updatePriceProductList.push(newProduct);
        // }
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
          // if (newProduct.FeaturePicture) {
          //   try {
          //     if (typeof newProduct.FeaturePicture == 'string') {
          //       const tag = CryptoJS.MD5(newProduct.FeaturePicture as any).toString();
          //       // const file = await this.apiService.uploadFileByLink(newProduct.FeaturePicture);
          //       let file = this.uploadedImages[tag];
          //       if (!file) {
          //         this.cms.toastService.show(`${newProduct.Name}`, `Upload hình đại diện`, { status: 'primary', duration: 10000 });
          //         file = file || await this.apiService.uploadFileByLink(newProduct.FeaturePicture as any);
          //         file.Tag = tag;
          //         this.uploadedImages[tag] = file;
          //       }

          //       newProduct.FeaturePicture = file;
          //     }
          //     if (!newProduct.Pictures) newProduct.Pictures = [];
          //     if (newProduct.Pictures.findIndex(f => f.Tag == newProduct.FeaturePicture.Tag) < 0) {
          //       newProduct.Pictures.unshift(newProduct.FeaturePicture);
          //     }
          //   } catch (err) {
          //     console.error(err);
          //     delete newProduct.FeaturePicture;
          //   }
          // }

          // if (newProduct.Pictures && newProduct.Pictures.length > 0) {
          //   for (let i = 0; i < newProduct.Pictures.length; i++) {
          //     if (typeof newProduct.Pictures[i] == 'string') {
          //       try {
          //         const tag = CryptoJS.MD5(newProduct.Pictures[i] as any).toString();
          //         let file = this.uploadedImages[tag];
          //         if (!file) {
          //           this.cms.toastService.show(`${newProduct.Name}`, `Upload danh sách hình`, { status: 'primary', duration: 10000 });
          //           file = file || await this.apiService.uploadFileByLink(newProduct.Pictures[i] as any);
          //           file.Tag = tag;
          //           this.uploadedImages[tag] = file;
          //         }
          //         console.log(file);

          //         newProduct.Pictures[i] = file;
          //       } catch (err) {
          //         console.error(err);
          //         newProduct.Pictures.splice(i, 1);
          //       }
          //     }
          //   }
          //   if (!newProduct.FeaturePicture) {
          //     newProduct.FeaturePicture = newProduct.Pictures[0];
          //   }
          // }
          const node = this.gridApi.getDisplayedRowAtIndex(newProduct.index);
          try {
            const createdProducts = await this.apiService.putPromise<ContactModel[]>('/contact/contacts', {}, [newProduct]);
            // this.progress = 0;
            // for (const i in createdProducts) {
            newProduct.Code = createdProducts[0].Code;
            newProduct.Phone = createdProducts[0].Phone;
            newProduct.FullAddress = createdProducts[0].FullAddress;
            node.setDataValue('Result', 'Success');
            node.setDataValue('Code', createdProducts[0].Code);
            node.setDataValue('Phone', createdProducts[0].Phone);
            node.setDataValue('FullAddress', createdProducts[0].FullAddress);
            node.setDataValue('IsImport', false);
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
        // const createdProducts = await this.apiService.putPromise<ContactModel[]>('/admin-product/products', {}, newProductList);
        // for (const i in createdProducts) {
        //   newProductList[i].Code = createdProducts[i].Code;
        //   newProductList[i].Sku = createdProducts[i].Sku;
        //   const node = this.gridApi.getDisplayedRowAtIndex(newProductList[i].index);
        //   node.setDataValue('Sku', createdProducts[i].Sku);
        //   node.setDataValue('Code', createdProducts[i].Code);
        //   node.setDataValue('IsImport', false);
        // }
        // this.cms.toastService.show('Đã import thông tin liên hệ', 'Import thành công', { status: 'success' });
        // console.log(newProductList);
      }

      // Update price
      this.progressStatus = 'primary';
      // if (updatePriceProductList.length > 0) {
      //   this.cms.toastService.show('Đang cập nhật giá mới', 'Cập nhật giá', { status: 'primary', duration: 30000 });
      //   const priceUpdateData: any[] = [];
      //   for (const updatePriceProduct of updatePriceProductList) {
      //     for (const unitConversion of updatePriceProduct.UnitConversions) {
      //       priceUpdateData.push({
      //         MasterPriceTable: 'default',
      //         Product: this.cms.getObjectId(updatePriceProduct.Code),
      //         ProductName: this.cms.getObjectId(updatePriceProduct.Name),
      //         Unit: this.cms.getObjectId(unitConversion.Unit),
      //         UnitName: this.cms.getObjectText(unitConversion.Unit),
      //         Price: unitConversion.UnitPrice,
      //       });
      //     }
      //   }
      //   await this.apiService.putPromise('/sales/master-price-table-details', { requestUpdatePrice: true }, priceUpdateData);
      //   this.progress = 0;
      //   for (const updatePriceProduct of updatePriceProductList) {
      //     const node = this.gridApi.getDisplayedRowAtIndex(updatePriceProduct.index);
      //     if (node) node.setDataValue('IsUpdatePrice', false);
      //   }
      //   this.cms.toastService.show('Đã cập nhật giá mới', 'Cập nhật giá', { status: 'success' });
      // }

      // Export update data
      for (const i in allProductList) {
        const realIndex = parseInt(i) + 1;
        this.sheet[realIndex][this.mapping['Phone']] = allProductList[i].Phone;
        this.sheet[realIndex][this.mapping['Code']] = allProductList[i].Code;

        // this.sheet[realIndex][this.mapping['WarehouseUnit']] = this.cms.getObjectId(allProductList[i].WarehouseUnit);
        // this.sheet[realIndex][this.mapping['WarehouseUnitName']] = allProductList[i].WarehouseUnitName;

        // if (this.mapping['UnitConversions']) {
        //   for (let r = 0; r < this.mapping['UnitConversions'].length; r++) {
        //     this.sheet[realIndex][this.mapping['UnitConversions'][r]['Unit']] = this.cms.getObjectId(allProductList[i]['Unit' + (r + 1)]);
        //   }
        // }
        // if (this.mapping['Properties']) {
        //   for (let r = 0; r < this.mapping['Properties'].length; r++) {
        //     if (this.sheet[realIndex][this.mapping['Properties'][r]['Property']]) this.sheet[realIndex][this.mapping['Properties'][r]['Property']] = this.cms.getObjectId(allProductList[i]['Property' + (r + 1)]);
        //     if (allProductList[i]['PropertyValues' + (r + 1)]) this.sheet[realIndex][this.mapping['Properties'][r]['PropertyValues']] = allProductList[i]['PropertyValues' + (r + 1)].map(m => this.cms.getObjectId(m)).join(', ');
        //   }
        // }
      }

      // Include column name into header
      // Export mapping file
      this.workBook.Sheets[this.chooseSheet] = XLSX.utils.json_to_sheet(this.sheet, { skipHeader: true });
      XLSX.writeFile(this.workBook, this.fileName);

      this.cms.toastService.show('Import liên hệ hoàn tất', 'Import thành công', { status: 'success' });

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

  /** Ag dynamic list */
  syncTaskDetailsApiPath = '/wordpress/sync-task-details';
  // syncTaskDetailsApiPath = '/commerce-pos/orders';
  prepareSyncTaskDetailsParams = (params: any, getRowParams: IGetRowsParams) => {
    params['includeIdText'] = true;
    return params;
  };
  /** End Ag dynamic list */


  async exportTemplateFile() {
    const sheetData: any[] = [
      {
        Code: 'ID Liên hệ',
        Name: 'Tên liên hệ',
        Groups: 'ID nhóm, cách nhau dấu phẩy (,)',
        Title: 'Danh xưng: Anh, Chị, ...',
        ShortName: 'Tên rút gọn',
        Email: 'Email chính',
        Phone: 'Số điện thoại chính',
        Address: 'Địa chỉ chính số nhà tên đường',
        MapLink: 'Link bản đồ',
        TaxCode: 'Mã số thuế',
        IdentifiedNumber: 'Số định danh',
        Avatar: 'Link avatar',
        Birthday: 'Ngày sinh',
        PlaceOfBirth: 'Nơi sinh',
        Location: 'Khu vực hành chính: ID Phường/Xã',
      }
    ];

    const groupList = await this.apiService.getPromise<ContactGroupModel[]>('/contact/groups', { select: 'Code,Name,Description', limit: 'nolimit' });

    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(sheetData, { skipHeader: false });
    const sheet2 = XLSX.utils.json_to_sheet(groupList, { skipHeader: false });
    XLSX.utils.book_append_sheet(workbook, sheet, 'Liên hệ: DS sẽ import');
    XLSX.utils.book_append_sheet(workbook, sheet2, 'Nhóm: dùng đề lấy ID');

    XLSX.writeFile(workbook, 'contact-import-template.xlsx');
    return true;
  }

  checkImportAll() {
    this.gridApi.forEachNodeAfterFilter((node, index) => {
      node.setDataValue('IsImport', true);
    });
    return true;
  }
}
