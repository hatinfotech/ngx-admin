// import { AllCommunityModules, CellDoubleClickedEvent, ColDef, ColumnApi, GridApi, IDatasource, IGetRowsParams, Module, RowNode, SuppressKeyboardEventParams } from '@ag-grid-community/all-modules';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService, NbDialogRef, NbThemeService } from '@nebular/theme';
import { BtnCellRenderer, CkbCellRenderer, CustomHeader } from '../../../../lib/custom-element/ag-list/ag-list.lib';
import { Select2Option } from '../../../../lib/custom-element/select2/select2.component';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { AccBankModel } from '../../../../models/accounting.model';
import { ContactDetailModel } from '../../../../models/contact.model';
import { ProductModel } from '../../../../models/product.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { CellDoubleClickedEvent, ColDef, ColumnApi, GridApi, IDatasource, IGetRowsParams, IRowNode, Module, RowNode, SuppressKeyboardEventParams } from '@ag-grid-community/core';

@Component({
  selector: 'ngx-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class WordpressProductFormComponent extends DataManagerFormComponent<AccBankModel> implements OnInit {

  componentName: string = 'WordpressProductFormComponent';
  idKey = 'Id';
  baseFormUrl = '';
  apiPath = '/wordpress/products';

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ref: NbDialogRef<WordpressProductFormComponent>,
    public themeService: NbThemeService,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms);

    /** AG-Grid */
    this.updateGridColumn();

    this.pagination = false;
    this.maxBlocksInCache = 5;
    this.paginationPageSize = this.cacheBlockSize = 1000;
    /** End AG-Grid */

  }


  productList: ProductModel[];
  themeName = this.themeService.currentTheme == 'default' ? '' : this.themeService.currentTheme;

  select2OptionForSites: Select2Option = {
    ...this.cms.makeSelect2AjaxOption('/wordpress/wp-sites', { includeIdText: true }, {
      placeholder: 'Chọn sites...',
      limit: 10,
      prepareReaultItem: (item) => {
        item.text = `${item.Name} - ${item.Domain}`;
        return item;
      }
    }),
    multiple: true,
    allowClear: true,
  };

  select2OptionForCategories: Select2Option = {
    ...this.cms.makeSelect2AjaxOption('/admin-product/categories', { includeIdText: true }, {
      placeholder: 'Chọn danh mục...',
      limit: 10,
      prepareReaultItem: (item) => {
        return item;
      }
    }),
    multiple: true,
    allowClear: true,
  };

  select2OptionForGroups = {
    ...this.cms.makeSelect2AjaxOption('/admin-product/groups', { includeIdText: true }, {
      placeholder: 'Chọn nhóm...',
      limit: 10,
      prepareReaultItem: (item) => {
        return item;
      }
    }),
    multiple: true,
    allowClear: true,
  };

  select2OptionForProducts: Select2Option = {
    ...this.cms.makeSelect2AjaxOption('/admin-product/products', { includeIdText: true }, {
      placeholder: 'Chọn sản phẩm...',
      limit: 10,
      prepareReaultItem: (item) => {
        return item;
      }
    }),
    multiple: true,
    allowClear: true,
  };

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
    // if (this.inputId) {
    //   this.mode = 'dialog';
    // }
  }

  async init(): Promise<boolean> {
    return super.init().then(status => {
      if (this.isDuplicate) {
        // Clear id
        this.id = [];
        this.array.controls.forEach((formItem, index) => {
          formItem.get('Code').setValue('');
          this.getDetails(formItem as FormGroup).controls.forEach(conditonFormGroup => {
            // Clear id
            conditonFormGroup.get('Id').setValue('');
          });
        });
      }
      return status;
    });
  }

  async formLoad(formData: AccBankModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: AccBankModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // if (itemFormData.Details) {
      //   itemFormData.Details.forEach(detail => {
      //     const newUnitConversionFormGroup = this.makeNewDetailFormGroup(detail);
      //     this.getDetails(newForm).push(newUnitConversionFormGroup);
      //     const comIndex = this.getDetails(newForm).length - 1;
      //     this.onAddDetailFormGroup(newForm, comIndex, newUnitConversionFormGroup);
      //   });
      // }

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });

  }

  // getRequestId(callback: (id?: string[]) => void) {
  //   callback(this.inputId);
  // }

  /** Execute api get */
  executeGet(params: any, success: (resources: AccBankModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeOrganizations'] = true;
    params['includeGroups'] = true;
    params['includeDetails'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: AccBankModel): FormGroup {
    const curentUrl = new URL(window.location.href); curentUrl.origin
    const newForm = this.formBuilder.group({
      Code: [''],
      Sites: ['', Validators.required],
      IsNotInGroups: [false],
      ProductGroups: [''],
      IsNotInCategories: [false],
      ProductCategories: [''],
      IsNotInProducts: [false],
      Products: [''],
      Schedule: [''],
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: AccBankModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }
  goback(): false {
    super.goback();
    if (this.mode === 'page') {
      this.router.navigate(['/contact/contact/list']);
    } else {
      this.ref.close();
      // this.dismiss();
    }
    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  onAfterCreateSubmit(newFormData: AccBankModel[]) {
    super.onAfterCreateSubmit(newFormData);
    // this.minierpService.reloadCache();
  }
  onAfterUpdateSubmit(newFormData: AccBankModel[]) {
    return super.onAfterUpdateSubmit(newFormData);
    // this.minierpService.reloadCache();
  }

  dismiss() {
    this.ref.close();
  }

  /** Details Form */
  makeNewDetailFormGroup(data?: ContactDetailModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      Type: [''],
      Detail: [''],
    });

    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  getDetails(formItem: FormGroup) {
    return formItem.get('Details') as FormArray;
  }
  addDetailFormGroup(formItem: FormGroup) {
    const newFormGroup = this.makeNewDetailFormGroup();
    this.getDetails(formItem).push(newFormGroup);
    this.onAddDetailFormGroup(formItem, this.getDetails(formItem).length - 1, newFormGroup);
    return false;
  }
  removeDetailGroup(parentForm: FormGroup, formItem: FormGroup, index: number) {
    this.getDetails(parentForm).removeAt(index);
    this.onRemoveDetailFormGroup(formItem, index);
    return false;
  }
  onAddDetailFormGroup(parentForm: FormGroup, index: number, newFormGroup: FormGroup) {
  }
  onRemoveDetailFormGroup(formItem: FormGroup, index: number) {
  }
  /** End Details Form */


  /** AG-Grid */
  public gridApi: GridApi;
  public gridColumnApi: ColumnApi;
  // public modules: Module[] = AllCommunityModules;
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
    return item.Code;
  }
  public getRowStyle = (params: { node: IRowNode }) => {
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


      let details: ProductModel[] = (this.productList || []).map((detail: ProductModel) => {

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

        let details: ProductModel[] = (this.productList as []).slice(getRowParams.startRow, getRowParams.endRow);

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
        valueGetter: 'node.data.Code',
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
        headerName: 'Sync',
        field: 'IsSync',
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
      // {
      //   headerName: 'Nghi vấn trùng',
      //   field: 'Status',
      //   width: 110,
      //   filter: 'agTextColumnFilter',
      //   pinned: 'left',
      //   cellRenderer: 'textRender',
      // },
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
      // {
      //   headerName: 'Tên cũ',
      //   field: 'OldName',
      //   width: 400,
      //   filter: 'agTextColumnFilter',
      //   // pinned: 'left',
      // },
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
        headerName: 'State',
        field: 'Keywords',
        width: 100,
        filter: 'agTextColumnFilter',
        pinned: 'right',
        cellRenderer: 'textRender',
      },
    ];
  }

  loadProducts() {
    let config = this.getRawFormData();
    this.apiService.getPromise<ProductModel[]>('/admin-product/products', {includeGroups: true, includeCategories: true, limit: 100 }).then(list => {
      this.productList = list.map(product => {
        product.IsSync = true;
        return product;
      });
      this.loadList();
    });
  }

  sync() {
    
  }
}
