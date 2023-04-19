import { AgButtonsCellRenderer, AgCurrencyCellRenderer, AgIdCellRenderer, AgTagsCellRenderer, AgTextCellRenderer } from './../../../../lib/custom-element/ag-list/ag-list.lib';
import { Component, OnInit } from '@angular/core';
import { CommercePosOrderModel } from '../../../../models/commerce-pos.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogRef, NbDialogService, NbThemeService, NbToastrService } from '@nebular/theme';
import { CommercePosOrderFormComponent } from '../commerce-pos-order-form/commerce-pos-order-form.component';
import { AgGridDataManagerListComponent } from '../../../../lib/data-manager/ag-grid-data-manger-list.component';
import { DatePipe } from '@angular/common';
import { AgButtonCellRenderer, AgDateCellRenderer } from '../../../../lib/custom-element/ag-list/ag-list.lib';
import { AppModule } from '../../../../app.module';
import { IGetRowsParams } from '@ag-grid-community/core';
import { AgSelect2Filter } from '../../../../lib/custom-element/ag-list/ag-list-lib/select2.component.filter';
import { CommercePosOrderPrintComponent } from '../commerce-pos-order-print/commerce-pos-order-print.component';
import { DialogFormComponent } from '../../../dialog/dialog-form/dialog-form.component';
import { FormGroup } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ngx-commerce-pos-order-list',
  templateUrl: './commerce-pos-order-list.component.html',
  styleUrls: ['./commerce-pos-order-list.component.scss'],
  providers: [DatePipe, TranslatePipe]
})
export class CommercePosOrderListComponent extends AgGridDataManagerListComponent<CommercePosOrderModel, CommercePosOrderFormComponent> implements OnInit {

  componentName: string = 'CommercePosOrderListComponent';
  formPath = '/commerce-pos/commerce-pos-order/form';
  apiPath = '/commerce-pos/orders';
  idKey = 'Code';
  formDialog = CommercePosOrderFormComponent;
  printDialog = CommercePosOrderPrintComponent;

  // AG-Grid config
  public rowHeight: number = 50;

  constructor(
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public themeService: NbThemeService,
    public ref: NbDialogRef<CommercePosOrderListComponent>,
    public datePipe: DatePipe,
  ) {
    super(apiService, router, cms, dialogService, toastService, themeService, ref);



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
          this.cms.showDialog('Đơn hàng POS', 'Bạn có chắc muốn bỏ ghi các đơn hàng đã chọn ?', [
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
                  this.cms.toastService.show('Bỏ ghi thành công !', 'Đơn hàng POS', { status: 'success' });
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
          this.cms.showDialog('Đơn hàng POS', 'Bạn có chắc muốn bỏ ghi các đơn hàng đã chọn ?', [
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
                  this.cms.toastService.show('Duyệt thành công !', 'Đơn hàng POS', { status: 'success' });
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
        disabled: () => false,
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

      const processingMap = AppModule.processMaps['commercePos'];
      await this.cms.waitForLanguageLoaded();
      this.columnDefs = this.configSetting([
        {
          headerName: '#',
          field: 'Id',
          width: 80,
          valueGetter: 'node.data.Id',
          cellRenderer: 'loadingCellRenderer',
          sortable: false,
          filter: false,
          pinned: 'left',
          headerCheckboxSelection: true,
          checkboxSelection: true,
          showDisabledCheckboxes: true,
        },
        {
          headerName: 'Mã',
          field: 'Code',
          width: 140,
          filter: 'agTextColumnFilter',
          pinned: 'left',
        },
        {
          headerName: 'Khách hàng',
          field: 'Object',
          pinned: 'left',
          width: 200,
          cellRenderer: AgTextCellRenderer,
          // suppressMenu: true,
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
          headerName: 'Chứng từ liên quan',
          field: 'RelativeVouchers',
          width: 350,
          filter: 'agTextColumnFilter',
          cellRenderer: AgTagsCellRenderer,
          cellRendererParams: {
            onInit: (params: any, component: AgTagsCellRenderer) => {
              params.tags = (params?.node?.data?.RelativeVouchers || []).map(m => ({
                name: 'edit',
                ...m,
                action: (params: any, button: any) => {
                  this.cms.previewVoucher(m.type, m.id);
                }
              }));
            }
          }
        },
        {
          headerName: 'Người tạo',
          field: 'Creator',
          width: 150,
          filter: 'agTextColumnFilter',
          cellRenderer: AgTextCellRenderer,
        },
        {
          headerName: 'Ngày tạo',
          field: 'Created',
          width: 180,
          // valueFormatter: (node) => {
          //   return node.value ? this.datePipe.transform(node.value, 'short') : '';
          // },
          filter: 'agDateColumnFilter',
          filterParams: {
            inRangeFloatingFilterDateFormat: 'DD/MM/YY',
          },
          cellRenderer: AgDateCellRenderer,
        },
        {
          headerName: 'Tiêu đề',
          field: 'Title',
          width: 300,
          filter: 'agTextColumnFilter',
          autoHeight: true,
        },
        {
          headerName: 'Số tiền',
          field: 'Amount',
          width: 150,
          cellRenderer: AgCurrencyCellRenderer,
          filter: 'agNumberColumnFilter',
          pinned: 'right',
          type: 'rightAligned',
        },
        {
          headerName: 'Trạng thái',
          field: 'State',
          width: 180,
          pinned: 'right',
          cellRenderer: AgButtonCellRenderer,
          cellStyle: { 'text-overflow': 'initial' },
          cellRendererParams: {
            label: '...',
            onInit: (params: any, component: AgButtonCellRenderer) => {
              // console.log(component);
              const value = this.cms.getObjectId(params.value);
              if (value && processingMap[value]) {
                params.label = processingMap[value].label;
                params.status = processingMap[value].status;
                params.outline = processingMap[value].outline;
              }
            },
            onRefresh: (params: any, component: AgButtonCellRenderer) => {
              // console.log(params);
              params.label = params.value;
            },
            clicked: (params: any) => {
              this.preview([params.node.data]);
            }
          },
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              placeholder: 'Chọn...',
              allowClear: true,
              width: '100%',
              dropdownAutoWidth: true,
              minimumInputLength: 0,
              withThumbnail: false,
              multiple: true,
              keyMap: {
                id: 'id',
                text: 'text',
              },
              data: Object.keys(processingMap).map(m => ({
                id: m,
                text: this.cms.translateText(processingMap[m].label),
              })),
            }
          },
        },
        {
          headerName: 'Sử/Xóa',
          field: 'State',
          width: 130,
          filter: false,
          pinned: 'right',
          headerClass: 'ag-right-aligned-header',
          cellRenderer: AgButtonsCellRenderer,
          resizable: false,
          cellStyle: { 'text-overflow': 'initial' },
          cellRendererParams: {
            buttons: [
              {
                name: 'edit',
                status: 'warning',
                icon: 'edit-2-outline',
                action: (params: any, button: any) => {
                  this.openForm([params.node.data.Code]);
                }
              },
              {
                name: 'delete',
                status: 'danger',
                icon: 'trash-2-outline',
                action: (params: any, button: any) => {
                  this.deleteConfirm([params.node.data.Code]);
                }
              },
            ],
            onInit: (params: any, component: AgButtonsCellRenderer) => {
            },
            onRefresh: (params: any, component: AgButtonsCellRenderer) => {
              // console.log(params);
            },
          }
        },
      ]);

      return state;
    });
  }

  ngOnInit() {
    super.ngOnInit();
  }

  prepareApiParams(params: any, getRowParams: IGetRowsParams) {
    params['includeCreator'] = true;
    params['includeObject'] = true;
    params['includeRelativeVouchers'] = true;
    // params['sort_Id'] = 'desc';
    return params;
  }

  /** Implement required */
  openFormDialplog(ids?: string[], onDialogSave?: (newData: CommercePosOrderModel[]) => void, onDialogClose?: () => void) {
    this.cms.openDialog(CommercePosOrderFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: ids,
        onDialogSave: (newData: CommercePosOrderModel[]) => {
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
    const columnsState = this.gridColumnApi.getColumnState();
    const defaultFilter = columnsState.find(f => f.colId === 'Id');
    if (defaultFilter) {
      defaultFilter.sort = 'desc';
    }
    this.gridColumnApi.applyColumnState({
      state: columnsState,
      applyOrder: true,
    });
  }
}
