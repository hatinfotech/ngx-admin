import { Component, OnInit } from '@angular/core';
import { AgGridDataManagerListComponent } from '../../../../lib/data-manager/ag-grid-data-manger-list.component';
import { HelpdeskTicketModel } from '../../../../models/helpdesk-ticket.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { ContactFormComponent } from '../../../contact/contact/contact-form/contact-form.component';
import { HelpdeskTicketFormComponent } from '../helpdesk-ticket-form/helpdesk-ticket-form.component';

@Component({
  selector: 'ngx-helpdesk-ticket-list',
  templateUrl: './helpdesk-ticket-list.component.html',
  styleUrls: ['./helpdesk-ticket-list.component.scss'],
})
export class HelpdeskTicketListComponent extends AgGridDataManagerListComponent<HelpdeskTicketModel, HelpdeskTicketFormComponent> implements OnInit {

  componentName: string = 'HelpdeskTicketListComponent';
  formPath = '/helpdesk/ticket/form';
  apiPath = '/helpdesk/tickets';
  idKey = 'Code';

  constructor(
    protected apiService: ApiService,
    public router: Router,
    protected commonService: CommonService,
    protected dialogService: NbDialogService,
    protected toastService: NbToastrService,
  ) {
    super(apiService, router, commonService, dialogService, toastService);

    this.columnDefs = this.configSetting([
      {
        headerName: '#',
        width: 52,
        valueGetter: 'node.data.No',
        cellRenderer: 'loadingCellRenderer',
        sortable: false,
        pinned: 'left',
      },
      {
        headerName: 'Mã',
        field: 'Code',
        width: 130,
        filter: 'agTextColumnFilter',
        pinned: 'left',
      },
      {
        headerName: 'Tiêu đề',
        field: 'Title',
        width: 300,
        filter: 'agTextColumnFilter',
        pinned: 'left',
        autoHeight: true,
      },
      {
        headerName: 'Người yêu cầu',
        field: 'SupportedPersonName',
        width: 200,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Số điện thoại yêu cầu',
        field: 'SupportedPersonPhone',
        width: 200,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Công ty',
        field: 'OrganizationName',
        width: 200,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'SDT Công ty',
        field: 'OrganizationPhone',
        width: 200,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'ĐC Công ty',
        field: 'OrganizationAddress',
        width: 200,
        filter: 'agTextColumnFilter',
      },
    ]);

    this.pagination = false;
    this.maxBlocksInCache = 5;
    this.paginationPageSize = 100;
    this.cacheBlockSize = 100;
  }

  ngOnInit() {
    super.ngOnInit();
  }

  /** Implement required */
  openFormDialplog(ids?: string[], onDialogSave?: (newData: HelpdeskTicketModel[]) => void, onDialogClose?: () => void) {
    this.dialogService.open(ContactFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: ids,
        onDialogSave: (newData: HelpdeskTicketModel[]) => {
          if (onDialogSave) onDialogSave(newData);
        },
        onDialogClose: () => {
          if (onDialogClose) onDialogClose();
        },
      },
    });
    return false;
  }
}
