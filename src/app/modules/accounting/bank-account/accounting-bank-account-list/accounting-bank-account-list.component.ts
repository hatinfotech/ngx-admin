import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { AccBankAccount } from '../../../../models/accounting.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { AccBusinessFormComponent } from '../../acc-business/acc-business-form/acc-business-form.component';
import { AccountingBankAccountFormComponent } from '../accounting-bank-account-form/accounting-bank-account-form.component';

@Component({
  selector: 'ngx-accounting-bank-account-list',
  templateUrl: './accounting-bank-account-list.component.html',
  styleUrls: ['./accounting-bank-account-list.component.scss']
})
export class AccountingBankAccountListComponent extends ServerDataManagerListComponent<AccBankAccount> implements OnInit {

  componentName: string = 'AccountingBankAccountListComponent';
  formPath = '/accounting/business/form';
  apiPath = '/accounting/bank-accounts';
  idKey = 'Code';
  formDialog = AccountingBankAccountFormComponent;

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
    public ref: NbDialogRef<AccountingBankAccountListComponent>,
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
        // Name: {
        //   title: this.commonService.translateText('Common.name'),
        //   type: 'string',
        //   width: '15%',
        //   // filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
        // },
        Owner: {
          title: this.commonService.translateText('Accounting.accountOwner'),
          type: 'string',
          width: '10%',
          // filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
        },
        AccountNumber: {
          title: this.commonService.translateText('Accounting.accountNumber'),
          type: 'string',
          width: '15%',
          // filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
        },
        Branch: {
          title: this.commonService.translateText('Common.branch'),
          type: 'string',
          width: '15%',
        },
        Province: {
          title: this.commonService.translateText('Common.province'),
          type: 'string',
          width: '15%',
        },
        BranchAddress: {
          title: this.commonService.translateText('Common.branchAddress'),
          type: 'string',
          width: '15%',
          // filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
        },
        Description: {
          title: this.commonService.translateText('Common.description'),
          type: 'string',
          width: '20%',
        },
        TailAmount: {
          title: this.commonService.translateText('Accounting.tailAmount'),
          type: 'acc-currency',
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
            instance.click.subscribe(async (row: AccBankAccount) => {

              this.commonService.openDialog(AccBusinessFormComponent, {
                context: {
                  inputMode: 'dialog',
                  inputId: [row.Code],
                  isDuplicate: true,
                  onDialogSave: (newData: AccBankAccount[]) => {
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
