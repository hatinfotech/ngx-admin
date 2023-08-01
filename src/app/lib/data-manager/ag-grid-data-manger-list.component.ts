import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { NbDialogService, NbToastrService, NbGlobalPhysicalPosition, NbDialogRef, NbThemeService } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../../modules/dialog/showcase-dialog/showcase-dialog.component';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ReuseComponent } from '../reuse-component';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AgGridAngular } from '@ag-grid-community/angular';
// import {
//   GridApi, ColumnApi, Module, AllCommunityModules,
//   IGetRowsParams, IDatasource
// } from '@ag-grid-community/all-modules';
import { map, takeUntil } from 'rxjs/operators';
import { ColumnApi, GridApi, IDatasource, IRowNode, Module } from 'ag-grid-community';
import { ColDef, GridOptions, IGetRowsParams, RowHeightParams, RowModelType, SelectionChangedEvent } from '@ag-grid-community/core';
import { InfiniteRowModelModule } from '@ag-grid-community/infinite-row-model';
import { DataManagerListComponent } from './data-manger-list.component';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ResourcePermissionEditComponent } from '../lib-system/components/resource-permission-edit/resource-permission-edit.component';

@Component({ template: '' })
export abstract class AgGridDataManagerListComponent<M, F> extends DataManagerListComponent<M> implements OnInit, ReuseComponent {

  editing = {};
  rows = [];
  hasSelect = 'none';

  /** Seleted ids */
  selectedIds: string[] = [];

  /** Local dat source */
  dataSource: IDatasource;

  @Input() formPath: string;

  /** Restful api path */
  @Input() apiPath: string;

  /** Resource id key */
  @Input() idKey: any;
  @Input() gridHeight = '100%';
  @Input() onDialogChoose?: (chooseItems: M[]) => void;
  @Input() onInit: (component: AgGridDataManagerListComponent<M, F>) => void;
  @Output() onComponentInit = new EventEmitter<AgGridDataManagerListComponent<M, F>>();
  @Output() onItemsChoosed = new EventEmitter<M[]>();
  @Output() onItemsSelected = new EventEmitter<M[]>();
  @Output() onNodesSelected = new EventEmitter<IRowNode<M>[]>();


  public refreshPendding = false;
  lastRequestCount: number = 0;
  lastResponseHeader: HttpHeaders = null;
  @Input() prepareApiParams(params: any, getRowParams?: IGetRowsParams): any { };


  @ViewChild('agGrid', { static: true }) agGrid: AgGridAngular;

  public gridApi: GridApi;
  public gridColumnApi: ColumnApi;
  // public modules: Module[] = AllCommunityModules;
  public modules: Module[] = [
    // ModuleRegistry,
    InfiniteRowModelModule,
    ClientSideRowModelModule,
  ];

  public gridParams;
  @Input() columnDefs: ColDef[];
  @Input() defaultColDef: ColDef = {
    // flex: 1, 
    resizable: true,
    sortable: true,
    filter: true,
    floatingFilter: true,
    // suppressMenu: strue,
    floatingFilterComponentParams: {
      suppressFilterButton: false
    },
    // headerComponent: 'sortableHeaderComponent',
    // headerComponentParams: {
    //   menuIcon: 'fa-filter'
    // },
    // cellStyle: {
    //   // 'height': '100%',
    //   'display': 'flex',
    //   // 'justify-content': 'center',
    //   'align-items': 'center',
    // },
  };

  @Input() gridOptions: GridOptions = {
    // angularCompileHeaders: true,
  };
  @Input() rowSelection: 'single' | 'multiple' = 'multiple';
  @Input() rowModelType: RowModelType = 'infinite';
  @Input() pagination = false;
  @Input() paginationPageSize = 20;
  @Input() cacheBlockSize = this.paginationPageSize;
  @Input() paginationAutoPageSize = false;
  @Input() cacheOverflowSize = 3;
  @Input() maxConcurrentDatasourceRequests = 1;
  @Input() infiniteInitialRowCount = null;
  @Input() maxBlocksInCache = 50;// 50x20 = 1000 items // Set 50 then refresh ag-grid make 50 request, resolution: rewrite refresh function: only reload visible item and clear cache
  @Input() rowMultiSelectWithClick = false;
  @Input() suppressRowClickSelection = false;
  @Input() enableCellTextSelection = true;
  @Input() ensureDomOrder = true;
  @Input() getRowNodeId = (item: M) => {
    return this.makeId(item);
  }
  @Input() getRowStyle: (params: any) => any;
  @Input() getRowClass: (params: any) => any;
  @Input() rowClassRules: any;
  @Input() components;
  //  = {
  //   loadingCellRenderer: (params) => {
  //     if (params.value) {
  //       // return params.value;
  //       return params.rowIndex + 1;
  //     } else {
  //       return '<span class="ag-loading"></span>';
  //     }
  //   },
  //   agColumnHeader: CustomHeader,
  // };
  @Input() multiSortKey = 'ctrl';
  @Input() rowDragManaged = false;
  @Input() rowHeight: number;
  @Input() getRowHeight: (params: RowHeightParams<M>) => number;
  @Input() hadRowsSelected = false;
  @Input() rowData: M[];
  themeName = '';
  themeMap = {
    default: 'ag-theme-alpine',
    corporate: 'ag-theme-alpine',
    dark: 'ag-theme-alpine-dark',
    cosmic: 'ag-theme-alpine-dark ag-theme-alpine-cosmic',
  };

  // gridOptions: GridOptions = {
  //   suppressRowClickSelection: true,
  // };

  constructor(
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public themeService: NbThemeService,
    public ref?: NbDialogRef<AgGridDataManagerListComponent<M, F>>,
  ) {
    super(apiService, router, cms, dialogService, toastService, ref);
    this.themeName = this.themeMap[this.themeService.currentTheme];
    this.themeService.onThemeChange().pipe(takeUntil(this.destroy$)).subscribe(theme => {
      this.themeName = this.themeMap[theme.name];
    });

    this.components = {
      loadingCellRenderer: (params) => {
        if (params.value) {
          // return params.value;
          return params.rowIndex + 1;
        } else {
          return '<span class="ag-loading"></span>';
        }
      },
      ...this.components,
    }
  }

  choose() {
    if (this.onDialogChoose) {
      this.onDialogChoose(this.selectedItems);
      this.onChoose(this.selectedItems);
      // this.close();
    } else {
      this.onItemsChoosed.emit(this.selectedItems);
      this.close();
    }
  }

  filterTypeMap = {
    equals: 'eq',
    notEqual: 'ne',
    startsWith: 'right',
    endsWith: 'left',
    contains: 'filter',
    lessThan: 'lt',
    greaterThan: 'gt',
  };
  parseFilterItemToApiParams(filterItem: any, key: string) {
    const query = {};
    switch (filterItem.filterType) {
      case 'date':
        if (filterItem.type == 'inRange') {
          query['ge_' + key] = this.cms.makeBeginOfDay(new Date(filterItem.dateFrom)).toISOString();
          query['le_' + key] = this.cms.makeEndOfDay(new Date(filterItem.dateTo)).toISOString();
        } else if (filterItem.type == 'equals') {
          query['ge_' + key] = this.cms.makeBeginOfDay(new Date(filterItem.dateFrom)).toISOString();
          query['le_' + key] = this.cms.makeEndOfDay(new Date(filterItem.dateFrom)).toISOString();
        } else {
          if (filterItem.dateFrom) {
            query[this.filterTypeMap[filterItem.type] + '_' + key] = new Date(filterItem.dateFrom).toISOString();
          }
          if (filterItem.dateTo) {
            query[this.filterTypeMap[filterItem.type] + '_' + key] = new Date(filterItem.dateTo).toISOString();
          }
        }
        break;
      default:
        query[this.filterTypeMap[filterItem.type] + '_' + key] = Array.isArray(filterItem.filter) ? ('[' + filterItem.filter.join(',') + ']') : filterItem.filter;
        break;
    }
    return query;
  }

  parseFilterToApiParams(filter: any) {
    let query: any = {};
    for (const key in filter) {
      const condition = filter[key];

      if (condition.type == 'inRange') {

      }

      if (condition.operator && condition.conditions) {
        for (const cond of condition.conditions) {
          const itemQuery = this.parseFilterItemToApiParams(cond, key);
          query = {
            ...query,
            ...itemQuery,
          };
        }
      } else {
        // if (this.filterTypeMap[condition.type]) {
        const itemQuery = this.parseFilterItemToApiParams(condition, key);
        query = {
          ...query,
          ...itemQuery,
        };
        // }
      }
    }
    return query;
  }

  async init(): Promise<boolean> {
    return super.init().then(status => {
      return status;
    });
  }

  /** List init event */
  ngOnInit() {
    super.ngOnInit();
    this.subcriptions.push(this.cms.componentChange$.subscribe(info => {
      if (info.componentName === this.componentName) {
        this.refreshPendding = true;
      }
    }));
    // this.loadList();
    // this.apiService.getObservable<M[]>(this.apiPath, this.prepareApiParams({ limit: 1 }, null)).pipe(
    //   map((res) => {
    //     this.lastResponseHeader = res.headers;
    //     this.infiniteInitialRowCount = +res.headers.get('x-total-count');
    //     console.log('set this.infiniteInitialRowCount: ' + this.infiniteInitialRowCount);
    //     let data = res.body;
    //     return data;
    //   }),
    // ).toPromise().then(rs => {
    //   // success(rs);
    //   return rs;
    // });
    this.initDataSource();
  }

  isFristFetchData = true;
  onAfterFetchData(): boolean {
    return true;
  }

  initDataSource() {
    if (this.rowModelType === 'infinite') {
      this.dataSource = {
        rowCount: null,
        getRows: (getRowParams: IGetRowsParams) => {
          console.info('asking for ' + getRowParams.startRow + ' to ' + getRowParams.endRow);

          let query = { limit: this.cacheBlockSize, offset: getRowParams.startRow };
          getRowParams.sortModel.forEach(sortItem => {
            query['sort_' + sortItem['colId']] = sortItem['sort'];
          });
          const filterQuery = this.parseFilterToApiParams(getRowParams.filterModel);
          query = {
            ...query,
            ...filterQuery
          };
          if (this.prepareApiParams) {
            query = this.prepareApiParams(query, getRowParams);
          }

          this.executeGet(query, list => {
            list.forEach((item, index) => {
              // item['No'] = (getRowParams.startRow + index + 1);
              item['id'] = this.makeId(item);
            });

            let lastRow = -1;
            if (list.length < this.paginationPageSize) {
              lastRow = getRowParams.startRow + list.length;
            }
            getRowParams.successCallback(list, lastRow);
            this.gridApi.resetRowHeights();
            this.onAfterFetchData();
            this.isFristFetchData = false;
          });

        },
      };
    }
  }

  isFirstBlockLoaded = true;
  onFirstBlockLoaded() {

    return true;
  }

  onGridReady(params) {
    this.gridParams = params;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.addEventListener('modelUpdated', (event) => {
      console.log(event);
      this.cms.takeUntil(this.componentName + '_row_loaded', 1000, () => {
        if (this.isFirstBlockLoaded) {
          this.onFirstBlockLoaded();
          this.isFirstBlockLoaded = false;
        }
      });
    });
    this.loadList();

  }

  onSelectionChanged(event: SelectionChangedEvent<M>) {
    this.selectedItems = this.gridApi.getSelectedRows();
    this.selectedIds = this.selectedItems.map(m => this.makeId(m));
    console.log('onSelectionChanged: ', event, this.selectedItems, this.selectedIds);
    this.onItemsSelected.emit(this.selectedItems);
    this.onNodesSelected.emit(this.gridApi.getSelectedNodes());
  }

  getList(callback: (list: M[]) => void) {
    this.cms.takeUntil(this.componentName, 300, () => {
      this.executeGet({ limit: 999999999, offset: 0 }, results => callback(results));
    });
  }

  /** Get data from api and push to list */
  loadList(callback?: (list: M[]) => void) {

    // if (!this.dataSource) {

    // }

    if (this.gridApi) {
      if (this.rowModelType === 'infinite') {
        this.gridApi.setDatasource(this.dataSource);
      }
    }
    // this.gridApi.setFilterModel({});

    // this.selectedIds = [];
    // this.hasSelect = 'none';
    // this.getList(list => {
    //   this.source.load(list.map((item, index) => {
    //     if (!item['No']) {
    //       item['No'] = index + 1;
    //     }
    //     return item;
    //   }));
    //   if (callback) callback(list);
    // });
  }

  onReloadBtnClick(): false {
    // this.source.reset();
    this.loadList();
    return false;
  }

  showFilter(event) {
    this.cms.openDialog(ShowcaseDialogComponent, {
      context: {
        title: 'Tìm kiếm nâng cao',
        content: 'Filter',
        actions: [
          {
            label: 'Trở về',
            icon: 'back',
            status: 'success',
            action: () => { },
          },
        ],
      },
    });
    return false;
  }

  /** Go to form */
  gotoForm(id?: string): false {
    this.router.navigate(id ? [this.formPath, id] : [this.formPath], { queryParams: { list: this.componentName } });
    return false;
  }

  createNewItem(): false {
    this.openFormDialplog(null, newData => {
      this.refresh();
    }, () => { });
    return false;
  }

  getSelectedRows() {
    return this.gridApi && this.gridApi.getSelectedRows() || [];
  }

  editSelectedItem(): false {
    // console.info(this.getSelectedRows());
    this.openFormDialplog(this.getSelectedRows().map(item => item.id), newData => {
      this.refresh();
    }, () => { });
    return false;
  }

  /** Implement on inheried class */
  abstract openFormDialplog(ids?: string[], onDialogSave?: (newData: M[]) => void, onDialogClose?: () => void): void;

  /** User select event */
  onUserRowSelect(event: any) {
    this.selectedIds = event.selected.map((item: M) => {
      return this.makeId(item);
    });
    // console.info(event);
    if (this.selectedIds.length > 0) {
      this.hasSelect = 'selected';
    } else {
      this.hasSelect = 'none';
    }
  }

  /** Row select event */
  onRowSelect(event) {
    // console.info(event);
  }

  /** Edit event */
  onEditAction(event: { data: M }) {
    // this.router.navigate(['modules/manager/form', event.data[this.idKey]]);
    this.gotoForm(this.makeId(event.data));
  }

  /** Create and multi edit/delete action */
  onSerialAction(event: any) {
    if (this.selectedIds.length > 0) {
      this.editChoosedItems();
    } else {
      // this.router.navigate(['modules/manager/form']);
      this.gotoForm();
    }
  }

  editChoosedItems(): false {
    this.cms.openDialog(ShowcaseDialogComponent, {
      context: {
        title: 'Xác nhận',
        content: 'Bạn muốn chỉnh sửa các dữ liệu đã chọn hay xoá chúng ?',
        actions: [
          {
            label: 'Xoá',
            icon: 'delete',
            status: 'danger',
            action: () => {
              this.deleteConfirm(this.selectedIds, () => this.loadList());
            },
          },
          {
            label: 'Trở về',
            icon: 'back',
            status: 'success',
            action: () => { },
          },
          {
            label: 'Chỉnh',
            icon: 'edit',
            status: 'warning',
            action: () => {
              // this.router.navigate(['modules/manager/form/', this.selectedIds.join('-')]);
              this.gotoForm(this.selectedIds.map(item => encodeURIComponent(item)).join(encodeURIComponent('&')));
            },
          },
        ],
      },
    });
    return false;
  }

  deleteSelected() {
    const selectedRows = this.getSelectedRows();
    this.deleteConfirm(selectedRows.map(item => item.id), () => {
      // const result = this.gridApi.updateRowData({ remove: selectedRows });
      this.refresh();
      this.gridApi.deselectAll();
      this.updateActionState();
      // console.info(result);
      this.toastService.show('success', 'Dữ liệu đã bị xoá', {
        status: 'success',
        hasIcon: true,
        position: NbGlobalPhysicalPosition.TOP_RIGHT,
      });
    });
  }

  deleteConfirm(ids: string[], callback?: () => void) {
    this.cms.openDialog(ShowcaseDialogComponent, {
      context: {
        title: 'Xác nhận xoá dữ liệu',
        content: 'Dữ liệu sẽ bị xoá, bạn chắc chắn chưa ?',
        actions: [
          {
            label: 'Trở về',
            icon: 'arrow-ios-back-outline',
            status: 'info',
            action: () => { },
          },
          {
            label: 'Xoá',
            icon: 'trash-2-outline',
            status: 'danger',
            action: () => {
              // this.apiService.delete(this.apiPath, ids, result => {
              //   if (callback) callback();
              // });
              this.loading = true;
              let toastRef = this.cms.showToast('Đang xóa các dòng được chọn...', 'Đang xóa dữ liệu', { status: 'warning', duration: 99999 });
              this.executeDelete(ids, callback).then(statu => {
                this.loading = false;
                toastRef.close();
                this.cms.showToast('Đã xóa các dòng được chọn', 'Hoàn tất xóa dữ liệu', { status: 'success', duration: 10000 });
              }).catch(err => {
                this.loading = false;
                toastRef.close();
                return Promise.reject(err);
              });
            },
          },
        ],
      },
    });
  }

  async delete(ids: string[], option?: { title?: string, content?: string }): Promise<void> {
    // if (option?.skipConfirm) {
    this.loading = true;
    let toastRef = this.cms.showToast('Đang xóa các dòng được chọn...', 'Đang xóa dữ liệu', { status: 'warning', duration: 99999 });
    return this.executeDelete(ids, (rs) => { }).then(statu => {
      this.loading = false;
      toastRef.close();
      this.cms.showToast('Đã xóa các dòng được chọn', 'Hoàn tất xóa dữ liệu', { status: 'success', duration: 10000 });
    }).catch(err => {
      this.loading = false;
      toastRef.close();
      return Promise.reject(err);
    });
    // } else {
    //   this.cms.openDialog(ShowcaseDialogComponent, {
    //     context: {
    //       title: option?.title || 'Xác nhận xoá dữ liệu',
    //       content: option?.content || 'Dữ liệu sẽ bị xoá, bạn chắc chắn chưa ?',
    //       actions: [
    //         {
    //           label: 'Trở về',
    //           icon: 'arrow-ios-back-outline',
    //           status: 'info',
    //           action: () => { },
    //         },
    //         {
    //           label: 'Xoá',
    //           icon: 'trash-2-outline',
    //           status: 'danger',
    //           action: () => {
    //             // this.apiService.delete(this.apiPath, ids, result => {
    //             //   if (callback) callback();
    //             // });
    //             this.loading = true;
    //             let toastRef = this.cms.showToast('Đang xóa các dòng được chọn...', 'Đang xóa dữ liệu', { status: 'warning', duration: 99999 });
    //             return this.executeDelete(ids, (rs) => { }).then(statu => {
    //               this.loading = false;
    //               toastRef.close();
    //               this.cms.showToast('Đã xóa các dòng được chọn', 'Hoàn tất xóa dữ liệu', { status: 'success', duration: 10000 });
    //             }).catch(err => {
    //               this.loading = false;
    //               toastRef.close();
    //               return Promise.reject(err);
    //             });
    //           },
    //         },
    //       ],
    //     },
    //   });
    // }
  }

  openPermissionForm(rowData: M) {
    this.cms.openDialog(ResourcePermissionEditComponent, {
      context: {
        inputMode: 'dialog',
        inputId: this.makeId(rowData),
        note: 'Click vào nút + để thêm 1 phân quyền, mỗi phân quyền bao gồm người được phân quyền và các quyền mà người đó được thao tác',
        resourceName: this.cms.translateText('resource', { action: '', definition: '' }) + ` ${rowData['Title'] || ''}`,
        // resrouce: rowData,
        apiPath: this.apiPath,
      }
    });
  }

  /** Api delete funciton */
  async executeDelete(ids: any, success: (resp: any) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: any | HttpErrorResponse) => void) {
    if (this.rowModelType === 'infinite') {
      await super.executeDelete(ids, success, error, complete);
    } else if (this.rowModelType === 'clientSide') {
      const selectedNodes = this.gridApi.getSelectedNodes();
      this.gridApi.applyTransaction({ remove: selectedNodes.map(m => m.data) });
    }
  }

  /** Api get funciton */
  executeGet(params: any, success: (resources: M[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: M[] | HttpErrorResponse) => void) {
    // this.apiService.get<M[]>(this.apiPath, params, success, error, complete);
    this.apiService.getObservable<M[]>(this.apiPath, params).pipe(
      map((res) => {
        this.lastResponseHeader = res.headers;
        const infiniteInitialRowCount = +res.headers.get('x-total-count');
        if (infiniteInitialRowCount) {
          this.infiniteInitialRowCount = infiniteInitialRowCount;
          this.gridApi.setRowCount(infiniteInitialRowCount);
        }
        // this.gridApi.setpage
        console.log('set this.infiniteInitialRowCount: ' + this.infiniteInitialRowCount);
        let data = res.body;
        return data;
      }),
    ).toPromise().then(rs => {
      success(rs);
      return rs;
    });

  }

  /** Api delete funciton */
  // executeDelete(id: any, success: (resp: any) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: any | HttpErrorResponse) => void) {
  //   this.apiService.delete(this.apiPath, id, success, error, complete);
  // }

  // executeDelete(ids: string[], callback: (result: any) => void) {
  //   this.apiService.delete(this.apiPath, ids, result => {
  //     if (callback) callback(result);
  //   });
  // }

  /** Delete action */
  // delete(event: any): void {
  //   this.deleteConfirm([event.data[this.idKey]], () => this.loadList());
  // }

  async refresh(mode?: string) {
    // this.loadList();
    // this.gridApi.refreshInfiniteCache();
    // this.gridApi.refreshInfinitePageCache();



    // this.gridApi.refreshInfiniteCache();


    if (mode == 'visible') {
      const renderedNodes = this.gridApi.getRenderedNodes();
      const renderedIds = renderedNodes.map(node => this.makeId(node.data));

      console.log(renderedNodes);
      console.log(renderedIds);
      let query = { id: renderedIds };
      query = this.prepareApiParams(query);
      this.executeGet(query, list => {
        for (const item of list) {
          const node = this.gridApi.getRowNode(this.makeId(item));
          if (node) {
            node.setData(item);
          }
        }
      });
    } else {
      this.gridApi.purgeInfiniteCache();
    }

    this.updateActionState();
    // return false;
  }

  async refreshItems(ids: string[]): Promise<M[]> {
    let query = { id: ids };
    query = this.prepareApiParams(query);
    return new Promise<M[]>((resolve, reject) => {
      this.executeGet(query, list => {
        for (const item of list) {
          const node = this.gridApi.getRowNode(this.makeId(item));
          if (node) {
            node.setData(item);
          }
        }
        this.updateActionState();
        resolve(list);
      }, err => {
        reject(err);
      });
    });
    // return false;
  }

  reset() {

    this.gridApi!.setFilterModel(null);
    const initSortColums = this.columnDefs.filter(f => f.initialSort).reduce((prev, current, index) => {
      prev[current.field] = current;
      return prev;
    }, {});
    const columnsState = this.gridColumnApi.getColumnState().filter(f => initSortColums[f.colId]).map(columnState => {
      columnState.sort = initSortColums[columnState.colId].initialSort;
      return columnState;
    });

    this.gridColumnApi!.applyColumnState({
      // defaultState: { sort: null },
      state: columnsState,
    });
    // this.gridApi.setSortModel(null);
    this.gridApi.deselectAll();
    this.loadList();
    this.updateActionState();
    return false;
  }

  onRowSelected() {
    this.updateActionState();
  }

  updateActionState() {
    this.hadRowsSelected = this.getSelectedRows().length > 0;
  }

  onResume() {
    super.onResume();
    if (this.refreshPendding) {
      this.refreshPendding = false;
      this.refresh();
    }
  }

  autoSizeAll(skipHeader) {
    const allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function (column) {
      console.info(column);
      if (['0', 'Code', 'Name'].indexOf(column.getColId()) < 0) {
        allColumnIds.push(column.getColId());
      }
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }

  protected configSetting(settings: any) {
    if (this.isChoosedMode) {

      if (settings) {
        const commandColumn: ColDef = settings.find(f => f.field == 'Command');
        if (commandColumn) {
          commandColumn.width = 90;
          commandColumn.resizable = true;
          commandColumn.cellRendererParams['buttons'] = [];
          // if (commandColumn.cellRendererParams['buttons']) {
          commandColumn.cellRendererParams['buttons'].push({
            name: 'choose',
            label: 'Chọn',
            status: 'primary',
            icon: 'checkmark-square',
            outline: true,
            action: (params: any, button: any) => {
              if (this.onDialogChoose) {
                this.onDialogChoose([params.data]);
              }
              this.onItemsChoosed.emit([params.data]);
              this.close();
            }
          });
          // commandColumn.width += 40;
          // }
        }
      }
    }
    return settings;
  }

  onColumnResized() {
    this.gridApi.resetRowHeights();
  }

  loadListSetting() {
    return null;
  }

  /**
   * Get grid data
   */
  getData(): M[] {
    const data: M[] = [];
    this.gridApi.forEachNode((rowNode, index) => {
      data.push(rowNode.data);
    });
    return data;
  }
}
