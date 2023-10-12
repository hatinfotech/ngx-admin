import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { RootServices } from '../../../../services/root.services';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogRef, NbDialogService, NbThemeService, NbToastrService } from '@nebular/theme';
import { AppModule } from '../../../../app.module';
import { AgGridDataManagerListComponent } from '../../../../lib/data-manager/ag-grid-data-manger-list.component';
import { agMakeSelectionColDef } from '../../../../lib/custom-element/ag-list/column-define/selection.define';
import { DatePipe } from '@angular/common';
import { agMakeCommandColDef } from '../../../../lib/custom-element/ag-list/column-define/command.define';
import { ColDef, IGetRowsParams } from '@ag-grid-community/core';
import { SystemParameterFormComponent } from '../../parameter/system-parameter-form/system-parameter-form.component';
import { SystemParameterModel } from '../../../../models/system.model';
import { agMakeCheckboxColDef } from '../../../../lib/custom-element/ag-list/column-define/checkbox.define';

@Component({
  selector: 'ngx-sys-parameter-list',
  templateUrl: './parameter-list.component.html',
  styleUrls: ['./parameter-list.component.scss'],
})
export class SysParameterListComponent extends AgGridDataManagerListComponent<SystemParameterModel, SystemParameterFormComponent> implements OnInit {

  componentName: string = 'SystemParameterListComponent';
  formPath = '/sales/sales-voucher/form';
  apiPath = '/system/parameters';
  idKey = ['Id'];

  // Use for load settings menu for context
  featureName = 'Parameter';
  moduleName = 'System';

  formDialog = SystemParameterFormComponent;
  // printDialog = SystemParameterPrintComponent;

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
    public ref: NbDialogRef<SysParameterListComponent>,
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
          headerName: 'Tên',
          field: 'Name',
          width: 200,
          filter: 'agTextColumnFilter',
        },
        {
          headerName: 'Mô tả',
          field: 'Description',
          width: 400,
          filter: 'agTextColumnFilter',
        },
        {
          headerName: 'Kiểu dữ liệu',
          field: 'Type',
          width: 180,
          filter: 'agTextColumnFilter',
        },
        {
          headerName: 'Giá trị',
          field: 'Value',
          width: 300,
          filter: 'agTextColumnFilter',
        },
        {
          headerName: 'Module',
          field: 'Module',
          width: 140,
          filter: 'agTextColumnFilter',
        },
        {
          ...agMakeCheckboxColDef(this, this.cms, (params) => {
            this.apiService.putPromise<SystemParameterModel[]>('/system/parameters/' + params.data.Id, {}, [{ Id: params.data.Id, IsApplied: params.data.IsApplied }]);
          }),
          headerName: 'Sử dụng',
          field: 'IsApplied',
          width: 120,
          filter: 'agTextColumnFilter',
          pinned: 'right',
        },
        {
          ...agMakeCheckboxColDef(this, this.cms, (params) => {
            this.apiService.putPromise<SystemParameterModel[]>('/system/parameters/' + params.data.Id, {}, [{ Id: params.data.Id, IsApplied: params.data.IsApplied }]);
          }),
          headerName: 'Public',
          field: 'IsPublic',
          width: 120,
          filter: 'agTextColumnFilter',
          pinned: 'right',
        },
        {
          ...agMakeCommandColDef(this, this.cms, true, false, false),
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
    // params['includeCreator'] = true;
    // params['includeContact'] = true;
    // params['includeObject'] = true;
    // params['includeRelativeVouchers'] = true;
    // params['sort_Id'] = 'desc';
    for (const key in this.inputQuery) {
      params[key] = this.inputQuery[key];
    }
    return params;
  }

  /** Implement required */
  openFormDialplog(ids?: string[], onDialogSave?: (newData: SystemParameterModel[]) => void, onDialogClose?: () => void) {
    this.cms.openDialog(SystemParameterFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: ids,
        onDialogSave: (newData: SystemParameterModel[]) => {
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
