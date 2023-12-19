import { ColDef, IGetRowsParams } from "@ag-grid-community/core";
import { Component, OnInit } from "@angular/core";
import { AgGridDataManagerListComponent } from "../../../../../lib/data-manager/ag-grid-data-manger-list.component";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";
import { NbDialogService, NbToastrService, NbThemeService, NbDialogRef } from "@nebular/theme";
import { take, filter, takeUntil } from "rxjs/operators";
import { AppModule } from "../../../../../app.module";
import { AgDateCellRenderer } from "../../../../../lib/custom-element/ag-list/cell/date.component";
import { AgTextCellRenderer } from "../../../../../lib/custom-element/ag-list/cell/text.component";
import { agMakeCommandColDef } from "../../../../../lib/custom-element/ag-list/column-define/command.define";
import { agMakeCurrencyColDef } from "../../../../../lib/custom-element/ag-list/column-define/currency.define";
import { agMakeSelectionColDef } from "../../../../../lib/custom-element/ag-list/column-define/selection.define";
import { agMakeStateColDef } from "../../../../../lib/custom-element/ag-list/column-define/state.define";
import { agMakeTagsColDef } from "../../../../../lib/custom-element/ag-list/column-define/tags.define";
import { agMakeTextColDef } from "../../../../../lib/custom-element/ag-list/column-define/text.define";
import { AgSelect2Filter } from "../../../../../lib/custom-element/ag-list/filter/select2.component.filter";
import { PageModel } from "../../../../../models/page.model";
import { ApiService } from "../../../../../services/api.service";
import { CommonService } from "../../../../../services/common.service";
import { MobileAppService } from "../../../../mobile-app/mobile-app.service";
import { CollaboratorService } from "../../../collaborator.service";
import { Model } from "../../../../../models/model";
import { CollaboratorPageFormComponent } from "../../../page/collaborator-page-form/collaborator-page-form.component";
import { agMakeNumberColDef } from "../../../../../lib/custom-element/ag-list/column-define/number.define";
import { Select2Option } from "../../../../../lib/custom-element/select2/select2.component";
import { FormBuilder, FormGroup } from "@angular/forms";
import { RootServices } from "../../../../../services/root.services";

declare const $: any;
@Component({
  selector: 'ngx-collaborator-kpi-indicator-list',
  templateUrl: './kpi-indicator-list.component.html',
  styleUrls: ['./kpi-indicator-list.component.scss']
})
export class CollaboratorKpiIndicatorListComponent extends AgGridDataManagerListComponent<Model, CollaboratorPageFormComponent> implements OnInit {


  componentName: string = 'CommercePosOrderListComponent';
  formPath = '/collaborator/kpi-indicator/form';
  apiPath = '/collaborator/kpi-indicators';
  idKey = ['Employee'];
  // formDialog = CollaboratorKpiIndicatorFormComponent;
  // printDialog = CollaboratorKpiIndicatorPrintComponent;

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

  filterFormGroup: FormGroup;

  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public themeService: NbThemeService,
    public ref: NbDialogRef<CollaboratorKpiIndicatorListComponent>,
    public datePipe: DatePipe,
    public mobileAppService: MobileAppService,
    public collaboratorService: CollaboratorService,
    public formBuilder: FormBuilder,
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

    const today = new Date();
    this.filterFormGroup = this.formBuilder.group({
      Month: [(today.getMonth() + 1) + '/' + today.getFullYear()],
      DateRange: [[this.cms.getBeginOfMonth(today), this.cms.getEndOfMonth(today)]],
    });
    const month = this.filterFormGroup.get('Month');
    const dateRange = this.filterFormGroup.get('DateRange');
    month.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      const today = new Date();
      const [month, year] = this.cms.getObjectId(value).split('/');
      today.setFullYear(year);
      today.setMonth(month - 1);
      dateRange.setValue([this.cms.getBeginOfMonth(today), this.cms.getEndOfMonth(today)]);
    });
  }

  select2OptionForMonth: Select2Option = {
    ...this.cms.select2OptionForTemplate,
    data: Array.from(Array(12).keys()).reduce((result, curr, index) => {
      const monthYear = (parseInt(result.today.getMonth() as any) + 1) + '/' + result.today.getFullYear();
      result.months.push({ id: monthYear, text: 'Tháng ' + monthYear });
      result.today.setMonth(result.today.getMonth() - 1);
      return result;
    }, { today: new Date(), months: [] }).months,
  };

  async init() {
    return super.init().then(async state => {

      // Add page choosed
      const today = new Date();
      // this.collaboratorService.pageList$.pipe(take(1), filter(f => f && f.length > 0)).toPromise().then(pageList => {
      //   this.actionButtonList.unshift({
      //     type: 'select2',
      //     name: 'month',
      //     status: 'primary',
      //     label: 'Chọn tháng',
      //     icon: 'plus',
      //     title: 'Chọn tháng cần lấy dữ liệu',
      //     size: 'medium',
      //     select2: {
      //       data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => ({ id: m, text: 'Tháng ' + m + (today.getMonth() == m ? ' (hiện tại)' : '') })),
      //       option: {
      //         placeholder: 'Chọn tháng...',
      //         allowClear: true,
      //         width: '100%',
      //         dropdownAutoWidth: true,
      //         minimumInputLength: 0,
      //         keyMap: {
      //           id: 'id',
      //           text: 'text',
      //         },
      //       }
      //     },
          // asyncValue: this.collaboratorService.currentpage$,
      //     change: (value: any, option: any) => {
      //       this.onChangePage(value);
      //     },
      //     disabled: () => {
      //       return false;
      //     },
      //     click: () => {
      //       // this.gotoForm();
      //       return false;
      //     },
      //   });
      // });

      const processingMap = AppModule.processMaps['collaboratoCommissionIncurred'];
      await this.cms.waitForLanguageLoaded();
      this.columnDefs = this.configSetting([
        {
          ...agMakeSelectionColDef(this.cms),
          headerName: 'Stt',
          field: 'Id',
          width: 100,
          valueGetter: 'node.data.Manager',
          // sortingOrder: ['desc', 'asc'],
          initialSort: 'desc',
        },
        // {
        //   headerName: 'ID',
        //   field: 'Manager',
        //   width: 140,
        //   filter: 'agTextColumnFilter',
        //   pinned: 'left',
        // },
        // {
        //   ...agMakeTextColDef(this.cms),
        //   headerName: 'Chu kỳ',
        //   field: 'Cycle',
        //   width: 180,
        //   filter: AgSelect2Filter,
        //   filterParams: {
        //     select2Option: {
        //       placeholder: 'Chọn...',
        //       allowClear: true,
        //       width: '100%',
        //       dropdownAutoWidth: true,
        //       minimumInputLength: 0,
        //       withThumbnail: false,
        //       multiple: true,
        //       keyMap: {
        //         id: 'id',
        //         text: 'text',
        //       },
        //       data: [
        //         { id: 'HOUR', text: 'Phân tích theo ngày (các giờ trong ngày)' },
        //         { id: 'DAYOFWEEK', text: 'Phân tích theo tuần (các ngày trong tuần)' },
        //         { id: 'DAY', text: 'Phân tích theo tháng (30 ngày gần nhất)' },
        //         { id: 'MONTH', text: 'Phân tích theo năm (các tháng trong năm)' },
        //       ],
        //     }
        //   },
        // },
        // {
        //   headerName: 'Khoản thời gian',
        //   field: 'DateRange',
        //   width: 180,
        //   filter: 'agDateColumnFilter',
        //   filterParams: {
        //     inRangeFloatingFilterDateFormat: 'DD/MM/YY',
        //   },
        //   cellRenderer: AgDateCellRenderer,
        // },
        {
          ...agMakeTextColDef(this.cms),
          headerName: 'NV CS CTV',
          field: 'Manager',
          valueGetter: 'node.data.ManagerName',
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
          ...agMakeCurrencyColDef(this.cms),
          headerName: 'Danh thu',
          field: 'Revenue',
          // pinned: 'right',
          width: 150,
        },
        {
          ...agMakeNumberColDef(this.cms),
          headerName: 'Số đơn hàng phát sinh',
          field: 'NumOfOrders',
          // pinned: 'right',
          width: 150,
        },
        {
          ...agMakeNumberColDef(this.cms),
          headerName: 'Tổng số CTV',
          field: 'NumOfPublishers',
          // pinned: 'right',
          width: 150,
        },
        {
          ...agMakeNumberColDef(this.cms),
          headerName: 'CTV mới',
          field: 'NumOfNewPublishers',
          // pinned: 'right',
          width: 150,
        },
        {
          ...agMakeNumberColDef(this.cms),
          headerName: 'CTV phát sinh đơn hàng',
          field: 'NumOfGenerateOrderPublishers',
          // pinned: 'right',
          width: 150,
        },
        {
          ...agMakeNumberColDef(this.cms),
          cellRendererParams: {
            symbol: '%'
          },
          headerName: 'Tỷ lệ chốt đơn',
          field: 'AprrovedOrderRatio',
          // pinned: 'right',
          width: 150,
        },
        {
          ...agMakeNumberColDef(this.cms),
          cellRendererParams: {
            symbol: '%'
          },
          headerName: 'Tỷ lệ hoàn tất',
          field: 'CompletedOrderRatio',
          // pinned: 'right',
          width: 150,
        },
        {
          ...agMakeNumberColDef(this.cms),
          cellRendererParams: {
            symbol: '%'
          },
          headerName: 'Tỷ lệ hủy đơn',
          field: 'UnrecordedOrderRatio',
          // pinned: 'right',
          width: 150,
        },
        // {
        //   headerName: 'Ngày bán hàng',
        //   field: 'DateOfOrder',
        //   width: 180,
        //   filter: 'agDateColumnFilter',
        //   filterParams: {
        //     inRangeFloatingFilterDateFormat: 'DD/MM/YY',
        //   },
        //   cellRenderer: AgDateCellRenderer,
        // },
        // {
        //   ...agMakeTextColDef(this.cms),
        //   headerName: 'Tiêu đề',
        //   field: 'Title',
        //   width: 300,
        // },
        // {
        //   headerName: 'Thực thi',
        //   field: 'JobHandler',
        //   width: 160,
        //   autoHeight: true,
        //   cellStyle: {
        //     lineHeight: '0.9rem',
        //     fontSize: '0.7rem'
        //   },
        //   cellRenderer: (params) => {
        //     if (params.node?.data?.JobHandler) {
        //       return `CV: ${params.node?.data?.JobHandler.JobName}<br>NV: ${this.cms.getObjectText(params.node?.data?.JobHandler)}<br>TG ${this.datePipe.transform(params.node?.data?.JobHandler?.JobAccepted, 'short')}`;
        //     }
        //     return this.cms.getObjectText(params.node?.data?.JobHandler);
        //   },
        //   filter: AgSelect2Filter,
        //   filterParams: {
        //     select2Option: {
        //       ...this.cms.makeSelect2AjaxOption('/user/users', { includeIdText: true }, {
        //         placeholder: 'Chọn nhân viên đang thự thi...', limit: 10, prepareReaultItem: (item) => {
        //           return item;
        //         }
        //       }),
        //       multiple: true,
        //       logic: 'OR',
        //       allowClear: true,
        //     }
        //   },
        // },
        // {
        //   ...agMakeCurrencyColDef(this.cms),
        //   headerName: 'Tổng tiền',
        //   field: 'Total',
        //   // pinned: 'right',
        //   width: 150,
        // },
        // {
        //   ...agMakeTagsColDef(this.cms, (tag) => {
        //     this.cms.previewVoucher(tag.type, tag.id);
        //   }),
        //   headerName: 'Chứng từ liên quan',
        //   field: 'RelativeVouchers',
        //   width: 300,
        // },
        // {
        //   headerName: 'Ngày tạo',
        //   field: 'Created',
        //   width: 180,
        //   filter: 'agDateColumnFilter',
        //   filterParams: {
        //     inRangeFloatingFilterDateFormat: 'DD/MM/YY',
        //   },
        //   cellRenderer: AgDateCellRenderer,
        // },
        // {
        //   headerName: 'Người tạo',
        //   field: 'Creator',
        //   // pinned: 'left',
        //   width: 200,
        //   cellRenderer: AgTextCellRenderer,
        //   filter: AgSelect2Filter,
        //   filterParams: {
        //     select2Option: {
        //       ...this.cms.makeSelect2AjaxOption('/user/users', { includeIdText: true, includeGroups: true, sort_SearchRank: 'desc' }, {
        //         placeholder: 'Chọn người tạo...', limit: 10, prepareReaultItem: (item) => {
        //           item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'];
        //           return item;
        //         }
        //       }),
        //       multiple: true,
        //       logic: 'OR',
        //       allowClear: true,
        //     }
        //   },
        // },
        // {
        //   headerName: 'CTV Bán Hàng',
        //   field: 'Publisher',
        //   width: 150,
        //   cellRenderer: AgTextCellRenderer,
        //   filter: AgSelect2Filter,
        //   filterParams: {
        //     select2Option: {
        //       ...this.cms.makeSelect2AjaxOption('/contact/contacts', { includeIdText: true, includeGroups: true, sort_SearchRank: 'desc' }, {
        //         placeholder: 'Chọn CTV Bán Hàng...', limit: 10, prepareReaultItem: (item) => {
        //           item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
        //           return item;
        //         }
        //       }),
        //       multiple: true,
        //       logic: 'OR',
        //       allowClear: true,
        //     }
        //   },
        // },
        // {
        //   ...agMakeCurrencyColDef(this.cms),
        //   headerName: 'Số tiền',
        //   field: 'Amount',
        //   // pinned: 'right',
        //   width: 150,
        // },
        // {
        //   ...agMakeStateColDef(this.cms, processingMap, (data) => {
        //     // this.preview([data]);
        //     if (this.cms.getObjectId(data.State) == 'PROCESSING') {
        //       this.openForm([data.Code]);
        //     } else {
        //       this.preview([data]);
        //     }
        //   }),
        //   headerName: 'Trạng thái',
        //   field: 'State',
        //   width: 155,
        // },
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

  // @Input() getRowHeight = (params: RowHeightParams<CollaboratorKpiIndicatorModel>) => {
  //   return 123;
  // }

  prepareApiParams(params: any, getRowParams?: IGetRowsParams) {
    // params['includeObject'] = true;
    // params['includeCreator'] = true;
    // params['includePublisher'] = true;
    // params['includeRelativeVouchers'] = true;
    // params['sort_Id'] = 'desc';
    params['cycle'] = 'MONTH';
    params['page'] = this.collaboratorService?.currentpage$?.value || null;


    const filterData = this.filterFormGroup.getRawValue();
    params['from'] = this.cms.getBeginOfDate(filterData['DateRange'][0]).toISOString();
    params['to'] = this.cms.getEndOfDate(filterData['DateRange'][1]).toISOString();

    return params;
  }

  /** Implement required */
  // openFormDialplog(ids?: string[], onDialogSave?: (newData: CollaboratorKpiIndicatorModel[]) => void, onDialogClose?: () => void) {
  //   this.cms.openDialog(CollaboratorKpiIndicatorFormComponent, {
  //     context: {
  //       inputMode: 'dialog',
  //       inputId: ids,
  //       onDialogSave: (newData: CollaboratorKpiIndicatorModel[]) => {
  //         if (onDialogSave) onDialogSave(newData);
  //       },
  //       onDialogClose: () => {
  //         if (onDialogClose) onDialogClose();
  //       },
  //     },
  //   });
  //   return false;
  // }

  // async getFormData(ids: string[]) {
  //   return this.apiService.getPromise<CollaboratorKpiIndicatorModel[]>('/sales/commerce-pos-orders', { id: ids, includeContact: true, includeDetails: true, useBaseTimezone: true });
  // }

  onGridReady(params) {
    super.onGridReady(params);
    // const $(this.agGrid['_nativeElement']).offset().top;
    this.filterFormGroup.get('DateRange').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(filterData => {
      this.refresh();
    });
  }

  // async preview(data: CollaboratorKpiIndicatorModel[], source?: string) {
  //   this.cms.openDialog(CollaboratorKpiIndicatorPrintComponent, {
  //     context: {
  //       showLoadinng: true,
  //       title: 'Xem trước',
  //       // data: data,
  //       // id: data.map(m => m[this.idKey]),
  //       id: data.map(item => this.makeId(item)),
  //       sourceOfDialog: 'list',
  //       mode: 'print',
  //       idKey: ['Code'],
  //       // approvedConfirm: true,
  //       onChange: async (data: CollaboratorKpiIndicatorModel, printComponent: CollaboratorKpiIndicatorPrintComponent) => {

  //         printComponent.close();
  //         if (this.cms.getObjectId(data.State) === 'PROCESSING') {
  //           this.gotoForm(data.Code);
  //         } else {
  //           this.refresh();
  //         }

  //       },
  //       onSaveAndClose: () => {
  //         this.refresh();
  //       },
  //     },
  //   });
  //   return false;
  // }

  // onChangePage(page: PageModel) {
  //   this.collaboratorService.currentpage$.next(this.cms.getObjectId(page));
  //   this.cms.takeOnce(this.componentName + '_on_domain_changed', 1000).then(() => {
  //     this.refresh();
  //   });
  // }

  openFormDialplog(ids?: string[], onDialogSave?: (newData: Model[]) => void, onDialogClose?: () => void): void {
    throw new Error("Method not implemented.");
  }
}
