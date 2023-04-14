import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { NbDialogService, NbToastrService, NbGlobalPhysicalPosition, NbDialogRef, NbThemeService } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../../modules/dialog/showcase-dialog/showcase-dialog.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base-component';
import { ReuseComponent } from '../reuse-component';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AgGridAngular } from '@ag-grid-community/angular';
// import {
//   GridApi, ColumnApi, Module, AllCommunityModules,
//   IGetRowsParams, IDatasource
// } from '@ag-grid-community/all-modules';
import { ActionControl } from '../custom-element/action-control-list/action-control.interface';
import { map, takeUntil } from 'rxjs/operators';
import { ColumnApi, GridApi, IDatasource, Module } from 'ag-grid-community';
import { IGetRowsParams, ModuleRegistry } from '@ag-grid-community/core';
import { InfiniteRowModelModule } from '@ag-grid-community/infinite-row-model';

@Component({ template: '' })
export abstract class AgGridDataManagerListComponent<M, F> extends BaseComponent implements OnInit, ReuseComponent {

  editing = {};
  rows = [];
  hasSelect = 'none';

  /** Seleted ids */
  selectedIds: string[] = [];

  /** Local dat source */
  dataSource: IDatasource;

  abstract formPath: string;

  /** Restful api path */
  abstract apiPath: string;

  /** Resource id key */
  abstract idKey: string;

  public refreshPendding = false;
  lastRequestCount: number = 0;
  lastResponseHeader: HttpHeaders = null;

  actionButtonList: ActionControl[] = [
    {
      name: 'delete',
      status: 'danger',
      label: 'Xoá',
      icon: 'trash-2',
      title: 'Xoá',
      size: 'medium',
      disabled: () => {
        return !this.hadRowsSelected;
      },
      click: () => {
        this.deleteSelected();
        return false;
      },
    },
    {
      name: 'edit',
      status: 'warning',
      label: 'Chỉnh',
      icon: 'edit-2',
      title: 'Chỉnh sửa',
      size: 'medium',
      disabled: () => {
        return !this.hadRowsSelected;
      },
      click: () => {
        this.editSelectedItem();
        return false;
      },
    },
    {
      name: 'preview',
      status: 'primary',
      label: 'Xem',
      icon: 'external-link',
      title: 'Xem trước',
      size: 'medium',
      disabled: () => {
        return !this.hadRowsSelected;
      },
      click: () => {

        return false;
      },
    },
    {
      name: 'add',
      status: 'success',
      label: 'Tạo',
      icon: 'file-add',
      title: 'Tạo mới',
      size: 'medium',
      disabled: () => {
        return false;
      },
      click: () => {
        this.createNewItem();
        return false;
      },
    },
    {
      name: 'reset',
      status: 'info',
      label: 'Reset',
      icon: 'refresh',
      title: 'Đặt lại từ đầu',
      size: 'medium',
      disabled: () => {
        return false;
      },
      click: () => {
        this.reset();
        return false;
      },
    },
    {
      name: 'refresh',
      status: 'success',
      label: 'Refresh',
      icon: 'sync',
      title: 'Làm mới',
      size: 'medium',
      disabled: () => {
        return false;
      },
      click: () => {
        this.refresh();
        return false;
      },
    },
  ];

  @ViewChild('agGrid', { static: true }) agGrid: AgGridAngular;

  public gridApi: GridApi;
  public gridColumnApi: ColumnApi;
  // public modules: Module[] = AllCommunityModules;
  public modules: Module[] = [
    // ModuleRegistry,
    InfiniteRowModelModule,
  ];

  public gridParams;
  public columnDefs;
  public defaultColDef = {
    sortable: true,
    resizable: true,
    // suppressSizeToFit: true,
  };
  public rowSelection = 'multiple';
  public rowModelType = 'infinite';
  public pagination = false;
  public paginationPageSize = 40;
  public cacheBlockSize = this.paginationPageSize;
  public cacheOverflowSize = 10;
  public maxConcurrentDatasourceRequests = 2;
  public infiniteInitialRowCount = null;
  public maxBlocksInCache = 100;
  public getRowNodeId = (item: { id: string }) => {
    return item.id;
  }
  public components = {
    loadingCellRenderer: (params) => {
      if (params.value) {
        return params.value;
      } else {
        return '<img src="assets/images/loading.gif">';
      }
    },
  };
  public multiSortKey = 'ctrl';
  public rowDragManaged = false;
  public rowHeight: number;
  public getRowHeight;
  public hadRowsSelected = false;
  public rowData: M[];
  themeName = '';

  constructor(
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public themeService: NbThemeService,
    public ref?: NbDialogRef<AgGridDataManagerListComponent<M, F>>,
  ) {
    super(cms, router, apiService, ref);
    this.themeName = this.themeService.currentTheme == 'default' ? '' : this.themeService.currentTheme;
    this.themeService.onThemeChange().pipe(takeUntil(this.destroy$)).subscribe(theme => {
      this.themeName = theme.name == 'default' ? '' : theme.name;
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
    this.apiService.getObservable<M[]>(this.apiPath, { limit: 1 }).pipe(
      map((res) => {
        this.lastResponseHeader = res.headers;
        this.infiniteInitialRowCount = +res.headers.get('x-total-count');
        let data = res.body;
        return data;
      }),
    ).toPromise().then(rs => {
      // success(rs);
      return rs;
    });
    this.initDataSource();
  }
  filterTypeMap = {
    equals: 'eq',
    notEqual: 'ne',
    startsWith: 'right',
    endsWith: 'left',
    contains: 'filter',
  };
  initDataSource() {
    this.dataSource = {
      rowCount: null,
      getRows: (getRowParams: IGetRowsParams) => {
        console.info('asking for ' + getRowParams.startRow + ' to ' + getRowParams.endRow);

        const query = { limit: this.cacheBlockSize, offset: getRowParams.startRow };
        getRowParams.sortModel.forEach(sortItem => {
          query['sort_' + sortItem['colId']] = sortItem['sort'];
        });
        Object.keys(getRowParams.filterModel).forEach(key => {
          const condition: { filter: string, filterType: string, type: string } = getRowParams.filterModel[key];
          if(this.filterTypeMap[condition.type]){
            query[this.filterTypeMap[condition.type] + '_' + key] = condition.filter;
          }
        });

        this.executeGet(query, list => {
          list.forEach((item, index) => {
            item['No'] = (getRowParams.startRow + index + 1);
            item['id'] = item[this.idKey];
          });

          let lastRow = -1;
          if (list.length < this.paginationPageSize) {
            lastRow = getRowParams.startRow + list.length;
          }
          getRowParams.successCallback(list, lastRow);
          this.gridApi.resetRowHeights();
        });
        // this.getList(contactList => {

        // });

      },
    };
  }

  onGridReady(params) {
    this.gridParams = params;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.loadList();

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

    this.gridApi.setDatasource(this.dataSource);
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
    return this.gridApi.getSelectedRows();
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
      return item[this.idKey];
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
    this.gotoForm(event.data[this.idKey]);
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
            icon: 'back',
            status: 'info',
            action: () => { },
          },
          {
            label: 'Xoá',
            icon: 'delete',
            status: 'danger',
            action: () => {
              // this.apiService.delete(this.apiPath, ids, result => {
              //   if (callback) callback();
              // });
              this.executeDelete(ids, callback);
            },
          },
        ],
      },
    });
  }

  /** Api get funciton */
  executeGet(params: any, success: (resources: M[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: M[] | HttpErrorResponse) => void) {
    // this.apiService.get<M[]>(this.apiPath, params, success, error, complete);
    this.apiService.getObservable<M[]>(this.apiPath, params).pipe(
      map((res) => {
        this.lastResponseHeader = res.headers;
        this.infiniteInitialRowCount = +res.headers.get('x-total-count');
        let data = res.body;
        return data;
      }),
    ).toPromise().then(rs => {
      success(rs);
      return rs;
    });

  }

  /** Api delete funciton */
  executeDelete(id: any, success: (resp: any) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: any | HttpErrorResponse) => void) {
    this.apiService.delete(this.apiPath, id, success, error, complete);
  }

  // executeDelete(ids: string[], callback: (result: any) => void) {
  //   this.apiService.delete(this.apiPath, ids, result => {
  //     if (callback) callback(result);
  //   });
  // }

  /** Delete action */
  delete(event: any): void {
    this.deleteConfirm([event.data[this.idKey]], () => this.loadList());
  }

  async refresh() {
    // this.loadList();
    // this.gridApi.refreshInfiniteCache();
    // this.gridApi.refreshInfinitePageCache();
    this.gridApi.refreshInfiniteCache();
    this.updateActionState();
    return false;
  }

  reset() {
    this.gridApi.setFilterModel(null);
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

  public configSetting(settings: any[]) {
    return settings;
  }

  onColumnResized() {
    this.gridApi.resetRowHeights();
  }
}
