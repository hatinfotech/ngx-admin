import { SmartTableDateTimeRangeFilterComponent } from './../../../../lib/custom-element/smart-table/smart-table.filter.component';
// import { AllCommunityModules, CellDoubleClickedEvent, ColDef, ColumnApi, GridApi, IDatasource, IGetRowsParams, Module, RowNode, SuppressKeyboardEventParams, ValueFormatterParams } from '@ag-grid-community/all-modules';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService, NbDialogRef, NbThemeService } from '@nebular/theme';
import { Select2Option } from '../../../../lib/custom-element/select2/select2.component';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { AccBankModel } from '../../../../models/accounting.model';
import { ContactDetailModel } from '../../../../models/contact.model';
import { ProductModel } from '../../../../models/product.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
// import { GridApi } from 'ag-grid-community';
import { CellDoubleClickedEvent, ColDef, ColumnApi, GridApi, IDatasource, IGetRowsParams, IRowNode, Module, RowNode, SuppressKeyboardEventParams, ValueFormatterParams } from '@ag-grid-community/core';
import { AgButtonCellRenderer } from '../../../../lib/custom-element/ag-list/cell/button.component';
import { AgCheckboxCellRenderer } from '../../../../lib/custom-element/ag-list/cell/checkbox.component';
import { CustomHeader } from '../../../../lib/custom-element/ag-list/header/custom.component';
import { agMakeSelectionColDef } from '../../../../lib/custom-element/ag-list/column-define/selection.define';
import { AgDynamicListComponent } from '../../../general/ag-dymanic-list/ag-dymanic-list.component';
import { agMakeCommandColDef } from '../../../../lib/custom-element/ag-list/column-define/command.define';
import { agMakeStateColDef } from '../../../../lib/custom-element/ag-list/column-define/state.define';
import { agMakeCurrencyColDef } from '../../../../lib/custom-element/ag-list/column-define/currency.define';
import { AgDateCellRenderer } from '../../../../lib/custom-element/ag-list/cell/date.component';
import { AgTextCellRenderer } from '../../../../lib/custom-element/ag-list/cell/text.component';
import { agMakeTagsColDef } from '../../../../lib/custom-element/ag-list/column-define/tags.define';
import { AgSelect2Filter } from '../../../../lib/custom-element/ag-list/filter/select2.component.filter';
import { AgImageCellRenderer } from '../../../../lib/custom-element/ag-list/cell/image.component';
import { FileModel } from '../../../../models/file.model';
import { ImagesViewerComponent } from '../../../../lib/custom-element/my-components/images-viewer/images-viewer.component';
import { agMakeImageColDef } from '../../../../lib/custom-element/ag-list/column-define/image.define';
import { AdminProductService } from '../../../admin-product/admin-product.service';
import { AgButtonsCellRenderer } from '../../../../lib/custom-element/ag-list/cell/buttons.component';

@Component({
  selector: 'ngx-sync-profile-preview',
  templateUrl: './sync-profile-preview.component.html',
  styleUrls: ['./sync-profile-preview.component.scss'],
  providers: [CurrencyPipe, DatePipe]
})
export class WordpressSyncProfilePreviewComponent extends DataManagerFormComponent<AccBankModel> implements OnInit, OnDestroy {

  componentName: string = 'WordpressSyncProfilePreviewComponent';
  idKey = 'Code';
  baseFormUrl = '';
  apiPath = '/wordpress/wp-sync-profiles';

  @ViewChild('agSyncTaskDetailList') agSyncTaskDetailList: AgDynamicListComponent<any>;

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
    public currencyPipe: CurrencyPipe,
    public datePipe: DatePipe,
    public prds: AdminProductService,
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
        click: (event, option) => {
          const formGroup = option.form;
          const sites = formGroup.get('Sites').value;
          this.cms.showDialog('Tao task đồng bộ cho tất cả site', 'Bạn có muốn tạo task đồng bộ cho tất cả các site trong profile này ?', [
            {
              label: 'Trở về',
              status: 'basic',
              action: () => {

              }
            },
            {
              label: 'Chọn sản phẩm',
              status: 'primary',
              action: () => {
                this.cms.openDialog(AgDynamicListComponent, {
                  context: {
                    title: 'Chọn sản phẩm cần đồng bộ',
                    width: '90%',
                    height: '95vh',
                    apiPath: '/wordpress/products',
                    idKey: 'Id',
                    rowMultiSelectWithClick: true,
                    suppressRowClickSelection: false,
                    prepareApiParams: (params, getRowParams) => {
                      // const sites = formGroup.get('Sites').value;
                      params['eq_Site'] = this.cms.getObjectId(sites[0]);
                      return params;
                    },
                    onDialogChoose: (chooseItems) => {
                      console.log(chooseItems);
                      if (chooseItems && chooseItems.length > 0) {
                        this.loading = true;
                        this.apiService.putPromise<any[]>('/wordpress/wp-sync-profiles/' + this.inputId[0], { prepare: true }, [
                          {
                            Code: this.inputId[0],
                            ForSite: this.cms.getObjectId(sites[0]),
                            ForWpProducts: chooseItems.map(m => m.Id),
                          }
                        ]).then(rs => {
                          this.refresh().then(rs => {
                            setTimeout(() => {
                              this.activeTask(this.cms.getObjectId(this.syncTasks[0]));
                              this.loading = false;
                            }, 500);
                          });
                        }).catch(err => {
                          console.log(err);
                          this.loading = false;
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
                        ...agMakeImageColDef(this.cms),
                        headerName: 'Hình',
                        field: 'FeaturePicture',
                        width: 100,
                      },
                      {
                        headerName: 'ID',
                        field: 'Product',
                        initialSort: 'desc',
                        width: 100,
                        filter: 'agTextColumnFilter',
                        cellRenderer: AgTextCellRenderer,
                        pinned: 'left',
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
                      },
                      {
                        headerName: 'Sku',
                        field: 'Sku',
                        width: 80,
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
                        headerName: 'Tên sản phẩm',
                        field: 'Name',
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
                        headerName: 'ĐVT',
                        field: 'Unit',
                        width: 150,
                        // cellRenderer: AgTextCellRenderer,
                        valueFormatter: (params) => {
                          return params.data?.UnitName;
                        },
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
                        headerName: 'Danh mục',
                        field: 'Categories',
                        width: 200,
                        // cellRenderer: AgTextCellRenderer,
                        valueFormatter: (params) => {
                          return this.cms.getObjectsText(params.value);
                        },
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
                            data: this.prds.categoryList$.value,
                            multiple: true,
                            logic: 'OR',
                          }
                        },
                      },
                      {
                        headerName: 'Danh mục WP',
                        field: 'RefCategories',
                        width: 300,
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
                        valueFormatter: (params) => {
                          return this.cms.getObjectsText(params.value);
                        },
                      },
                      {
                        headerName: 'Đồng bộ lần cuối',
                        field: 'LastSync',
                        width: 180,
                        filter: 'agDateColumnFilter',
                        filterParams: {
                          inRangeFloatingFilterDateFormat: 'DD/MM/YY',
                        },
                        cellRenderer: AgDateCellRenderer,
                      },
                      {
                        headerName: 'Site',
                        field: 'SiteName',
                        width: 100,
                        filter: 'agTextColumnFilter',
                        cellRenderer: AgTextCellRenderer,
                      },
                      {
                        ...agMakeCurrencyColDef(this.cms),
                        headerName: 'Giá niêm yết',
                        field: 'Price',
                        pinned: 'right',
                        width: 150,
                      },
                      {
                        ...agMakeCurrencyColDef(this.cms),
                        headerName: 'Giá bán',
                        field: 'SalePrice',
                        pinned: 'right',
                        width: 150,
                      },
                    ],
                    onInit: (component) => {

                    }
                  }
                });
              }
            },
            {
              label: 'Tạo cho tất sản phẩm',
              status: 'success',
              action: () => {
                this.loading = true;
                this.apiService.putPromise<any[]>('/wordpress/wp-sync-profiles/' + this.inputId[0], { prepare: true }, [
                  {
                    Code: this.inputId[0],
                  }
                ]).then(rs => {
                  this.refresh().then(rs => {
                    setTimeout(() => {
                      this.activeTask(this.cms.getObjectId(this.syncTasks[0]));
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
      // await this.loadSyncTaskDetails(newForm.value?.Code);
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

  /** Ag dynamic list */
  syncTaskDetailsApiPath = '/wordpress/sync-task-details';
  // syncTaskDetailsApiPath = '/commerce-pos/orders';
  prepareSyncTaskDetailsParams = (params: any, getRowParams: IGetRowsParams) => {
    if (this.activeTaskId) {
      const task = this.syncTasks.find(f => f.Code == this.activeTaskId);
      params['eq_Task'] = this.activeTaskId;
      params['includeIdText'] = true;
      // if (task.State == 'READY') {
      //   params['sort_No'] = 'asc';
      // } else {
      //   params['sort_SyncTime'] = 'desc';
      //   params['sort_No'] = 'asc';
      // }
    } else {
      params['eq_Id'] = '-1';
    }
    return params;
  };
  /** End Ag dynamic list */

  /** AG-Grid */

  public gridApi: GridApi;
  public gridColumnApi: ColumnApi;
  public modules: Module[] = [

  ];
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
    },

    filter: true,

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
    // const allColumnIds: string[] = [];
    // this.gridColumnApi.getAllColumns()!.forEach((column) => {
    //   allColumnIds.push(column.getId());
    // });

    // this.gridColumnApi!.autoSizeColumns(allColumnIds, skipHeader);
  }

  loadList(callback?: (list: ProductModel[]) => void) {

    if (this.gridApi) {

      const addItems = [];
      const updateItems = [];
      const removeItems = [];
      const currentItemsMap = {};

      // Prepare newDataMap 
      const newDataMap = {};
      for (const newItem of this.syncTaskDetails) {
        newDataMap[newItem.Id] = newItem;
      }

      this.gridApi.forEachNode(async (rowNode, index) => {
        const rowData = rowNode.data;
        currentItemsMap[rowData.Id] = rowData;
        if (newDataMap[rowData.Id]) {
          updateItems.push(newDataMap[rowData.Id]);
        } else {
          removeItems.push(rowData);
        }
      });

      // Find insert items
      for (const newItem of this.syncTaskDetails) {
        if (!currentItemsMap[newItem.Id]) {
          addItems.push(newItem);
        }
      }

      this.gridApi.applyTransaction({ update: updateItems, add: addItems, remove: removeItems });
      const columnsState = this.gridColumnApi.getColumnState();
      const syncTimeColState = columnsState.find(f => f.colId === 'SyncTime');
      if (syncTimeColState) {
        syncTimeColState.sort = 'desc';
      }
      this.gridColumnApi.applyColumnState({
        state: columnsState,
        applyOrder: true,
      });


      // let details: any[] = (this.syncTaskDetails || []).map((detail: any) => {
      //   return detail;
      // });
      // this.gridApi.setRowData(details);
      // // this.gridApi.applyTransaction({update: details});
      this.autoSizeAll(false);
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
        ...agMakeSelectionColDef(this.cms),
        headerName: 'STT',
        field: 'No',
        valueGetter: 'node.data.No',
        cellRenderer: (params) => {
          if (params.value) {
            // return params.value;
            return params.value;
          } else {
            return '<img src="assets/images/loading.gif">';
          }
        }
      },
      {
        ...agMakeImageColDef(this.cms),
        headerName: 'Hình',
        field: 'FeaturePicture',
        width: 100,
      },
      {
        headerName: 'Sync',
        field: 'IsSync',
        width: 80,
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
        headerName: 'ID',
        field: 'Product',
        width: 100,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
        pinned: 'left',
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
      },
      {
        headerName: 'Sku',
        field: 'Sku',
        width: 80,
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
        headerName: 'Tên sản phẩm',
        field: 'ProductName',
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
        headerName: 'ĐVT',
        field: 'UnitName',
        width: 150,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
      },
      {
        headerName: 'Giá niêm yết',
        field: 'Price',
        width: 110,
        filter: 'agTextColumnFilter',
        valueFormatter: (cell: ValueFormatterParams) => {
          return cell && cell.value && /\d+/.test(cell.value) && this.currencyPipe.transform(cell.value, 'VND') || cell?.value;
        }
      },
      {
        headerName: 'Giá sale',
        field: 'SalePrice',
        width: 110,
        filter: 'agTextColumnFilter',
        valueFormatter: (cell: ValueFormatterParams) => {
          return cell && cell.value && /\d+/.test(cell.value) && this.currencyPipe.transform(cell.value, 'VND') || cell?.value;
        }
      },
      {
        headerName: 'Danh mục WP',
        field: 'RefCategories',
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
      },
      {
        headerName: 'Site',
        field: 'SiteName',
        width: 100,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
      },
      {
        headerName: 'SyncTime',
        field: 'SyncTime',
        width: 180,
        filter: 'agTextColumnFilter',
        pinned: 'right',
        valueFormatter: (cell: ValueFormatterParams) => {
          return cell && cell.value && this.datePipe.transform(cell.value, 'short') || cell?.value;
        }
      },
      {
        headerName: 'Status',
        field: 'Status',
        width: 150,
        filter: 'agTextColumnFilter',
        pinned: 'right',
        cellRenderer: AgTextCellRenderer,
      },
      {
        headerName: 'Message',
        field: 'Message',
        width: 300,
        filter: 'agTextColumnFilter',
        pinned: 'right',
        cellRenderer: AgTextCellRenderer,
      },
      {
        headerName: 'Gở',
        field: 'Command',
        width: 65,
        filter: false,
        pinned: 'right',
        type: 'rightAligned',
        cellClass: ['ag-cell-items-center', 'ag-cell-justify-center', 'ag-cell-no-padding-left', 'ag-cell-no-padding-right'],
        cellRenderer: AgButtonsCellRenderer,
        resizable: false,
        cellStyle: { 'text-overflow': 'initial' },
        cellRendererParams: {
          buttons: [
            {
              name: 'delete',
              status: 'danger',
              icon: 'trash-2-outline',
              outline: false,
              action: (params: any, button: any) => {
                this.agSyncTaskDetailList.deleteConfirm([params.node.data.Id]);
                return false;
              }
            },
          ],
        }
      },
    ];
  }

  syncTaskDetails = [];
  async loadSyncTaskDetails(profile?: string) {
    if (this.activeTaskId) {
      await this.cms.waitFor(500, 20, async () => !!this.agSyncTaskDetailList);
      this.agSyncTaskDetailList.refresh();
      this.agSyncTaskDetailList.title = `Danh sách biến thể`;
      const task = this.syncTasks.find(f => f.Code == this.activeTaskId);
      const columnsState = this.agSyncTaskDetailList.gridColumnApi.getColumnState();
      if (task.State == 'READY') {
        const defaultFilter = columnsState.find(f => f.colId === 'No');
        if (defaultFilter) {
          defaultFilter.sort = 'asc';
        }
        this.agSyncTaskDetailList.gridColumnApi.applyColumnState({
          state: columnsState,
          applyOrder: true,
        });
      } else {
        const defaultFilter = columnsState.find(f => f.colId === 'SyncTime');
        if (defaultFilter) {
          defaultFilter.sort = 'desc';
        }
        this.agSyncTaskDetailList.gridColumnApi.applyColumnState({
          state: columnsState,
          applyOrder: true,
        });
      }

      // const task = this.syncTasks.find(f => f.Code == this.activeTaskId);
      // const params: any = {
      //   eq_Task: this.activeTaskId,
      //   // sort_SyncTime: 'desc',
      //   limit: 'nolimit',
      //   includeIdText: true,
      // };
      // if (task.State == 'READY') {
      //   params.sort_No = 'asc';
      // } else {
      //   params.sort_SyncTime = 'desc';
      //   params.sort_No = 'asc';
      // }
      // // this.syncTaskDetails = await this.apiService.getPromise<any[]>('/wordpress/sync-task-details', params).then(rs => {
      // //   for (const item of rs) {
      // //     item.No = parseInt(item.No);
      // //     item.IsSync = item.Status === 'READY';
      // //     item.RefCategoriesText = (item.RefCategories || []).map(m => this.cms.getObjectText(m)).join(', ');
      // //   }
      // //   return rs;
      // // });
      // this.loadList();
    }
    return true;
  }
  syncTasks = [];
  async loadSyncTasks(profile: string) {
    this.syncTasks = await this.apiService.getPromise<any[]>('/wordpress/sync-tasks', { eq_Profile: profile, sort_Id: 'desc', limit: 'nolimit', includeIdText: true }).then(rs => rs.map(m => {
      if (m.StartTime && m.EndTime) {
        m.Duration = (new Date(m.EndTime).getTime() - new Date(m.StartTime).getTime()) / 1000;
        m.Duration = this.cms.toTimeString(m.Duration);
      }
      return m;
    }));
    if (this.syncTasks && this.syncTasks.length > 0 && !this.activeTaskId) {
      this.activeTask(this.cms.getObjectId(this.syncTasks[0]));
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

    // const syncList = [];
    // this.gridApi.forEachNode(async (rowNode, index) => {
    //   const rowData = rowNode.data;
    //   if (!rowData.IsSync) {
    //     syncList.push({
    //       Id: rowData.Id,
    //       Status: 'SKIP',
    //     });
    //   }
    // });

    // Update IsSync state
    this.loading = true;
    try {
      // let offset = 0;
      // const limit = 100;
      // while (true) {
      //   const partList = syncList.slice(offset, offset + limit);
      //   if (partList.length > 0) {
      //     await this.apiService.deletePromise('/wordpress/sync-task-details', partList.map(m => m.Id));
      //     offset += limit;
      //   } else {
      //     break;
      //   }
      // }
      // await this.loadSyncTaskDetails();

      return this.apiService.putPromise('/wordpress/wp-sync-profiles/' + this.inputId[0], { sync: true }, [
        { Code: this.inputId[0] },
      ]).then(async rs => {
        await this.loadSyncTasks(this.inputId[0]);
        await this.loadSyncTaskDetails();
        this.loading = false;
        setTimeout(() => {
          this.refresh();
          setTimeout(() => {
            this.autoRefresh();
          }, 300);
        }, 500);
        return true;
      });
    } catch (err) {
      this.loading = false;
    }
  }

  async changeState(task: any, state: string) {
    return this.apiService.putPromise('/wordpress/sync-tasks/' + this.cms.getObjectId(task), { changeState: 'REQUESTSTOP' }, [
      { Code: this.cms.getObjectId(task) },
    ]).then(rs => {
      this.loadSyncTasks(this.inputId[0]);
      return true;
    });
  }

  async changeIsOverwritePictures(task: any, state: boolean) {
    return this.apiService.putPromise('/wordpress/sync-tasks/' + this.cms.getObjectId(task), {}, [
      { Code: this.cms.getObjectId(task), IsOverwritePictures: state},
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
      this.refreshProcessing = null;
    }
  }

  autoRefresh() {
    if (!this.refreshProcessing && this.syncTasks.find(f => (f.State === 'PROCESSING' || f.State === 'REQUESTSTOP'))) {
      this.refreshProcessing = setInterval(() => {
        if (this.syncTasks.find(f => (f.State === 'PROCESSING' || f.State === 'REQUESTSTOP'))) {
          console.log('Auto refresh');
          this.loadSyncTasks(this.inputId[0]);
          this.loadSyncTaskDetails(this.inputId[0]);
        } else {
          clearInterval(this.refreshProcessing);
          this.refreshProcessing = null;
        }
      }, 10000);
    }
  }


}
