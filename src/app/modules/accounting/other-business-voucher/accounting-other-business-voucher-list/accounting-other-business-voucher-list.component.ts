import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbThemeService, NbToastrService } from '@nebular/theme';
import { AppModule } from '../../../../app.module';
import { OtherBusinessVoucherModel } from '../../../../models/accounting.model';
import { ApiService } from '../../../../services/api.service';
import { RootServices } from '../../../../services/root.services';
import { CommonService } from '../../../../services/common.service';
import { AccountingOtherBusinessVoucherFormComponent } from '../accounting-other-business-voucher-form/AccountingOtherBusinessVoucherFormComponent';
import { AccountingOtherBusinessVoucherPrintComponent } from '../accounting-other-business-voucher-print/accounting-other-business-voucher-print.component';
import { AgGridDataManagerListComponent } from '../../../../lib/data-manager/ag-grid-data-manger-list.component';
import { DatePipe } from '@angular/common';
import { DialogFormComponent } from '../../../dialog/dialog-form/dialog-form.component';
import { agMakeSelectionColDef } from '../../../../lib/custom-element/ag-list/column-define/selection.define';
import { AgTextCellRenderer } from '../../../../lib/custom-element/ag-list/cell/text.component';
import { AgSelect2Filter } from '../../../../lib/custom-element/ag-list/filter/select2.component.filter';
import { AgDateCellRenderer } from '../../../../lib/custom-element/ag-list/cell/date.component';
import { agMakeTagsColDef } from '../../../../lib/custom-element/ag-list/column-define/tags.define';
import { FormGroup } from '@angular/forms';
import { agMakeCurrencyColDef } from '../../../../lib/custom-element/ag-list/column-define/currency.define';
import { agMakeStateColDef } from '../../../../lib/custom-element/ag-list/column-define/state.define';
import { agMakeCommandColDef } from '../../../../lib/custom-element/ag-list/column-define/command.define';
import { ColDef, IGetRowsParams } from '@ag-grid-community/core';

@Component({
  selector: 'ngx-accounting-other-business-voucher-list',
  templateUrl: './accounting-other-business-voucher-list.component.html',
  styleUrls: ['./accounting-other-business-voucher-list.component.scss']
})
export class AccountingOtherBusinessVoucherListComponent extends AgGridDataManagerListComponent<OtherBusinessVoucherModel, AccountingOtherBusinessVoucherFormComponent> implements OnInit {

  componentName: string = 'AccountingOtherBusinessVoucherListComponent';
  formPath = '/accounting/other-business-voucher/form';
  apiPath = '/accounting/other-business-vouchers';
  idKey = 'Code';

  formDialog = AccountingOtherBusinessVoucherFormComponent;
  printDialog = AccountingOtherBusinessVoucherPrintComponent;

  reuseDialog = true;
  static _dialog: NbDialogRef<AccountingOtherBusinessVoucherListComponent>;

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
    public ref: NbDialogRef<AccountingOtherBusinessVoucherListComponent>,
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
        name: 'unrecord',
        status: 'warning',
        label: 'Bỏ ghi',
        title: 'Bỏ ghi các phiếu đã chọn',
        size: 'medium',
        icon: 'slash-outline',
        disabled: () => {
          return this.selectedIds.length == 0;
        },
        click: () => {
          this.cms.showDialog('Phiếu mua hàng', 'Bạn có chắc muốn bỏ ghi các đơn hàng đã chọn ?', [
            {
              label: 'Trở về',
              status: 'basic',
              action: () => {
              }
            },
            {
              label: 'Bỏ ghi',
              status: 'warning',
              focus: true,
              action: () => {
                this.apiService.putPromise(this.apiPath, { changeState: 'UNRECORDED' }, this.selectedIds.map(id => ({ Code: id }))).then(rs => {
                  this.cms.toastService.show('Bỏ ghi thành công !', 'Phiếu mua hàng', { status: 'success' });
                  this.refresh();
                });
              }
            },
          ]);
        }
      });
      this.actionButtonList.unshift({
        type: 'button',
        name: 'writetobook',
        status: 'primary',
        label: 'Duyệt',
        title: 'Duyệt các phiếu đã chọn',
        size: 'medium',
        icon: 'checkmark-square-outline',
        disabled: () => {
          return this.selectedIds.length == 0;
        },
        click: () => {
          this.cms.showDialog('Phiếu mua hàng', 'Bạn có chắc muốn bỏ ghi các đơn hàng đã chọn ?', [
            {
              label: 'Trở về',
              status: 'basic',
              action: () => {
              }
            },
            {
              label: 'Duyệt',
              status: 'primary',
              focus: true,
              action: () => {
                this.apiService.putPromise(this.apiPath, { changeState: 'APPROVED' }, this.selectedIds.map(id => ({ Code: id }))).then(rs => {
                  this.cms.toastService.show('Duyệt thành công !', 'Phiếu mua hàng', { status: 'success' });
                  this.refresh();
                });
              }
            },
          ]);
        }
      });
      this.actionButtonList.unshift({
        type: 'button',
        name: 'writetobook',
        status: 'danger',
        label: 'Ghi sổ lại',
        title: 'Ghi sổ lại',
        size: 'medium',
        icon: 'npm-outline',
        disabled: () => {
          return this.selectedIds.length == 0;
        },
        click: () => {
          this.cms.openDialog(DialogFormComponent, {
            context: {
              title: 'ID phiếu cần ghi sổ lại',
              width: '600px',
              onInit: async (form, dialog) => {
                return true;
              },
              controls: [
                {
                  name: 'Ids',
                  label: 'Link hình',
                  placeholder: 'Mỗi ID trên 1 dòng',
                  type: 'textarea',
                  initValue: this.selectedIds.join('\n'),
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
                  label: 'Ghi sổ lại',
                  icon: 'npm-outline',
                  status: 'danger',
                  action: async (form: FormGroup) => {

                    let ids: string[] = form.get('Ids').value.trim()?.split('\n');

                    if (ids && ids.length > 0) {
                      let toastRef = this.cms.showToast('Các đơn hàng đang được ghi sổ lại', 'Đang ghi sổ lại', { status: 'info', duration: 60000 });
                      try {
                        ids = [...new Set(ids)];
                        this.loading = true;
                        await this.apiService.putPromise(this.apiPath, { reChangeState: 'UNRECORDED,APPROVED' }, ids.map(id => ({ Code: id.trim() })));
                        toastRef.close();
                        toastRef = this.cms.showToast('Các đơn hàng đã được ghi sổ lại', 'Hoàn tất ghi sổ lại', { status: 'success', duration: 10000 });
                        this.loading = false;
                      } catch (err) {
                        console.error(err);
                        this.loading = false;
                        toastRef.close();
                        toastRef = this.cms.showToast('Các đơn hàng chưa đượ ghi sổ lại do có lỗi xảy ra trong quá trình thực thi', 'Lỗi ghi sổ lại', { status: 'danger', duration: 30000 });
                      }
                    }

                    return true;
                  },
                },
              ],
            },
          });
        }
      });

      const processingMap = AppModule.processMaps['otherBusinessVoucher'];
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
          field: 'Object',
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
          headerName: 'Mô tả',
          field: 'Description',
          width: 300,
          filter: 'agTextColumnFilter',
          autoHeight: true,
        },
        {
          headerName: 'Ngày thu',
          field: 'DateOfVoucher',
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
          field: 'DateOfCreate',
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
    params['includeContact'] = true;
    params['includeParent'] = true;
    params['includeRelativeVouchers'] = true;
    params['includeCreator'] = true;
    // params['sort_Id'] = 'desc';
    return params;
  }

  /** Implement required */
  openFormDialplog(ids?: string[], onDialogSave?: (newData: OtherBusinessVoucherModel[]) => void, onDialogClose?: () => void) {
    this.cms.openDialog(AccountingOtherBusinessVoucherFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: ids,
        onDialogSave: (newData: OtherBusinessVoucherModel[]) => {
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
