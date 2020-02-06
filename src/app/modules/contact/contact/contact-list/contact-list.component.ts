import { Component, OnInit, ViewChild } from '@angular/core';
import { ContactModel } from '../../../../models/contact.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { ContactFormComponent } from '../contact-form/contact-form.component';
import { AgGridDataManagerListComponent } from '../../../../lib/data-manager/ag-grid-data-manger-list.component';

@Component({
  selector: 'ngx-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
})
export class ContactListComponent extends AgGridDataManagerListComponent<ContactModel, ContactFormComponent> implements OnInit {

  componentName: string = 'ContactListComponent';
  formPath = '/contact/contact/form';
  apiPath = '/contact/contacts';
  idKey = 'Code';

  constructor(
    protected apiService: ApiService,
    public router: Router,
    protected commonService: CommonService,
    protected dialogService: NbDialogService,
    protected toastService: NbToastrService,
    private http: HttpClient,
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
        width: 115,
        filter: 'agTextColumnFilter',
        pinned: 'left',
      },
      {
        headerName: 'Tên',
        field: 'Name',
        width: 450,
        filter: 'agTextColumnFilter',
        pinned: 'left',
        autoHeight: true,
      },
      {
        headerName: 'Điện thoại',
        field: 'Phone',
        width: 200,
        filter: 'agNumberColumnFilter',
        filterParams: {
          filterOptions: ['equals', 'lessThan', 'greaterThan'],
          suppressAndOrCondition: true,
        },
      },
      {
        headerName: 'Email',
        field: 'Email',
        width: 200,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Địa chỉ',
        field: 'Address',
        width: 350,
        filter: 'agTextColumnFilter',
      },
    ]);

  }

  ngOnInit() {
    super.ngOnInit();
  }

  /** Implement required */
  openFormDialplog(ids?: string[], onDialogSave?: (newData: ContactModel[]) => void, onDialogClose?: () => void) {
    this.dialogService.open(ContactFormComponent, {
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
}
