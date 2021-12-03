import { FormControl } from '@angular/forms';
import { OtherBusinessVoucherModel, OtherBusinessVoucherDetailModel } from '../../../../models/accounting.model';
import { AccountingOtherBusinessVoucherFormComponent } from '../../other-business-voucher/accounting-other-business-voucher-form/accounting-other-business-voucher-form.component';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { takeUntil, filter } from 'rxjs/operators';
import { SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { DataManagerListComponent, SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { AccountModel } from '../../../../models/accounting.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { AccountingDetailByObjectReportComponent } from '../accounting-detail-by-object-report/accounting-detail-by-object-report.component';
import { CurrencyPipe } from '@angular/common';
import { Icon } from '../../../../lib/custom-element/card-header/card-header.component';
import { ActionControl, ActionControlListOption } from '../../../../lib/custom-element/action-control-list/action-control.interface';
import { AccountingService } from '../../accounting.service';

@Component({
  selector: 'ngx-accounting-profit-report',
  templateUrl: './accounting-profit-report.component.html',
  styleUrls: ['./accounting-profit-report.component.scss'],
  providers: [
    CurrencyPipe,
  ]
})
export class AccountingProfitReportComponent extends DataManagerListComponent<AccountModel> implements OnInit {

  componentName: string = 'AccountingProfitReportComponent';
  formPath = '/accounting/account/form';
  apiPath = '/accounting/reports';
  idKey = 'Code';
  formDialog = AccountingOtherBusinessVoucherFormComponent;

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
    public ref: NbDialogRef<AccountingProfitReportComponent>,
    public currencyPipe: CurrencyPipe,
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
      this.actionButtonList = this.actionButtonList.filter(f => ['delete', 'edit', 'choose', 'preview'].indexOf(f.name) < 0);
      this.actionButtonList.find(f => f.name === 'refresh').label = this.commonService.translateText('Common.refresh');
      const addActionButton = this.actionButtonList.find(f => f.name === 'add');
      if (addActionButton) {
        addActionButton.icon = 'save';
        addActionButton.status = 'primary';
        addActionButton.label = this.commonService.translateText('Accounting.profitForward');
        addActionButton.click = () => {

          this.getList(rs => {
            const details: OtherBusinessVoucherDetailModel[] = [];
            let profit = true;
            let profitAmount = 0;
            for (const detail of rs) {
              details.push({
                Description: 'Kết chuyển ' + detail['AccountName'],
                Amount: Math.abs(detail['TailCredit'] - detail['TailDebit']),
                Currency: 'VND',
                DebitAccount: detail['DebitAccount'],
                CreditAccount: detail['CreditAccount'],
              });
              if (detail['DebitAccount'] === '4212') {
                profit = false;
                profitAmount = Math.abs(detail['TailCredit'] - detail['TailDebit']);
              };
              if (detail['CreditAccount'] === '4212') {
                profit = true;
                profitAmount = Math.abs(detail['TailCredit'] - detail['TailDebit']);
              };
            }

            const toDate = this.accountingService?.reportToDate$?.value || new Date();
            this.commonService.openDialog(AccountingOtherBusinessVoucherFormComponent, {
              context: {
                showLoadinng: true,
                inputMode: 'dialog',
                // inputId: ids,
                data: [{
                  DateOfVoucher: new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate(), 21, 0, 0) as any,
                  Description: 'Kết chuyển lãi/lỗ đến ngày ' + this.commonService.datePipe.transform(toDate, 'short') + ' => ' + (profit ? 'Lãi' : 'Lỗ') + ' ' + this.currencyPipe.transform(profitAmount, 'VND'),
                  Details: details,
                }],
                onDialogSave: (newData: OtherBusinessVoucherModel[]) => {
                  if (newData[0]?.Code) {
                    this.commonService.previewVoucher('OTHERBUSINESSVOUCHER', newData[0].Code, () => {
                      this.refresh();
                    });
                  }
                },
                onDialogClose: () => {
                },
              },
              closeOnEsc: false,
              closeOnBackdropClick: false,
            });
          });

        };
      }

      // Auto refresh list on reportToDate changed
      this.accountingService?.reportToDate$.pipe(takeUntil(this.destroy$), filter(f => f !== null)).subscribe(toDate => {
        console.log(toDate);
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
        AccountName: {
          title: this.commonService.translateText('Common.description'),
          type: 'string',
          width: '40%',
          valuePrepareFunction: (cell: any, row: any) => {
            if (row['DebitAccount'] === '4212') return cell + ' => Lỗ';
            if (row['CreditAccount'] === '4212') return cell + ' => Lãi';
            return cell;
          },
        },
        DebitAccount: {
          title: this.commonService.translateText('Accounting.debitAccount'),
          type: 'string',
          width: '10%',
        },
        CreditAccount: {
          title: this.commonService.translateText('Accounting.creditAccount'),
          type: 'string',
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
        TailAmount: {
          title: this.commonService.translateText('Accounting.tailAmount'),
          type: 'acc-currency',
          width: '10%',
          valuePrepareFunction: (cell: any, row: any) => {
            return Math.abs(row['TailDebit'] - row['TailCredit']) as any;
          },
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
    params['reportProfit'] = true;
    if (this.accountingService?.reportToDate$?.value) {
      const choosedDate = (this.accountingService.reportToDate$.value as Date) || new Date();
      const toDate = new Date(choosedDate.getFullYear(), choosedDate.getMonth(), choosedDate.getDate(), 25, 59, 59, 999);
      params['toDate'] = toDate.toISOString();
    }

    super.executeGet(params, success, error, complete);
  }

  getList(callback: (list: AccountModel[]) => void) {
    super.getList((rs) => {
      // rs.forEach(item => {
      //   item.Content = item.Content.substring(0, 256) + '...';
      // });
      // for (const item of rs) {
      //   if (item['DebitAccount'] === '4212') item['AccountName'] += ' => Lỗ';
      //   if (item['CreditAccount'] === '4212') item['AccountName'] += ' => Lãi';
      // }
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
        accounts: [rowData['DebitAccount'] === '911' ? rowData['CreditAccount'] : rowData['DebitAccount']],
        report: 'reportDetailByAccountAndObject',
        fromDate: null,
        toDate: null,
      },
      closeOnEsc: false,
    })
  }

  async refresh() {
    super.refresh();
  }

}
