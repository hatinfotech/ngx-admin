import { take, filter } from 'rxjs/operators';
import { CollaboratorService } from '../../collaborator.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbThemeService, NbToastrService } from '@nebular/theme';
import { ProductModel } from '../../../../models/product.model';
import { ApiService } from '../../../../services/api.service';
import { RootServices } from '../../../../services/root.services';
import { CommonService } from '../../../../services/common.service';
import { CollaboratorProductFormComponent } from '../collaborator-product-form/collaborator-product-form.component';
import { ProductListComponent } from '../../../admin-product/product/product-list/product-list.component';
import { PageModel } from '../../../../models/page.model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AgGridDataManagerListComponent } from '../../../../lib/data-manager/ag-grid-data-manger-list.component';
import { ContactFormComponent } from '../../../contact/contact/contact-form/contact-form.component';
import { AgDateCellRenderer } from '../../../../lib/custom-element/ag-list/cell/date.component';
import { ColDef, IGetRowsParams } from '@ag-grid-community/core';
import { AgTextCellRenderer } from '../../../../lib/custom-element/ag-list/cell/text.component';
import { agMakeCommandColDef } from '../../../../lib/custom-element/ag-list/column-define/command.define';
import { agMakeSelectionColDef } from '../../../../lib/custom-element/ag-list/column-define/selection.define';
import { AgSelect2Filter } from '../../../../lib/custom-element/ag-list/filter/select2.component.filter';
import { ContactModel } from '../../../../models/contact.model';
import { agMakeImageColDef } from '../../../../lib/custom-element/ag-list/column-define/image.define';
import { agMakeTagsColDef } from '../../../../lib/custom-element/ag-list/column-define/tags.define';
import { agMakeCurrencyColDef } from '../../../../lib/custom-element/ag-list/column-define/currency.define';
import { agMakeNumberColDef } from '../../../../lib/custom-element/ag-list/column-define/number.define';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'ngx-collaborator-product-list',
  templateUrl: './collaborator-product-list.component.html',
  styleUrls: ['./collaborator-product-list.component.scss'],
  providers: [CurrencyPipe],
})
export class CollaboratorProductListComponent extends AgGridDataManagerListComponent<ProductModel, ContactFormComponent> implements OnInit {

  componentName: string = 'CollaboratorProductListComponent';
  formPath = '/collaborator/product/form';
  apiPath = '/collaborator/products';
  idKey: string | string[] = ['Code'];
  formDialog = CollaboratorProductFormComponent;
  currentPage: PageModel;

  // AG-Grid config
  public rowHeight: number = 50;
  // @Input() suppressRowClickSelection = false;

  // @Input() gridHeight = 'calc(100vh - 230px)';


  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public themeService: NbThemeService,
    public ref: NbDialogRef<CollaboratorProductListComponent>,
    public datePipe: DatePipe,
    public collaboratorService: CollaboratorService,
  ) {
    super(rsv, apiService, router, cms, dialogService, toastService, themeService, ref);

    this.defaultColDef = {
      ...this.defaultColDef,
      cellClass: 'ag-cell-items-center',
    }

    this.pagination = false;
    // this.maxBlocksInCache = 5;
    this.paginationPageSize = 100;
    this.cacheBlockSize = 100;
  }

  async init() {
    return super.init().then(async state => {

      // Remove buttons
      this.actionButtonList = this.actionButtonList.filter(f => ['add'].indexOf(f.name) < 0);

      this.actionButtonList.unshift({
        type: 'button',
        name: 'addProduct',
        label: this.cms.translateText('Collaborator.Product.add'),
        icon: 'cube-outline',
        status: 'primary',
        size: 'medium',
        title: this.cms.translateText('Common.subscribe'),
        click: () => {
          this.cms.openDialog(ProductListComponent, {
            context: {
              inputMode: 'dialog',
              gridHeight: '95vh',
              onDialogChoose: async (chooseItems: ProductModel[]) => {
                console.log(chooseItems);
                const page = this.collaboratorService.currentpage$?.value;
                this.apiService.putPromise<ProductModel[]>('/collaborator/products', { id: chooseItems.map(product => product.Code), assign: true, page: this.collaboratorService.currentpage$.value }, chooseItems.map(product => ({ Code: product.Code }))).then(rs => {
                  this.cms.toastService.show(this.cms.translateText('Common.success'), this.cms.translateText('Collaborator.Product.subscribeSuccessText'), {
                    status: 'success',
                  })
                  this.refresh();
                });
              },
              onDialogClose: () => {
              },
            },
          })
        },
      });

      // Add page choosed
      this.collaboratorService.pageList$.pipe(filter(f => f && f.length > 0), take(1)).toPromise().then(pageList => {
        this.actionButtonList.unshift({
          type: 'select2',
          name: 'pbxdomain',
          status: 'success',
          label: 'Select page',
          icon: 'plus',
          title: this.cms.textTransform(this.cms.translate.instant('Common.createNew'), 'head-title'),
          size: 'medium',
          select2: {
            data: pageList, option: {
              placeholder: 'Chọn trang...',
              allowClear: true,
              width: '100%',
              dropdownAutoWidth: true,
              minimumInputLength: 0,
              keyMap: {
                id: 'id',
                text: 'text',
              },
            }
          },
          asyncValue: this.collaboratorService.currentpage$,
          change: (value: any, option: any) => {
            this.onChangePage(value);
          },
          disabled: () => {
            return false;
          },
          click: () => {
            // this.gotoForm();
            return false;
          },
        });
      });

      this.actionButtonList.unshift({
        type: 'button',
        name: 'exportPdf',
        status: 'primary',
        label: 'Báo chiết khấu (PDF)',
        title: 'Xuất báo giá chiết khấu cho CTV ra PDF',
        size: 'medium',
        icon: 'download-outline',
        disabled: () => {
          return this.selectedIds.length == 0;
        },
        click: () => {
          const product = this.selectedItems.map(m => this.cms.getObjectId(m.Code));
          let params = {
            type: 'pdf',
            report: 'ExportProductCommission',
            eq_Code: '[' + product.join(',') + ']'
          };
          params['includeCategories'] = true;
          params['includeGroups'] = true;
          params['includeProduct'] = true;
          params['includeUnit'] = true;
          params['includeUnitPrices'] = true;
          params['includeCommissionRatio'] = true;
          params['productOfPage'] = true;
          params['includePrice'] = true;
          params['sort_Id'] = 'desc';
          if (this.collaboratorService.currentpage$.value) {
            params['page'] = this.collaboratorService.currentpage$.value;
          }
          window.open(this.apiService.buildApiUrl(this.apiPath, params), '__blank');
        }
      });

      await this.cms.waitForLanguageLoaded();
      this.columnDefs = this.configSetting([
        {
          ...agMakeSelectionColDef(this.cms),
          headerName: 'ID',
          field: 'Id',
          width: 100,
          valueGetter: 'node.data.Code',
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
          // pinned: 'left',
        },
        {
          headerName: 'Sku',
          field: 'Sku',
          // pinned: 'left',
          width: 120,
          filter: 'agTextColumnFilter',
        },
        {
          headerName: 'Tên',
          field: 'Name',
          // pinned: 'left',
          width: 400,
          filter: 'agTextColumnFilter',
          cellRenderer: AgTextCellRenderer,
        },
        {
          ...agMakeTagsColDef(this.cms, (tag) => {
          }),
          headerName: 'ĐVT',
          field: 'Unit',
          width: 200,
          valueGetter: (params: { data: ProductModel }) => {
            // const baseUnitId = this.cms.getObjectId(params.data?.WarehouseUnit);
            // const baseUnitText = this.cms.getObjectText(params.data?.WarehouseUnit);
            // return params.data?.Units?.map(unit => {
            //   let text = '';
            //   if (baseUnitId == unit?.id) {
            //     text = unit.text;
            //   } else {
            //     text = `${unit.text} = ${unit.ConversionRatio} ${baseUnitText}`;
            //   }
            //   unit.toolTip = `${text} (${unit.IsAutoAdjustInventory ? 'Trừ kho tự động' : 'Không tự động trừ kho'}, ${unit.IsManageByAccessNumber ? 'Quản lý theo số truy xuất' : 'Không quản lý theo số truy xuất'})`;
            //   if (unit.IsManageByAccessNumber) {
            //     unit.status = 'danger';
            //   }
            //   if (!unit.IsAutoAdjustInventory) {
            //     unit.status = 'warning';
            //   }
            //   unit.label = `${unit.text} (${unit.ConversionRatio})`;
            //   return unit;
            // });
            return params.data?.Unit ? [params.data?.Unit] : null;
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
          ...agMakeCurrencyColDef(this.cms),
          headerName: 'Giá EU',
          field: 'Price',
          pinned: 'right',
          width: 150,
        },
        {
          ...agMakeNumberColDef(this.cms),
          cellRendererParams: {
            symbol: '%',
          },
          headerName: 'CKCB',
          field: 'Level1CommissionRatio',
          pinned: 'right',
          width: 100,
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
          ...agMakeCommandColDef(this, this.cms, false, (data) => {
            this.deleteConfirm([data.Code]);
          }, false, [
          ]),
          headerName: 'Sửa/Xóa',
        },
      ] as ColDef[]);

      return state;
    });
  }

  ngOnInit() {
    super.ngOnInit();
  }

  // @Input() getRowHeight = (params: RowHeightParams<CommercePosOrderModel>) => {
  //   return 123;
  // }

  prepareApiParams(params: any, getRowParams: IGetRowsParams) {
    params['includeCategories'] = true;
    params['includeGroups'] = true;
    params['includeProduct'] = true;
    params['includeUnit'] = true;
    params['includeUnitPrices'] = true;
    params['includeCommissionRatio'] = true;
    params['productOfPage'] = true;
    params['includePrice'] = true;
    params['onlyBusinessProducts'] = true;

    params['page'] = this.collaboratorService?.currentpage$?.value;
    return params;
  }

  /** Implement required */
  openFormDialplog(ids?: string[], onDialogSave?: (newData: ContactModel[]) => void, onDialogClose?: () => void) {
    this.cms.openDialog(ContactFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: ids,
        onDialogSave: (newData: ContactModel[]) => {
          if (onDialogSave) onDialogSave(newData);
        },
        onDialogClose: () => {
          if (onDialogClose) onDialogClose();
        },
      },
    });
    return false;
  }

  onGridReady(params) {
    super.onGridReady(params);
  }

  onChangePage(page: PageModel) {
    if (page !== null) {
      this.collaboratorService.currentpage$.next(this.cms.getObjectId(page));
      this.cms.takeOnce(this.componentName + '_on_domain_changed', 1000).then(() => {
        this.refresh();
      });
    }
  }

  /** Api delete funciton */
  async executeDelete(ids: any, success: (resp: any) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: any | HttpErrorResponse) => void) {
    if (this.rowModelType === 'infinite') {
      // await super.executeDelete(ids, success, error, complete);
      const params = {
        id: ids,
        page: this.collaboratorService?.currentpage$?.value,
      };
      return this.apiService.deletePromise(this.apiPath, params).then(resp => {
        // this.removeGridItems(deletedItems);
        this.refresh();
        if (success) success(resp);
        if (complete) complete(resp);
      }).catch(err => {
        if (error) error(err);
        return Promise.reject(err);
      });
    } else if (this.rowModelType === 'clientSide') {
      const selectedNodes = this.gridApi.getSelectedNodes();
      this.gridApi.applyTransaction({ remove: selectedNodes.map(m => m.data) });
    }
  }
}
