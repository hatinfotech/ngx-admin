import { takeUntil } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { AccBankAccountModel } from '../../../../models/accounting.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { AccBusinessFormComponent } from '../../acc-business/acc-business-form/acc-business-form.component';
import { AccountingBankAccountFormComponent } from '../accounting-bank-account-form/accounting-bank-account-form.component';
import { AccountingDetailByObjectReportComponent } from '../../reports/accounting-detail-by-object-report/accounting-detail-by-object-report.component';
import { AccountingAccountDetailsReportPrintComponent } from '../../reports/print/accounting-account-details-report-print/accounting-account-details-report-print.component';

@Component({
  selector: 'ngx-accounting-bank-account-list',
  templateUrl: './accounting-bank-account-list.component.html',
  styleUrls: ['./accounting-bank-account-list.component.scss']
})
export class AccountingBankAccountListComponent extends ServerDataManagerListComponent<AccBankAccountModel> implements OnInit {

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
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<AccountingBankAccountListComponent>,
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
        // Name: {
        //   title: this.cms.translateText('Common.name'),
        //   type: 'string',
        //   width: '15%',
        //   // filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
        // },
        Owner: {
          title: this.cms.translateText('Accounting.accountOwner'),
          type: 'string',
          width: '10%',
          // filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
        },
        AccountNumber: {
          title: this.cms.translateText('Accounting.accountNumber'),
          type: 'string',
          width: '10%',
          // filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
        },
        Branch: {
          title: this.cms.translateText('Common.branch'),
          type: 'string',
          width: '10%',
        },
        Province: {
          title: this.cms.translateText('Common.province'),
          type: 'string',
          width: '10%',
        },
        BranchAddress: {
          title: this.cms.translateText('Common.branchAddress'),
          type: 'string',
          width: '15%',
          // filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
        },
        Description: {
          title: this.cms.translateText('Common.description'),
          type: 'string',
          width: '15%',
        },
        TailAmount: {
          title: this.cms.translateText('Accounting.tailAmount'),
          type: 'acc-currency',
          width: '10%',
        },
        Preview: {
          title: this.cms.translateText('Common.detail'),
          type: 'custom',
          width: '10%',
          class: 'align-right',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'external-link-outline';
            instance.display = true;
            instance.status = 'primary';
            instance.style = 'text-align: right';
            instance.class = 'align-right';
            instance.title = this.cms.translateText('Common.preview');
            instance.label = this.cms.translateText('Common.detail');
            instance.valueChange.subscribe(value => {
              // instance.icon = value ? 'unlock' : 'lock';
              // instance.status = value === 'REQUEST' ? 'warning' : 'success';
              // instance.disabled = value !== 'REQUEST';
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: any) => {
              this.openInstantDetailReport(rowData);
            });
          },
        }
        // Copy: {
        //   title: 'Copy',
        //   type: 'custom',
        //   width: '5%',
        //   renderComponent: SmartTableButtonComponent,
        //   onComponentInitFunction: (instance: SmartTableButtonComponent) => {
        //     instance.iconPack = 'eva';
        //     instance.icon = 'copy';
        //     // instance.label = this.cms.translateText('Common.copy');
        //     instance.display = true;
        //     instance.status = 'warning';
        //     instance.valueChange.subscribe(value => {
        //       // if (value) {
        //       //   instance.disabled = false;
        //       // } else {
        //       //   instance.disabled = true;
        //       // }
        //     });
        //     instance.click.subscribe(async (row: AccBankAccountModel) => {

        //       this.cms.openDialog(AccBusinessFormComponent, {
        //         context: {
        //           inputMode: 'dialog',
        //           inputId: [row.Code],
        //           isDuplicate: true,
        //           onDialogSave: (newData: AccBankAccountModel[]) => {
        //             // if (onDialogSave) onDialogSave(row);
        //           },
        //           onDialogClose: () => {
        //             // if (onDialogClose) onDialogClose();
        //             this.refresh();
        //           },
        //         },
        //       });

        //     });
        //   },
        // },
      },
    });
  }

  openInstantDetailReport(rowData: AccBankAccountModel) {
    this.cms.openDialog(AccountingDetailByObjectReportComponent, {
      context: {
        inputMode: 'dialog',
        // object: rowData.Object,
        title: 'Chi tiết giao dịch của tài khoản ngân hàng `' + rowData.Description + '`',
        accounts: ['1121'],
        report: 'reportDetailByAccountAndObject',
        fromDate: null,
        toDate: null,
        filter: {
          eq_BankAccount: rowData.Code
        },
        reportComponent: AccountingAccountDetailsReportPrintComponent,
      },
      closeOnEsc: false,
    })
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
