import { ContactAllListComponent } from './../../../contact/contact-all-list/contact-all-list.component';
import { ContactModel } from './../../../../models/contact.model';
import { ContactListComponent } from './../../../contact/contact/contact-list/contact-list.component';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { take, takeUntil } from 'rxjs/operators';
import { SmartTableNumberEditableComponent, SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { DataManagerListComponent, SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { AccountModel } from '../../../../models/accounting.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'ngx-acc-master-book-head-object-amount',
  templateUrl: './acc-master-book-head-object-amount.component.html',
  styleUrls: ['./acc-master-book-head-object-amount.component.scss']
})
export class AccMasterBookHeadObjectAmountComponent extends DataManagerListComponent<AccountModel> implements OnInit {

  componentName: string = 'AccAccountListComponent';
  formPath = '/accounting/account/form';
  apiPath = '/accounting/master-book-head-entries';
  idKey = 'Object';
  // formDialog = AccMasterBookHeadAmountComponent;

  reuseDialog = true;

  // Smart table
  static filterConfig: any;
  static sortConf: any;
  static pagingConf = { page: 1, perPage: 40 };

  totalBalance: { Debit: number, Credit: number } = { Debit: 0, Credit: 0 };

  @Input() account: AccountModel;
  @Input() data: any[];

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<AccMasterBookHeadObjectAmountComponent>,
  ) {
    super(apiService, router, commonService, dialogService, toastService, ref);
  }

  async init() {
    // await this.loadCache();
    return super.init().then(rs => {
      this.actionButtonList = this.actionButtonList.filter(f => ['delete', 'edit', 'choose', 'preview'].indexOf(f.name) < 0);
      this.actionButtonList.find(f => f.name === 'refresh').label = this.commonService.translateText('Common.refresh');
      this.actionButtonList.unshift({
        label: this.commonService.translateText('Common.save'),
        icon: 'save',
        type: 'button',
        status: 'primary',
        size: 'medium',
        title: this.commonService.translateText('Common.save'),
        click: () => {
          this.saveAndClose();
        },
      });
      const addActionButton = this.actionButtonList.find(f => f.name === 'add');
      if (addActionButton) {
        addActionButton.status = 'success';
        addActionButton.label = this.commonService.translateText('Common.addObject');
        addActionButton.click = () => {
          this.commonService.openDialog(ContactAllListComponent, {
            context: {
              inputMode: 'dialog',
              onDialogChoose: (accounts: ContactModel[]) => {
                // console.log(accounts);
                for (const contact of accounts) {
                  this.source.append({
                    Object: contact.Code,
                    ObjectName: contact.Name,
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
          title: this.commonService.translateText('Common.object'),
          type: 'string',
          width: '5%',
          // filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
        },
        ObjectName: {
          title: this.commonService.translateText('Common.objectName'),
          type: 'string',
          width: '45%',
          // filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
        },
        Debit: {
          title: this.commonService.translateText('Accounting.headDebit'),
          width: '12%',
          type: 'custom',
          editable: true,
          delay: 3000,
          renderComponent: SmartTableNumberEditableComponent,
          onComponentInitFunction: async (instance: SmartTableNumberEditableComponent) => {
            instance.init.asObservable().pipe(take(1)).toPromise().then(initRow => {
              if (this.account?.NumOfChildren > 0 || this.account?.Property === 'CREDIT') {
                instance.disabled = true;
              }
            });
          },
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
              if (this.account?.NumOfChildren > 0 || this.account?.Property === 'DEBIT') {
                instance.disabled = true;
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
      // },
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
    super.executeGet(params, success, error, complete);
  }

  getList(callback: (list: AccountModel[]) => void) {
    if (typeof this.data !== 'undefined') callback(this.data);
    else
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

  refresh() {
    super.refresh();
    this.apiService.getPromise<any>(this.apiPath, { getTotalBalance: true }).then(balances => this.totalBalance = balances);
  }

  get isChoosedMode() {
    return false;
  }

  saveAndClose() {
    this.source.getAll().then(data => this.onDialogChoose(data));
    this.close();
    return true;
  }

  save() {
    this.source.getAll().then(data => this.onDialogChoose(data));
    return true;
  }

}
