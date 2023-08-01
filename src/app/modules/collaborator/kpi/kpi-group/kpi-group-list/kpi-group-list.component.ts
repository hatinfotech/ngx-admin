import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbThemeService, NbToastrService } from '@nebular/theme';
import { take, filter } from 'rxjs/operators';
import { AppModule } from '../../../../../app.module';
import { AgDateCellRenderer } from '../../../../../lib/custom-element/ag-list/cell/date.component';
import { AgTextCellRenderer } from '../../../../../lib/custom-element/ag-list/cell/text.component';
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
import { CollaboratorKpiGroupFormComponent } from '../kpi-group-form/kpi-group-form.component';
import { Model } from '../../../../../models/model';


@Component({
  selector: 'ngx-collaborator-kpi-group-list',
  templateUrl: './kpi-group-list.component.html',
  styleUrls: ['./kpi-group-list.component.scss'],
  providers: [CurrencyPipe, DatePipe],
})
export class CollaboratorKpiGroupListComponent extends AgGridDataManagerListComponent<Model, CollaboratorKpiGroupFormComponent> implements OnInit {

  componentName: string = 'CollaboratorKpiGroupListComponent';
  formPath = '/collaborator/product/form';
  apiPath = '/collaborator/kpi-groups';
  idKey: string | string[] = ['Code'];
  formDialog = CollaboratorKpiGroupFormComponent;
  currentPage: PageModel;

  // AG-Grid config
  public rowHeight: number = 50;
  // @Input() suppressRowClickSelection = false;
  // @Input() gridHeight = 'calc(100vh - 230px)';

  constructor(
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public themeService: NbThemeService,
    public ref: NbDialogRef<CollaboratorKpiGroupListComponent>,
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
        ...AppModule.processMaps.common,
        "APPROVED": {
          ...AppModule.approvedState,
          nextState: 'RUNNING',
          status: 'success',
          nextStates: [
            { ...AppModule.unrecordedState, status: 'warning' },
            { ...this.runningState, status: 'success' },
          ],
        },
        "RUNNING": {
          ...this.runningState,
          nextState: 'COMPLETE',
          nextStates: [
            { ...AppModule.completeState, status: 'basic' },
            { ...AppModule.unrecordedState, status: 'warning' },
          ],
        },
      };

      this.columnDefs = this.configSetting([
        {
          ...agMakeSelectionColDef(this.cms),
          headerName: 'ID',
          field: 'Id',
          width: 100,
          valueGetter: 'node.data.Code',
          // sortingOrder: ['desc', 'asc'],
          initialSort: 'desc',
          headerCheckboxSelection: true,
        },
        {
          ...agMakeTextColDef(this.cms),
          headerName: 'ID',
          field: 'Code',
          width: 180,
          filter: 'agTextColumnFilter',
          // pinned: 'left',
        },
        {
          ...agMakeTextColDef(this.cms),
          headerName: 'Tên',
          field: 'Name',
          // pinned: 'left',
          width: 1024,
          filter: 'agTextColumnFilter',
        },
        {
          ...agMakeCommandColDef(this, this.cms, true, (data) => {
            this.deleteConfirm([data.Code]);
          }, false, [
          ]),
          headerName: 'Sửa/Xóa',
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
  }

  onChangePage(page: PageModel) {
    this.collaboratorService.currentpage$.next(this.cms.getObjectId(page));
    this.cms.takeOnce(this.componentName + '_on_domain_changed', 1000).then(() => {
      this.refresh();
    });
  }
}
