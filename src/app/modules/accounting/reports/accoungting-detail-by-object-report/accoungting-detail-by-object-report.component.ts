import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { SmartTableTagsComponent, SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { DataManagerListComponent, SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { AccountModel } from '../../../../models/accounting.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { AccAccountFormComponent } from '../../acc-account/acc-account-form/acc-account-form.component';

@Component({
  selector: 'ngx-accoungting-detail-by-object-report',
  templateUrl: './accoungting-detail-by-object-report.component.html',
  styleUrls: ['./accoungting-detail-by-object-report.component.scss']
})
export class AccoungtingDetailByObjectReportComponent extends ServerDataManagerListComponent<AccountModel> implements OnInit {

  componentName: string = 'AccoungtingDetailByObjectReportComponent';
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

  @Input() object?: string;
  @Input() accounts?: string[];
  @Input() fromDate?: Date;
  @Input() toDate?: Date;
  @Input() report?: string;

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<AccoungtingDetailByObjectReportComponent>,
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
      // this.actionButtonList = this.actionButtonList.filter(f => f.name !== 'choose');
      this.actionButtonList = this.actionButtonList.filter(f => ['delete', 'edit', 'add', 'choose', 'preview'].indexOf(f.name) < 0);
      return rs;
    });
  }

  editing = {};
  rows = [];

  loadListSetting(): SmartTableSetting {
    const settings = this.configSetting({
      actions: false,
      columns: {
        VoucherDate: {
          title: this.commonService.translateText('Accounting.voucherDate'),
          type: 'datetime',
          width: '10%',
        },
        Object: {
          title: this.commonService.translateText('Common.contact'),
          type: 'string',
          width: '10%',
        },
        ObjectName: {
          title: this.commonService.translateText('Common.contactName'),
          type: 'string',
          width: '15%',
        },
        Description: {
          title: this.commonService.translateText('Common.description'),
          type: 'string',
          width: '15%',
        },
        Voucher: {
          title: this.commonService.translateText('Common.voucher'),
          type: 'custom',
          renderComponent: SmartTableTagsComponent,
          valuePrepareFunction: (cell: string, row: any) => {
            return [{ id: cell, text: row['Description'], type: row['VoucherType'] }] as any;
          },
          onComponentInitFunction: (instance: SmartTableTagsComponent) => {
            instance.click.subscribe((tag: { id: string, text: string, type: string }) => tag.type && this.commonService.previewVoucher(tag.type, tag.id));
          },
          width: '10%',
        },
        HeadAmount: {
          title: this.commonService.translateText('Accounting.headAmount'),
          type: 'acc-currency',
          width: '10%',
        },
        GenerateDebit: {
          title: this.commonService.translateText('Accounting.debitGenerate'),
          type: 'acc-currency',
          width: '10%',
        },
        GenerateCredit: {
          title: this.commonService.translateText('Accounting.creditGenerate'),
          type: 'acc-currency',
          width: '10%',
        },
        // HeadAmount: {
        //   title: this.commonService.translateText('Accounting.headAmount'),
        //   type: 'acc-currency',
        //   width: '10%',
        // },
        // GenerateAmount: {
        //   title: this.commonService.translateText('Accounting.generate'),
        //   type: 'acc-currency',
        //   width: '10%',
        // },
        IncrementAmount: {
          title: this.commonService.translateText('Accounting.increment'),
          type: 'acc-currency',
          width: '10%',
        },
        // TailAmount: {
        //   title: this.commonService.translateText('Accounting.tailAmount'),
        //   type: 'acc-currency',
        //   width: '10%',
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
            // instance.label = this.commonService.translateText('Common.detail');
            instance.valueChange.subscribe(value => {
              // instance.icon = value ? 'unlock' : 'lock';
              // instance.status = value === 'REQUEST' ? 'warning' : 'success';
              // instance.disabled = value !== 'REQUEST';
            });
            // instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: CashVoucherModel) => {
            //   this.getFormData([rowData.Code]).then(rs => {
            //     this.preview(rs);
            //   });
            // });
          },
        }
      },
    });
    delete settings.columns['Choose'];
    return settings;
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  initDataSource() {
    const source = super.initDataSource();

    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {

      if (this.object) {
        params['eq_Object'] = this.object;
      }
      if (this.accounts) {
        params['eq_Account'] = this.accounts.join(',');
      }
      if (this.report) {
        params[this.report] = true;
      } else {
        params['reportDetailByObject'] = true;
      }
      params['includeIncrementAmount'] = true;

      return params;
    };

    return source;
  }

  /** Api get funciton */
  executeGet(params: any, success: (resources: AccountModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: AccountModel[] | HttpErrorResponse) => void) {
    if (this.object) {
      params['eq_Object'] = this.object;
    }
    if (this.accounts) {
      params['eq_Account'] = this.accounts.join(',');
    }
    if (this.report) {
      params[this.report] = true;
    } else {
      params['reportDetailByObject'] = true;
    }
    super.executeGet(params, success, error, complete);
  }

  // getList(callback: (list: AccountModel[]) => void) {
  //   super.getList((rs) => {
  //     let increment = 0;
  //     for (const item of rs) {
  //       // if (['131', '141', '1111','1121'].indexOf(item['Account']) > -1) {
  //       if (/^[1|2|6|8]/.test(item['Account'])) {
  //         item['HeadAmount'] = item['HeadDebit'] - item['HeadCredit'];
  //         item['IncrementAmount'] = (increment += item['HeadAmount'] + (item['GenerateDebit'] - item['GenerateCredit']));
  //       }
  //       // if (['331', '5111', '5112,5113', '5118', '515'].indexOf(item['Account']) > -1) {
  //       if (/^[3|5|4|9]/.test(item['Account'])) {
  //         item['HeadAmount'] = item['HeadCredit'] - item['HeadDebit'];
  //         item['IncrementAmount'] = (increment += item['HeadAmount'] + (item['GenerateCredit'] - item['GenerateDebit']));
  //       }
  //     }
  //     if (callback) callback(rs);
  //   });
  // }

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

}
