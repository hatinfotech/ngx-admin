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
import { WordpressSyncProfilePreviewComponent } from '../sync-profile-preview/sync-profile-preview.component';

@Component({
  selector: 'ngx-sync-profile-list',
  templateUrl: './sync-profile-list.component.html',
  styleUrls: ['./sync-profile-list.component.scss']
})
export class WordpressSyncProfileListComponent extends ServerDataManagerListComponent<AccBankModel> implements OnInit {

  componentName: string = 'WordpressSyncProfileListComponent';
  formPath = '';
  apiPath = '/wordpress/wp-sync-profiles';
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
          width: '30%',
          valuePrepareFunction: (cell: any, row) => {
            return (cell || []).map(m => this.cms.getObjectText(m)).join(', ');
          }
        },
        Progress: {
          title: 'Tiến trình',
          type: 'string',
          width: '40%',
          // filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
        },
        State: {
          title: 'Phê duyệt',
          type: 'string',
          width: '10%',
        },
        // Status: {
        //   title: 'Trạng thái',
        //   type: 'string',
        //   width: '10%',
        // },
        Sync: {
          title: 'Sync',
          type: 'custom',
          width: '5%',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'cloud-upload-outline';
            // instance.label = this.cms.translateText('Common.copy');
            instance.display = true;
            instance.status = 'danger';
            instance.valueChange.subscribe(value => {
            });
            instance.click.subscribe(async (row: AccBankModel) => {
              // await this.apiService.putPromise<any[]>('/wordpress/wp-sync-profiles/' + instance.rowData.Code, { prepare: true }, [
              //   {
              //     Code: instance.rowData.Code,
              //   }
              // ]).catch(err => console.log(err));
              this.cms.openDialog(WordpressSyncProfilePreviewComponent, {
                context: {
                  inputId: [instance.rowData.Code],
                },
                closeOnEsc: false
              })
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
