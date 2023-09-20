import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbThemeService, NbToastrService } from '@nebular/theme';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { ContactAllListComponent } from '../contact-all-list/contact-all-list.component';
import { IGetRowsParams } from 'ag-grid-community';
import { DatePipe } from '@angular/common';
import { RootServices } from '../../../services/root.services';

@Component({
  selector: 'ngx-customer-list',
  templateUrl: './contact-customer-list.component.html',
  styleUrls: ['./contact-customer-list.component.scss']
})
export class ContactCustomerListComponent extends ContactAllListComponent implements OnInit {

  componentName: string = 'ContactCustomerListComponent';
  static _dialog: NbDialogRef<ContactCustomerListComponent>;

  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public themeService: NbThemeService,
    public _http: HttpClient,
    public ref: NbDialogRef<ContactCustomerListComponent>,
    public datePipe: DatePipe,
  ) {
    super(rsv, apiService, router, cms, dialogService, toastService, themeService, ref, datePipe);
  }

  async init() {
    return super.init();
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }
  
  prepareApiParams(params: any, getRowParams: IGetRowsParams) {
    params['eq_IsDeleted'] = false;
    params['eq_Groups'] = 'CUSTOMER';
    return params;
  }

}
