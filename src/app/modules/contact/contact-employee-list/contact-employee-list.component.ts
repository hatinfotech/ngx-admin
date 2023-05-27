import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbThemeService, NbToastrService } from '@nebular/theme';
import { takeUntil } from 'rxjs/operators';
import { CustomServerDataSource } from '../../../lib/custom-element/smart-table/custom-server.data-source';
import { SmartTableThumbnailComponent, SmartTableDateTimeComponent, SmartTableButtonComponent } from '../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableDateTimeRangeFilterComponent } from '../../../lib/custom-element/smart-table/smart-table.filter.component';
import { SmartTableSetting } from '../../../lib/data-manager/data-manger-list.component';
import { ServerDataManagerListComponent } from '../../../lib/data-manager/server-data-manger-list.component';
import { CashVoucherModel } from '../../../models/accounting.model';
import { ContactModel } from '../../../models/contact.model';
import { UserGroupModel } from '../../../models/user-group.model';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { ShowcaseDialogComponent } from '../../dialog/showcase-dialog/showcase-dialog.component';
import { ContactAllListComponent } from '../contact-all-list/contact-all-list.component';
import { ContactFormComponent } from '../contact/contact-form/contact-form.component';
import { IGetRowsParams } from '@ag-grid-community/core';
import { ContactSupplierListComponent } from '../contact-supplier-list/contact-supplier-list.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-employee-list',
  templateUrl: './contact-employee-list.component.html',
  styleUrls: ['./contact-employee-list.component.scss']
})
export class ContactEmployeeListComponent extends ContactAllListComponent implements OnInit {

  componentName: string = 'ContactEmployeeListComponent';
  static _dialog: NbDialogRef<ContactEmployeeListComponent>;

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
    params['eq_Groups'] = 'EMPLOYEE';
    return params;
  }

}
