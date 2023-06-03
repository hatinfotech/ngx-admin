import { Component, Input, OnInit } from "@angular/core";
import { AgGridDataManagerListComponent } from "../../../lib/data-manager/ag-grid-data-manger-list.component";
import { MasterPriceTableQueueModel } from "../../../models/sales.model";
import { MasterPriceTableUpdateNoteFormComponent } from "../master-price-table-update-note/master-price-table-update-note-form/master-price-table-update-note-form.component";
import { ColDef, IGetRowsParams } from "@ag-grid-community/core";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";
import { NbDialogService, NbToastrService, NbThemeService, NbDialogRef } from "@nebular/theme";
import { AppModule } from "../../../app.module";
import { AgDateCellRenderer } from "../../../lib/custom-element/ag-list/cell/date.component";
import { AgTextCellRenderer } from "../../../lib/custom-element/ag-list/cell/text.component";
import { agMakeCommandColDef } from "../../../lib/custom-element/ag-list/column-define/command.define";
import { agMakeSelectionColDef } from "../../../lib/custom-element/ag-list/column-define/selection.define";
import { AgSelect2Filter } from "../../../lib/custom-element/ag-list/filter/select2.component.filter";
import { ApiService } from "../../../services/api.service";
import { CommonService } from "../../../services/common.service";
import { agMakeImageColDef } from "../../../lib/custom-element/ag-list/column-define/image.define";
import { agMakeTagsColDef } from "../../../lib/custom-element/ag-list/column-define/tags.define";
import { agMakeCurrencyColDef } from "../../../lib/custom-element/ag-list/column-define/currency.define";


@Component({
  selector: 'ngx-master-price-table-queue',
  templateUrl: './master-price-table-queue.component.html',
  styleUrls: ['./master-price-table-queue.component.scss'],
})
export class MasterPriceTableQueueComponent extends AgGridDataManagerListComponent<MasterPriceTableQueueModel, MasterPriceTableUpdateNoteFormComponent> implements OnInit {

  componentName: string = 'MasterPriceTableQueueComponent';
  formPath = '/sales/master-price-table-queue/form';
  apiPath = '/sales/master-price-table-queue';
  idKey = ['Id'];

  // formDialog = MasterPriceTableUpdateNoteFormComponent;
  // printDialog = MasterPriceTableUpdateNotePrintComponent;

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
    public ref: NbDialogRef<MasterPriceTableQueueComponent>,
    public datePipe: DatePipe,
  ) {
    super(apiService, router, cms, dialogService, toastService, themeService, ref);

    this.defaultColDef = {
      ...this.defaultColDef,
      cellClass: 'ag-cell-items-center',
    }

    this.pagination = false;
    this.maxBlocksInCache = 5;
    this.paginationPageSize = 100;
    this.cacheBlockSize = 100;
  }

  async init() {
    return super.init().then(async state => {

      this.actionButtonList.unshift({
        type: 'button',
        name: 'createMasterPriceTableUpdateNote',
        status: 'danger',
        label: 'Tạo phiếu cập nhật giá',
        title: 'Tạo phiếu cập nhật giá',
        size: 'medium',
        icon: 'file-text-outline',
        disabled: () => {
          return this.selectedIds.length == 0;
        },
        click: () => {
          this.cms.openDialog(MasterPriceTableUpdateNoteFormComponent, {
            context: {
              data: [
                {
                  Title: 'Cập nhật giá ' + new Date().toUTCString(),
                  Details: this.selectedItems.reverse().map(m => ({
                    Image: m.Product.Pictures,
                    Product: m.Product as any,
                    Unit: m.Unit as any,
                    Description: this.cms.getObjectText(m.Product),
                    Price: m.OldPrice,
                    PurchasePrice: m.PurchasePrice,

                    // RelateDetail: m.RelativeDetail,
                    RelativeQueueItem: m.Id,
                  })) as any
                }
              ],
              onDialogSave: (newData) => {
                if (newData[0].State === 'APPROVED') {
                  // this.delete(this.selectedIds).then(() => {
                  this.refresh();
                  // });
                }
              },
            }
          });
        }
      });

      const processingMap = AppModule.processMaps['priceReport'];
      await this.cms.waitForLanguageLoaded();
      this.columnDefs = this.configSetting([
        {
          ...agMakeSelectionColDef(this.cms),
          headerName: 'STT',
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
          valueGetter: 'node.data.Product.FeaturePicture',
          headerName: 'Hình',
          pinned: 'left',
          field: 'FeaturePicture',
          width: 100,
        },
        {
          headerName: 'ID',
          field: 'Product',
          cellRenderer: AgTextCellRenderer,
          // valueGetter: (params) => this.cms.getObjectId(params.node.data.Product),
          valueGetter: 'node.data.Product.id',
          width: 150,
          filter: 'agTextColumnFilter',
          pinned: 'left',
        },
        {
          headerName: 'Sku',
          field: 'Sku',
          cellRenderer: AgTextCellRenderer,
          // valueGetter: (params) => this.cms.getObjectId(params.node.data.Product),
          valueGetter: 'node.data.Product.Sku',
          width: 120,
          filter: 'agTextColumnFilter',
          pinned: 'left',
        },
        {
          headerName: 'Sản phẩm',
          field: 'ProductName',
          cellRenderer: AgTextCellRenderer,
          width: 500,
          filter: 'agTextColumnFilter',
          // pinned: 'left',
        },
        {
          headerName: 'ĐVT',
          field: 'Unit',
          cellRenderer: AgTextCellRenderer,
          width: 100,
          // pinned: 'left',
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.makeSelect2AjaxOption('/admin-product/units', { includeIdText: true, includeGroups: true, sort_Name: 'asc' }, {
                placeholder: 'Chọn ĐVT...', limit: 10, prepareReaultItem: (item) => {
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
          ...agMakeTagsColDef(this.cms, (tag) => {
            this.cms.previewVoucher(tag.type, tag.id);
          }),
          headerName: 'Chứng từ liên quan',
          field: 'RelativeVoucher',
          valueGetter: params => params.node?.data?.RelativeVoucher ? [{ id: params.node.data.RelativeVoucher, text: params.node.data.RelativeVoucherTitle }] : [],
          width: 180,
        },
        {
          headerName: 'Ngày yêu cầu',
          field: 'RequestDate',
          width: 180,
          filter: 'agDateColumnFilter',
          filterParams: {
            inRangeFloatingFilterDateFormat: 'DD/MM/YY',
          },
          cellRenderer: AgDateCellRenderer,
        },
        {
          headerName: 'Yêu cầu bởi',
          field: 'RequestBy',
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
          ...agMakeCurrencyColDef(this.cms),
          headerName: 'Giá nhập',
          field: 'PurchasePrice',
          pinned: 'right',
          width: 150,
        },
        {
          ...agMakeCurrencyColDef(this.cms),
          headerName: 'Giá hiện tại',
          field: 'OldPrice',
          pinned: 'right',
          width: 150,
        },
        {
          ...agMakeCommandColDef(this, this.cms, false, true, false),
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
    params['includeProduct'] = true;
    params['includeUnit'] = true;
    return params;
  }

  /** Implement required */
  openFormDialplog(ids?: string[], onDialogSave?: (newData: MasterPriceTableQueueModel[]) => void, onDialogClose?: () => void) {
    this.cms.openDialog(MasterPriceTableUpdateNoteFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: ids,
        onDialogSave: (newData: MasterPriceTableQueueModel[]) => {
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
