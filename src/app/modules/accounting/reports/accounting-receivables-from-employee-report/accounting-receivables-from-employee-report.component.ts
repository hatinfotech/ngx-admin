import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { filter, takeUntil } from 'rxjs/operators';
import { SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableSelect2FilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { DataManagerListComponent, SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { AccountModel } from '../../../../models/accounting.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { AccAccountFormComponent } from '../../acc-account/acc-account-form/acc-account-form.component';
import { AccAccountListComponent } from '../../acc-account/acc-account-list/acc-account-list.component';
import { AccountingService } from '../../accounting.service';
import { AccountingDetailByObjectReportComponent } from '../accounting-detail-by-object-report/accounting-detail-by-object-report.component';
import { AccountingObjectCashFlowReportPrintComponent } from '../print/accounting-object-cash-flow-report-print/accounting-object-cash-flow-report-print.component';
import { AccountingDetailByObjectReportAgComponent } from '../accounting-detail-by-object-report-ag/accounting-detail-by-object-report-ag.component';

@Component({
  selector: 'ngx-accounting-receivables-from-employee-report',
  templateUrl: './accounting-receivables-from-employee-report.component.html',
  styleUrls: ['./accounting-receivables-from-employee-report.component.scss']
})
export class AccountingReceivablesFromEmployeeReportComponent extends ServerDataManagerListComponent<AccountModel> implements OnInit {

  componentName: string = 'AccountingReceivablesFromEmployeeReportComponent';
  formPath = '/accounting/account/form';
  apiPath = '/accounting/reports';
  idKey = 'Object';
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
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<AccountingReceivablesFromEmployeeReportComponent>,
    public accountingService: AccountingService,
  ) {
    super(apiService, router, cms, dialogService, toastService, ref);
  }

  async init() {
    // await this.loadCache();
    await this.cms.waitForReady();
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
      this.actionButtonList = this.actionButtonList.filter(f => ['delete', 'edit', 'add', 'choose', 'preview'].indexOf(f.name) < 0);
      this.actionButtonList.find(f => f.name === 'refresh').label = this.cms.translateText('Common.refresh');

      // Auto refresh list on reportToDate changed
      this.accountingService?.reportToDate$.pipe(takeUntil(this.destroy$), filter(f => f !== null)).subscribe(toDate => {
        console.log(toDate);
        this.refresh();
      });
      this.accountingService?.reportFromDate$.pipe(takeUntil(this.destroy$), filter(f => f !== null)).subscribe(fromDate => {
        console.log(fromDate);
        this.refresh();
      });

      this.actionButtonList.unshift({
        type: 'button',
        status: 'primary',
        icon: 'printer',
        name: 'vouchersReport',
        label: 'In đối soát công nợ',
        title: 'In đối soát công nợ',
        size: 'medium',
        disabled: () => this.selectedIds.length <= 0,
        click: () => {
          this.cms.openDialog(AccountingObjectCashFlowReportPrintComponent, {
            context: {
              showLoadinng: true,
              // title: 'Xem trước',
              mode: 'print',
              id: ['all'],
              objects: this.selectedIds,
              accounts: '334'
            },
          });
        }
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
        Object: {
          title: this.cms.translateText('Common.contact'),
          type: 'string',
          width: '20%',
          valuePrepareFunction: (cell: any, row: any) => {
            return row.ObjectName;
          },
          filter: {
            type: 'custom',
            component: SmartTableSelect2FilterComponent,
            config: {
              delay: 0,
              condition: 'eq',
              select2Option: {
                ...this.cms.makeSelect2AjaxOption('/contact/contacts', {includeIdText: true, includeGroups: true}, { placeholder: 'Chọn liên hệ...', limit: 10, prepareReaultItem: (item) => {
                  item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
                  return item;
                }}),
                multiple: true,
                logic: 'OR',
                allowClear: true,
              },
            },
          },
        },
        HeadDebit: {
          title: '[' + this.cms.translateText('Accounting.headDebit'),
          type: 'acc-currency',
          width: '10%',
        },
        HeadCredit: {
          title: this.cms.translateText('Accounting.headCredit') + ']',
          type: 'acc-currency',
          width: '10%',
        },
        GenerateDebit: {
          title: '[' + this.cms.translateText('Accounting.debitGenerate'),
          type: 'acc-currency',
          width: '10%',
        },
        GenerateCredit: {
          title: this.cms.translateText('Accounting.creditGenerate') + ']',
          type: 'acc-currency',
          width: '10%',
        },
        TailDebit: {
          title: '[Phải thu',
          type: 'acc-currency',
          width: '10%',
          valuePrepareFunction(cell, row) {
            return row.TailCredit < 0 && (-row.TailCredit) || 0 as any;
          }
        },
        TailCredit: {
          title:'Phải trả]',
          type: 'acc-currency',
          width: '10%',
          valuePrepareFunction(cell, row) {
            return row.TailCredit > 0 && (row.TailCredit) || 0 as any;
          }
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
  //   params['reportReceivablesFromEmployee'] = true;

  //   const choosedFromDate = (this.accountingService.reportFromDate$.value as Date) || new Date();
  //   const fromDate = new Date(choosedFromDate.getFullYear(), choosedFromDate.getMonth(), choosedFromDate.getDate(), 0, 0, 0, 0);
  //   const choosedToDate = (this.accountingService.reportToDate$.value as Date) || new Date();
  //   const toDate = new Date(choosedToDate.getFullYear(), choosedToDate.getMonth(), choosedToDate.getDate(), 23, 59, 59, 999);

  //   params['toDate'] = toDate.toISOString();
  //   params['fromDate'] = fromDate.toISOString();
  //   super.executeGet(params, success, error, complete);
  // }

  initDataSource() {
    const source = super.initDataSource();
    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {

      // params['reportReceivablesFromEmployee'] = true;
      params['includeColumnHeader'] = true;
      params['eq_Accounts'] = '3341,3348';
      params['groupBy'] = 'Object';
      params['sort_TailCredit'] = 'asc';

      const choosedFromDate = (this.accountingService.reportFromDate$.value as Date) || new Date();
      const fromDate = new Date(choosedFromDate.getFullYear(), choosedFromDate.getMonth(), choosedFromDate.getDate(), 0, 0, 0, 0);
      const choosedToDate = (this.accountingService.reportToDate$.value as Date) || new Date();
      const toDate = new Date(choosedToDate.getFullYear(), choosedToDate.getMonth(), choosedToDate.getDate(), 23, 59, 59, 999);

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
  // protected configPaging() {
  //   return {
  //     display: true,
  //     perPage: 99999,
  //   };
  // }

  openInstantDetailReport(rowData: any) {
    this.cms.openDialog(AccountingDetailByObjectReportAgComponent, {
      context: {
        inputMode: 'dialog',
        object: rowData.Object,
        accounts: ['3341,3348'],
        fromDate: null,
        toDate: null,
        report: 'reportDetailByAccountAndObject',
      },
      closeOnEsc: false,
    })
  }

  async refresh() {
    super.refresh();
  }

}
