import { AccMasterBookListComponent } from './../acc-master-book-list/acc-master-book-list.component';
import { AccMasterBookHeadBankAccountAmountComponent } from './../acc-master-book-head-bank-account-amount/acc-master-book-head-bank-account-amount.component';
import { AccMasterBookModel } from './../../../../models/accounting.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { take, takeUntil, map } from 'rxjs/operators';
import { SmartTableButtonComponent, SmartTableNumberEditableComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { DataManagerListComponent, SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { AccountModel } from '../../../../models/accounting.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { AccMasterBookHeadObjectAmountComponent } from '../acc-master-book-head-object-amount/acc-master-book-head-object-amount.component';
import { AccAccountListComponent } from '../../acc-account/acc-account-list/acc-account-list.component';

@Component({
  selector: 'ngx-acc-master-book-head-amount',
  templateUrl: './acc-master-book-head-amount.component.html',
  styleUrls: ['./acc-master-book-head-amount.component.scss']
})
export class AccMasterBookHeadAmountComponent extends DataManagerListComponent<AccountModel> implements OnInit {

  componentName: string = 'AccAccountListComponent';
  formPath = '/accounting/account/form';
  apiPath = '/accounting/master-book-head-entries';
  idKey = 'Account';
  // formDialog = AccMasterBookHeadAmountComponent;

  reuseDialog = true;

  // Smart table
  static filterConfig: any;
  static sortConf: any;
  static pagingConf = { page: 1, perPage: 40 };
  @Input() masterBook: AccMasterBookModel;

  totalBalance: { Debit: number, Credit: number } = { Debit: 0, Credit: 0 };

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<AccMasterBookHeadAmountComponent>,
  ) {
    super(apiService, router, commonService, dialogService, toastService, ref);
  }

  async init() {
    // await this.loadCache();
    return super.init().then(rs => {
      this.actionButtonList = this.actionButtonList.filter(f => ['delete', 'edit', 'choose', 'preview'].indexOf(f.name) < 0);
      const refreshActionButton = this.actionButtonList.find(f => f.name === 'refresh');
      if (refreshActionButton) {
        refreshActionButton.label = this.commonService.translateText('Common.refresh');
        refreshActionButton.status = 'warning';
      }
      const addActionButton = this.actionButtonList.find(f => f.name === 'add');
      if (addActionButton) {
        addActionButton.status = 'success';
        addActionButton.label = this.commonService.translateText('Accounting.addAccount');
        addActionButton.click = () => {
          this.commonService.openDialog(AccAccountListComponent, {
            context: {
              inputMode: 'dialog',
              onDialogChoose: (accounts: AccountModel[]) => {
                // console.log(accounts);
                for (const account of accounts) {
                  this.source.append({
                    Account: account.Code,
                    Description: account.Name,
                    Currency: account.Currency,
                    Property: account.Property,
                    ReportByObject: account.ReportByObject,
                    ReportByBankAccount: account.ReportByBankAccount,
                    NumOfChildren: account.NumOfChildren,
                    Debit: 0,
                    Credit: 0
                  });
                  // this.source.add();
                }
              },
            }
          })
        };
      }

      const indexOfAddButton = this.actionButtonList.findIndex(f => f.name === 'add');
      this.actionButtonList.splice(indexOfAddButton + 1, 0, {
        label: this.commonService.translateText('Accounting.MasterBook.importFromAnMasterBook'),
        icon: 'import',
        type: 'button',
        status: 'primary',
        size: 'medium',
        title: this.commonService.translateText('Accounting.MasterBook.importFromAnMasterBook'),
        click: () => {
          this.commonService.openDialog(AccMasterBookListComponent, {
            context: {
              inputMode: 'dialog',
            }
          });
        },
      });

      this.actionButtonList.unshift({
        label: this.commonService.translateText('Common.save'),
        icon: 'save',
        type: 'button',
        status: 'primary',
        size: 'medium',
        title: this.commonService.translateText('Common.save'),
        click: () => {
          this.save();
        },
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
        Account: {
          title: this.commonService.translateText('Accounting.account'),
          type: 'string',
          width: '5%',
        },
        Description: {
          title: this.commonService.translateText('Common.description'),
          type: 'string',
          width: '40%',
          // filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
        },
        // Description: {
        //   title: this.commonService.translateText('Common.description'),
        //   type: 'string',
        //   width: '15%',
        // },
        // Debit: {
        //   title: this.commonService.translateText('Common.debit'),
        //   type: 'currency',
        //   width: '8%',
        // },
        // Credit: {
        //   title: this.commonService.translateText('Common.credit'),
        //   type: 'currency',
        //   width: '8%',
        // },
        Currency: {
          title: this.commonService.translateText('Common.currency'),
          type: 'string',
          width: '5%',
        },
        Property: {
          title: this.commonService.translateText('Common.property'),
          type: 'string',
          width: '5%',
        },
        Debit: {
          title: this.commonService.translateText('Accounting.headDebit'),
          width: '12%',
          type: 'custom',
          renderComponent: SmartTableNumberEditableComponent,
          onComponentInitFunction: async (instance: SmartTableNumberEditableComponent) => {
            instance.init.asObservable().pipe(take(1)).toPromise().then(initRow => {
              if (instance.rowData?.NumOfChildren > 0 || instance.rowData?.Property === 'CREDIT' || instance.rowData?.ReportByObject) {
                instance.disabled = true;
              }
            });
          },
          editable: true,
          delay: 3000,
        },
        Credit: {
          title: this.commonService.translateText('Accounting.headCredit'),
          width: '10%',
          type: 'custom',
          editable: true,
          delay: 3000,
          renderComponent: SmartTableNumberEditableComponent,
          onComponentInitFunction: async (instance: SmartTableNumberEditableComponent) => {
            instance.init.asObservable().pipe(take(1)).toPromise().then(initRow => {
              if (instance.rowData?.NumOfChildren > 0 || instance.rowData?.Property === 'DEBIT' || instance.rowData?.ReportByObject) {
                instance.disabled = true;
              }
            });
          },
        },
        Detail: {
          title: this.commonService.translateText('Common.details'),
          type: 'custom',
          width: '5%',
          class: 'align-right',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'external-link-outline';
            instance.display = true;
            instance.status = 'primary';
            instance.style = 'text-align: right';
            instance.class = 'align-right';
            instance.label = this.commonService.translateText('Accounting.reportByObject');
            instance.title = this.commonService.translateText('Accounting.reportByObject');
            instance.init.pipe(takeUntil(this.destroy$)).subscribe(initRowData => {
              if (!instance.rowData?.ReportByObject && !instance.rowData?.ReportByBankAccount) {
                instance.disabled = true;
              }

              if (instance.rowData?.ReportByBankAccount) {
                instance.label = this.commonService.translateText('Accounting.reportByBankAccount');
              }

              // instance.icon = value ? 'unlock' : 'lock';
              // instance.status = value === 'REQUEST' ? 'warning' : 'success';
              // instance.disabled = value !== 'REQUEST';
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: AccountModel) => {
              if (instance.rowData?.ReportByObject) {
                this.commonService.openDialog(AccMasterBookHeadObjectAmountComponent, {
                  context: {
                    inputMode: 'dialog',
                    data: rowData['ReportByObjectDetails'] || [],
                    onDialogChoose: (detailsData: any[]) => {
                      console.log(detailsData);
                      if (detailsData && Array.isArray(detailsData)) {
                        instance.rowData['ReportByObjectDetails'] = detailsData.map(m => ({
                          Object: m.Object,
                          ObjectName: m.ObjectName,
                          Debit: m.Debit,
                          Credit: m.Credit,
                        }));
                        rowData.Debit = 0;
                        rowData.Credit = 0;
                        for (const detail of detailsData) {
                          rowData.Debit += detail.Debit;
                          rowData.Credit += detail.Credit;
                        }
                        this.updateGridItems([rowData], [rowData]);
                      }
                    },
                  },
                  closeOnEsc: false,
                  closeOnBackdropClick: false,
                });
              }
              if (instance.rowData?.ReportByBankAccount) {
                this.commonService.openDialog(AccMasterBookHeadBankAccountAmountComponent, {
                  context: {
                    inputMode: 'dialog',
                    data: rowData['ReportByBankAccountDetails'] || [],
                    onDialogChoose: (detailsData: any[]) => {
                      console.log(detailsData);
                      if (detailsData && Array.isArray(detailsData)) {
                        instance.rowData['ReportByBankAccountDetails'] = detailsData.map(m => ({
                          BankAccount: m.BankAccount,
                          BankAccountDescription: m.BankAccountDescription,
                          Debit: m.Debit,
                          Credit: m.Credit,
                        }));
                        rowData.Debit = 0;
                        rowData.Credit = 0;
                        for (const detail of detailsData) {
                          rowData.Debit += detail.Debit;
                          rowData.Credit += detail.Credit;
                        }
                        this.updateGridItems([rowData], [rowData]);
                      }
                    },
                  },
                  closeOnEsc: false,
                  closeOnBackdropClick: false,
                });
              }
            });
          },
        },
        Remove: {
          title: this.commonService.translateText('Common.remove'),
          type: 'custom',
          width: '5%',
          class: 'align-right',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'close';
            instance.display = true;
            instance.status = 'danger';
            instance.style = 'text-align: right';
            instance.class = 'align-right';
            instance.label = this.commonService.translateText('Common.remove');
            instance.title = this.commonService.translateText('Common.remove');
            instance.valueChange.subscribe(value => {
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: AccountModel) => {
              this.removeGridItems([rowData]);
            });
          },
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
    // params['includeAmount'] = true;
    params['masterBook'] = this.masterBook?.Code;
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

  async refresh() {
    super.refresh();
  }

  get isChoosedMode() {
    return false;
  }

  saveAndClose() {
    this.save().then(rs => {
      if (rs) {
        this.close();
      }
    });
    return true;
  }

  async save() {
    this.loading = true;
    await new Promise(resolve => setTimeout(() => resolve(true), 500));
    return this.source.getAll().then(async data => {
      // console.log(data.filter(f => !!f?.hasModified));

      let credit = 0;
      let debit = 0;
      for (const entry of data) {
        debit += entry.Debit;
        credit += entry.Credit;
      }

      if (debit != credit) {
        this.loading = false;
        const confirm = await new Promise(resolve => {
          this.commonService.showDiaplog(this.commonService.translateText('Accounting.headAmount'), this.commonService.translateText('Accounting.Warning.headAmountNotBalanced'), [
            {
              label: this.commonService.translateText('Common.goback'),
              status: 'primary',
              action: () => {
                resolve(false);
              },
            },
            {
              label: this.commonService.translateText('Common.forceSave'),
              status: 'danger',
              action: () => {
                resolve(true);
              },
            },
          ], () => {
            resolve(false);
          });
        });
        if (!confirm) {
          this.loading = false;
          return false;
        };
      }

      return this.apiService.putPromise(this.apiPath, { masterBook: this.masterBook.Code }, data).then(rs => {
        this.loading = false;
        return rs;
      }).catch(err => {
        this.loading = false;
        return Promise.reject(err);
      });
    })
  }

}
