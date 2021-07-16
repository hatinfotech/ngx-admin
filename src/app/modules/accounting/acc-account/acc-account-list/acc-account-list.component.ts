import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { AccountModel } from '../../../../models/accounting.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { AccAccountFormComponent } from '../acc-account-form/acc-account-form.component';

@Component({
  selector: 'ngx-acc-account-list',
  templateUrl: './acc-account-list.component.html',
  styleUrls: ['./acc-account-list.component.scss']
})
export class AccAccountListComponent extends ServerDataManagerListComponent<AccountModel> implements OnInit {

  componentName: string = 'AccAccountListComponent';
  formPath = '/accounting/account/form';
  apiPath = '/accounting/accounts';
  idKey = 'Code';
  formDialog = AccAccountFormComponent;

  reuseDialog = true;

  // Smart table
  static filterConfig: any;
  static sortConf: any;
  static pagingConf = { page: 1, perPage: 40 };

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<AccAccountListComponent>,
  ) {
    super(apiService, router, commonService, dialogService, toastService, ref);
  }

  async init() {
    // await this.loadCache();
    return super.init();
  }

  editing = {};
  rows = [];

  settings = this.configSetting({
    columns: {
      Code: {
        title: this.commonService.translateText('Common.code'),
        type: 'string',
        width: '10%',
      },
      Name: {
        title: this.commonService.translateText('Common.name'),
        type: 'string',
        width: '15%',
        // filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
      },
      Description: {
        title: this.commonService.translateText('Common.description'),
        type: 'string',
        width: '20%',
      },
      Currency: {
        title: this.commonService.translateText('Common.currency'),
        type: 'string',
        width: '15%',
      },
      Property: {
        title: this.commonService.translateText('Common.property'),
        type: 'string',
        width: '15%',
      },
      Type: {
        title: this.commonService.translateText('Common.type'),
        type: 'string',
        width: '10%',
        // filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
      },
      Level: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.level'), 'head-title'),
        type: 'string',
        width: '15%',
      },
      Group: {
        title: this.commonService.translateText('Common.group'),
        type: 'string',
        width: '5%',
      },
    },
  });

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
