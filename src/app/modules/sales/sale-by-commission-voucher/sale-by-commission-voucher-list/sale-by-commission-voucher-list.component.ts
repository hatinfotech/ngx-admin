import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { SaleByCommissionVoucherModel } from '../../../../models/sales.model';
import { ApiService } from '../../../../services/api.service';
import { RootServices } from '../../../../services/root.services';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogRef, NbDialogService, NbThemeService, NbToastrService } from '@nebular/theme';
import { SaleByCommissionVoucherFormComponent } from '../sale-by-commission-voucher-form/sale-by-commission-voucher-form.component';
import { SaleByCommissionVoucherPrintComponent } from '../sale-by-commission-voucher-print/sale-by-commission-voucher-print.component';
import { AppModule } from '../../../../app.module';
import { AgGridDataManagerListComponent } from '../../../../lib/data-manager/ag-grid-data-manger-list.component';
import { agMakeSelectionColDef } from '../../../../lib/custom-element/ag-list/column-define/selection.define';
import { AgTextCellRenderer } from '../../../../lib/custom-element/ag-list/cell/text.component';
import { AgSelect2Filter } from '../../../../lib/custom-element/ag-list/filter/select2.component.filter';
import { DatePipe } from '@angular/common';
import { AgDateCellRenderer } from '../../../../lib/custom-element/ag-list/cell/date.component';
import { agMakeTagsColDef } from '../../../../lib/custom-element/ag-list/column-define/tags.define';
import { agMakeCurrencyColDef } from '../../../../lib/custom-element/ag-list/column-define/currency.define';
import { agMakeStateColDef } from '../../../../lib/custom-element/ag-list/column-define/state.define';
import { agMakeCommandColDef } from '../../../../lib/custom-element/ag-list/column-define/command.define';
import { ColDef, IGetRowsParams } from '@ag-grid-community/core';
import { SaleByCommissionVoucherDetailsReportPrintComponent } from '../sale-by-commission-voucher-details-report-print/sale-by-commission-voucher-details-report-print.component';
import { DialogFormComponent } from '../../../dialog/dialog-form/dialog-form.component';
import { FormGroup } from '@angular/forms';
import { SaleByCommissionVoucherReportPrintComponent } from '../sale-by-commission-voucher-report-print/sale-by-commission-voucher-report-print.component';

@Component({
  selector: 'ngx-sale-by-commission-voucher-list',
  templateUrl: './sale-by-commission-voucher-list.component.html',
  styleUrls: ['./sale-by-commission-voucher-list.component.scss'],
})
export class SaleByCommissionVoucherListComponent extends AgGridDataManagerListComponent<SaleByCommissionVoucherModel, SaleByCommissionVoucherFormComponent> implements OnInit {

  componentName: string = 'SaleByCommissionVoucherListComponent';
  formPath = '/sales/sale-by-commission-voucher/form';
  apiPath = '/sales/sale-by-commission-vouchers';
  idKey = ['Code'];

  // Use for load settings menu for context
  feature = {
    Module: { id: 'Sales', text: 'Bán hàng' },
    Feature: { id: 'SaleByCommissionVoucher', text: 'Phiếu bán hàng đối tác' }
  };

  formDialog = SaleByCommissionVoucherFormComponent;
  printDialog = SaleByCommissionVoucherPrintComponent;

  // AG-Grid config
  public rowHeight: number = 50;
  // @Input() suppressRowClickSelection = false;

  @Input() gridHeight = '100%';

  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public themeService: NbThemeService,
    public ref: NbDialogRef<SaleByCommissionVoucherListComponent>,
    public datePipe: DatePipe,
  ) {
    super(rsv, apiService, router, cms, dialogService, toastService, themeService, ref);

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
        name: 'reprotbyDetail',
        status: 'primary',
        label: 'Báo cáo chi tiết',
        title: 'Báo cáo chi tiết',
        size: 'medium',
        icon: 'list-outline',
        disabled: () => false,
        click: () => {
          this.cms.openDialog(DialogFormComponent, {
            context: {
              title: 'Báo cáo bán hàng đối tác',
              width: '600px',
              onInit: async (form, dialog) => {
                return true;
              },
              controls: [
                {
                  name: 'Supplier',
                  label: 'Nhà cung cấp',
                  placeholder: 'Chọn nhà cung cấp',
                  type: 'select2',
                  initValue: null,
                  option: {
                    ...this.cms.makeSelect2AjaxOption('/contact/contacts', { includeIdText: true }),
                  }
                },
                {
                  name: 'FromDate',
                  label: 'Từ ngày',
                  placeholder: 'Chọn báo cáo từ ngày',
                  type: 'date',
                  initValue: null,
                },
                {
                  name: 'ToDate',
                  label: 'Đến ngày',
                  placeholder: 'Chọn báo cáo đến ngày',
                  type: 'date',
                  initValue: null,
                },
              ],
              actions: [
                {
                  label: 'Trở về',
                  icon: 'back',
                  status: 'basic',
                  action: async () => { return true; },
                },
                {
                  label: 'Báo cáo chi tiết',
                  icon: 'npm-outline',
                  status: 'info',
                  action: async (form: FormGroup) => {

                    let supplier: string[] = form.get('Supplier').value;
                    let fromDate = form.get('FromDate').value as Date;
                    let toDate = form.get('ToDate').value as Date;
                    this.cms.openDialog(SaleByCommissionVoucherDetailsReportPrintComponent, {
                      context: {
                        id: [],
                        suppliers: [this.cms.getObjectId(supplier)],
                        fromDate: fromDate,
                        toDate: toDate,
                        query: {
                          // ge_DateOfSale: fromDate.toISOString(),
                          // le_DateOfSale: toDate.toISOString(),
                          eq_State: 'APPROVED'
                        }
                      }
                    });
                    return true;
                  },
                },
                {
                  label: 'Báo cáo',
                  icon: 'npm-outline',
                  status: 'primary',
                  action: async (form: FormGroup) => {

                    let supplier: string[] = form.get('Supplier').value;
                    let fromDate = form.get('FromDate').value as Date;
                    let toDate = form.get('ToDate').value as Date;
                    this.cms.openDialog(SaleByCommissionVoucherReportPrintComponent, {
                      context: {
                        id: [],
                        suppliers: [this.cms.getObjectId(supplier)],
                        fromDate: fromDate,
                        toDate: toDate,
                        query: {
                          // ge_DateOfSale: fromDate.toISOString(),
                          // le_DateOfSale: toDate.toISOString(),
                          eq_State: 'APPROVED'
                        }
                      }
                    });
                    return true;
                  },
                },
              ],
            },
          });
        }
      });

      // this.actionButtonList.unshift({
      //   type: 'button',
      //   name: 'writetobook',
      //   status: 'primary',
      //   label: 'Duyệt',
      //   title: 'Duyệt các phiếu đã chọn',
      //   size: 'medium',
      //   icon: 'checkmark-square-outline',
      //   disabled: () => {
      //     return this.selectedIds.length == 0;
      //   },
      //   click: () => {
      //     this.cms.showDialog('Phiếu mua hàng', 'Bạn có chắc muốn bỏ ghi các đơn hàng đã chọn ?', [
      //       {
      //         label: 'Trở về',
      //         status: 'basic',
      //         action: () => {
      //         }
      //       },
      //       {
      //         label: 'Duyệt',
      //         status: 'primary',
      //         focus: true,
      //         action: () => {
      //           this.apiService.putPromise(this.apiPath, { changeState: 'APPROVED' }, this.selectedIds.map(id => ({ Code: id }))).then(rs => {
      //             this.cms.toastService.show('Duyệt thành công !', 'Phiếu mua hàng', { status: 'success' });
      //             this.refresh();
      //           });
      //         }
      //       },
      //     ]);
      //   }
      // });
      // this.actionButtonList.unshift({
      //   type: 'button',
      //   name: 'writetobook',
      //   status: 'danger',
      //   label: 'Ghi sổ lại',
      //   title: 'Ghi sổ lại',
      //   size: 'medium',
      //   icon: 'npm-outline',
      //   disabled: () => {
      //     return this.selectedIds.length == 0;
      //   },
      //   click: () => {
      //     this.cms.openDialog(DialogFormComponent, {
      //       context: {
      //         title: 'ID phiếu cần ghi sổ lại',
      //         width: '600px',
      //         onInit: async (form, dialog) => {
      //           return true;
      //         },
      //         controls: [
      //           {
      //             name: 'Ids',
      //             label: 'Link hình',
      //             placeholder: 'Mỗi ID trên 1 dòng',
      //             type: 'textarea',
      //             initValue: this.selectedIds.join('\n'),
      //           },
      //         ],
      //         actions: [
      //           {
      //             label: 'Trở về',
      //             icon: 'back',
      //             status: 'basic',
      //             action: async () => { return true; },
      //           },
      //           {
      //             label: 'Ghi sổ lại',
      //             icon: 'npm-outline',
      //             status: 'danger',
      //             action: async (form: FormGroup) => {

      //               let ids: string[] = form.get('Ids').value.trim()?.split('\n');

      //               if (ids && ids.length > 0) {
      //                 let toastRef = this.cms.showToast('Các đơn hàng đang được ghi sổ lại', 'Đang ghi sổ lại', { status: 'info', duration: 60000 });
      //                 try {
      //                   ids = [...new Set(ids)];
      //                   this.loading = true;
      //                   await this.apiService.putPromise(this.apiPath, { reChangeState: 'UNRECORDED,APPROVED' }, ids.map(id => ({ Code: id.trim() })));
      //                   toastRef.close();
      //                   toastRef = this.cms.showToast('Các đơn hàng đã được ghi sổ lại', 'Hoàn tất ghi sổ lại', { status: 'success', duration: 10000 });
      //                   this.loading = false;
      //                 } catch (err) {
      //                   console.error(err);
      //                   this.loading = false;
      //                   toastRef.close();
      //                   toastRef = this.cms.showToast('Các đơn hàng chưa đượ ghi sổ lại do có lỗi xảy ra trong quá trình thực thi', 'Lỗi ghi sổ lại', { status: 'danger', duration: 30000 });
      //                 }
      //               }

      //               return true;
      //             },
      //           },
      //         ],
      //       },
      //     });
      //   }
      // });

      const processingMap = AppModule.processMaps['salesVoucher'];
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
          headerName: 'Mã',
          field: 'Code',
          width: 140,
          filter: 'agTextColumnFilter',
          pinned: 'left',
        },
        {
          headerName: 'Nhà cung cấp',
          field: 'Supplier',
          pinned: 'left',
          width: 200,
          cellRenderer: AgTextCellRenderer,
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
          headerName: 'Khách hàng',
          field: 'Customer',
          pinned: 'left',
          width: 200,
          cellRenderer: AgTextCellRenderer,
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
          headerName: 'Tiêu đề',
          field: 'Title',
          width: 300,
          filter: 'agTextColumnFilter',
          autoHeight: true,
        },
        {
          headerName: 'Ngày bán hàng',
          field: 'DateOfSale',
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
          field: 'RelativeVouchers',
          width: 330,
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
          field: 'DateOfCreated',
          width: 180,
          filter: 'agDateColumnFilter',
          filterParams: {
            inRangeFloatingFilterDateFormat: 'DD/MM/YY',
          },
          cellRenderer: AgDateCellRenderer,
        },
        {
          ...agMakeCurrencyColDef(this.cms),
          headerName: 'Số tiền',
          field: 'Amount',
          pinned: 'right',
          width: 150,
        },
        {
          ...agMakeStateColDef(this.cms, processingMap, (data) => {
            this.preview([data]);
          }),
          headerName: 'Trạng thái',
          field: 'State',
          width: 155,
        },
        {
          ...agMakeCommandColDef(this, this.cms, true, true, true),
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
    params['includeCreator'] = true;
    params['includeContact'] = true;
    params['includeObject'] = true;
    params['includeRelativeVouchers'] = true;
    // params['sort_Id'] = 'desc';
    return params;
  }

  /** Implement required */
  openFormDialplog(ids?: string[], onDialogSave?: (newData: SaleByCommissionVoucherModel[]) => void, onDialogClose?: () => void) {
    this.cms.openDialog(SaleByCommissionVoucherFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: ids,
        onDialogSave: (newData: SaleByCommissionVoucherModel[]) => {
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
