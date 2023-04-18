import { CollaboratorAddonStrategyProductModel, CollaboratorAddonStrategyModel } from './../../../../models/collaborator.model';
// import { Module, AllCommunityModules, GridApi, ColumnApi, IDatasource, IGetRowsParams, ColDef, RowNode, CellClickedEvent, CellDoubleClickedEvent, SuppressKeyboardEventParams, ICellRendererParams } from '@ag-grid-community/all-modules';
import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService, NbDialogRef, NbThemeService } from '@nebular/theme';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { ProductModel, ProductUnitModel, ProductCategoryModel, ProductGroupModel, ProductUnitConversoinModel } from '../../../../models/product.model';
import { WarehouseGoodsContainerModel, WarehouseInventoryAdjustNoteDetailModel } from '../../../../models/warehouse.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { WarehouseGoodsContainerListComponent } from '../../../warehouse/goods-container/warehouse-goods-container-list/warehouse-goods-container-list.component';
import { AssignNewContainerFormComponent } from '../../../warehouse/goods/assign-new-containers-form/assign-new-containers-form.component';
// import { BtnCellRenderer } from '../../../warehouse/inventory-adjust-note/inventory-adjust-note-form/inventory-adjust-note-form.component';
import { CollaboratorService } from '../../collaborator.service';
import { CollaboratorProductListComponent } from '../../product/collaborator-product-list/collaborator-product-list.component';
import { ChangeDetectorRef } from '@angular/core';
import { AgButtonCellRenderer } from '../../../../lib/custom-element/ag-list/ag-list.lib';
import { CollaboratorBasicStrategyProductFormComponent } from '../product-form/collaborator-basic-strategy-product-form.component';
import { CellDoubleClickedEvent, ColDef, ColumnApi, GridApi, IDatasource, IGetRowsParams, IRowNode, Module, RowNode, SuppressKeyboardEventParams } from '@ag-grid-community/core';
@Component({
  selector: 'ngx-collaborator-basic-strategy-form',
  templateUrl: './collaborator-basic-strategy-form.component.html',
  styleUrls: ['./collaborator-basic-strategy-form.component.scss'],
  providers: [
    CurrencyPipe
  ]
})
export class CollaboratorBasicStrategyFormComponent extends DataManagerFormComponent<CollaboratorAddonStrategyModel> implements OnInit {

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ref?: NbDialogRef<CollaboratorBasicStrategyFormComponent>,
    public collaboratorService?: CollaboratorService,
    public themeService?: NbThemeService,
    public onDetectChangeRef?: ChangeDetectorRef
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms);


    const $this = this;
    /** AG-Grid */
    this.columnDefs = [
      {
        headerName: 'Hình',
        field: 'FeaturePicture',
        width: 100,
        filter: 'agTextColumnFilter',
        pinned: 'left',
        autoHeight: true,
        cellRenderer: 'imageRender',
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
        headerName: 'ID',
        width: 110,
        valueGetter: 'node.data.Product',
        cellRenderer: 'loadingCellRenderer',
        sortable: false,
      },
      {
        headerName: 'Tên sản phẩm',
        field: 'ProductName',
        width: 400,
        filter: 'agTextColumnFilter',
        // pinned: 'left',
      },
      {
        headerName: 'ĐVT',
        field: 'Unit',
        width: 110,
        filter: 'agTextColumnFilter',
        cellRenderer: 'textRender',
        // pinned: 'right',
      },
      {
        headerName: 'CKCB',
        field: 'Level1CommissionRatio',
        width: 110,
        filter: 'agTextColumnFilter',
        cellRenderer: 'textRender',
        // pinned: 'right',
      },
      {
        headerName: 'Thưởng tuần',
        field: 'Level1WeeklyAwardRatio',
        width: 150,
        filter: 'agTextColumnFilter',
        cellRenderer: 'textRender',
        // pinned: 'right',
      },
      {
        headerName: 'Thưởng tháng',
        field: 'Level1MonthlyAwardRatio',
        width: 150,
        filter: 'agTextColumnFilter',
        cellRenderer: 'textRender',
        // pinned: 'right',
      },
      {
        headerName: 'Thưởng quý',
        field: 'Level1QuarterlyAwardRatio',
        width: 150,
        filter: 'agTextColumnFilter',
        cellRenderer: 'textRender',
        // pinned: 'right',
      },
      {
        headerName: 'Thưởng năm',
        field: 'Level1YearlyAwardRatio',
        width: 150,
        filter: 'agTextColumnFilter',
        cellRenderer: 'textRender',
        // pinned: 'right',
      },
      {
        headerName: 'Cài đặt',
        field: 'id',
        width: 130,
        filter: 'agTextColumnFilter',
        pinned: 'right',
        cellRenderer: 'btnCellRenderer',
        cellRendererParams: {
          icon: 'settings-2-outline',
          status: 'primary',
          label: 'Cài đặt',
          clicked: (params: { node: IRowNode, data: CollaboratorAddonStrategyProductModel, api: GridApi } & { [key: string]: any }) => {
            // alert(`${field} was clicked`);
            console.log(params);

            // Setting for product
            this.cms.openDialog(CollaboratorBasicStrategyProductFormComponent, {
              context: {
                data: [
                  params.data,
                ],
                onDialogSave(newData) {
                  console.log(newData);
                  let currentNode: IRowNode = $this.gridApi.getRowNode($this.cms.getObjectId(params.data.Product) + '-' + $this.cms.getObjectId(params.data.Unit));
                  currentNode.setData(newData[0]);
                },
              }
            });

            return false;

          },
        },
      },
      {
        headerName: 'Gở',
        field: 'id',
        width: 100,
        filter: 'agTextColumnFilter',
        pinned: 'right',
        cellRenderer: 'btnCellRenderer',
        cellRendererParams: {
          icon: 'minus-circle-outline',
          status: 'danger',
          label: 'Gở',
          clicked: (params: { node: RowNode, data: WarehouseInventoryAdjustNoteDetailModel, api: GridApi } & { [key: string]: any }) => {
            // alert(`${field} was clicked`);
            console.log(params);

            // Remove row
            params.api.applyTransaction({ remove: [params.node.data] });
            return false;
          },
        },
      },
    ];

    this.pagination = false;
    this.maxBlocksInCache = 5;
    this.paginationPageSize = this.cacheBlockSize = 1000;
    /** End AG-Grid */




  }

  componentName: string = 'CollaboratorBasicStrategyFormComponent';
  idKey = ['Code'];
  apiPath = '/collaborator/basic-strategies';
  baseFormUrl = '/collaborator/basic-strategy/form';
  themeName = this.themeService.currentTheme == 'default' ? '' : this.themeService.currentTheme;
  unitList: ProductUnitModel[] = [];







  /** AG-Grid */
  public gridApi: GridApi;
  public gridColumnApi: ColumnApi;
  // public modules: Module[] = AllCommunityModules;
  public modules: Module[] = [

  ];
  public dataSource: IDatasource;
  public columnDefs: ColDef[];
  public rowSelection = 'multiple';
  // public rowModelType = 'infinite';
  public rowModelType = 'clientSide';
  public paginationPageSize: number;
  public cacheOverflowSize = 2;
  public maxConcurrentDatasourceRequests = 2;
  public infiniteInitialRowCount = 1;
  public maxBlocksInCache: number;
  public cacheBlockSize: number;
  public rowData: WarehouseInventoryAdjustNoteDetailModel[];
  public gridParams;
  public multiSortKey = 'ctrl';
  public rowDragManaged = false;
  public getRowHeight;
  public rowHeight: number = 60;
  public hadRowsSelected = false;
  public pagination: boolean;
  public emailAddressListDetails: WarehouseInventoryAdjustNoteDetailModel[] = [];
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

        return false;
      }
    }

  };
  public getRowNodeId = (item: CollaboratorAddonStrategyProductModel) => {
    return this.cms.getObjectId(item.Product) + '-' + this.cms.getObjectId(item.Unit);
  }
  public getRowStyle = (params: { node: RowNode }) => {
  };

  async createNewContainer(productId: string, unitId: string): Promise<WarehouseGoodsContainerModel> {
    return new Promise((resolve, reject) => {
      this.cms.openDialog(AssignNewContainerFormComponent, {
        context: {
          inputMode: 'dialog',
          inputGoodsList: [{ Code: productId, WarehouseUnit: unitId as any }],
          onDialogSave: (newData: WarehouseGoodsContainerModel[]) => {
            resolve(newData[0]);
          },
          onDialogClose: () => {
            resolve(null);
          },
        },
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    });
  }

  async openCreateOfPreviewContainersDialog(productId: string, productName: string, unitId: string, containers: string[]) {
    return new Promise<WarehouseGoodsContainerModel>((resolve, reject) => {
      this.cms.showDialog('Vị trí hàng hóa', `«${productName}» đã có vị trí! Bạn vẫn muốn tạo thêm vị trí mới hay xem lại các vị trí liên quan ?`, [
        {
          label: 'Tạo mới',
          status: 'danger',
          action: async () => {
            await this.createNewContainer(productId, unitId).then(container => {
              resolve(container);
            });
            return true;
          }
        },
        {
          label: 'Xem lại',
          status: 'primary',
          action: () => {
            this.cms.openDialog(WarehouseGoodsContainerListComponent, {
              context: {
                // isChoosedMode: true,
                inputFilter: {
                  eq_Code: '[' + containers.join(',') + ']'
                },
                onDialogChoose: (containers => {
                  console.log(containers);
                  resolve(containers[0]);
                })
              }
            });
            return true;
          }
        }
      ], () => {
        // resolve(null);
      });
    });
  }

  public cellDoubleClicked = (params: CellDoubleClickedEvent) => {
    console.log(params);
    const shelf = this.cms.getObjectId(this.array.controls[0].get('Shelf').value);
    if (params.colDef.field == 'Shelf' || params.colDef.field == 'Container') {
      if (!params.data.Containers || params.data.Containers.length == 0) {

        this.createNewContainer(this.cms.getObjectId(params.data.Product), this.cms.getObjectId(params.data.Unit)).then(container => {
          params.node.setDataValue('Shelf', { id: container.Shelf, text: container.ShelfName });
          params.node.setDataValue('Warehouse', container.Warehouse);
          params.node.setDataValue('Container', { id: container.Code, text: container.Path, Shelf: { id: container.Shelf, text: container.ShelfName }, Warehouse: container.Warehouse });
        });

      } else {
        this.openCreateOfPreviewContainersDialog(this.cms.getObjectId(params.data.Product), this.cms.getObjectText(params.data.Product), this.cms.getObjectId(params.data.Unit), params.data.Containers.map(m => this.cms.getObjectId(m))).then(container => {
          if (this.cms.getObjectId(shelf) && container.Shelf != this.cms.getObjectId(shelf)) {
            this.cms.toastService.show(`Vị trí vừa chọn không thuộc kệ «${this.cms.getObjectText(shelf)}»`, 'Không đúng kệ đang kiểm kho', { status: 'warning', duration: 10000 });
          } else {
            params.node.setDataValue('Shelf', { id: container.Shelf, text: container.ShelfName });
            params.node.setDataValue('Warehouse', container.Warehouse);
            params.node.setDataValue('Container', { id: container.Code, text: container.Path, Shelf: { id: container.Shelf, text: container.ShelfName }, Warehouse: container.Warehouse });

            // Update row data
            params.data.Containers.push({ ...container, id: container.Code, text: container.Path });
            params.node.setData({ ...params.data, Containers: params.data.Containers });
          }
        });
      }
    }
    if (params.colDef.field == 'AccessNumbers') {
      this.cms.showDialog('Số truy xuất', Array.isArray(params.data.AccessNumbers) ? params.data.AccessNumbers.join(', ') : '', []);
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
      if (Array.isArray(params.value)) {
        return params.value.map(m => this.cms.getObjectText(m)).join(', ');
      } else {
        return this.cms.getObjectText(params.value);
      }
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
      // if (Array.isArray(params.value)) {
      //   image = params.value[0];
      // }
      return image?.Thumbnail ? '<div style="width: 50px; height: 50px; background-image: url(' + image?.Thumbnail + '); border-radius: 5px; background-repeat: no-repeat; background-size: cover; margin: 5px;"></div>' : '';
    },
    btnCellRenderer: AgButtonCellRenderer
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
  loadList(callback?: (list: CollaboratorAddonStrategyProductModel[]) => void) {
    if (this.gridApi) {
      let products: CollaboratorAddonStrategyProductModel[] = (this.array.controls[0].get('Products').value || []).map((detail: CollaboratorAddonStrategyProductModel) => {
        // if (detail.Container) {
        //   detail.Shelf = { id: detail.Container.Shelf, text: detail.Container.ShelfName };
        // }
        // detail.AccessNumbers = detail.AccessNumbers ? detail.AccessNumbers.map(m => this.cms.getObjectId(m)) : [];
        return detail;
      });
      this.gridApi.setRowData(products);

    }

  }

  initDataSource() {
    this.dataSource = {
      rowCount: null,
      getRows: (getRowParams: IGetRowsParams) => {
        console.info('asking for ' + getRowParams.startRow + ' to ' + getRowParams.endRow);
        let details: CollaboratorAddonStrategyProductModel[] = (this.array.controls[0]['Products'] as []).slice(getRowParams.startRow, getRowParams.endRow);
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











  // Category list for select2
  categoryList: (ProductCategoryModel & { id?: string, text?: string })[] = [];
  // Group list for select2
  groupList: (ProductGroupModel & { id?: string, text?: string })[] = [];
  productList: ProductModel[] = [];
  // productList = {
  //   rowCount: null,
  //   getRows: (getRowParams: IGetRowsParams) => {
  //     console.info('asking for ' + getRowParams.startRow + ' to ' + getRowParams.endRow);
  //     this.apiService.getPromise<ProductModel[]>('/admin-product/products', { limit: 40, offset: getRowParams.startRow, includeIdText: true }).then(productList => {
  //       let lastRow = -1;
  //       if (productList.length < 40) {
  //         lastRow = getRowParams.startRow + productList.length;
  //       }
  //       getRowParams.successCallback(productList, lastRow);
  //     });
  //   },
  // };
  publisherList = {
    rowCount: null,
    getRows: (getRowParams: IGetRowsParams) => {
      console.info('asking for ' + getRowParams.startRow + ' to ' + getRowParams.endRow);
      this.apiService.getPromise<ProductModel[]>('/contact/contacts', { limit: 40, offset: getRowParams.startRow, includeIdText: true }).then(publisherList => {
        let lastRow = -1;
        if (publisherList.length < 40) {
          lastRow = getRowParams.startRow + publisherList.length;
        }
        getRowParams.successCallback(publisherList, lastRow);
      });
    },
  };

  percentFormat: CurrencyMaskConfig = { ...this.cms.getNumberMaskConfig(), precision: 3 };
  okrPercentFormat: CurrencyMaskConfig = { ...this.cms.getNumberMaskConfig(), precision: 1 };
  kpiPercentFormat: CurrencyMaskConfig = { ...this.cms.getNumberMaskConfig(), precision: 2 };
  currencyInputMask = this.cms.createFloatNumberMaskConfig({
    digitsOptional: false,
    digits: 3
  });
  okrInputMask = this.cms.createFloatNumberMaskConfig({
    digitsOptional: false,
    digits: 1
  });
  level1ComissionRatioInputMask = this.cms.createFloatNumberMaskConfig({
    digitsOptional: false,
    digits: 1
  });
  towDigitsInputMask = this.cms.createFloatNumberMaskConfig({
    digitsOptional: false,
    digits: 2
  });
  select2OptionForPage = {
    placeholder: 'Chọn trang...',
    allowClear: false,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };

  async loadCache() {
    // iniit category
    this.categoryList = (await this.apiService.getPromise<ProductCategoryModel[]>('/admin-product/categories', { limit: 'nolimit' })).map(cate => ({ id: cate.Code, text: cate.Name })) as any;
    this.groupList = (await this.apiService.getPromise<ProductGroupModel[]>('/admin-product/groups', { limit: 'nolimit' })).map(cate => ({ id: cate.Code, text: cate.Name })) as any;
    this.productList = (await this.apiService.getPromise<ProductModel[]>('/admin-product/products', { limit: 100, includeIdText: true }));
  }

  getRequestId(callback: (id?: string[]) => void) {
    if (this.mode === 'page') {
      super.getRequestId(callback);
    } else {
      callback(this.inputId);
    }
  }

  levelList = [
    { id: 'CTVLEVEL1', text: 'CTV Level 1', },
    { id: 'CTVLEVEL2', text: 'CTV Level 2' },
    { id: 'CTVLEVEL3', text: 'CTV Level 3' },
  ];
  select2OptionForLevel = {
    placeholder: 'Chọn level...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    tags: true,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };

  okrList = [
    { id: 'WEEK', text: 'Theo tuần' },
    { id: 'MONTH', text: 'Theo tháng' },
    { id: 'QUARTER', text: 'Theo quý', },
    { id: 'YEAR', text: 'Theo năm', },
  ];
  select2OptionForKpi = {
    placeholder: 'Chọn thời gian...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    tags: true,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };
  badgeList = [
    { id: 'DONG1', text: 'Đồng 1' },
    { id: 'BAC2', text: 'Bạc 2' },
    { id: 'VANG3', text: 'Vàng 3' },
  ];
  select2OptionForbadge = {
    placeholder: 'Chọn danh hiệu...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    tags: true,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };
  cycleList = [
    { id: 'WEEKLY', text: 'Tuần' },
    { id: 'MONTHLY', text: 'Tháng' },
    { id: 'YEARLY', text: 'Năm' },
  ];
  select2OptionForCycle = {
    placeholder: 'Chọn chu kỳ...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    tags: true,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };

  select2ExtendTerm = {
    placeholder: 'Chọn điều khoản tăng cường...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    // multiple: true,
    // tags: true,
    keyMap: {
      id: 'Code',
      text: 'Title',
    },
    ajax: {
      transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
        console.log(settings);
        const params = settings.data;
        this.apiService.getPromise('/collaborator/education-articles', { onlyIdText: true, filter_Title: params['term'] ? params['term'] : '', limit: 20 }).then(rs => {
          success(rs);
        }).catch(err => {
          console.error(err);
          failure();
        });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        // console.info(data, params);
        return {
          results: data,
        };
      },
    },
  };

  select2ExtendTermPublishers = {
    placeholder: 'Chọn cộng tác viên...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    multiple: true,
    // tags: true,
    keyMap: {
      id: 'id',
      text: 'text',
    },
    ajax: {
      transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
        console.log(settings);
        const params = settings.data;
        this.apiService.getPromise('/collaborator/publishers', { onlyIdText: true, filter_Name: params['term'] }).then(rs => {
          success(rs);
        }).catch(err => {
          console.error(err);
          failure();
        });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        return {
          results: data,
        };
      },
    },
  };

  onLevelChange(level: any, formGroup: FormGroup) {
    if (level && level.text) {
      formGroup.get('Description').setValue(level.text);
    }
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init() {
    await this.loadCache();
    return super.init().then(rs => {
      return rs;
    });
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: ProductModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeProducts'] = true;
    // params['includeLevels'] = true;
    // params['includeKpis'] = true;
    // params['includeExtendTerm'] = true;
    super.executeGet(params, success, error);
  }

  async formLoad(formData: ProductModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: ProductModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      if (this.gridApi) {
        this.loadList();
      }

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });

  }

  makeNewFormGroup(data?: ProductModel): FormGroup {
    const currentDate = new Date();
    const newForm = this.formBuilder.group({
      Code: { value: '', disabled: true },
      Title: ['', Validators.required],
      Page: [this.collaboratorService.currentpage$.value, Validators.required],
      // Cycle: ['MONTHLY'],
      // IsSelfOrder: [false],
      // SelfOrderDiscount: [null],
      DateRange: [[Date.today(), Date.today().next().month()], Validators.required],
      // IsAutoExtended: [true],
      // IsAllPublisher: [false],
      // IsAllProduct: [false],
      // IsDiscountByVoucher: [false],
      // PlatformFee: [],

      // // Level 1 field
      // Level1Badge: { value: 'CTV Bán Hàng Đồng 1', disabled: true },
      // Level1Label: { value: 'CTV Bán Hàng Level 1', disabled: true },
      // Level1Description: ['Bán dược bao nhiêu hưởng bấy nhiêu'],
      // Level1CommissionRatio: [null, Validators.required],

      // IsAppliedForLevel1Weekly: [true],
      // Level1WeeklyLabel: { disabled: true, value: 'Theo tuần' },
      // Level1WeeklyKpi: [],
      // Level1WeeklyOkr: [],
      // Level1WeeklyAwardRatio: [],

      // IsAppliedForLevel1Monthly: [true],
      // Level1MonthlyLabel: { disabled: true, value: 'Theo tháng' },
      // Level1MonthlyKpi: [],
      // Level1MonthlyOkr: [],
      // Level1MonthlyAwardRatio: [],

      // IsAppliedForLevel1Quarterly: [true],
      // Level1QuarterlyLabel: { disabled: true, value: 'Theo quý' },
      // Level1QuarterlyKpi: [],
      // Level1QuarterlyOkr: [],
      // Level1QuarterlyAwardRatio: [],

      // IsAppliedForLevel1Yearly: [true],
      // Level1YearlyLabel: { disabled: true, value: 'Theo năm' },
      // Level1YearlyKpi: [],
      // Level1YearlyOkr: [],
      // Level1YearlyAwardRatio: [],

      // // Level 2 field
      // Level2ExtBadge: { disabled: true, value: 'CTV Bán Hàng Bạc 2' },
      // Level2ExtLabel: { disabled: true, value: 'CTV Bán Hàng Level 2' },
      // Level2ExtRequiredKpi: [],
      // Level2ExtRequiredOkr: [],
      // Level2ExtAwardRatio: [],
      // Level2ExtDescription: [],

      // // Level 3 field
      // Level3ExtBadge: { disabled: true, value: 'CTV Bán Hàng Vàng 3' },
      // Level3ExtLabel: { disabled: true, value: 'CTV Bán Hàng Level 3' },
      // Level3ExtRequiredKpi: [],
      // Level3ExtRequiredOkr: [],
      // Level3ExtAwardRatio: [],
      // Level3ExtDescription: [],

      // ExtendTerm: [],
      // ExtendTermLabel: [],

      Products: [[]],
      // Publishers: [],


    });
    if (data) {
      data.DateRange = [data.DateOfStart, data.DateOfEnd];
      newForm.patchValue(data);
    }
    // newForm.get('PlatformFee').valueChanges.subscribe(value => {
    //   console.log(value);
    // });
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: ProductModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }

  goback(): false {
    super.goback();
    if (this.mode === 'page') {
      this.router.navigate(['/admin-product/product/list']);
    } else {
      this.ref.close();
    }
    return false;
  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  /** Execute api put */
  executePut(params: any, data: ProductModel[], success: (data: ProductModel[]) => void, error: (e: any) => void) {
    return super.executePut(params, data, success, error);
  }

  /** Execute api post */
  executePost(params: any, data: ProductModel[], success: (data: ProductModel[]) => void, error: (e: any) => void) {
    return super.executePost(params, data, success, error);
  }

  getRawFormData() {
    const data = super.getRawFormData();
    for (const item of data.array) {
      // Extract date range
      if (item.DateRange) {
        item.DateOfStart = item.DateRange[0];
        item.DateOfEnd = item.DateRange[1];
      }

      // Get details data from ag-grid
      item.Products = [];
      this.gridApi.forEachNode((rowNode, index) => {
        console.log(rowNode, index);
        const rawDetail = {};
        for (const prop in rowNode.data) {
          rawDetail[prop] = this.cms.getObjectId(rowNode.data[prop]);
        }
        item.Products.push(rawDetail);
      });
    }



    return data;
  }

  async save(): Promise<ProductModel[]> {
    return super.save();
  }

  onAdvanceTermChange(formItem: FormGroup, data: any, index: number) {
    formItem.get('ExtendTermLabel').setValue(this.cms.getObjectText(data));
  }

  products = [];
  addProduct(formItem: FormGroup) {
    const $this = this;
    this.cms.openDialog(CollaboratorProductListComponent, {
      context: {
        onDialogChoose(chooseItems) {
          console.log(chooseItems);
          const newRowNodeTrans = $this.gridApi.applyTransaction({
            add: chooseItems.map(m => ({
              id: m.Product,
              text: m.ProductName,
              Product: m.Product,
              ProductName: m.ProductName,
              Sku: m.Sku,
              Unit: m.Unit,
              Pictures: m.Pictures,
              FeaturePicture: m.FeaturePicture,
            }))
          });
          console.log('New Row Node Trans: ', newRowNodeTrans);
        },
      }
    });
    return false;
  }

  editSelectedProducts(formItem: FormGroup) {
    const $this = this;
    const selectedNodes: IRowNode[] = this.gridApi.getSelectedNodes();

    // Setting for product
    this.cms.openDialog(CollaboratorBasicStrategyProductFormComponent, {
      context: {
        data: selectedNodes.map(m => m.data),
        onDialogSave(newData) {
          console.log(newData);
          for (const itemData of newData) {
            let currentNode: IRowNode = $this.gridApi.getRowNode($this.cms.getObjectId(itemData.Product) + '-' + $this.cms.getObjectId(itemData.Unit));
            currentNode.setData(itemData);
          }
        },
      }
    });

    return false;
  }

  removeSelectedProducts(formItem: FormGroup) {

    const selectedNodes: IRowNode[] = this.gridApi.getSelectedNodes();
    this.gridApi.applyTransaction({ remove: selectedNodes.map(m => m.data) });

    return false;
  }
}
