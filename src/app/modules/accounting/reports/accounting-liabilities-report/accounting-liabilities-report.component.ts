import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { filter, takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../../../lib/base-component';
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
import { AccountingReportComponent } from '../accounting-report.component';
import { AccountingLiabilitiesDetailsReportPrintComponent } from '../print/accounting-liabilities-details-report-print/accounting-liabilities-details-report-print.component';
import { AccountingLiabilitiesReportPrintComponent } from '../print/accounting-liabilities-report-print/accounting-liabilities-report-print.component';

@Component({
  selector: 'ngx-accounting-liabilities-report',
  templateUrl: './accounting-liabilities-report.component.html',
  styleUrls: ['./accounting-liabilities-report.component.scss']
})
export class AccountingLiabilitiesReportComponent extends ServerDataManagerListComponent<AccountModel> implements OnInit {

  componentName: string = 'AccountingLiabilitiesReportComponent';
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
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<AccountingLiabilitiesReportComponent>,
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
      this.actionButtonList.find(f => f.name === 'refresh').label = null;
      const summaryReportBtn = this.actionButtonList.find(f => f.name == 'preview');
      summaryReportBtn.label = summaryReportBtn.title = 'In báo cáo';
      summaryReportBtn.icon = 'printer';
      summaryReportBtn.status = 'info';
      summaryReportBtn.disabled = () => false;
      summaryReportBtn.click = () => {
        this.commonService.openDialog(AccountingLiabilitiesReportPrintComponent, {
          context: {
            showLoadinng: true,
            // title: 'Xem trước',
            mode: 'print',
            id: ['all']
          },
        });
      };

      const detailsReportBtn = { ...summaryReportBtn };
      detailsReportBtn.status = 'primary';
      detailsReportBtn.name = 'detailReport';
      detailsReportBtn.label = detailsReportBtn.title = 'In báo cáo chi tiết';
      detailsReportBtn.disabled = () => this.selectedIds.length <= 0;
      detailsReportBtn.click = () => {
        this.commonService.openDialog(AccountingLiabilitiesDetailsReportPrintComponent, {
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
          title: this.commonService.translateText('Common.contact'),
          type: 'string',
          width: '30%',
          valuePrepareFunction: (cell: any, row: any) => {
            return this.commonService.getObjectId(row.Object) + ' - ' + row.ObjectName;
          },
          filter: {
            type: 'custom',
            component: SmartTableSelect2FilterComponent,
            config: {
              delay: 0,
              condition: 'eq',
              select2Option: {
                ...this.commonService.makeSelect2AjaxOption('/contact/contacts', {includeIdText: true, includeGroups: true}, { placeholder: 'Chọn liên hệ...', limit: 10, prepareReaultItem: (item) => {
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
          title: '[' + this.commonService.translateText('Accounting.LiabilitiesReport.tailDebit'),
          type: 'acc-currency',
          width: '10%',
        },
        TailCredit: {
          title: this.commonService.translateText('Accounting.LiabilitiesReport.tailCredit') + ']',
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
  //   params['reportLiabilities'] = true;
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

      // params['reportLiabilities'] = true;
      const choosedFromDate = (this.accountingService.reportFromDate$.value as Date) || new Date();
      const fromDate = new Date(choosedFromDate.getFullYear(), choosedFromDate.getMonth(), choosedFromDate.getDate(), 0, 0, 0, 0);

      const choosedToDate = (this.accountingService.reportToDate$.value as Date) || new Date();
      const toDate = new Date(choosedToDate.getFullYear(), choosedToDate.getMonth(), choosedToDate.getDate(), 23, 59, 59, 999);

      params['includeColumnHeader'] = true;
      params['eq_Accounts'] = '331';
      params['groupBy'] = 'Object';
      params['toDate'] = toDate.toISOString();
      params['fromDate'] = fromDate.toISOString();
      params['sort_TailCredit'] = 'desc';

      return params;
    };

    return source;
  }

  getList(callback: (list: AccountModel[]) => void) {
    super.getList((rs) => {
      for (const item of rs) {
        const amount = item['HeadCredit'] - item['HeadDebit'] + item['GenerateCredit'] - item['GenerateDebit'];
        if (amount > 0) {
          item['TailDebit'] = 0;
          item['TailCredit'] = amount;
        } else {
          item['TailDebit'] = -amount;
          item['TailCredit'] = 0;
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

  openInstantDetailReport(rowData: any) {
    this.commonService.openDialog(AccountingDetailByObjectReportComponent, {
      context: {
        inputMode: 'dialog',
        object: rowData.Object,
        accounts: ['331'],
        fromDate: null,
        toDate: null,
        // report: 'reportDetailByAccountAndObject',
      },
      closeOnEsc: false,
    })
  }

  async refresh() {
    super.refresh();
  }

}
