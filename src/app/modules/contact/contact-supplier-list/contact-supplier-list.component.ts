import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbThemeService, NbToastrService } from '@nebular/theme';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { ContactAllListComponent } from '../contact-all-list/contact-all-list.component';
import { DatePipe } from '@angular/common';
import { IGetRowsParams } from '@ag-grid-community/core';

@Component({
  selector: 'ngx-supplier-list',
  templateUrl: './contact-supplier-list.component.html',
  styleUrls: ['./contact-supplier-list.component.scss']
})
export class ContactSupplierListComponent extends ContactAllListComponent implements OnInit {

  componentName: string = 'ContactSupplierListComponent';
  static _dialog: NbDialogRef<ContactSupplierListComponent>;

  constructor(
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public themeService: NbThemeService,
    public _http: HttpClient,
    public ref: NbDialogRef<ContactSupplierListComponent>,
    public datePipe: DatePipe,
  ) {
    super(apiService, router, cms, dialogService, toastService, themeService, ref, datePipe);
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
    params['eq_Groups'] = 'SUPPLIER';
    return params;
  }

}
