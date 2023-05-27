import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogRef, NbDialogService, NbThemeService, NbToastrService } from '@nebular/theme';
import { PurchaseProductFormComponent } from '../purchase-product-form/purchase-product-form.component';
import { PurchaseProductModel } from '../../../../models/purchase.model';
import { DatePipe, DecimalPipe } from '@angular/common';
import { AgGridDataManagerListComponent } from '../../../../lib/data-manager/ag-grid-data-manger-list.component';
import { ColDef, IGetRowsParams } from '@ag-grid-community/core';
import { FormGroup } from '@angular/forms';
import { AppModule } from '../../../../app.module';
import { AgDateCellRenderer } from '../../../../lib/custom-element/ag-list/cell/date.component';
import { AgTextCellRenderer } from '../../../../lib/custom-element/ag-list/cell/text.component';
import { agMakeCommandColDef } from '../../../../lib/custom-element/ag-list/column-define/command.define';
import { agMakeImageColDef } from '../../../../lib/custom-element/ag-list/column-define/image.define';
import { agMakeSelectionColDef } from '../../../../lib/custom-element/ag-list/column-define/selection.define';
import { agMakeTagsColDef } from '../../../../lib/custom-element/ag-list/column-define/tags.define';
import { AgSelect2Filter } from '../../../../lib/custom-element/ag-list/filter/select2.component.filter';
import { DialogFormComponent } from '../../../dialog/dialog-form/dialog-form.component';

@Component({
  selector: 'ngx-purchase-product-list',
  templateUrl: './purchase-product-list.component.html',
  styleUrls: ['./purchase-product-list.component.scss'],
  providers: [DecimalPipe],
})
export class PurchaseProductListComponent extends AgGridDataManagerListComponent<PurchaseProductModel, PurchaseProductFormComponent> implements OnInit {

  componentName: string = 'PurchaseProductListComponent';
  formPath = '/purchase/product/form';
  apiPath = '/purchase/products';
  idKey = ['Id'];
  formDialog = PurchaseProductFormComponent;

  // AG-Grid config
  public rowHeight: number = 50;
  // @Input() suppressRowClickSelection = false;

  @Input() gridHeight = '100%';


  constructor(
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public themeService: NbThemeService,
    public ref: NbDialogRef<PurchaseProductListComponent>,
    public datePipe: DatePipe,
  ) {
    super(apiService, router, cms, dialogService, toastService, themeService, ref);

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
          headerName: 'Sản phẩm',
          field: 'Product',
          pinned: 'left',
          width: 200,
          valueGetter: 'node.data.Name',
          cellRenderer: AgTextCellRenderer,
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.makeSelect2AjaxOption('/admin-product/products', { includeIdText: true }, {
                placeholder: 'Chọn sản phẩm...', limit: 10, prepareReaultItem: (item) => {
                  // item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
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
          headerName: 'Nhà cung cấp',
          field: 'Supplier',
          pinned: 'left',
          width: 200,
          cellRenderer: AgTextCellRenderer,
          valueGetter: 'node.data.SupplierName',
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.makeSelect2AjaxOption('/contact/contacts', { includeIdText: true, includeGroups: true, sort_SearchRank: 'desc' }, {
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
          headerName: 'Tên theo NCC',
          field: 'Name',
          width: 300,
          filter: 'agTextColumnFilter',
          autoHeight: true,
        },
        {
          headerName: 'Sku NCC',
          field: 'Sku',
          width: 100,
          filter: 'agTextColumnFilter',
          autoHeight: true,
        },
        {
          headerName: 'Tên thuế',
          field: 'TaxName',
          width: 200,
          filter: 'agTextColumnFilter',
          autoHeight: true,
        },
        {
          headerName: 'Thuế',
          field: 'TaxValue',
          width: 100,
          filter: 'agTextColumnFilter',
          autoHeight: true,
        },
        {
          headerName: 'Cập nhật cuối',
          field: 'LastUpdate',
          width: 180,
          filter: 'agDateColumnFilter',
          filterParams: {
            inRangeFloatingFilterDateFormat: 'DD/MM/YY',
          },
          cellRenderer: AgDateCellRenderer,
        },
        {
          ...agMakeTagsColDef(this.cms, (tag) => {
            this.cms.previewVoucher(tag.type, tag.id);
          }),
          headerName: 'Chứng từ liên quan',
          field: 'ReferenceVoucher',
          width: 150,
          pinned: 'right',
          valueGetter: (params) => params.node?.data?.ReferenceVoucher ? [{ id: params.node.data.ReferenceVoucher, text: params.node.data.ReferenceVoucher }] : []
        },
        {
          ...agMakeCommandColDef(this, this.cms, true, true, false),
          headerName: 'Lệnh',
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
    params['includeContact'] = true;
    params['includeObject'] = true;
    params['includeCreator'] = true;
    params['includeRelativeVouchers'] = true;
    // params['sort_Id'] = 'desc';
    return params;
  }

  /** Implement required */
  openFormDialplog(ids?: string[], onDialogSave?: (newData: PurchaseProductModel[]) => void, onDialogClose?: () => void) {
    this.cms.openDialog(PurchaseProductFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: ids,
        onDialogSave: (newData: PurchaseProductModel[]) => {
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
}
