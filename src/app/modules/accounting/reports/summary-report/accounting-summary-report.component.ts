import { AccountingAccountDetailsReportPrintComponent } from './../print/accounting-account-details-report-print/accounting-account-details-report-print.component';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { filter, takeUntil } from 'rxjs/operators';
import { SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { DataManagerListComponent, SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { AccountModel } from '../../../../models/accounting.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { AccAccountFormComponent } from '../../acc-account/acc-account-form/acc-account-form.component';
import { AccountingService } from '../../accounting.service';
import { AccountingDetailByObjectReportComponent } from '../accounting-detail-by-object-report/accounting-detail-by-object-report.component';
import { SmartTableSelect2FilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';

@Component({
  selector: 'ngx-summary-report',
  templateUrl: './accounting-summary-report.component.html',
  styleUrls: ['./accounting-summary-report.component.scss']
})
export class AccountingSummaryReportComponent extends ServerDataManagerListComponent<AccountModel> implements OnInit {

  componentName: string = 'AccountingSummaryReportComponent';
  formPath = '/accounting/account/form';
  apiPath = '/accounting/reports';
  idKey = 'Account';
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
    public accountingService: AccountingService,
  ) {
    super(apiService, router, commonService, dialogService, toastService, ref);
  }

  async init() {
    // await this.loadCache();
    await this.commonService.waitForReady();
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
      this.actionButtonList = this.actionButtonList.filter(f => ['delete', 'edit', 'add', 'choose'].indexOf(f.name) < 0);
      this.actionButtonList.find(f => f.name === 'refresh').label = this.commonService.translateText('Common.refresh');

      const summaryReportBtn = this.actionButtonList.find(f => f.name == 'preview');
      summaryReportBtn.label = summaryReportBtn.title = 'In báo cáo sổ chi tiết tài khoản';
      summaryReportBtn.icon = 'printer';
      summaryReportBtn.status = 'info';
      summaryReportBtn.disabled = () => this.selectedIds.length <= 0;
      summaryReportBtn.click = () => {
        this.commonService.openDialog(AccountingAccountDetailsReportPrintComponent, {
          context: {
            showLoadinng: true,
            // title: 'Xem trước',
            accounts: this.selectedIds,
            mode: 'print',
            id: ['all']
          },
        });
      };

      // const detailsReportBtn = {...summaryReportBtn};
      // detailsReportBtn.status = 'primary';
      // detailsReportBtn.name = 'detailReport';
      // detailsReportBtn.label = detailsReportBtn.title = 'In báo cáo chi tiết';
      // detailsReportBtn.disabled = () => this.selectedIds.length <= 0;
      // detailsReportBtn.click = () => {
      //   this.commonService.openDialog(AccountingAccountDetailsReportPrintComponent, {
      //     context: {
      //       showLoadinng: true,
      //       // title: 'Xem trước',
      //       mode: 'print',
      //       id: ['all'],
      //       objects: this.selectedIds,
      //     },
      //   });
      // };
      // this.actionButtonList.unshift(detailsReportBtn);

      // Auto refresh list on reportToDate changed
      this.accountingService?.reportToDate$.pipe(takeUntil(this.destroy$), filter(f => f !== null)).subscribe(toDate => {
        console.log(toDate);
        this.refresh();
      });
      this.accountingService?.reportFromDate$.pipe(takeUntil(this.destroy$), filter(f => f !== null)).subscribe(fromDate => {
        console.log(fromDate);
        this.refresh();
      });

      return rs;
    });
  }

  editing = {};
  rows = [];

  loadListSetting(): SmartTableSetting {
    return this.configSetting({
      actions: false,
      columns: {
        Accounts: {
          title: this.commonService.translateText('Accounting.account'),
          type: 'string',
          width: '10%',
          valuePrepareFunction: (cell: any, row: AccountModel) => {
            return row.Account;
          },
          filter: {
            type: 'custom',
            component: SmartTableSelect2FilterComponent,
            config: {
              delay: 0,
              condition: 'eq',
              select2Option: {
                logic: 'OR',
                placeholder: 'Chọn tài khoản...',
                allowClear: true,
                width: '100%',
                dropdownAutoWidth: true,
                minimumInputLength: 0,
                keyMap: {
                  id: 'id',
                  text: 'text',
                },
                multiple: true,
                ajax: {
                  transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
                    console.log(settings);
                    const params = settings.data;
                    this.apiService.getPromise('/accounting/accounts', { 'search': params['term'], includeIdText: true }).then(rs => {
                      success(rs);
                    }).catch(err => {
                      console.error(err);
                      failure();
                    });
                  },
                  delay: 300,
                  processResults: (data: any, params: any) => {
                    // console.info(data, params);
                    return {
                      results: data.map(item => {
                        item.text = `${item.id} - ${item.text}`;
                        return item;
                      }),
                    };
                  },
                },
              },
            },
          },
        },
        AccountName: {
          title: this.commonService.translateText('Common.description'),
          type: 'string',
          width: '40%',
        },
        // HeadDebit: {
        //   title: '[' + this.commonService.translateText('Accounting.headDebit'),
        //   type: 'acc-currency',
        //   width: '10%',
        // },
        // HeadCredit: {
        //   title: this.commonService.translateText('Accounting.headCredit') + ']',
        //   type: 'acc-currency',
        //   width: '10%',
        // },
        HeadAmount: {
          title: '[' + this.commonService.translateText('Accounting.headAmount') + ']',
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
        // TailDebit: {
        //   title: '[' + this.commonService.translateText('Accounting.tailDebit'),
        //   type: 'acc-currency',
        //   width: '10%',
        // },
        // TailCredit: {
        //   title: this.commonService.translateText('Accounting.tailCredit') + ']',
        //   type: 'acc-currency',
        //   width: '10%',
        // },
        TailAmount: {
          title: '[' + this.commonService.translateText('Accounting.tailAmount') + ']',
          type: 'acc-currency',
          width: '10%',
        },
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
  // executeGet(params: any, success: (resources: AccountModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: AccountModel[] | HttpErrorResponse) => void) {
  //   // params['includeParent'] = true;
  //   params['reportSummary'] = true;
  //   params['Accounts'] = '111,112,128,131,138,141,136,211,331,338,511,512,515,632,635,641,642,711,4222,811,156,1331,3331,4212,4111,4112,4118,3341,3411,3348,3349,3350,6411,4211,3412,2288';

  //   const choosedFromDate = (this.accountingService.reportFromDate$.value as Date) || new Date();
  //   const fromDate = new Date(choosedFromDate.getFullYear(), choosedFromDate.getMonth(), choosedFromDate.getDate(), 0, 0, 0, 999);

  //   const choosedToDate = (this.accountingService.reportToDate$.value as Date) || new Date();
  //   const toDate = new Date(choosedToDate.getFullYear(), choosedToDate.getMonth(), choosedToDate.getDate(), 23, 59, 59);

  //   params['toDate'] = toDate.toISOString();
  //   params['fromDate'] = fromDate.toISOString();

  //   super.executeGet(params, success, error, complete);
  // }



  initDataSource() {
    const source = super.initDataSource();
    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {

      const choosedFromDate = (this.accountingService.reportFromDate$.value as Date) || new Date();
      const fromDate = new Date(choosedFromDate.getFullYear(), choosedFromDate.getMonth(), choosedFromDate.getDate(), 0, 0, 0, 999);

      const choosedToDate = (this.accountingService.reportToDate$.value as Date) || new Date();
      const toDate = new Date(choosedToDate.getFullYear(), choosedToDate.getMonth(), choosedToDate.getDate(), 23, 59, 59);

      params['reportSummary'] = true;
      params['eq_Accounts'] = '[111,112,128,131,138,141,136,211,331,338,511,512,515,521,632,635,641,642,711,4222,811,156,1331,3331,4212,4111,4112,4118,3341,3411,3348,3349,3350,6411,4211,3412,2288]';
      params['toDate'] = toDate.toISOString();
      params['fromDate'] = fromDate.toISOString();

      return params;
    };

    return source;
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
    this.commonService.openDialog(AccountingDetailByObjectReportComponent, {
      context: {
        inputMode: 'dialog',
        // object: rowData.Object,
        accounts: [rowData['Account']],
        report: 'reportDetailByAccountAndObject',
        fromDate: null,
        toDate: null,
        reportComponent: AccountingAccountDetailsReportPrintComponent,
      },
      closeOnEsc: false,
    })
  }

  async refresh() {
    super.refresh();
  }

}
