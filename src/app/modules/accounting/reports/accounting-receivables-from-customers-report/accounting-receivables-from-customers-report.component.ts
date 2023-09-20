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
import { AccountingService } from '../../accounting.service';
import { AccountingDetailByObjectReportComponent } from '../accounting-detail-by-object-report/accounting-detail-by-object-report.component';
import { AccountingReceivablesFromCustomersDetailsReportPrintComponent } from '../print/accounting-receivables-from-customers-details-report-print/accounting-receivables-from-customers-details-report-print.component';
import { AccountingReceivablesFromCustomersReportPrintComponent } from '../print/accounting-receivables-from-customers-report-print/accounting-receivables-from-customers-report-print.component';
import { AccountingReceivablesFromCustomersVoucherssReportPrintComponent } from '../print/accounting-receivables-from-customers-vouchers-report-print/accounting-receivables-from-customers-vouchers-report-print.component';
import { AccountingDetailByObjectReportAgComponent } from '../accounting-detail-by-object-report-ag/accounting-detail-by-object-report-ag.component';
import { RootServices } from '../../../../services/root.services';

@Component({
  selector: 'ngx-accounting-receivables-from-customers-report',
  templateUrl: './accounting-receivables-from-customers-report.component.html',
  styleUrls: ['./accounting-receivables-from-customers-report.component.scss']
})
export class AccountingReceivablesFromCustomersReportComponent extends ServerDataManagerListComponent<AccountModel> implements OnInit {

  componentName: string = 'AccountingReceivablesFromCustomersReportComponent';
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
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<AccountingReceivablesFromCustomersReportComponent>,
    public accountingService: AccountingService,
  ) {
    super(rsv, apiService, router, cms, dialogService, toastService, ref);
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
      this.actionButtonList = this.actionButtonList.filter(f => ['delete', 'edit', 'add', 'choose'].indexOf(f.name) < 0);
      this.actionButtonList.find(f => f.name === 'refresh').label = null;
      const summaryReportBtn = this.actionButtonList.find(f => f.name == 'preview');
      summaryReportBtn.label = summaryReportBtn.title = 'In báo cáo';
      summaryReportBtn.icon = 'printer';
      summaryReportBtn.status = 'info';
      summaryReportBtn.disabled = () => false;
      summaryReportBtn.click = () => {
        this.cms.openDialog(AccountingReceivablesFromCustomersReportPrintComponent, {
          context: {
            showLoadinng: true,
            // title: 'Xem trước',
            mode: 'print',
            id: ['all'],
            objects: this.selectedIds,
          },
        });
      };

      const detailsReportBtn = { ...summaryReportBtn };
      detailsReportBtn.status = 'primary';
      detailsReportBtn.name = 'detailReport';
      detailsReportBtn.label = detailsReportBtn.title = 'In báo cáo chi tiết';
      detailsReportBtn.disabled = () => this.selectedIds.length <= 0;
      detailsReportBtn.click = () => {
        this.cms.openDialog(AccountingReceivablesFromCustomersDetailsReportPrintComponent, {
          context: {
            showLoadinng: true,
            // title: 'Xem trước',
            mode: 'print',
            id: ['all'],
            objects: this.selectedIds,
          },
        });
      };
      this.actionButtonList.unshift(detailsReportBtn);

      const vouchersReportBtn = { ...summaryReportBtn };
      vouchersReportBtn.status = 'primary';
      vouchersReportBtn.name = 'vouchersReport';
      vouchersReportBtn.label = vouchersReportBtn.title = 'In báo cáo chứng từ';
      vouchersReportBtn.disabled = () => this.selectedIds.length <= 0;
      vouchersReportBtn.click = () => {
        this.cms.openDialog(AccountingReceivablesFromCustomersVoucherssReportPrintComponent, {
          context: {
            showLoadinng: true,
            // title: 'Xem trước',
            mode: 'print',
            id: ['all'],
            objects: this.selectedIds,
          },
        });
      };
      this.actionButtonList.unshift(vouchersReportBtn);

      // const printDebtConfirmBtn = {...summaryReportBtn};
      // printDebtConfirmBtn.status = 'danger';
      // printDebtConfirmBtn.name = 'detailReport';
      // printDebtConfirmBtn.label = printDebtConfirmBtn.title = 'In phiếu xác nhận công nợ';
      // printDebtConfirmBtn.click = () => {
      //   this.cms.openDialog(AccountingReceivablesFromCustomersReportPrintComponent, {
      //     context: {
      //       showLoadinng: true,
      //       // title: 'Xem trước',
      //       mode: 'print',
      //       id: ['all']
      //     },
      //   });
      // };
      // this.actionButtonList.unshift(printDebtConfirmBtn);

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
          title: '[' + this.cms.translateText('Accounting.ReceivablesFromCustomersReport.tailDebit'),
          type: 'acc-currency',
          width: '10%',
        },
        TailCredit: {
          title: this.cms.translateText('Accounting.ReceivablesFromCustomersReport.tailCredit') + ']',
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
      },
    });
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  /** Api get funciton */
  // executeGet(params: any, success: (resources: AccountModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: AccountModel[] | HttpErrorResponse) => void) {
  //   params['reportReceivablesFromCustomer'] = true;
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

      // params['reportReceivablesFromCustomer'] = true;
      params['includeColumnHeader'] = true;
      params['eq_Accounts'] = '131';
      params['groupBy'] = 'Object';
      params['sort_TailDebit'] = 'desc';
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

      for (const item of rs) {
        const amount = item['HeadDebit'] - item['HeadCredit'] + item['GenerateDebit'] - item['GenerateCredit'];
        if (amount > 0) {
          item['TailDebit'] = amount;
          item['TailCredit'] = 0;
        } else {
          item['TailDebit'] = 0;
          item['TailCredit'] = -amount;
        }
      }

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

  async refresh() {
    super.refresh();
  }

  openInstantDetailReport(rowData: any) {
    this.cms.openDialog(AccountingDetailByObjectReportAgComponent, {
      context: {
        inputMode: 'dialog',
        object: rowData.Object,
        accounts: ['131'],
        fromDate: null,
        toDate: null,
        // report: 'reportDetailByAccountAndObject',
        reportComponent: AccountingReceivablesFromCustomersDetailsReportPrintComponent,
      },
      closeOnEsc: false,
    })
  }

}
