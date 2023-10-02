import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbThemeService, NbToastrService } from '@nebular/theme';
import { AppModule } from '../../../../app.module';
import { CostClassificationModel } from '../../../../models/accounting.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { AccCostClassificationFormComponent } from '../cost-classification-form/cost-classification-form.component';
import { AccCostClassificationPrintComponent } from '../cost-classification-print/cost-classification-print.component';
import { AgGridDataManagerListComponent } from '../../../../lib/data-manager/ag-grid-data-manger-list.component';
import { DatePipe } from '@angular/common';
import { IGetRowsParams } from 'ag-grid-community';
import { DialogFormComponent } from '../../../dialog/dialog-form/dialog-form.component';
import { FormGroup } from '@angular/forms';
import { agMakeSelectionColDef } from '../../../../lib/custom-element/ag-list/column-define/selection.define';
import { AgTextCellRenderer } from '../../../../lib/custom-element/ag-list/cell/text.component';
import { AgSelect2Filter } from '../../../../lib/custom-element/ag-list/filter/select2.component.filter';
import { agMakeTagsColDef } from '../../../../lib/custom-element/ag-list/column-define/tags.define';
import { AgDateCellRenderer } from '../../../../lib/custom-element/ag-list/cell/date.component';
import { agMakeCurrencyColDef } from '../../../../lib/custom-element/ag-list/column-define/currency.define';
import { agMakeStateColDef } from '../../../../lib/custom-element/ag-list/column-define/state.define';
import { agMakeCommandColDef } from '../../../../lib/custom-element/ag-list/column-define/command.define';
import { ColDef } from '@ag-grid-community/core';
import { RootServices } from '../../../../services/root.services';
import { Select2Option } from '../../../../lib/custom-element/select2/select2.component';

@Component({
  selector: 'ngx-cost-classification-list',
  templateUrl: './cost-classification-list.component.html',
  styleUrls: ['./cost-classification-list.component.scss']
})
export class AccCostClassificationListComponent extends AgGridDataManagerListComponent<CostClassificationModel, AccCostClassificationFormComponent> implements OnInit {

  componentName: string = 'AccCostClassificationListComponent';
  formPath = '/accounting/cost-classification/form';
  apiPath = '/accounting/cost-classifications';
  idKey = ['Code'];
  formDialog = AccCostClassificationFormComponent;
  printDialog = AccCostClassificationPrintComponent;

  reuseDialog = true;
  static _dialog: NbDialogRef<AccCostClassificationListComponent>;

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
    public ref: NbDialogRef<AccCostClassificationListComponent>,
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

      const processingMap = AppModule.processMaps['cashVoucher'];
      await this.cms.waitForLanguageLoaded();
      this.columnDefs = this.configSetting([
        {
          ...agMakeSelectionColDef(this.cms),
          headerName: 'Stt',
          field: 'Id',
          width: 100,
          valueGetter: 'node.data.Id',
          // sortingOrder: ['desc', 'asc'],
          initialSort: 'desc',
        },
        {
          headerName: 'Khoản mục cha',
          field: 'Parent',
          pinned: 'left',
          width: 150,
          cellRenderer: AgTextCellRenderer,
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.makeSelect2AjaxOption('/accounting/cost-classifications', { onlyIdText: true, sort_Name: 'asc' }, {
                placeholder: 'Chọn khoản mục cha...', limit: 10, prepareReaultItem: (item) => {
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
          headerName: 'ID',
          field: 'Code',
          width: 140,
          filter: 'agTextColumnFilter',
          pinned: 'left',
        },
        {
          headerName: 'Name',
          field: 'Name',
          width: 300,
          filter: 'agTextColumnFilter',
          autoHeight: true,
        },
        {
          headerName: 'Mô hình kế toán',
          field: 'AccModel',
          pinned: 'left',
          width: 180,
          cellRenderer: (params) => { return { 'TT200': 'Thông tư 200', 'TT133': 'Thông tư 133', '': '--' }[this.cms.getObjectId(params?.node?.data?.AccModel) || ''] },
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.select2OptionForTemplate,
              multiple: true,
              placeholder: 'Chọn mô hình kế toán...',
              data: [
                { id: 'TT200', text: 'Thông tư 200' },
                { id: 'TT133', text: 'Thông tư 133' },
              ],
            } as Select2Option
          },
        },
        {
          headerName: 'Mô tả',
          field: 'Description',
          width: 800,
          filter: 'agTextColumnFilter',
          autoHeight: true,
        },
        {
          ...agMakeCurrencyColDef(this.cms),
          headerName: 'Số dư',
          field: 'Balance',
          width: 200,
          pinned: 'right'
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
    params['includeBalance'] = true;
    return params;
  }

  /** Implement required */
  openFormDialplog(ids?: string[], onDialogSave?: (newData: CostClassificationModel[]) => void, onDialogClose?: () => void) {
    this.cms.openDialog(AccCostClassificationFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: ids,
        onDialogSave: (newData: CostClassificationModel[]) => {
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
