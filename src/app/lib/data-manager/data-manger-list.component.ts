import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../../modules/dialog/showcase-dialog/showcase-dialog.component';
import { OnInit, Input, AfterViewInit, Type } from '@angular/core';
import { BaseComponent } from '../base-component';
import { ReuseComponent } from '../reuse-component';
import { HttpErrorResponse } from '@angular/common/http';
import { SmartTableCheckboxComponent } from '../custom-element/smart-table/smart-table.component';
import { takeUntil } from 'rxjs/operators';
import { SmartTableFilterComponent } from '../custom-element/smart-table/smart-table.filter.component';
import { ActionControl } from '../custom-element/action-control-list/action-control.interface';
import { Icon } from '../custom-element/card-header/card-header.component';
import { DataManagerFormComponent } from './data-manager-form.component';

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
      onChange?: (value: any, rowData: any, instance?: ViewCell) => void,
    },
  };
}

export abstract class DataManagerListComponent<M> extends BaseComponent implements OnInit, AfterViewInit, ReuseComponent {

  editing = {};
  rows = [];
  hasSelect = 'none';
  settings: SmartTableSetting;
  formDialog: Type<DataManagerFormComponent<M>>;

  /** Seleted ids */
  selectedIds: string[] = [];
  selectedItems: M[] = [];

  /** Local dat source */
  source: LocalDataSource = new LocalDataSource();

  abstract formPath: string;

  /** Restful api path */
  abstract apiPath: string;

  /** Resource id key */
  abstract idKey: string;

  protected refreshPendding = false;
  @Input() onDialogChoose?: (chooseItems: M[]) => void;

  favicon: Icon = { pack: 'eva', name: 'list', size: 'medium', status: 'primary' };
  @Input() title?: string;
  @Input() size?: string = 'medium';
  actionButtonList: ActionControl[] = [
    {
      name: 'choose',
      status: 'success',
      // label: 'Refresh',
      icon: 'checkmark-square',
      title: this.commonService.textTransform(this.commonService.translate.instant('Common.close'), 'head-title'),
      size: 'medium',
      disabled: () => this.selectedIds.length === 0,
      hidden: () => !this['ref'] || Object.keys(this['ref']).length === 0 ? true : false,
      click: () => {
        this.choose();
        return false;
      },
    },
    {
      name: 'add',
      status: 'success',
      label: 'Tạo',
      icon: 'plus',
      title: this.commonService.textTransform(this.commonService.translate.instant('Common.createNew'), 'head-title'),
      size: 'medium',
      disabled: () => {
        return false;
      },
      click: () => {
        this.openForm();
        return false;
      },
    },
    {
      name: 'delete',
      status: 'warning',
      label: 'Xoá',
      icon: 'trash-2',
      title: this.commonService.textTransform(this.commonService.translate.instant('Common.delete'), 'head-title'),
      size: 'medium',
      disabled: () => this.selectedIds.length === 0,
      click: () => {
        this.deleteConfirm(this.selectedIds, () => this.loadList());
      },
    },
    {
      name: 'edit',
      status: 'warning',
      label: 'Chỉnh',
      icon: 'edit-2',
      title: this.commonService.textTransform(this.commonService.translate.instant('Common.edit'), 'head-title'),
      size: 'medium',
      disabled: () => this.selectedIds.length === 0,
      click: () => {
        this.openForm(this.selectedIds);
      },
    },
    {
      name: 'preview',
      status: 'primary',
      label: 'Xem',
      icon: 'external-link',
      title: this.commonService.textTransform(this.commonService.translate.instant('Common.preview'), 'head-title'),
      size: 'medium',
      disabled: () => this.selectedIds.length === 0,
      click: () => {

        return false;
      },
    },
    // {
    //   name: 'reset',
    //   status: 'info',
    //   // label: 'Reset',
    //   icon: 'refresh',
    //   title: this.commonService.textTransform(this.commonService.translate.instant('Common.reset'), 'head-title'),
    //   size: 'small',
    //   disabled: () => {
    //     return false;
    //   },
    //   click: () => {
    //     this.reset();
    //     return false;
    //   },
    // },
    {
      name: 'refresh',
      status: 'success',
      // label: 'Refresh',
      icon: 'sync',
      title: this.commonService.textTransform(this.commonService.translate.instant('Common.refresh'), 'head-title'),
      size: 'medium',
      disabled: () => {
        return false;
      },
      click: () => {
        this.refresh();
        return false;
      },
    },
    {
      name: 'close',
      status: 'danger',
      // label: 'Refresh',
      icon: 'close',
      title: this.commonService.textTransform(this.commonService.translate.instant('Common.close'), 'head-title'),
      size: 'medium',
      disabled: () => false,
      hidden: () => !this['ref'] || Object.keys(this['ref']).length === 0 ? true : false,
      click: () => {
        this.close();
        return false;
      },
    },
  ];

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
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

  // ngAfterViewInit(): void {
  //   // const nativeEle = this;
  //   // Fix dialog scroll
  //   if (this['ref']) {
  //     const dialog: NbDialogRef<DataManagerListComponent<M>> = this['ref'];
  //     if (dialog && dialog.componentRef && dialog.componentRef.location && dialog.componentRef.location.nativeElement) {
  //       const nativeEle = dialog.componentRef.location.nativeElement;
  //       // tslint:disable-next-line: ban
  //       const compoentNativeEle = $(nativeEle);
  //       const overlayWraper = compoentNativeEle.closest('.cdk-global-overlay-wrapper');
  //       const overlayBackdrop = overlayWraper.prev();

  //       this['ref'].hide = () => {
  //         overlayWraper.fadeOut(100);
  //         overlayBackdrop.fadeOut(100);
  //         this.onDialogHide();
  //       };

  //       compoentNativeEle.closest('.cdk-global-overlay-wrapper').addClass('dialog');
  //       console.log(compoentNativeEle);
  //     }
  //   }
  // }

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

  openForm(ids?: string[]) {
    if (this.formDialog) {
      this.openFormDialog(ids);
    } else {
      this.gotoForm(ids && ids.length > 0 ? ids.map(item => encodeURIComponent(item)).join(encodeURIComponent('&')) : null);
    }
  }

  /** User select event */
  onUserRowSelect(event: any) {
    this.selectedItems = event.selected;
    this.selectedIds = event.selected.map((item: M) => {
      return item[this.idKey];
    });
    // console.info(event);
    // if (this.selectedIds.length > 0) {
    //   this.hasSelect = 'selected';
    // } else {
    //   this.hasSelect = 'none';
    // }
  }

  /** Row select event */
  onRowSelect(event) {
    // console.info(event);
  }

  /** Edit event */
  onEditAction(event: { data: M }) {
    // this.router.navigate(['modules/manager/form', event.data[this.idKey]]);
    this.openForm([event.data[this.idKey]]);
  }

  /** Create and multi edit/delete action */
  onSerialAction(event: any) {
    // if (this.selectedIds.length > 0) {
    //   this.editChoosedItems();
    // } else {
    //   // this.router.navigate(['modules/manager/form']);
    //   this.gotoForm();
    // }
    this.reset();
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
              this.openForm(this.selectedIds);
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
      addButtonContent: '<i class="nb-loop"></i>',
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

    if (!settings.add) {
      settings.add = this.configAddButton();
    }
    if (!settings.edit) {
      settings.edit = this.configEditButton();
    }
    if (!settings.delete) {
      settings.delete = this.configDeleteButton();
    }

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
            if (column.onChange) {
              column.onChange(value, instance.rowData, instance);
            }
          });
        };
      }

      if (column.type === 'currency-editable') {
        column.type = 'custom';
        column.renderComponent = SmartTableCheckboxComponent;
        column.onComponentInitFunction = (instance: SmartTableCheckboxComponent) => {
          instance.disable = !column.editable;
          instance.valueChange.asObservable().pipe(takeUntil(this.destroy$)).subscribe(value => {
            if (column.onChange) {
              column.onChange(value, instance.rowData, instance);
            }
          });
        };
      }

      if (typeof column['filter'] === 'undefined') {
        column['filter'] = {
          type: 'custom',
          component: SmartTableFilterComponent,
        };
      }

    });

    return settings;
  }

  /** Implement required */
  async openFormDialog(ids?: string[], formDialog?: Type<DataManagerFormComponent<M>>) {
    return new Promise<{ event: string, data?: M[] }>(resolve => {
      this.dialogService.open<DataManagerFormComponent<M>>(formDialog || this.formDialog, {
        context: {
          inputMode: 'dialog',
          inputId: ids,
          onDialogSave: (newData: M[]) => {
            resolve({ event: 'save', data: newData });
            this.refresh();
          },
          onDialogClose: () => {
            resolve({ event: 'close' });
          },
        },
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    });

  }

  choose() {
    if (this.onDialogChoose) {
      this.onDialogChoose(this.selectedItems);
      this.onChoose(this.selectedItems);
      // this.close();
    }
  }

  onChoose(selectedItems: M[]) {
    if (this.reuseDialog) {
      this.hide();
    } else {
      this.close();
    }
  }

  reset() {
    this.source.reset();
    return false;
  }
}
