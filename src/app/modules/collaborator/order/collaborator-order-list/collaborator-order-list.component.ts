import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbThemeService, NbToastrService } from '@nebular/theme';
import { AppModule } from '../../../../app.module';
import { CollaboratorOrderModel } from '../../../../models/collaborator.model';
import { ApiService } from '../../../../services/api.service';
import { RootServices } from '../../../../services/root.services';
import { CommonService } from '../../../../services/common.service';
import { CollaboratorOrderPrintComponent } from '../collaborator-order-print/collaborator-order-print.component';
import { AgGridDataManagerListComponent } from '../../../../lib/data-manager/ag-grid-data-manger-list.component';
import { DatePipe } from '@angular/common';
import { agMakeSelectionColDef } from '../../../../lib/custom-element/ag-list/column-define/selection.define';
import { AgTextCellRenderer } from '../../../../lib/custom-element/ag-list/cell/text.component';
import { AgSelect2Filter } from '../../../../lib/custom-element/ag-list/filter/select2.component.filter';
import { AgDateCellRenderer } from '../../../../lib/custom-element/ag-list/cell/date.component';
import { agMakeTagsColDef } from '../../../../lib/custom-element/ag-list/column-define/tags.define';
import { agMakeCurrencyColDef } from '../../../../lib/custom-element/ag-list/column-define/currency.define';
import { agMakeStateColDef } from '../../../../lib/custom-element/ag-list/column-define/state.define';
import { agMakeCommandColDef } from '../../../../lib/custom-element/ag-list/column-define/command.define';
import { ColDef, IGetRowsParams } from '@ag-grid-community/core';
import { CollaboratorOrderFormComponent } from '../collaborator-order-form/collaborator-order-form.component';
import { MobileAppService } from '../../../mobile-app/mobile-app.service';
import { CollaboratorService } from '../../collaborator.service';
import { PageModel } from '../../../../models/page.model';
import { filter, take } from 'rxjs/operators';
import { agMakeTextColDef } from '../../../../lib/custom-element/ag-list/column-define/text.define';

declare const $: any;
@Component({
  selector: 'ngx-collaborator-order-list',
  templateUrl: './collaborator-order-list.component.html',
  styleUrls: ['./collaborator-order-list.component.scss']
})
export class CollaboratorOrderListComponent extends AgGridDataManagerListComponent<CollaboratorOrderModel, CollaboratorOrderFormComponent> implements OnInit {

  componentName: string = 'CommercePosOrderListComponent';
  formPath = '/collaborator/page/order/form';
  apiPath = '/collaborator/orders';
  idKey = ['Code'];
  // formDialog = CollaboratorOrderFormComponent;
  printDialog = CollaboratorOrderPrintComponent;

  // AG-Grid config
  public rowHeight: number = 50;
  // @Input() gridHeight = 'calc(100vh - 230px)';
  // @Input() suppressRowClickSelection = false;

  paymentMethodMap = {
    CASH: { id: 'CASH', text: 'Tiền mặt' },
    BANKTRANSFER: { id: 'BANKTRANSFER', text: 'Chuyển khoản' },
    DEBT: { id: 'DEBT', text: 'Công nợ' },
    MIXED: { id: 'MIXED', text: 'Hỗn hợp' },
  };

  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public themeService: NbThemeService,
    public ref: NbDialogRef<CollaboratorOrderListComponent>,
    public datePipe: DatePipe,
    public mobileAppService: MobileAppService,
    public collaboratorService: CollaboratorService,
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

      // Add page choosed
      this.collaboratorService.pageList$.pipe(filter(f => f && f.length > 0), take(1)).toPromise().then(pageList => {
        this.actionButtonList.unshift({
          type: 'select2',
          name: 'pbxdomain',
          status: 'success',
          label: 'Select page',
          icon: 'plus',
          title: this.cms.textTransform(this.cms.translate.instant('Collaborator.Page.title', { action: this.cms.translateText('Common.choose'), definition: '' }), 'head-title'),
          size: 'medium',
          select2: {
            data: pageList,
            option: {
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
        label: 'Download PDF',
        title: 'Xuất danh sách đơn hiện tại ra PDF',
        size: 'medium',
        icon: 'download-outline',
        // disabled: () => {
        //   return this.selectedIds.length == 0;
        // },
        click: () => {
          let query = {
            type: 'pdf',
            ...this.parseFilterToApiParams(this.gridApi.getFilterModel())
          };
          window.open(this.apiService.buildApiUrl(this.apiPath, this.prepareApiParams(query)), '__blank');
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
      //     this.cms.showDialog('Đơn hàng POS', 'Bạn có chắc muốn bỏ ghi các đơn hàng đã chọn ?', [
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
      //             this.cms.toastService.show('Duyệt thành công !', 'Đơn hàng POS', { status: 'success' });
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
      //   disabled: () => false,
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

      const processingMap = AppModule.processMaps['collaboratoOrder'];
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
          headerName: 'ID',
          field: 'Code',
          width: 140,
          filter: 'agTextColumnFilter',
          pinned: 'left',
        },
        {
          ...agMakeTextColDef(this.cms),
          headerName: 'Khách hàng',
          field: 'Object',
          // pinned: 'left',
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
          headerName: 'Ngày bán hàng',
          field: 'DateOfOrder',
          width: 180,
          filter: 'agDateColumnFilter',
          filterParams: {
            inRangeFloatingFilterDateFormat: 'DD/MM/YY',
          },
          cellRenderer: AgDateCellRenderer,
        },
        {
          ...agMakeTextColDef(this.cms),
          headerName: 'Tiêu đề',
          field: 'Title',
          width: 300,
        },
        {
          headerName: 'Thực thi',
          field: 'JobHandler',
          width: 160,
          autoHeight: true,
          cellStyle: {
            lineHeight: '0.9rem',
            fontSize: '0.7rem'
          },
          cellRenderer: (params) => {
            if (params.node?.data?.JobHandler) {
              return `CV: ${params.node?.data?.JobHandler.JobName}<br>NV: ${this.cms.getObjectText(params.node?.data?.JobHandler)}<br>TG ${this.datePipe.transform(params.node?.data?.JobHandler?.JobAccepted, 'short')}`;
            }
            return this.cms.getObjectText(params.node?.data?.JobHandler);
          },
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.makeSelect2AjaxOption('/user/users', { includeIdText: true }, {
                placeholder: 'Chọn nhân viên đang thự thi...', limit: 10, prepareReaultItem: (item) => {
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
          headerName: 'Tổng tiền',
          field: 'Total',
          pinned: 'right',
          width: 150,
        },
        {
          ...agMakeTagsColDef(this.cms, (tag) => {
            this.cms.previewVoucher(tag.type, tag.id);
          }),
          headerName: 'Chứng từ liên quan',
          field: 'RelativeVouchers',
          width: 300,
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
                  item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'];
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
          headerName: 'CTV Bán Hàng',
          field: 'Publisher',
          width: 150,
          cellRenderer: AgTextCellRenderer,
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.makeSelect2AjaxOption('/contact/contacts', { includeIdText: true, includeGroups: true, sort_SearchRank: 'desc' }, {
                placeholder: 'Chọn CTV Bán Hàng...', limit: 10, prepareReaultItem: (item) => {
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
          headerName: 'Số tiền',
          field: 'Amount',
          // pinned: 'right',
          width: 150,
        },
        {
          ...agMakeStateColDef(this.cms, processingMap, (data) => {
            // this.preview([data]);
            if (this.cms.getObjectId(data.State) == 'PROCESSING') {
              this.openForm([data.Code]);
            } else {
              this.preview([data]);
            }
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

  // @Input() getRowHeight = (params: RowHeightParams<CollaboratorOrderModel>) => {
  //   return 123;
  // }

  prepareApiParams(params: any, getRowParams?: IGetRowsParams) {
    params['includeObject'] = true;
    params['includeCreator'] = true;
    params['includePublisher'] = true;
    params['includeRelativeVouchers'] = true;
    params['sort_Id'] = 'desc';
    params['page'] = this.collaboratorService?.currentpage$?.value || null;
    return params;
  }

  /** Implement required */
  openFormDialplog(ids?: string[], onDialogSave?: (newData: CollaboratorOrderModel[]) => void, onDialogClose?: () => void) {
    this.cms.openDialog(CollaboratorOrderFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: ids,
        onDialogSave: (newData: CollaboratorOrderModel[]) => {
          if (onDialogSave) onDialogSave(newData);
        },
        onDialogClose: () => {
          if (onDialogClose) onDialogClose();
        },
      },
    });
    return false;
  }

  // async getFormData(ids: string[]) {
  //   return this.apiService.getPromise<CollaboratorOrderModel[]>('/sales/commerce-pos-orders', { id: ids, includeContact: true, includeDetails: true, useBaseTimezone: true });
  // }

  onGridReady(params) {
    super.onGridReady(params);
    // const $(this.agGrid['_nativeElement']).offset().top;
  }

  async preview(data: CollaboratorOrderModel[], source?: string) {
    this.cms.openDialog(CollaboratorOrderPrintComponent, {
      context: {
        showLoadinng: true,
        title: 'Xem trước',
        // data: data,
        // id: data.map(m => m[this.idKey]),
        id: data.map(item => this.makeId(item)),
        sourceOfDialog: 'list',
        mode: 'print',
        idKey: ['Code'],
        // approvedConfirm: true,
        onChange: async (data: CollaboratorOrderModel, printComponent: CollaboratorOrderPrintComponent) => {

          printComponent.close();
          if (this.cms.getObjectId(data.State) === 'PROCESSING') {
            this.gotoForm(data.Code);
          } else {
            this.refresh();
          }

        },
        onSaveAndClose: () => {
          this.refresh();
        },
      },
    });
    return false;
  }

  onChangePage(page: PageModel) {
    if (page !== null) {
      this.collaboratorService.currentpage$.next(this.cms.getObjectId(page));
      this.cms.takeOnce(this.componentName + '_on_domain_changed', 1000).then(() => {
        this.refresh();
      });
    }
  }
}
