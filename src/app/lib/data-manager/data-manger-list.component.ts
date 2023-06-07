import { LocalDataSource, ViewCell, Ng2SmartTableComponent } from 'ng2-smart-table';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { NbDialogService, NbToastrService, NbDialogRef, NbDialogConfig } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../../modules/dialog/showcase-dialog/showcase-dialog.component';
import { OnInit, Input, AfterViewInit, Type, ViewChild, Component, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../base-component';
import { ReuseComponent } from '../reuse-component';
import { HttpErrorResponse } from '@angular/common/http';
import { SmartTableAccCurrencyComponent, SmartTableBaseComponent, SmartTableButtonComponent, SmartTableCheckboxComponent, SmartTableCurrencyComponent, SmartTableCurrencyEditableComponent, SmartTableDateTimeComponent } from '../custom-element/smart-table/smart-table.component';
import { takeUntil } from 'rxjs/operators';
import { SmartTableFilterComponent } from '../custom-element/smart-table/smart-table.filter.component';
import { ActionControl } from '../custom-element/action-control-list/action-control.interface';
import { Icon } from '../custom-element/card-header/card-header.component';
import { DataManagerFormComponent } from './data-manager-form.component';
import { DataManagerPrintComponent } from './data-manager-print.component';

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
    display?: boolean,
    page?: number,
    perPage: number,
  };
  columns: {
    [key: string]: {
      [key: string]: any,
      title: string,
      type: string,
      editable?: boolean,
      width?: string,
      exclude?: boolean,
      filterFunction?: (value: string, query: string) => boolean,
      valuePrepareFunction?: (cell: string, row?: any) => string,
      renderComponent?: any,
      onComponentInitFunction?: (instance: any) => void,
      onChange?: (value: any, rowData: any, instance?: ViewCell) => void,
    },
  };
}

@Component({ template: '' })
export abstract class DataManagerListComponent<M> extends BaseComponent implements OnInit, AfterViewInit, ReuseComponent {

  editing = {};
  rows = [];
  hasSelect = 'none';
  settings: SmartTableSetting;
  formDialog: Type<DataManagerFormComponent<M>>;
  printDialog: Type<DataManagerPrintComponent<M>>;
  @ViewChild('table') table: Ng2SmartTableComponent;

  /** Seleted ids */
  selectedIds: (string | any)[] = [];
  selectedItems: M[] = [];

  /** Local dat source */
  source: LocalDataSource = new LocalDataSource();

  abstract formPath: string;

  /** Restful api path */
  abstract apiPath: string;

  /** Resource id key */
  abstract idKey: string | string[];

  protected refreshPendding = false;
  @Input() onDialogChoose?: (chooseItems: M[]) => void;
  @Output() onItemsChoosed = new EventEmitter<M[]>();

  favicon: Icon = { pack: 'eva', name: 'list', size: 'medium', status: 'primary' };
  @Input() title?: string;
  @Input() size?: string = 'medium';
  @Input() actionButtonList?: ActionControl[] = [];

  @Input() extendActionButtons: ActionControl[] = [];
  @Input() hideChooseButton: boolean = false;

  smartTable: Ng2SmartTableComponent;
  @ViewChild('smartTable') set content(content: Ng2SmartTableComponent) {
    if (content) { // initially setter gets called with undefined
      this.smartTable = content;

      // handle change page event
      const $this = this;
      this.smartTable.changePage = (function (_super) {
        return function () {
          $this.selectedIds = [];
          $this.selectedItems = [];
        };

      })(this.smartTable.changePage);
    }
  }

  constructor(
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public ref?: NbDialogRef<DataManagerListComponent<M>>,
  ) {
    super(cms, router, apiService, ref);
  }

  async getFormData(ids: string[]): Promise<M[]> {
    return [];
  }

  // preview(data: any[]) {
  //   return true;
  // }

  async init(): Promise<boolean> {
    return super.init().then(async state => {

      // Wait for langluage service loaded
      this.actionButtonList = [
        ...this.extendActionButtons.map(m => ({
          ...m,
          click: (event, option) => {
            m.click(event, option, this);
          }
        })),
        {
          name: 'choose',
          status: 'primary',
          label: this.cms.textTransform(this.cms.translate.instant('Common.choose'), 'head-title'),
          icon: 'checkmark-square',
          title: this.cms.textTransform(this.cms.translate.instant('Common.choose'), 'head-title'),
          size: 'medium',
          disabled: () => this.selectedIds.length === 0,
          hidden: () => !this.isChoosedMode || this.hideChooseButton,
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
          title: this.cms.textTransform(this.cms.translate.instant('Common.createNew'), 'head-title'),
          size: 'medium',
          disabled: () => {
            return false;
          },
          hidden: () => this.isChoosedMode,
          click: () => {
            this.openForm();
            return false;
          },
        },
        {
          name: 'delete',
          status: 'danger',
          label: 'Xoá',
          icon: 'trash-2',
          title: this.cms.textTransform(this.cms.translate.instant('Common.delete'), 'head-title'),
          size: 'medium',
          disabled: () => this.selectedIds.length === 0,
          hidden: () => this.isChoosedMode,
          click: () => {
            this.deleteConfirm(this.selectedIds.map(item => this.makeId(item)), () => this.loadList());
          },
        },
        {
          name: 'edit',
          status: 'warning',
          label: 'Chỉnh',
          icon: 'edit-2',
          title: this.cms.textTransform(this.cms.translate.instant('Common.edit'), 'head-title'),
          size: 'medium',
          disabled: () => this.selectedIds.length === 0,
          hidden: () => this.isChoosedMode,
          click: () => {
            this.openForm(this.selectedIds);
          },
        },
        {
          name: 'preview',
          status: 'primary',
          label: 'Xem',
          icon: 'external-link',
          title: this.cms.textTransform(this.cms.translate.instant('Common.preview'), 'head-title'),
          size: 'medium',
          disabled: () => this.selectedIds.length === 0,
          hidden: () => this.isChoosedMode,
          click: () => {
            // this.getFormData(this.selectedIds).then(data => {
            // });
            this.preview(this.selectedItems);
            return false;
          },
        },
        {
          name: 'reset',
          status: 'info',
          // label: 'Reset',
          icon: 'refresh-outline',
          title: this.cms.textTransform(this.cms.translate.instant('Common.reset'), 'head-title'),
          size: 'medium',
          // disabled: () => {
          //   return false;
          // },
          click: () => {
            this.reset();
            return false;
          },
        },
        // {
        //   name: 'refresh',
        //   status: 'success',
        //   // label: 'Refresh',
        //   icon: 'sync',
        //   title: this.cms.textTransform(this.cms.translate.instant('Common.refresh'), 'head-title'),
        //   size: 'medium',
        //   disabled: () => {
        //     return false;
        //   },
        //   click: () => {
        //     this.refresh();
        //     return false;
        //   },
        // },
        // {
        //   name: 'close',
        //   status: 'danger',
        //   // label: 'Refresh',
        //   icon: 'close',
        //   title: this.cms.textTransform(this.cms.translate.instant('Common.close'), 'head-title'),
        //   size: 'medium',
        //   disabled: () => false,
        //   hidden: () => !this.ref || Object.keys(this.ref).length === 0 ? true : false,
        //   click: () => {
        //     this.close();
        //     return false;
        //   },
        // },
        ...this.actionButtonList,
      ];
      await this.loadCache();
      this.onAfterInit && this.onAfterInit(this);
      this.settings = this.loadListSetting();
      return state;
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
    this.loadList();
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  getList(callback: (list: M[]) => void) {
    this.cms.takeUntil(this.componentName, 300, () => {
      // this.executeGet({ limit: 999999999, offset: 0 }, results => callback(results));
      this.executeGet({ limit: 'nolimit', offset: 0 }, results => callback(results));
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
      if (this.idKey instanceof Array) {
        const id: any = {};
        for (let i = 0; i < this.idKey.length; i++) {
          id[this.idKey[i]] = this.cms.getObjectId(item[this.idKey[i]]);
        }
        return id;
      }
      return item[this.idKey as string];
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

  makeId(item: M) {
    if (typeof item === 'string') return item;
    if (Array.isArray(this.idKey)) {
      return this.idKey.map(key => this.encodeId(item[key])).join('-');
    }
    return item[this.idKey];
  }

  /** Edit event */
  onEditAction(event: { data: M }) {
    // this.router.navigate(['modules/manager/form', event.data[this.idKey]]);
    this.openForm([this.makeId(event.data)]);
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
              this.openForm(this.selectedIds);
            },
          },
        ],
      },
    });
    return false;
  }

  deleteConfirm(ids: string[], callback?: () => void) {
    this.cms.openDialog(ShowcaseDialogComponent, {
      context: {
        title: 'Xác nhận xoá dữ liệu',
        content: 'Dữ liệu sẽ bị xoá, bạn chắc chắn chưa ?',
        actions: [
          {
            label: 'Trở về',
            icon: 'arrow-ios-back',
            status: 'info',
            action: () => { },
          },
          {
            label: 'Xoá',
            icon: 'trash-2',
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
  async executeDelete(ids: any, success: (resp: any) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: any | HttpErrorResponse) => void) {
    // const deletedItems = await this.convertIdsToItems(ids);
    return this.apiService.deletePromise(this.apiPath, ids).then(resp => {
      // this.removeGridItems(deletedItems);
      this.refresh();
      if (success) success(resp);
      if (complete) complete(resp);
    }).catch(err => {
      if (error) error(err);
      return Promise.reject(err);
    });
  }

  // executeDelete(ids: string[], callback: (result: any) => void) {
  //   this.apiService.delete(this.apiPath, ids, result => {
  //     if (callback) callback(result);
  //   });
  // }

  /** Delete action */
  delete(event: any): void {
    this.deleteConfirm([this.makeId(event.data)], () => this.loadList());
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

  async refresh() {
    this.loadList(() => {
      this.syncSelectedStatus();
    });
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
  protected configPaging(): any {
    return {
      display: true,
      perPage: 100,
      // perPageSelect: [1,2,3]
    };
  }

  abstract loadListSetting(): SmartTableSetting;

  /** Config for stmart table setttings */
  protected configSetting(settings: SmartTableSetting) {

    if (typeof settings.add === 'undefined') {
      settings.add = this.configAddButton();
    }
    if (typeof settings.edit === 'undefined') {
      settings.edit = this.configEditButton();
    }
    if (typeof settings.delete === 'undefined') {
      settings.delete = this.configDeleteButton();
    }
    if (typeof settings.pager === 'undefined') {
      settings.pager = this.configPaging();
    }
    if (typeof settings.mode === 'undefined') {
      settings.mode = 'external';
    }
    if (typeof settings.selectMode === 'undefined') {
      settings.selectMode = 'multi';
    }
    if (typeof settings.actions === 'undefined') {
      settings.actions = this.isChoosedMode ? false : {
        position: 'right',
      };
    }

    // Set default filter function
    // Object.keys(settings.columns).forEach(key => {
    for (const key of Object.keys(settings.columns)) {
      if (settings.columns[key]?.exclude) {
        delete settings.columns[key];
        continue;
      }
      const column = settings.columns[key];
      if (!settings.columns[key]['filterFunction']) {
        settings.columns[key]['filterFunction'] = (value: string, query: string) => this.cms.smartFilter(value, query);
      }

      if (column.type === 'boolean') {
        column.type = 'custom';
        column.renderComponent = SmartTableCheckboxComponent;
        column.onComponentInitFunction = (instance: SmartTableCheckboxComponent) => {
          instance.disabled = !column.editable;
          instance.valueChange.asObservable().pipe(takeUntil(this.destroy$)).subscribe(value => {
            if (column.onChange) {
              column.onChange(value, instance.rowData, instance);
            }
          });
        };
      }

      // if (column.type === 'currency-editable') {
      //   column.type = 'custom';
      //   column.renderComponent = SmartTableCheckboxComponent;
      //   column.onComponentInitFunction = (instance: SmartTableCheckboxComponent) => {
      //     instance.disabled = !column.editable;
      //     instance.valueChange.asObservable().pipe(takeUntil(this.destroy$)).subscribe(value => {
      //       if (column.onChange) {
      //         column.onChange(value, instance.rowData, instance);
      //       }
      //     });
      //   };
      // }

      if (column.type === 'currency-editable') {
        column.type = 'custom';
        column.renderComponent = SmartTableCurrencyEditableComponent;
        column.onComponentInitFunction = (instance: SmartTableCurrencyEditableComponent) => {
          instance.disabled = !column.editable;
          instance.placeholder = column.title;
          instance.name = key;
          if (column.delay) {
            instance.delay = column.delay;
          }
          instance.valueChange.asObservable().pipe(takeUntil(this.destroy$)).subscribe(value => {
            if (column.onChange) {
              column.onChange(value, instance.rowData, instance);
            }
          });
        };
      }

      if (column.type === 'currency') {
        column.type = 'custom';
        column.class = 'align-right';
        column.position = 'right';
        column.renderComponent = SmartTableCurrencyComponent;
        column.onComponentInitFunction = (instance: SmartTableCurrencyComponent) => {
          instance.style = 'text-align: right';
        };
      }
      if (column.type === 'acc-currency') {
        column.type = 'custom';
        column.class = 'align-right';
        column.position = 'right';
        column.renderComponent = SmartTableAccCurrencyComponent;
        column.onComponentInitFunction = (instance: SmartTableAccCurrencyComponent) => {
          instance.style = 'text-align: right';
        };
      }

      if (column.type === 'datetime') {
        column.type = 'custom';
        column.renderComponent = SmartTableDateTimeComponent;
        column.onComponentInitFunction = (instance: SmartTableDateTimeComponent) => {
          instance.disabled = !column.editable;
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

      const current_onComponentInitFunction = column.onComponentInitFunction;
      column.onComponentInitFunction = (instance: SmartTableBaseComponent) => {
        current_onComponentInitFunction && current_onComponentInitFunction(instance);
        instance.name = key;
      };

      // });
    }

    if (!this.hideChooseButton && this.isChoosedMode) {
      settings.columns['Choose'] = {
        title: this.cms.translateText('Common.choose'),
        type: 'custom',
        width: '10%',
        renderComponent: SmartTableButtonComponent,
        onComponentInitFunction: (instance: SmartTableButtonComponent) => {
          instance.iconPack = 'eva';
          instance.icon = 'checkmark-square';
          instance.label = this.cms.translateText('Common.choose');
          instance.display = true;
          instance.status = 'primary';
          instance.outline = true;
          instance.valueChange.subscribe(value => {
            // if (value) {
            //   instance.disabled = false;
            // } else {
            //   instance.disabled = true;
            // }
          });
          instance.click.subscribe(async (row: M) => {

            if (this.onDialogChoose) {
              this.onDialogChoose([row]);
            }
            this.onItemsChoosed.emit([row]);
            this.close();

          });
        },
      };
    }

    return settings;
  }

  async convertIdsToItems(ids: string[], source?: LocalDataSource) {
    this.source['isLocalUpdate'] = true;
    const editedItems = (await (source || this.source).getElements()).filter((f: M) => ids.some(id => id === f[this.idKey as string]));
    (source || this.source)['isLocalUpdate'] = false;
    return editedItems;
  }

  /** Implement required */
  async openFormDialog(ids?: string[], formDialog?: Type<DataManagerFormComponent<M>>) {
    return new Promise<{ event: string, data?: M[] }>(async resolve => {
      ids = ids || [];
      // this.source['isLocalUpdate'] = true;
      // const editedItems = (await this.source.getElements()).filter((f: M) => ids.some(id => id === f[this.idKey]));
      // this.source['isLocalUpdate'] = false;
      try {
        this.cms.openDialog<DataManagerFormComponent<M>>(formDialog || this.formDialog, {
          context: {
            showLoadinng: true,
            inputMode: 'dialog',
            inputId: ids,
            onDialogSave: (newData: M[]) => {
              resolve({ event: 'save', data: newData });
              this.refresh();
              // if (editedItems && editedItems.length > 0) {
              //   this.updateGridItems(editedItems, newData);
              // } else {
              //   this.prependGridItems(newData);
              // }
            },
            onDialogClose: () => {
              resolve({ event: 'close' });
            },
          },
          closeOnEsc: false,
          closeOnBackdropClick: false,
        });
      } catch (e) {
        this.source['isLocalUpdate'] = false;
        throw Error(e);
      }
    });

  }

  async updateGridItems(items: M[], updatedData: M[]) {
    this.source['isLocalUpdate'] = true;
    for (let i = 0; i < items.length; i++) {
      await this.source.update(items[i], updatedData.find(dt => dt[this.idKey as string] === items[i][this.idKey as string]));
    }
    this.source['isLocalUpdate'] = false;
  }

  async prependGridItems(items: M[]) {
    this.source['isLocalUpdate'] = true;
    for (let i = 0; i < items.length; i++) {
      await this.source.prepend(items[i]);
    }
    this.source['isLocalUpdate'] = false;
    setTimeout(() => {
      this.syncSelectedStatus();
    });
  }

  async removeGridItems(items: M[]) {
    this.source['isLocalUpdate'] = true;
    for (let i = 0; i < items.length; i++) {
      await this.source.remove(items[i]);
    }
    this.source['isLocalUpdate'] = false;
    setTimeout(() => {
      const rows = this.table.grid.getRows().filter(row => (this.selectedItems.some(item => item[this.idKey as string] === row.getData()[this.idKey as string]) && items.some(item => item[this.idKey as string] !== row.getData()[this.idKey as string])));
      for (let j = 0; j < rows.length; j++) {
        this.table.grid.multipleSelectRow(rows[j]);
      }
    }, 100);
  }

  syncSelectedStatus() {
    const selectedItems: M[] = [];
    const rows = this.table.grid.getRows()
      .filter(row => this.selectedItems
        .some(item => this.idKey instanceof Array
          ? (this.idKey.filter(idKey => this.cms.getObjectId(item[idKey]) === this.cms.getObjectId(row.getData()[idKey]))
            .length === this.idKey.length)
          : item[this.idKey as string] === row.getData()[this.idKey as string]));
    for (let i = 0; i < rows.length; i++) {
      this.table.grid.multipleSelectRow(rows[i]);
      selectedItems.push(rows[i].getData());
    }
    this.selectedItems = selectedItems;
  }

  selectAll() {
    const rows = this.table.grid.getRows();
    for (let i = 0; i < rows.length; i++) {
      this.table.grid.multipleSelectRow(rows[i]);
    }
  }

  unselectAll() {
    this.selectedItems = [];
    this.table.grid.selectAllRows(false);
  }

  choose() {
    if (this.onDialogChoose) {
      this.onDialogChoose(this.selectedItems);
      this.onChoose(this.selectedItems);
      // this.close();
    }
  }

  setPaging(page: number, limit: number, doEmit?: boolean) {
    this.source.setPaging(page, limit, doEmit);
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

  get isChoosedMode() {
    return this.ref && Object.keys(this.ref).length > 0;
  }

  async preview<T>(data: M[], source?: string, userConfig?: Partial<NbDialogConfig<Partial<T> | string>>) {
    if (!this.printDialog) {
      console.log('Print dialog was not set');
      return false;
    };
    this.cms.openDialog(this.printDialog, {
      // closeOnEsc: false,
      context: {
        showLoadinng: true,
        title: 'Xem trước',
        id: data.map(m => this.makeId(m)),
        sourceOfDialog: 'list',
        mode: 'print',
        idKey: ['Code'],
        // approvedConfirm: true,
        onChange: (data: M) => {
          // this.refresh();
          this.refreshItems([this.makeId(data)]);
        },
        onSaveAndClose: (data: M) => {
          // this.refresh();
          this.refreshItems([this.makeId(data)]);
        },
      },
      ...(userConfig || {})
    });
    return false;
  }

  async refreshItems(ids: string[]): Promise<M[]> {
    return [];
  }
}
