import { Component, OnInit } from '@angular/core';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { HelpdeskUserModel } from '../../../../models/helpdesk.model';
import { UserExtensionFormComponent } from '../user-extension-form/user-extension-form.component';
import { ApiService } from '../../../../services/api.service';
import { RootServices } from '../../../../services/root.services';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';

@Component({
  selector: 'ngx-user-extension-list',
  templateUrl: './user-extension-list.component.html',
  styleUrls: ['./user-extension-list.component.scss'],
})
export class UserExtensionListComponent extends ServerDataManagerListComponent<HelpdeskUserModel> implements OnInit {

  componentName: string = 'UserExtensionListComponent';
  formPath = '/helpdesk/user-extension/form';
  apiPath = '/helpdesk/users';
  idKey = 'Code';
  formDialog = UserExtensionFormComponent;

  reuseDialog = true;

  // Smart table
  static filterConfig: any;
  static sortConf: any;
  static pagingConf = { page: 1, perPage: 40 };

  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<UserExtensionListComponent>,
  ) {
    super(rsv, apiService, router, cms, dialogService, toastService, ref);
  }

  async init() {
    // await this.loadCache();
    return super.init();
  }

  editing = {};
  rows = [];

  loadListSetting(): SmartTableSetting {
    return this.configSetting({
      columns: {
        No: {
          title: 'Stt',
          type: 'number',
          width: '5%',
          class: 'no',
          filter: false,
        },
        Code: {
          title: 'Mã',
          type: 'string',
          width: '10%',
        },
        Name: {
          title: 'Name',
          type: 'string',
          width: '45%',
          filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
        },
        Username: {
          title: 'Username',
          type: 'string',
          width: '40%',
        },
      },
    });
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  initDataSource() {
    const source = super.initDataSource();

    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {
      params['includeParent'] = true;
      return params;
    };

    return source;
  }

}
