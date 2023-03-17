import { Component, OnInit } from '@angular/core';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { ContactModel } from '../../../../models/contact.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { ZaloOaFollowerListComponent } from '../../follower/zalo-oa-follower-list/zalo-oa-follower-list.component';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';

@Component({
  selector: 'ngx-zalo-oa-conversation',
  templateUrl: './zalo-oa-conversation.component.html',
  styleUrls: ['./zalo-oa-conversation.component.scss'],
})
export class ZaloOaConversationComponent extends ServerDataManagerListComponent<ContactModel> implements OnInit {

  componentName: string = 'ZaloOaConversationComponent';
  formPath = '/zalo-oa/follower/form';
  apiPath = '/zalo-oa/followers';
  idKey = 'Code';
  // formDialog = ZaloOaFollowerFormComponent;

  reuseDialog = true;

  // Smart table
  static filterConfig: any;
  static sortConf: any;
  static pagingConf = { page: 1, perPage: 40 };

  constructor(
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<ZaloOaFollowerListComponent>,
  ) {
    super(apiService, router, cms, dialogService, toastService, ref);
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
