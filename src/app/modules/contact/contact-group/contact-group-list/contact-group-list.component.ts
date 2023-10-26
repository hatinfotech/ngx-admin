import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbThemeService, NbToastrService } from '@nebular/theme';
import { ContactGroupModel } from '../../../../models/contact.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { AgGridDataManagerListComponent } from '../../../../lib/data-manager/ag-grid-data-manger-list.component';
import { DatePipe } from '@angular/common';
import { agMakeSelectionColDef } from '../../../../lib/custom-element/ag-list/column-define/selection.define';
import { ColDef, IGetRowsParams } from '@ag-grid-community/core';
import { RootServices } from '../../../../services/root.services';
import { ContactGroupFormComponent } from '../contact-group-form/contact-group-form.component';
import { agMakeCommandColDef } from '../../../../lib/custom-element/ag-list/column-define/command.define';

@Component({
  selector: 'ngx-contact-group-list',
  templateUrl: './contact-group-list.component.html',
  styleUrls: ['./contact-group-list.component.scss']
})
export class ContactGroupListComponent extends AgGridDataManagerListComponent<ContactGroupModel, ContactGroupFormComponent> implements OnInit {

  componentName: string = 'ContactGroupListComponent';
  formPath = '/contact/contact-form/form';
  apiPath = '/contact/groups';
  idKey = ['Code'];
  formDialog = ContactGroupFormComponent;

  // AG-Grid config
  public rowHeight: number = 50;
  // @Input() suppressRowClickSelection = false;

  @Input() gridHeight = 'calc(100vh - 230px)';


  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public themeService: NbThemeService,
    public ref: NbDialogRef<ContactGroupListComponent>,
    public datePipe: DatePipe,
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
  }

  async init() {
    return super.init().then(async state => {


      // const processingMap = AppModule.processMaps['purchaseOrder'];
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
          width: 200,
          filter: 'agTextColumnFilter',
          // pinned: 'left',
        },
        {
          headerName: 'Tên',
          field: 'Name',
          width: 300,
          filter: 'agTextColumnFilter',
          autoHeight: true,
          // pinned: 'left',
        },
        {
          headerName: 'Mô tả',
          field: 'Description',
          width: 1024,
          filter: 'agTextColumnFilter',
          autoHeight: true,
          // pinned: 'left',
        },
        {
          ...agMakeCommandColDef(this, this.cms, true, true, false),
        }
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

  @Input() prepareApiParams(params: any, getRowParams: IGetRowsParams) {
    return params;
  }

  /** Implement required */
  openFormDialplog(ids?: string[], onDialogSave?: (newData: ContactGroupModel[]) => void, onDialogClose?: () => void) {
    this.cms.openDialog(ContactGroupFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: ids,
        onDialogSave: (newData: ContactGroupModel[]) => {
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
