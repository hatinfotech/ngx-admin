import { SmartTableDateTimeRangeFilterComponent } from './../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { AllCommunityModules, CellDoubleClickedEvent, ColDef, ColumnApi, GridApi, IDatasource, IGetRowsParams, Module, RowNode, SuppressKeyboardEventParams } from '@ag-grid-community/all-modules';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
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

@Component({
  selector: 'ngx-sync-profile-preview',
  templateUrl: './sync-profile-preview.component.html',
  styleUrls: ['./sync-profile-preview.component.scss']
})
export class WordpressSyncProfilePreviewComponent extends DataManagerFormComponent<AccBankModel> implements OnInit, OnDestroy {

  componentName: string = 'WordpressSyncProfilePreviewComponent';
  idKey = 'Code';
  baseFormUrl = '';
  apiPath = '/wordpress/wp-sync-profiles';

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ref: NbDialogRef<WordpressSyncProfilePreviewComponent>,
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

      this.actionButtonList.unshift({
        name: 'prepareTasks',
        status: 'primary',
        label: 'Tạo task',
        icon: 'settings-outline',
        title: 'Tạo task đồng bộ cho từng site',
        size: 'medium',
        disabled: () => false,
        hidden: () => false,
        click: () => {

          this.cms.showDialog('Tao task đồng bộ cho tất cả site', 'Bạn có muốn tạo task đồng bộ cho tất cả các site trong profile này ?', [
            {
              label: 'Trở về',
              status: 'basic',
              action: () => {

              }
            },
            {
              label: 'Tạo',
              status: 'primary',
              action: () => {
                this.loading = true;
                this.apiService.putPromise<any[]>('/wordpress/wp-sync-profiles/' + this.inputId[0], { prepare: true }, [
                  {
                    Code: this.inputId[0],
                  }
                ]).then(rs => {
                  this.refresh().then(rs => {
                    setTimeout(() => {
                      this.activeTask(this.cms.getObjectId(this.syncTasks[this.syncTasks.length - 1]));
                      this.loading = false;
                    }, 500);
                  });
                }).catch(err => {
                  console.log(err);
                  this.loading = false;
                });
              }
            },
          ]);
          return false;
        },
      });
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
      await this.loadSyncTasks(newForm.value?.Code);
      await this.loadSyncTaskDetails(newForm.value?.Code);
      this.autoRefresh();
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
    // params['includeTasks'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: AccBankModel): FormGroup {
    const curentUrl = new URL(window.location.href); curentUrl.origin
    const newForm = this.formBuilder.group({
      Code: [''],
      Sites: { disabled: true, value: '' },
      IsNotInGroups: [false],
      ProductGroups: [''],
      IsNotInCategories: [false],
      ProductCategories: [''],
      IsNotInProducts: [false],
      Products: [''],
      Schedule: [''],
      Tasks: [[]],
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
    return item.Id;
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


      let details: any[] = (this.syncTaskDetails || []).map((detail: any) => {

        return detail;
      });
      this.gridApi.setRowData(details);
      // this.gridApi.applyTransaction({update: details});

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
        valueGetter: 'node.data.Id',
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
        headerName: 'ID',
        field: 'Product',
        width: 100,
        filter: 'agTextColumnFilter',
        cellRenderer: 'textRender',
        pinned: 'left',
      },
      {
        headerName: 'Sku',
        field: 'Sku',
        width: 80,
        filter: 'agTextColumnFilter',
        cellRenderer: 'textRender',
        pinned: 'left',
      },
      {
        headerName: 'Tên sản phẩm',
        field: 'ProductName',
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
        headerName: 'ĐVT',
        field: 'UnitName',
        width: 150,
        filter: 'agTextColumnFilter',
        cellRenderer: 'textRender',
        // pinned: 'right',
      },
      // {
      //   headerName: 'Thương hiệu',
      //   field: 'Brand',
      //   width: 150,
      //   filter: 'agTextColumnFilter',
      //   cellRenderer: 'textRender',
      //   // pinned: 'right',
      // },
      // {
      //   headerName: 'ĐVT cơ bản',
      //   field: 'WarehouseUnit',
      //   width: 150,
      //   filter: 'agTextColumnFilter',
      //   cellRenderer: 'textRender',
      //   // pinned: 'right',
      // },
      // {
      //   headerName: 'Danh mục',
      //   field: 'Categories',
      //   width: 200,
      //   filter: 'agTextColumnFilter',
      //   // pinned: 'right',
      //   cellRenderer: 'textRender',
      // },
      // {
      //   headerName: 'Nhóm',
      //   field: 'Groups',
      //   width: 200,
      //   filter: 'agTextColumnFilter',
      //   // pinned: 'right',
      //   cellRenderer: 'textRender',
      // },
      {
        headerName: 'Site',
        field: 'SiteName',
        width: 100,
        filter: 'agTextColumnFilter',
        // pinned: 'right',
        cellRenderer: 'textRender',
      },
      {
        headerName: 'Status',
        field: 'Status',
        width: 100,
        filter: 'agTextColumnFilter',
        pinned: 'right',
        cellRenderer: 'textRender',
      },
      {
        headerName: 'Message',
        field: 'Message',
        width: 500,
        filter: 'agTextColumnFilter',
        pinned: 'right',
        cellRenderer: 'textRender',
      },
    ];
  }

  syncTaskDetails = [];
  async loadSyncTaskDetails(profile?: string) {
    if (this.activeTaskId) {
      this.syncTaskDetails = await this.apiService.getPromise('/wordpress/sync-task-details', { eq_Task: this.activeTaskId, sort_No: 'asc', limit: 'nolimit', includeIdText: true });
      this.loadList();
    }
    return true;
  }
  syncTasks = [];
  async loadSyncTasks(profile: string) {
    this.syncTasks = await this.apiService.getPromise('/wordpress/sync-tasks', { eq_Profile: profile, sort_Id: 'asc', limit: 'nolimit', includeIdText: true });
    if (this.syncTasks && this.syncTasks.length > 0 && !this.activeTaskId) {
      this.activeTask(this.cms.getObjectId(this.syncTasks[this.syncTasks.length - 1]));
    }
    // this.loadList();
  }

  loadProducts() {
    let config = this.getRawFormData();
    this.apiService.getPromise<ProductModel[]>('/admin-product/products', { includeGroups: true, includeCategories: true, limit: 100 }).then(list => {
      this.productList = list.map(product => {
        product.IsSync = true;
        return product;
      });
      this.loadList();
    });
  }

  refreshProcessing = null;
  async sync() {
    return this.apiService.putPromise('/wordpress/wp-sync-profiles/' + this.inputId[0], { sync: true }, [
      { Code: this.inputId[0] },
    ]).then(async rs => {
      await this.loadSyncTasks(this.inputId[0]);
      await this.loadSyncTaskDetails(this.inputId[0]);
      setTimeout(() => {
        this.refresh();
        setTimeout(() => {
          this.autoRefresh();
        }, 300);
      }, 500);
      return true;
    });
  }

  async changeState(task: any, state: string) {
    return this.apiService.putPromise('/wordpress/sync-tasks/' + this.cms.getObjectId(task), { changeState: 'REQUESTSTOP' }, [
      { Code: this.cms.getObjectId(task) },
    ]).then(rs => {
      this.loadSyncTasks(this.inputId[0]);
      return true;
    });
  }

  activeTaskId = null;

  async activeTask(taskId: string) {
    this.activeTaskId = taskId;
    this.loading = true;
    this.loadSyncTaskDetails().then(rs => this.loading = false).catch(err => this.loading = false);
  }

  ngOnDestroy(): void {
    if (this.refreshProcessing) {
      clearInterval(this.refreshProcessing);
    }
  }

  autoRefresh() {
    if (!this.refreshProcessing && this.syncTasks.find(f => f.State === 'PROCESSING')) {
      this.refreshProcessing = setInterval(() => {
        if (this.syncTasks.find(f => f.State === 'PROCESSING')) {
          console.log('Auto refresh');
          this.loadSyncTasks(this.inputId[0]);
          this.loadSyncTaskDetails(this.inputId[0]);
        } else {
          clearInterval(this.refreshProcessing);
        }
      }, 10000);
    }
  }
}
