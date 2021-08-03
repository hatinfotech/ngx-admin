import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { takeUntil } from 'rxjs/operators';
import { SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { DataManagerListComponent, SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { AccountModel } from '../../../../models/accounting.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { AccAccountFormComponent } from '../../acc-account/acc-account-form/acc-account-form.component';
import { AccAccountListComponent } from '../../acc-account/acc-account-list/acc-account-list.component';
import { AccoungtingDetailByObjectReportComponent } from '../accoungting-detail-by-object-report/accoungting-detail-by-object-report.component';

@Component({
  selector: 'ngx-summary-report',
  templateUrl: './accounting-summary-report.component.html',
  styleUrls: ['./accounting-summary-report.component.scss']
})
export class AccountingSummaryReportComponent extends DataManagerListComponent<AccountModel> implements OnInit {

  componentName: string = 'AccountingSummaryReportComponent';
  formPath = '/accounting/account/form';
  apiPath = '/accounting/reports';
  idKey = 'Code';
  formDialog = AccAccountFormComponent;

  reuseDialog = true;

  // Smart table
  static filterConfig: any;
  static sortConf: any;
  static pagingConf = { page: 1, perPage: 40 };

  totalBalance: { Debit: number, Credit: number } = null;
  tabs: any[];

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<AccountingSummaryReportComponent>,
  ) {
    super(apiService, router, commonService, dialogService, toastService, ref);
  }

  async init() {
    // await this.loadCache();
    await this.commonService.waitForLanguageLoaded();
    this.tabs = [
      {
        title: 'Liabilities',
        route: '/accounting/report/liabilities',
        icon: 'home',
        // responsive: true, // hide title before `route-tabs-icon-only-max-width` value
      },
      {
        title: 'Receivables',
        route: '/accounting/report/receivables',
      },
      {
        title: 'Users',
        icon: 'person',
        route: './tab1',
      },
      {
        title: 'Orders',
        icon: 'paper-plane-outline',
        responsive: true,
        route: ['./tab2'],
      },
      {
        title: 'Transaction',
        icon: 'flash-outline',
        responsive: true,
        disabled: true,
      },
    ];
    return super.init().then(rs => {
      return rs;
    });
  }

  editing = {};
  rows = [];

  loadListSetting(): SmartTableSetting {
    return this.configSetting({
      actions: false,
      columns: {
        DebitAccount: {
          title: this.commonService.translateText('Accounting.account'),
          type: 'string',
          width: '10%',
        },
        // CreditAccount: {
        //   title: this.commonService.translateText('Common.contraAccount'),
        //   type: 'string',
        //   width: '5%',
        // },
        AccountName: {
          title: this.commonService.translateText('Common.description'),
          type: 'string',
          width: '20%',
        },
        HeadDebit: {
          title: '[' + this.commonService.translateText('Accounting.headDebit'),
          type: 'acc-currency',
          width: '10%',
        },
        HeadCredit: {
          title: this.commonService.translateText('Accounting.headCredit') + ']',
          type: 'acc-currency',
          width: '10%',
        },
        GenerateDebit: {
          title: '[' + this.commonService.translateText('Accounting.debitGenerate'),
          type: 'acc-currency',
          width: '10%',
        },
        GenerateCredit: {
          title: this.commonService.translateText('Accounting.creditGenerate') + ']',
          type: 'acc-currency',
          width: '10%',
        },
        TailDebit: {
          title: '[' + this.commonService.translateText('Accounting.tailDebit'),
          type: 'acc-currency',
          width: '10%',
        },
        TailCredit: {
          title: this.commonService.translateText('Accounting.tailCredit') + ']',
          type: 'acc-currency',
          width: '10%',
        },
        // TailAmount: {
        //   title: this.commonService.translateText('Accounting.tailAmount'),
        //   type: 'acc-currency',
        //   width: '10%',
        // },
        // Property: {
        //   title: this.commonService.translateText('Common.property'),
        //   type: 'string',
        //   width: '8%',
        // },
        // Type: {
        //   title: this.commonService.translateText('Common.type'),
        //   type: 'string',
        //   width: '5%',
        //   // filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
        // },
        // Level: {
        //   title: this.commonService.textTransform(this.commonService.translate.instant('Common.level'), 'head-title'),
        //   type: 'string',
        //   width: '5%',
        // },
        // Group: {
        //   title: this.commonService.translateText('Common.group'),
        //   type: 'string',
        //   width: '8%',
        // },
        Preview: {
          title: this.commonService.translateText('Common.detail'),
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
            instance.title = this.commonService.translateText('Common.preview');
            instance.label = this.commonService.translateText('Common.detail');
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
    params['reportSummary'] = true;
    params['Accounts'] = '111,112,131,331,511,632,6421,4222,811,156,1331,3331,4212,,4111,4112,4118';
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

  openInstantDetailReport(rowData: any) {
    this.commonService.openDialog(AccoungtingDetailByObjectReportComponent, {
      context: {
        inputMode: 'dialog',
        // object: rowData.Object,
        accounts: [rowData['DebitAccount']],
        report: 'reportDetailByAccountAndObject',
        fromDate: null,
        toDate: null,
      },
      closeOnEsc: false,
    })
  }

  refresh() {
    super.refresh();
  }

}
