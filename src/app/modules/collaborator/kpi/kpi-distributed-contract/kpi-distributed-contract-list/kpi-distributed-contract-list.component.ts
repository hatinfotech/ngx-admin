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
import { CollaboratorKpiDistributedContractFormComponent } from '../kpi-distributed-contract-form/kpi-distributed-contract-form.component';
import { CollaboratorKpiDistributedContractPrintComponent } from '../kpi-distributed-contract-print/kpi-distributed-print.component';
import { AgTextCellRenderer } from '../../../../../lib/custom-element/ag-list/cell/text.component';
import { AgSelect2Filter } from '../../../../../lib/custom-element/ag-list/filter/select2.component.filter';
import { AgDateCellRenderer } from '../../../../../lib/custom-element/ag-list/cell/date.component';
import { RootServices } from '../../../../../services/root.services';


@Component({
  selector: 'ngx-collaborator-kpi-distributed-contract-list',
  templateUrl: './kpi-distributed-contract-list.component.html',
  styleUrls: ['./kpi-distributed-contract-list.component.scss'],
  providers: [CurrencyPipe, DatePipe],
})
export class CollaboratorKpiDistributedContractListComponent extends AgGridDataManagerListComponent<Model, CollaboratorKpiDistributedContractFormComponent> implements OnInit {

  componentName: string = 'CollaboratorKpiGroupListComponent';
  formPath = '/collaborator/kpi-distributed-contract/form';
  apiPath = '/collaborator/kpi-distributed-contracts';
  idKey: string | string[] = ['Code'];
  textKey = 'Name';
  formDialog = CollaboratorKpiDistributedContractFormComponent;
  printDialog = CollaboratorKpiDistributedContractPrintComponent;
  currentPage: PageModel;

  // AG-Grid config
  public rowHeight: number = 50;
  // @Input() suppressRowClickSelection = false;
  // @Input() gridHeight = 'calc(100vh - 230px)';

  public static processingMap;

  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public themeService: NbThemeService,
    public ref: NbDialogRef<CollaboratorKpiDistributedContractListComponent>,
    public datePipe: DatePipe,
    public collaboratorService: CollaboratorService,
  ) {
    super(rsv, apiService, router, cms, dialogService, toastService, themeService, ref);

    this.defaultColDef = {
      ...this.defaultColDef,
      cellClass: 'ag-cell-items-center',
    }

    this.pagination = false;
    // this.maxBlocksInCache = 5;
    this.paginationPageSize = 100;
    this.cacheBlockSize = 100;

    CollaboratorKpiDistributedContractListComponent.processingMap = {
      "APPROVED": {
        ...AppModule.approvedState,
        nextState: 'COMPLETED',
        status: 'success',
        nextStates: [
          AppModule.completeState
        ],
      },
      "COMPLETED": {
        ...AppModule.completeState,
        nextState: 'NOTJUSTAPPROVED',
        status: 'basic',
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

      // const processingMap = {
      //   "APPROVED": {
      //     ...AppModule.approvedState,
      //     nextState: 'NOTJUSTAPPROVED',
      //     status: 'success',
      //     nextStates: [
      //       AppModule.notJustApprodedState
      //     ],
      //   },
      //   "NOTJUSTAPPROVED": {
      //     ...AppModule.notJustApprodedState,
      //     nextState: 'APPROVED',
      //     nextStates: [
      //       AppModule.approvedState
      //     ],
      //   },
      // };

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
          headerName: 'Tiêu đề',
          field: 'Title',
          // pinned: 'left',
          width: 350,
          filter: 'agTextColumnFilter',
        },
        {
          ...agMakeTextColDef(this.cms),
          headerName: 'Nhân viên',
          field: 'Object',
          // pinned: 'left',
          width: 200,
          cellRenderer: AgTextCellRenderer,
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.makeSelect2AjaxOption('/contact/contacts', { includeIdText: true, includeGroups: true, sort_SearchRank: 'desc', 'eq_Groups': '[PUBLISHERSUPPORTER]' }, {
                placeholder: 'Chọn nhân viên chăm sóc CTV...', limit: 10, prepareReaultItem: (item) => {
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
          ...agMakeTextColDef(this.cms),
          headerName: 'Chu kỳ',
          field: 'Cycle',
          // pinned: 'left',
          maxWidth: 150,
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              placeholder: 'Chọn chu kỳ...',
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
              data: [
                { id: 'MONTH', text: 'Tháng' },
                { id: 'QUATER', text: 'Quý' },
                { id: 'YEAR', text: 'Năm' },
              ],
            }
          },
        },
        {
          headerName: 'Ngày bắt đầu',
          field: 'DateOfStart',
          maxWidth: 180,
          filter: 'agDateColumnFilter',
          filterParams: {
            inRangeFloatingFilterDateFormat: 'DD/MM/YY',
          },
          cellRenderer: AgDateCellRenderer,
        },
        {
          headerName: 'Ngày kết thúc',
          field: 'DateOfEnd',
          maxWidth: 180,
          filter: 'agDateColumnFilter',
          filterParams: {
            inRangeFloatingFilterDateFormat: 'DD/MM/YY',
          },
          cellRenderer: AgDateCellRenderer,
        },
        {
          ...agMakeStateColDef(this.cms, CollaboratorKpiDistributedContractListComponent.processingMap, item => {
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
    this.gridApi.addEventListener('viewportChanged', (event) => {
      console.log(event);
    })
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
    if (page !== null) {
      this.collaboratorService.currentpage$.next(this.cms.getObjectId(page));
      this.cms.takeOnce(this.componentName + '_on_domain_changed', 1000).then(() => {
        this.refresh();
      });
    }
  }
}
