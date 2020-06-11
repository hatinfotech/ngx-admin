import { LocalDataSource } from 'ng2-smart-table';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../../modules/dialog/showcase-dialog/showcase-dialog.component';
import { OnInit } from '@angular/core';
import { BaseComponent } from '../base-component';
import { ReuseComponent } from '../reuse-component';
import { HttpErrorResponse } from '@angular/common/http';
import { SmartTableCheckboxComponent } from '../custom-element/smart-table/smart-table.component';
import { takeUntil } from 'rxjs/operators';

export class SmartTableSetting {
  mode?: string;
  selectMode?: string;
  actions?: Boolean | {
    position?: string;
  };
  // actions?: string | number | Boolean;
  add?: {
    addButtonContent: string,
    createButtonContent: string,
    cancelButtonContent: string,
  };
  edit?: {
    editButtonContent: string,
    saveButtonContent: string,
    cancelButtonContent: string,
  };
  delete?: {
    deleteButtonContent: string,
    confirmDelete: boolean,
  };
  pager?: {
    display: boolean,
    perPage: number,
  };
  columns: {
    [key: string]: {
      [key: string]: any,
      title: string,
      type: string,
      editable?: boolean,
      width?: string,
      filterFunction?: (value: string, query: string) => boolean,
      valuePrepareFunction?: (cell: string, row?: any) => string,
      renderComponent?: any,
      onComponentInitFunction?: (instance: any) => void,
      onChange?: (value: any, rowData: any) => void,
    },
  };
}

export abstract class DataManagerListComponent<M> extends BaseComponent implements OnInit, ReuseComponent {

  editing = {};
  rows = [];
  hasSelect = 'none';
  settings: SmartTableSetting;

  /** Seleted ids */
  selectedIds: string[] = [];

  /** Local dat source */
  source: LocalDataSource = new LocalDataSource();

  abstract formPath: string;

  /** Restful api path */
  abstract apiPath: string;

  /** Resource id key */
  abstract idKey: string;

  protected refreshPendding = false;

  constructor(
    protected apiService: ApiService,
    protected router: Router,
    protected commonService: CommonService,
    protected dialogService: NbDialogService,
    protected toastService: NbToastrService,
  ) {
    super(commonService, router, apiService);
  }

  /** List init event */
  ngOnInit() {
    super.ngOnInit();
    this.subcriptions.push(this.commonService.componentChange$.subscribe(info => {
      if (info.componentName === this.componentName) {
        this.refreshPendding = true;
      }
    }));
    this.loadList();
  }

  getList(callback: (list: M[]) => void) {
    this.commonService.takeUntil(this.componentName, 300, () => {
      this.executeGet({ limit: 999999999, offset: 0 }, results => callback(results));
    });
  }

  /** Get data from api and push to list */
  loadList(callback?: (list: M[]) => void) {
    this.selectedIds = [];
    this.hasSelect = 'none';
    this.getList(list => {
      this.source.load(list.map((item, index) => {
        if (!item['No']) {
          item['No'] = index + 1;
        }
        return item;
      }));
      if (callback) callback(list);
    });
  }

  onReloadBtnClick(): false {
    // this.source.reset();
    this.loadList();
    return false;
  }

  showFilter(event) {
    this.dialogService.open(ShowcaseDialogComponent, {
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
      // this.dialogService.open(ShowcaseDialogComponent, {
      //   context: {
      //     title: 'Xác nhận',
      //     content: 'Bạn muốn chỉnh sửa các dữ liệu đã chọn hay xoá chúng ?',
      //     actions: [
      //       {
      //         label: 'Xoá',
      //         icon: 'delete',
      //         status: 'danger',
      //         action: () => {
      //           this.deleteConfirm(this.selectedIds, () => this.loadList());
      //         },
      //       },
      //       {
      //         label: 'Trở về',
      //         icon: 'back',
      //         status: 'success',
      //         action: () => { },
      //       },
      //       {
      //         label: 'Chỉnh',
      //         icon: 'edit',
      //         status: 'warning',
      //         action: () => {
      //           // this.router.navigate(['modules/manager/form/', this.selectedIds.join('-')]);
      //           this.gotoForm(this.selectedIds.map(item => encodeURIComponent(item)).join(encodeURIComponent('&')));
      //         },
      //       },
      //     ],
      //   },
      // });
    } else {
      // this.router.navigate(['modules/manager/form']);
      this.gotoForm();
    }
  }

  editChoosedItems(): false {
    this.dialogService.open(ShowcaseDialogComponent, {
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

  deleteConfirm(ids: string[], callback?: () => void) {
    this.dialogService.open(ShowcaseDialogComponent, {
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
    this.apiService.get<M[]>(this.apiPath, params, success, error, complete);
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
    //   if (window.confirm('Bạn có muốn xoá dữ liệu \'' + event.data.Name + '\' không?')) {
    //     this.apiService.delete(this.apiPath, event.data.Name, result => {
    //       // event.confirm.resolve();
    //       // event._dataSet.data.splice(event.index, 1);
    //       this.source.remove(event.data);
    //     });
    //   } else {
    //     event.confirm.reject();
    //   }
  }

  refresh() {
    this.loadList();
  }

  onResume() {
    super.onResume();
    if (this.refreshPendding) {
      this.refreshPendding = false;
      this.refresh();
    }
  }

  /** Config for add button */
  protected configAddButton() {
    return {
      addButtonContent: '<i class="nb-edit"></i> <i class="nb-trash"></i> <i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    };
  }

  /** Config for add button */
  protected configFilterButton() {
    return {
      addButtonContent: '<i class="nb-search"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    };
  }

  /** Config for edit button */
  protected configEditButton() {
    return {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    };
  }

  /** Config for delete button */
  protected configDeleteButton() {
    return {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    };
  }

  /** Config for paging */
  protected configPaging() {
    return {
      display: true,
      perPage: 100,
    };
  }

  /** Config for stmart table setttings */
  protected configSetting(settings: SmartTableSetting) {

    // Set default filter function
    Object.keys(settings.columns).forEach(key => {
      const column = settings.columns[key];
      if (!settings.columns[key]['filterFunction']) {
        settings.columns[key]['filterFunction'] = (value: string, query: string) => this.commonService.smartFilter(value, query);
      }

      if (column.type === 'boolean') {
        column.type = 'custom';
        column.renderComponent = SmartTableCheckboxComponent;
        column.onComponentInitFunction = (instance: SmartTableCheckboxComponent) => {
          instance.disable = !column.editable;
          instance.valueChange.asObservable().pipe(takeUntil(this.destroy$)).subscribe(value => {
            // console.info(value);
            if (column.onChange) {
              column.onChange(value, instance.rowData);
            }
          });
          // instance.iconPack = 'eva';
          // instance.icon = 'play-circle-outline';
          // instance.label = 'Play';
          // instance.display = true;
          // instance.status = 'warning';
          // instance.valueChange.subscribe(value => {
          //   if (value) {
          //     instance.disabled = false;
          //   } else {
          //     instance.disabled = true;
          //   }
          // });
          // instance.click.subscribe((row: any) => {

          // });
        };
      }

    });

    return settings;
  }

  reset() {
    this.source.reset();
    return false;
  }
}
