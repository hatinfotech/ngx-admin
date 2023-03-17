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
  selector: 'ngx-customer-list',
  templateUrl: './contact-customer-list.component.html',
  styleUrls: ['./contact-customer-list.component.scss']
})
export class ContactCustomerListComponent extends ContactAllListComponent implements OnInit {

  componentName: string = 'ContactCustomerListComponent';
  static _dialog: NbDialogRef<ContactCustomerListComponent>;

  constructor(
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<ContactCustomerListComponent>,
  ) {
    super(apiService, router, cms, dialogService, toastService, _http, ref);
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
      params['eq_Groups'] = 'CUSTOMER';
      return params;
    };

    return source;
  }

}
