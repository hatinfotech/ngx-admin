import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../../../lib/base-component';
import { SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { DataManagerListComponent, SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { AccountModel } from '../../../../models/accounting.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { AccAccountFormComponent } from '../../acc-account/acc-account-form/acc-account-form.component';
import { AccAccountListComponent } from '../../acc-account/acc-account-list/acc-account-list.component';
import { AccoungtingDetailByObjectReportComponent } from '../accoungting-detail-by-object-report/accoungting-detail-by-object-report.component';
import { AccountingReportComponent } from '../accounting-report.component';

@Component({
  selector: 'ngx-accounting-liabilities-report',
  templateUrl: './accounting-liabilities-report.component.html',
  styleUrls: ['./accounting-liabilities-report.component.scss']
})
export class AccountingLiabilitiesReportComponent extends DataManagerListComponent<AccountModel> implements OnInit {

  componentName: string = 'AccountingLiabilitiesReportComponent';
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
    public ref: NbDialogRef<AccountingLiabilitiesReportComponent>,
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
      this.actionButtonList = this.actionButtonList.filter(f => ['delete','edit','add','choose','preview'].indexOf(f.name) < 0);
      this.actionButtonList.find(f => f.name === 'refresh').label = this.commonService.translateText('Common.refresh');
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
          title: this.commonService.translateText('Common.customer'),
          type: 'string',
          width: '10%',
        },
        ObjectName: {
          title: this.commonService.translateText('Common.customerName'),
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
  executeGet(params: any, success: (resources: AccountModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: AccountModel[] | HttpErrorResponse) => void) {
    // params['includeParent'] = true;
    params['reportLiabilities'] = true;
    super.executeGet(params, success, error, complete);
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
