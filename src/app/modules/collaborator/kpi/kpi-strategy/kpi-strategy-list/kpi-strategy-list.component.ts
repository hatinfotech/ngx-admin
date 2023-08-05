import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbThemeService, NbToastrService } from '@nebular/theme';
import { AppModule } from '../../../../../app.module';
import { agMakeCommandColDef } from '../../../../../lib/custom-element/ag-list/column-define/command.define';
import { agMakeSelectionColDef } from '../../../../../lib/custom-element/ag-list/column-define/selection.define';
import { agMakeStateColDef } from '../../../../../lib/custom-element/ag-list/column-define/state.define';
import { agMakeTextColDef } from '../../../../../lib/custom-element/ag-list/column-define/text.define';
import { AgGridDataManagerListComponent } from '../../../../../lib/data-manager/ag-grid-data-manger-list.component';
import { ContactModel } from '../../../../../models/contact.model';
import { PageModel } from '../../../../../models/page.model';
import { ApiService } from '../../../../../services/api.service';
import { CommonService } from '../../../../../services/common.service';
import { ContactFormComponent } from '../../../../contact/contact/contact-form/contact-form.component';
import { CollaboratorService } from '../../../collaborator.service';
import { ColDef, IGetRowsParams } from '@ag-grid-community/core';
import { Model } from '../../../../../models/model';
import { CollaboratorKpiStrategyFormComponent } from '../kpi-strategy-form/kpi-strategy-form.component';
import { ShowcaseDialogComponent } from '../../../../dialog/showcase-dialog/showcase-dialog.component';
import { CollaboratorKpiStrategyPrintComponent } from '../kpi-strategy-print/kpi-strategy-print.component';


@Component({
  selector: 'ngx-collaborator-kpi-strategy-list',
  templateUrl: './kpi-strategy-list.component.html',
  styleUrls: ['./kpi-strategy-list.component.scss'],
  providers: [CurrencyPipe, DatePipe],
})
export class CollaboratorKpiStrategyListComponent extends AgGridDataManagerListComponent<Model, CollaboratorKpiStrategyFormComponent> implements OnInit {

  componentName: string = 'CollaboratorKpiGroupListComponent';
  formPath = '/collaborator/kpi-strategy/form';
  apiPath = '/collaborator/kpi-strategies';
  idKey: string | string[] = ['Code'];
  textKey = 'Name';
  formDialog = CollaboratorKpiStrategyFormComponent;
  printDialog = CollaboratorKpiStrategyPrintComponent;
  currentPage: PageModel;

  // AG-Grid config
  public rowHeight: number = 50;
  // @Input() suppressRowClickSelection = false;
  // @Input() gridHeight = 'calc(100vh - 230px)';

  public static indicatorList = [
    { id: 'REVENUE', text: 'Doanh thu trên mỗi nhân viên chăm sóc CTV', unit: '₫' },
    { id: 'OVERREVENUE', text: 'Doanh thu vuot cap trên mỗi nhân viên chăm sóc CTV', unit: '₫' },
    { id: 'NUMOFORDER', text: 'Số đơn hoàn tất trên mỗi nhân viên chăm sóc CTV', unit: 'đơn' },
    { id: 'ORDERAPPROVEDRATIO', text: 'Tỷ lệ chốt đơn trên mỗi nhân viên chăm sóc CTV', unit: '%' },
  ];

  public static conditionList = [
    { id: 'GE', text: 'Lớn hơn/bằng (>=)', symbol: '>=', },
    { id: 'GT', text: 'Lớn hơn (>)', symbol: '>' },
    { id: 'LE', text: 'Nhỏ hơn/bằng (<=)', symbol: '<=' },
    { id: 'LT', text: 'Nhỏ hơn (<)', symbol: '<' },
    { id: 'EQ', text: 'Bằng (=)', symbol: '=' },
  ];
  public static groupTypeList = [
    { id: 'REQUIRE', text: 'Bắt buộc' },
    { id: 'OVERKPIAWARD', text: 'Thưởng vượt KPI' },
  ];

  public static processingMap;

  constructor(
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public themeService: NbThemeService,
    public ref: NbDialogRef<CollaboratorKpiStrategyListComponent>,
    public datePipe: DatePipe,
    public collaboratorService: CollaboratorService,
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

    CollaboratorKpiStrategyListComponent.processingMap = {
      "APPROVED": {
        ...AppModule.approvedState,
        nextState: 'NOTJUSTAPPROVED',
        status: 'success',
        nextStates: [
          AppModule.notJustApprodedState
        ],
      },
      "NOTJUSTAPPROVED": {
        ...AppModule.notJustApprodedState,
        nextState: 'APPROVED',
        nextStates: [
          AppModule.approvedState
        ],
      },
    };
  }

  runningState = {
    ...AppModule.approvedState,
    nextState: 'RUNNING',
    outlilne: true,
    status: 'danger',
    label: 'Đang chạy',
    nextStates: [
      { ...AppModule.notJustApprodedState, status: 'warning' },
    ],
  };

  async init() {
    return super.init().then(async state => {

      await this.cms.waitForLanguageLoaded();

      const processingMap = {
        "APPROVED": {
          ...AppModule.approvedState,
          nextState: 'NOTJUSTAPPROVED',
          status: 'success',
          nextStates: [
            AppModule.notJustApprodedState
          ],
        },
        "NOTJUSTAPPROVED": {
          ...AppModule.notJustApprodedState,
          nextState: 'APPROVED',
          nextStates: [
            AppModule.approvedState
          ],
        },
      };

      this.columnDefs = this.configSetting([
        {
          ...agMakeSelectionColDef(this.cms),
          headerName: 'ID',
          field: 'Id',
          maxWidth: 100,
          valueGetter: 'node.data.Code',
          // sortingOrder: ['desc', 'asc'],
          initialSort: 'desc',
          headerCheckboxSelection: true,
        },
        {
          ...agMakeTextColDef(this.cms),
          headerName: 'ID',
          field: 'Code',
          maxWidth: 150,
          filter: 'agTextColumnFilter',
          // pinned: 'left',
        },
        {
          ...agMakeTextColDef(this.cms),
          headerName: 'Tên',
          field: 'Name',
          // pinned: 'left',
          width: 350,
          filter: 'agTextColumnFilter',
        },
        {
          ...agMakeStateColDef(this.cms, processingMap, item => {
            // this.stateActionConfirm(item, processingMap);
            this.preview([item]);
          }),
          headerName: 'Trạng thái',
          field: 'State',
          maxWidth: 155,
          // resizable: false,
        },
        {
          ...agMakeCommandColDef(this, this.cms, true, (data) => {
            this.deleteConfirm([data.Code]);
          }, false, [
          ]),
          headerName: 'Sửa/Xóa',
          // resizable: false,
        },
      ] as ColDef[]);

      return state;
    });
  }

  ngOnInit() {
    super.ngOnInit();
  }

  prepareApiParams(params: any, getRowParams: IGetRowsParams) {
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
    // this.gridApi.addEventListener('viewportChanged', (event) => {
    //   console.log(event);
    // })
  }

  onFirstBlockLoaded(): boolean {
    const result = super.onFirstBlockLoaded();
    if (result) {
      this.gridApi.sizeColumnsToFit();
    }
    return result;
  }

  async refresh(mode?: string): Promise<void> {
    return super.refresh(mode).then(rs => {
      return rs;
    });
  }

  onChangePage(page: PageModel) {
    this.collaboratorService.currentpage$.next(this.cms.getObjectId(page));
    this.cms.takeOnce(this.componentName + '_on_domain_changed', 1000).then(() => {
      this.refresh();
    });
  }
}
