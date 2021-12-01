import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { takeUntil, filter } from 'rxjs/operators';
import { BaseComponent } from '../../../../lib/base-component';
import { DataManagerListComponent, SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { AccountModel } from '../../../../models/accounting.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { AccAccountFormComponent } from '../../acc-account/acc-account-form/acc-account-form.component';
import { AccAccountListComponent } from '../../acc-account/acc-account-list/acc-account-list.component';
import { AccountingService } from '../../accounting.service';
import { AccountingDetailByObjectReportComponent } from '../accounting-detail-by-object-report/accounting-detail-by-object-report.component';
import { AccountingReportComponent } from '../accounting-report.component';

@Component({
  selector: 'ngx-accounting-receivables-report',
  templateUrl: './accounting-receivables-report.component.html',
  styleUrls: ['./accounting-receivables-report.component.scss']
})
export class AccountingReceivablesReportComponent extends DataManagerListComponent<AccountModel> implements OnInit {

  componentName: string = 'AccountingReceivablesReportComponent';
  formPath = '/accounting/account/form';
  apiPath = '/accounting/accounts';
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
    public ref: NbDialogRef<AccountingReceivablesReportComponent>,
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
      this.actionButtonList = this.actionButtonList.filter(f => ['delete','edit','add','choose','preview'].indexOf(f.name) < 0);
      this.actionButtonList.find(f => f.name === 'refresh').label = this.commonService.translateText('Common.refresh');

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
      columns: {
        Code: {
          title: this.commonService.translateText('Common.code'),
          type: 'string',
          width: '5%',
        },
        Name: {
          title: this.commonService.translateText('Common.name'),
          type: 'string',
          width: '20%',
          // filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
        },
        Description: {
          title: this.commonService.translateText('Common.description'),
          type: 'string',
          width: '20%',
        },
        Debit: {
          title: this.commonService.translateText('Common.debit'),
          type: 'currency',
          width: '8%',
        },
        Credit: {
          title: this.commonService.translateText('Common.credit'),
          type: 'currency',
          width: '8%',
        },
        Currency: {
          title: this.commonService.translateText('Common.currency'),
          type: 'string',
          width: '8%',
        },
        Property: {
          title: this.commonService.translateText('Common.property'),
          type: 'string',
          width: '8%',
        },
        Type: {
          title: this.commonService.translateText('Common.type'),
          type: 'string',
          width: '5%',
          // filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
        },
        Level: {
          title: this.commonService.textTransform(this.commonService.translate.instant('Common.level'), 'head-title'),
          type: 'string',
          width: '5%',
        },
        Group: {
          title: this.commonService.translateText('Common.group'),
          type: 'string',
          width: '8%',
        },
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
    params['includeAmount'] = true;
    const choosedFromDate = (this.accountingService.reportFromDate$.value as Date) || new Date();
    const fromDate = new Date(choosedFromDate.getFullYear(), choosedFromDate.getMonth(), choosedFromDate.getDate(), 0, 0, 0, 0);

    const choosedToDate = (this.accountingService.reportToDate$.value as Date) || new Date();
    const toDate = new Date(choosedToDate.getFullYear(), choosedToDate.getMonth(), choosedToDate.getDate(), 23, 59, 59, 999);

    params['toDate'] = toDate.toISOString();
    params['fromDate'] = fromDate.toISOString();
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
    this.commonService.openDialog(AccountingDetailByObjectReportComponent, {
      context: {
        inputMode: 'dialog',
        object: rowData.Object,
        accounts: ['331'],
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
