import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbThemeService, NbToastrService } from '@nebular/theme';
import { AppModule } from '../../../../app.module';
import { CollaboratorOrderModel } from '../../../../models/collaborator.model';
import { ApiService } from '../../../../services/api.service';
import { RootServices } from '../../../../services/root.services';
import { CommonService } from '../../../../services/common.service';
import { AgGridDataManagerListComponent } from '../../../../lib/data-manager/ag-grid-data-manger-list.component';
import { DatePipe } from '@angular/common';
import { agMakeSelectionColDef } from '../../../../lib/custom-element/ag-list/column-define/selection.define';
import { AgTextCellRenderer } from '../../../../lib/custom-element/ag-list/cell/text.component';
import { AgSelect2Filter } from '../../../../lib/custom-element/ag-list/filter/select2.component.filter';
import { AgDateCellRenderer } from '../../../../lib/custom-element/ag-list/cell/date.component';
import { agMakeCommandColDef } from '../../../../lib/custom-element/ag-list/column-define/command.define';
import { ColDef, IGetRowsParams } from '@ag-grid-community/core';
import { MobileAppService } from '../../../mobile-app/mobile-app.service';
import { CollaboratorService } from '../../collaborator.service';
import { PageModel } from '../../../../models/page.model';
import { agMakeTextColDef } from '../../../../lib/custom-element/ag-list/column-define/text.define';
import { CollaboratorOrderFormComponent } from '../../order/collaborator-order-form/collaborator-order-form.component';
import { filter, take } from 'rxjs/operators';
import { Select2Option } from '../../../../lib/custom-element/select2/select2.component';

declare const $: any;
@Component({
  selector: 'ngx-collaborator-strategy-compile-rule-list',
  templateUrl: './strategy-compile-rule-list.component.html',
  styleUrls: ['./strategy-compile-rule-list.component.scss']
})
export class CollaboratorStrategyCompileRuleListComponent extends AgGridDataManagerListComponent<CollaboratorOrderModel, CollaboratorOrderFormComponent> implements OnInit {

  componentName: string = 'CollaboratorStrategyCompileRuleListComponent';
  // formPath = '/collaborator/strategy/order/form';
  apiPath = '/collaborator/strategy-compile-rules';
  idKey = ['Id', 'Publisher'];
  // formDialog = CollaboratorOrderFormComponent;
  // printDialog = CollaboratorOrderPrintComponent;

  // AG-Grid config
  public rowHeight: number = 50;
  // @Input() gridHeight = 'calc(100vh - 230px)';
  // @Input() suppressRowClickSelection = false;

  strategyTypeMap = {
    BASIC: { id: 'BASIC', text: 'Chiết khấu cơ bản' },
    ADVANCE: { id: 'ADVANCE', text: 'Chiết khấu nâng cao' },
    ADDON: { id: 'ADDON', text: 'Chiết khấu add-on' },
    REBY: { id: 'REBY', text: 'Chiết khấu tái mua' },
  };

  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public themeService: NbThemeService,
    public ref: NbDialogRef<CollaboratorStrategyCompileRuleListComponent>,
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
          // initialSort: 'desc',
        },
        {
          ...agMakeTextColDef(this.cms),
          headerName: 'Loại chiến lược',
          field: 'StrategyType',
          width: 150,
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              width: '100%',
              placeholder: 'Chọn loại chiến lược...',
              data: Object.keys(this.strategyTypeMap).map(key => this.strategyTypeMap[key]),
              multiple: true,
              logic: 'OR',
              allowClear: true,
              keyMap: {
                id: 'id',
                text: 'text',
              },
            } as Select2Option
          },
          valueGetter: params => this.strategyTypeMap[params?.data?.StrategyType],
          // pinned: 'left',
        },
        {
          ...agMakeTextColDef(this.cms),
          headerName: 'Chiết lược',
          field: 'StrategyTitle',
          width: 200,
          filter: 'agTextColumnFilter',
        },
        {
          ...agMakeTextColDef(this.cms),
          headerName: 'Sản phẩm',
          field: 'Sku',
          valueGetter: 'node.data.ProductName',
          // pinned: 'left',
          width: 300,
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.makeSelect2AjaxOption('/collaborator/products', {}, {
                placeholder: 'Chọn sản phẩm...', limit: 10, prepareReaultItem: (item) => {
                  item.id = item.Code;
                  item.text = item.Name;
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
          ...agMakeTextColDef(this.cms),
          headerName: 'ĐVT',
          field: 'Unit',
          width: 140,
        },
        {
          ...agMakeTextColDef(this.cms),
          headerName: 'CTV',
          field: 'Publisher',
          valueGetter: 'node.data.PublisherName',
          // pinned: 'left',
          width: 200,
          cellRenderer: AgTextCellRenderer,
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.makeSelect2AjaxOption('/collaborator/publishers', { select: 'Contact,Name' }, {
                placeholder: 'Chọn CTV...', limit: 10, prepareReaultItem: (item) => {
                  item.id = item.Contact;
                  item.text = item.Name;
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
          headerName: '%CK',
          field: 'CommissionRatio',
          width: 140,
          filter: 'agTextColumnFilter',
          // pinned: 'left',
        },
        {
          headerName: 'Ngày bắt đầu',
          field: 'DateOfStart',
          width: 180,
          cellRenderer: AgDateCellRenderer,
          cellRendererParams: {
            format: 'shortDate',
          },
          filter: 'agDateColumnFilter',
          filterParams: {
            inRangeFloatingFilterDateFormat: 'DD/MM/YY',
          },
        },
        {
          headerName: 'Ngày kết thúc',
          field: 'DateOfEnd',
          width: 180,
          cellRenderer: AgDateCellRenderer,
          cellRendererParams: {
            format: 'shortDate',
          },
          filter: 'agDateColumnFilter',
          filterParams: {
            inRangeFloatingFilterDateFormat: 'DD/MM/YY',
          },
        },
        {
          ...agMakeCommandColDef(this, this.cms, false, false, false),
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
    params['sort_DateOfStart'] = 'desc';
    params['includeUnit'] = true;
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

  // async preview(data: CollaboratorOrderModel[], source?: string) {
  //   this.cms.openDialog(CollaboratorOrderPrintComponent, {
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
  //       onChange: async (data: CollaboratorOrderModel, printComponent: CollaboratorOrderPrintComponent) => {

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

  onChangePage(page: PageModel) {
    if (page !== null) {
      this.collaboratorService.currentpage$.next(this.cms.getObjectId(page));
      this.cms.takeOnce(this.componentName + '_on_domain_changed', 1000).then(() => {
        this.refresh();
      });
    }
  }
}
