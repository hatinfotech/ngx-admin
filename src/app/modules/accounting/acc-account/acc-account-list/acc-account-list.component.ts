import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { DataManagerListComponent, SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { AccountModel } from '../../../../models/accounting.model';
import { ApiService } from '../../../../services/api.service';
import { RootServices } from '../../../../services/root.services';
import { CommonService } from '../../../../services/common.service';
import { AccAccountFormComponent } from '../acc-account-form/acc-account-form.component';

@Component({
  selector: 'ngx-acc-account-list',
  templateUrl: './acc-account-list.component.html',
  styleUrls: ['./acc-account-list.component.scss']
})
export class AccAccountListComponent extends DataManagerListComponent<AccountModel> implements OnInit {

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

  totalBalance: { Debit: number, Credit: number } = {Debit: 0, Credit: 0};

  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<AccAccountListComponent>,
  ) {
    super(rsv, apiService, router, cms, dialogService, toastService, ref);
  }

  async init() {
    // await this.loadCache();
    return super.init().then(rs => {
      this.apiService.getPromise<any>(this.apiPath, { getTotalBalance: true }).then(balances => this.totalBalance = balances);
      return rs;
    });
  }

  editing = {};
  rows = [];

  loadListSetting(): SmartTableSetting {
    return this.configSetting({
      columns: {
        Code: {
          title: this.cms.translateText('Common.code'),
          type: 'string',
          width: '5%',
        },
        Name: {
          title: this.cms.translateText('Common.name'),
          type: 'string',
          width: '20%',
          // filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
        },
        Description: {
          title: this.cms.translateText('Common.description'),
          type: 'string',
          width: '20%',
        },
        Debit: {
          title: this.cms.translateText('Common.debit'),
          type: 'currency',
          width: '8%',
        },
        Credit: {
          title: this.cms.translateText('Common.credit'),
          type: 'currency',
          width: '8%',
        },
        Currency: {
          title: this.cms.translateText('Common.currency'),
          type: 'string',
          width: '8%',
        },
        Property: {
          title: this.cms.translateText('Common.property'),
          type: 'string',
          width: '8%',
        },
        Type: {
          title: this.cms.translateText('Common.type'),
          type: 'string',
          width: '5%',
          // filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
        },
        Level: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.level'), 'head-title'),
          type: 'string',
          width: '5%',
        },
        Group: {
          title: this.cms.translateText('Common.group'),
          type: 'string',
          width: '8%',
        },
      },
    });
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  // initDataSource() {
  //   const source = super.initDataSource();

  //   // Set DataSource: prepareParams
  //   source.prepareParams = (params: any) => {
  //     params['includeParent'] = true;
  //     params['includeAmount'] = true;
  //     return params;
  //   };

  //   return source;
  // }

  /** Api get funciton */
  executeGet(params: any, success: (resources: AccountModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: AccountModel[] | HttpErrorResponse) => void) {
    // params['includeParent'] = true;
    params['includeAmount'] = true;
    super.executeGet(params, success, error, complete);
  }

  getList(callback: (list: AccountModel[]) => void) {
    super.getList((rs) => {
      // rs.forEach(item => {
      //   item.Content = item.Content.substring(0, 256) + '...';
      // });
      if (callback) callback(rs);
    });
  }

  /** Config for paging */
  protected configPaging() {
    return {
      display: true,
      perPage: 99999,
    };
  }

  async refresh() {
    super.refresh();
    this.apiService.getPromise<any>(this.apiPath, { getTotalBalance: true }).then(balances => this.totalBalance = balances);
  }

}
