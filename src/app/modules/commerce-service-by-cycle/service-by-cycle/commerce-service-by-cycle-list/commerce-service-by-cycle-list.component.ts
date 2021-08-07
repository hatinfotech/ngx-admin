import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { BusinessModel } from '../../../../models/accounting.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { AccBusinessFormComponent } from '../../../accounting/acc-business/acc-business-form/acc-business-form.component';
import { CommerceServiceByCycleFormComponent } from '../commerce-service-by-cycle-form/commerce-service-by-cycle-form.component';

@Component({
  selector: 'ngx-commerce-service-by-cycle-list',
  templateUrl: './commerce-service-by-cycle-list.component.html',
  styleUrls: ['./commerce-service-by-cycle-list.component.scss']
})
export class CommerceServiceByCycleListComponent extends ServerDataManagerListComponent<BusinessModel> implements OnInit {

  componentName: string = 'CommerceServiceByCycleListComponent';
  formPath = '/commerce-service-by-cycle/service-by-cycle/form';
  apiPath = '/commerce-service-by-cycle/service-by-cycles';
  idKey = 'Code';
  formDialog = CommerceServiceByCycleFormComponent;

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
    public ref: NbDialogRef<CommerceServiceByCycleListComponent>,
  ) {
    super(apiService, router, commonService, dialogService, toastService, ref);
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
        DebitAccount: {
          title: this.commonService.translateText('Accounting.debitAccount'),
          type: 'string',
          width: '15%',
        },
        CreditAccount: {
          title: this.commonService.translateText('Accounting.creditAccount'),
          type: 'string',
          width: '15%',
        },
        Type: {
          title: this.commonService.translateText('Common.type'),
          type: 'string',
          width: '10%',
          // filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
        },
        Copy: {
          title: 'Copy',
          type: 'custom',
          width: '5%',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'copy';
            // instance.label = this.commonService.translateText('Common.copy');
            instance.display = true;
            instance.status = 'warning';
            instance.valueChange.subscribe(value => {
              // if (value) {
              //   instance.disabled = false;
              // } else {
              //   instance.disabled = true;
              // }
            });
            instance.click.subscribe(async (row: BusinessModel) => {

              this.commonService.openDialog(AccBusinessFormComponent, {
                context: {
                  inputMode: 'dialog',
                  inputId: [row.Code],
                  isDuplicate: true,
                  onDialogSave: (newData: BusinessModel[]) => {
                    // if (onDialogSave) onDialogSave(row);
                  },
                  onDialogClose: () => {
                    // if (onDialogClose) onDialogClose();
                    this.refresh();
                  },
                },
              });

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
      params['includeParent'] = true;
      return params;
    };

    return source;
  }

}
