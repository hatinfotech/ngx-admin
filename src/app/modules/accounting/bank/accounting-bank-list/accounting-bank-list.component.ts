import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { AccBank } from '../../../../models/accounting.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { AccBusinessFormComponent } from '../../acc-business/acc-business-form/acc-business-form.component';
import { AccountingBankFormComponent } from '../accounting-bank-form/accounting-bank-form.component';

@Component({
  selector: 'ngx-accounting-bank-list',
  templateUrl: './accounting-bank-list.component.html',
  styleUrls: ['./accounting-bank-list.component.scss']
})
export class AccountingBankListComponent extends ServerDataManagerListComponent<AccBank> implements OnInit {

  componentName: string = 'AccountingBankListComponent';
  formPath = '/accounting/business/form';
  apiPath = '/accounting/banks';
  idKey = 'Code';
  formDialog = AccountingBankFormComponent;

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
    public ref: NbDialogRef<AccountingBankListComponent>,
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
            instance.click.subscribe(async (row: AccBank) => {

              this.commonService.openDialog(AccBusinessFormComponent, {
                context: {
                  inputMode: 'dialog',
                  inputId: [row.Code],
                  isDuplicate: true,
                  onDialogSave: (newData: AccBank[]) => {
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
