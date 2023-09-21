import { IdTextModel } from '../../../../models/common.model';
import { ProductUnitModel } from '../../../../models/product.model';
import { AdminProductService } from '../../admin-product.service';
import { Component, OnInit, Input } from '@angular/core';
import { ProductModel, ProductCategoryModel, ProductGroupModel } from '../../../../models/product.model';
import { ApiService } from '../../../../services/api.service';
import { RootServices } from '../../../../services/root.services';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService, NbDialogRef, NbThemeService } from '@nebular/theme';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ProductFormComponent } from '../product-form/product-form.component';
import { AssignCategoriesFormComponent } from '../assign-categories-form/assign-categories-form.component';
import { filter, take, takeUntil } from 'rxjs/operators';
// import { _ } from '@ag-grid-community/all-modules';
import { WarehouseGoodsContainerModel } from '../../../../models/warehouse.model';
import { ImportProductDialogComponent } from '../import-products-dialog/import-products-dialog.component';
import { AgGridDataManagerListComponent } from '../../../../lib/data-manager/ag-grid-data-manger-list.component';
import { ColDef, IGetRowsParams } from '@ag-grid-community/core';
import { agMakeCommandColDef } from '../../../../lib/custom-element/ag-list/column-define/command.define';
import { AgDateCellRenderer } from '../../../../lib/custom-element/ag-list/cell/date.component';
import { AgTextCellRenderer } from '../../../../lib/custom-element/ag-list/cell/text.component';
import { agMakeTagsColDef } from '../../../../lib/custom-element/ag-list/column-define/tags.define';
import { AgSelect2Filter } from '../../../../lib/custom-element/ag-list/filter/select2.component.filter';
import { agMakeSelectionColDef } from '../../../../lib/custom-element/ag-list/column-define/selection.define';
import { AppModule } from '../../../../app.module';
import { agMakeImageColDef } from '../../../../lib/custom-element/ag-list/column-define/image.define';
import { agMakeTextColDef } from '../../../../lib/custom-element/ag-list/column-define/text.define';

@Component({
  selector: 'ngx-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent extends AgGridDataManagerListComponent<ProductModel, ProductFormComponent> implements OnInit {

  componentName: string = 'ProductListComponent';
  formPath = '/admin-product/product/form';
  apiPath = '/admin-product/products';
  idKey: string | string[] = 'Code';
  formDialog = ProductFormComponent;

  @Input() reuseDialog = true;
  static _dialog: NbDialogRef<ProductListComponent>;

  // Smart table
  static filterConfig: any;
  static sortConf: any;
  static pagingConf = { page: 1, perPage: 40 };

  // Category list for filter
  categoryList: ProductCategoryModel[] = [];
  groupList: ProductGroupModel[] = [];
  unitList: ProductUnitModel[] = [];
  containerList: WarehouseGoodsContainerModel[] = [];
  // @Input() rowMultiSelectWithClick = true;
  // @Input() suppressRowClickSelection = false;

  @Input() width = '100%';
  @Input() height = '100%';

  shelfList: IdTextModel[];
  // @ViewChild('smartTable', { static: false }) smartTable: Ng2SmartTableComponent;

  // private smartTable: Ng2SmartTableComponent;

  @Input() pagingConfig: { display: boolean, perPage: number }

  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<ProductListComponent>,
    public adminProductService: AdminProductService,
    public themeService: NbThemeService,
  ) {
    super(rsv, apiService, router, cms, dialogService, toastService, themeService, ref);

    // this.defaultColDef = {
    //   ...this.defaultColDef,
    //   cellClass: 'ag-cell-items-center',
    // }

  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  /** Config for paging */
  protected configPaging() {
    if (this.pagingConfig) {
      return {
        ...super.configPaging(),
        ...this.pagingConfig,
      };
    }
    return super.configPaging();
  }

  async loadCache() {
    // iniit category
    this.categoryList = (await this.apiService.getPromise<ProductCategoryModel[]>('/admin-product/categories', { limit: 'nolimit' })).map(cate => ({ ...cate, id: cate.Code, text: cate.Name })) as any;
    this.groupList = (await this.apiService.getPromise<ProductGroupModel[]>('/admin-product/groups', { limit: 'nolimit' })).map(cate => ({ ...cate, id: cate.Code, text: cate.Name })) as any;
    // this.unitList = (await this.apiService.getPromise<UnitModel[]>('/admin-product/units', { includeIdText: true, limit: 'nolimit' }));
    this.containerList = (await this.apiService.getPromise<WarehouseGoodsContainerModel[]>('/warehouse/goods-containers', { includePath: true, includeIdText: true, limit: 'nolimit' })).map(container => ({ ...container, text: `${container.FindOrder} - ${container.Path}` })) as any;
    this.shelfList = (await this.apiService.getPromise<WarehouseGoodsContainerModel[]>('/warehouse/goods-containers', { includePath: true, limit: 'nolimit', eq_Type: 'SHELF' })).map(container => ({ id: container.Code, text: `${container.Name}` })) as any;
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    console.log(this.smartTable);
  }

  async init() {
    await this.adminProductService.unitList$.pipe(filter(f => !!f), take(1)).toPromise();
    await this.loadCache();
    return super.init().then(async rs => {

      // Load unit list
      this.adminProductService.unitList$.pipe(takeUntil(this.destroy$)).subscribe(unitList => {
        this.unitList = unitList;
      });


      this.actionButtonList.unshift({
        name: 'assignCategories',
        status: 'info',
        label: this.cms.textTransform(this.cms.translate.instant('Common.tag/untag'), 'head-title'),
        icon: 'pricetags',
        title: this.cms.textTransform(this.cms.translate.instant('Common.tag/untag'), 'head-title'),
        size: 'medium',
        disabled: () => this.selectedIds.length === 0,
        hidden: () => false,
        click: () => {
          this.openAssignCategoiesDialplog();
          return false;
        },
      });
      this.actionButtonList.unshift({
        name: 'copyProducts',
        status: 'danger',
        label: this.cms.textTransform(this.cms.translate.instant('Copy'), 'head-title'),
        icon: 'copy-outline',
        title: this.cms.textTransform(this.cms.translate.instant('Copy'), 'head-title'),
        size: 'medium',
        disabled: () => this.selectedIds.length === 0,
        hidden: () => false,
        click: () => {
          this.cms.openDialog(ProductFormComponent, {
            context: {
              showLoadinng: true,
              inputMode: 'dialog',
              inputId: this.selectedItems.map(item => this.makeId(item)),
              isDuplicate: true,
              onDialogSave: (newData: ProductModel[]) => {
              },
              onDialogClose: () => {
                this.refresh();
              },
            },
          });
          return false;
        },
      });

      this.actionButtonList.unshift({
        name: 'importProducts',
        status: 'primary',
        label: this.cms.textTransform(this.cms.translate.instant('Import'), 'head-title'),
        icon: 'download-outline',
        title: this.cms.textTransform(this.cms.translate.instant('Import'), 'head-title'),
        size: 'medium',
        disabled: () => false,
        hidden: () => false,
        click: () => {
          this.cms.openDialog(ImportProductDialogComponent, {
            context: {
              // showLoadinng: true,
              inputMode: 'dialog',
              onDialogSave: (newData: ProductModel[]) => {
              },
              onDialogClose: () => {
                this.refresh();
              },
            },
            closeOnEsc: false,
            closeOnBackdropClick: false,
          });
          return false;
        },
      });

      const processingMap = AppModule.processMaps['commercePos'];
      await this.cms.waitForLanguageLoaded();
      this.columnDefs = this.configSetting([
        {
          ...agMakeSelectionColDef(this.cms),
          headerName: 'ID',
          field: 'Id',
          width: 100,
          valueGetter: 'node.data.Id',
          // sortingOrder: ['desc', 'asc'],
          initialSort: 'desc',
          headerCheckboxSelection: true,
        },
        {
          ...agMakeImageColDef(this.cms, null, (rowData) => {
            return rowData.Pictures?.map(m => m['LargeImage']);
          }),
          headerName: 'Hình',
          pinned: 'left',
          field: 'FeaturePicture',
          width: 100,
        },
        {
          headerName: 'Mã',
          field: 'Code',
          width: 140,
          filter: 'agTextColumnFilter',
          pinned: 'left',
        },
        {
          headerName: 'Sku',
          field: 'Sku',
          pinned: 'left',
          width: 120,
          filter: 'agTextColumnFilter',
        },
        {
          ...agMakeTextColDef(this.cms),
          headerName: 'Tên',
          field: 'Name',
          pinned: 'left',
          width: 400,
        },
        {
          ...agMakeTagsColDef(this.cms, (tag) => {
          }),
          headerName: 'ĐVT',
          field: 'UnitConversions',
          width: 200,
          valueGetter: (params: { data: ProductModel }) => {
            const baseUnitId = this.cms.getObjectId(params.data?.WarehouseUnit);
            const baseUnitText = this.cms.getObjectText(params.data?.WarehouseUnit);
            return params.data?.UnitConversions?.map(unit => {
              let text = '';
              if (baseUnitId == unit?.id) {
                text = unit.text;
                unit.icon = 'checkmark-square-outline';
                // unit.status = 'primary';
              } else {
                text = `${unit.text} = ${unit.ConversionRatio} ${baseUnitText}`;
              }
              unit.toolTip = `${text} (${unit.IsAutoAdjustInventory ? 'Trừ kho tự động' : 'Không tự động trừ kho'}, ${unit.IsManageByAccessNumber ? 'Quản lý theo số truy xuất' : 'Không quản lý theo số truy xuất'})`;
              if (unit.IsManageByAccessNumber) {
                unit.status = 'danger';
              }
              if (!unit.IsAutoAdjustInventory) {
                unit.status = 'warning';
              }
              unit.label = baseUnitId != unit?.id && `${unit.text} (${baseUnitId == unit?.id ? '*' : unit.ConversionRatio})` || unit.text;
              return unit;
            });
          },
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.makeSelect2AjaxOption('/admin-product/units', { includeIdText: true, includeGroups: true, sort_Name: 'asc' }, {
                placeholder: 'Chọn liên hệ...', limit: 10, prepareReaultItem: (item) => {
                  item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
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
          headerName: 'Danh mục',
          field: 'Categories',
          // pinned: 'left',
          width: 200,
          cellRenderer: AgTextCellRenderer,
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.makeSelect2AjaxOption('/admin-product/categories', { includeIdText: true, includeGroups: true, sort_Name: 'asc' }, {
                placeholder: 'Chọn danh mục...', limit: 10, prepareReaultItem: (item) => {
                  item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
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
          headerName: 'Nhóm',
          field: 'Groups',
          // pinned: 'left',
          width: 200,
          cellRenderer: AgTextCellRenderer,
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.makeSelect2AjaxOption('/admin-product/groups', { includeIdText: true, includeGroups: true, sort_Name: 'asc' }, {
                placeholder: 'Chọn nhóm...', limit: 10, prepareReaultItem: (item) => {
                  item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
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
          headerName: 'Người tạo',
          field: 'Creator',
          // pinned: 'left',
          width: 200,
          cellRenderer: AgTextCellRenderer,
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.makeSelect2AjaxOption('/user/users', { includeIdText: true, includeGroups: true, sort_SearchRank: 'desc' }, {
                placeholder: 'Chọn người tạo...', limit: 10, prepareReaultItem: (item) => {
                  item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
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
          headerName: 'Ngày tạo',
          field: 'Created',
          width: 180,
          filter: 'agDateColumnFilter',
          filterParams: {
            inRangeFloatingFilterDateFormat: 'DD/MM/YY',
          },
          cellRenderer: AgDateCellRenderer,
        },
        {
          headerName: 'Người cập nhật',
          field: 'LastUpdateBy',
          // pinned: 'left',
          width: 200,
          cellRenderer: AgTextCellRenderer,
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.makeSelect2AjaxOption('/user/users', { includeIdText: true, includeGroups: true, sort_SearchRank: 'desc' }, {
                placeholder: 'Chọn người cập nhật...', limit: 10, prepareReaultItem: (item) => {
                  item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
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
          headerName: 'Ngày cập nhật',
          field: 'LastUpdate',
          width: 180,
          filter: 'agDateColumnFilter',
          filterParams: {
            inRangeFloatingFilterDateFormat: 'DD/MM/YY',
          },
          cellRenderer: AgDateCellRenderer,
        },
        {
          ...agMakeCommandColDef(this, this.cms, (data) => {
            this.openForm([data.Code]);
          }, (data) => {
            this.deleteConfirm([data.Code]);
          }, false, [
            {
              name: 'revisions',
              icon: 'clock-outline',
              status: 'warning',
              appendTo: 'head',
              outline: false,
              action: async (params) => {
                this.apiService.getPromise<ProductModel[]>(this.apiPath + '/' + this.makeId(params.node.data), { includeRevisions: true }).then(products => {
                  if (products[0].Revisions) {
                    this.cms.openDialog(ProductListComponent, {
                      context: {
                        title: 'Lịch sử cập nhật của sản phẩm : ' + products[0].Name,
                        height: '95vh',
                        width: '95vw',
                        rowModelType: 'clientSide',
                        idKey: ['Code'],
                        rowData: products[0].Revisions,
                        onInit: (component) => {
                          // component.actionButtonList = component.actionButtonList.filter(f => ['close', 'choose', 'preview', 'refresh', 'confirm'].indexOf(f.name) > -1);
                          const cmdColIndex = component.columnDefs.findIndex(f => f.field == 'Command');
                          component.columnDefs.splice(cmdColIndex - 1, 0, {
                            headerName: 'Ngày lưu trữ',
                            field: 'RevisionDate',
                            width: 180,
                            filter: 'agDateColumnFilter',
                            pinned: 'right',
                            filterParams: {
                              inRangeFloatingFilterDateFormat: 'DD/MM/YY',
                            },
                            cellRenderer: AgDateCellRenderer,
                          });
                        }
                      }
                    })
                  }
                })
                return true;
              }
            }
          ]),
          headerName: 'Sửa/Xóa',
        },
      ] as ColDef[]);

      if (this.onInit) {
        this.onInit(this);
      }
      return rs;
    });
  }

  editing = {};
  rows = [];

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  prepareApiParams(params: any, getRowParams: IGetRowsParams) {
    params['includeCategories'] = true;
    params['includeGroups'] = true;
    params['includeWarehouseUnit'] = true;
    // params['includeUnits'] = true;
    params['embedUnitConversions'] = true;
    params['includeCreator'] = true;
    params['includeLastUpdateBy'] = true;
    // params['sort_Id'] = 'desc';
    return params;
  }

  /** Api get funciton */
  executeGet(params: any, success: (resources: ProductModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: ProductModel[] | HttpErrorResponse) => void) {
    params['includeCategories'] = true;
    super.executeGet(params, success, error, complete);
  }

  getList(callback: (list: ProductModel[]) => void) {
    super.getList((rs) => {
      if (callback) callback(rs);
    });
  }

  /** Implement required */
  async openAssignCategoiesDialplog() {
    if (this.selectedIds.length > 0) {
      const editedItems = await this.convertIdsToItems(this.selectedIds);
      this.cms.openDialog(AssignCategoriesFormComponent, {
        context: {
          inputMode: 'dialog',
          inputProducts: this.selectedItems,
          onDialogSave: (newData: ProductModel[]) => {
            // this.refresh();
            this.updateGridItems(editedItems, newData);
          },
          onDialogClose: () => {
          },
        },
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    }
  }

  openFormDialplog(ids?: string[], onDialogSave?: (newData: ProductModel[]) => void, onDialogClose?: () => void): void {
    throw new Error('Method not implemented.');
  }
}
