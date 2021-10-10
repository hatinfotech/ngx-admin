import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
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
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<ContactEmployeeListComponent>,
  ) {
    super(apiService, router, commonService, dialogService, toastService, _http, ref);
  }

  async init() {
    return super.init();
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  initDataSource() {
    const source = super.initDataSource();

    // Set DataSource: prepareParams
    const parentPrepareParams = source.prepareParams;
    source.prepareParams = (params: any) => {
      parentPrepareParams && parentPrepareParams(params);
      params['eq_IsDeleted'] = false;
      params['eq_Groups'] = 'EMPLOYEE';
      return params;
    };

    return source;
  }

}
