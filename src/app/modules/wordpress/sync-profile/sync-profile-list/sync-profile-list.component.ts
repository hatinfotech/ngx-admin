import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { AccBankModel } from '../../../../models/accounting.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { WordpressSyncProfileFormComponent } from '../sync-profile-form/sync-profile-form.component';

@Component({
  selector: 'ngx-sync-profile-list',
  templateUrl: './sync-profile-list.component.html',
  styleUrls: ['./sync-profile-list.component.scss']
})
export class WordpressSyncProfileListComponent extends ServerDataManagerListComponent<AccBankModel> implements OnInit {

  componentName: string = 'WordpressSyncProfileListComponent';
  formPath = '';
  apiPath = '/wordpress/wp-sync-profile';
  idKey = 'Code';
  formDialog = WordpressSyncProfileFormComponent;

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
    public ref: NbDialogRef<WordpressSyncProfileListComponent>,
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
        Code: {
          title: this.cms.translateText('Common.code'),
          type: 'string',
          width: '10%',
        },
        Sites: {
          title: 'Sites',
          type: 'string',
          width: '20%',
          // filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
        },
        Groups: {
          title: 'Groups',
          type: 'string',
          width: '30%',
          // filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
        },
        Categoreis: {
          title: 'Categories',
          type: 'string',
          width: '25%',
        },
        Schedule: {
          title: this.cms.translateText('Accounting.debitAccount'),
          type: 'string',
          width: '10%',
        },
        Copy: {
          title: 'Copy',
          type: 'custom',
          width: '5%',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'copy';
            // instance.label = this.cms.translateText('Common.copy');
            instance.display = true;
            instance.status = 'warning';
            instance.valueChange.subscribe(value => {
              // if (value) {
              //   instance.disabled = false;
              // } else {
              //   instance.disabled = true;
              // }
            });
            instance.click.subscribe(async (row: AccBankModel) => {

             

            });
          },
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
      // params['includeParent'] = true;
      return params;
    };

    return source;
  }

}
