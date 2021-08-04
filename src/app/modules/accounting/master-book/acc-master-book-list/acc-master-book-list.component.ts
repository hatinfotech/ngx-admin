import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { takeUntil } from 'rxjs/operators';
import { AppModule } from '../../../../app.module';
import { SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { AccMasterBookModel } from '../../../../models/accounting.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { AccBusinessFormComponent } from '../../acc-business/acc-business-form/acc-business-form.component';
import { AccMasterBookFormComponent } from '../acc-master-book-form/acc-master-book-form.component';
import { AccMasterBookHeadAmountComponent } from '../acc-master-book-head-amount/acc-master-book-head-amount.component';

@Component({
  selector: 'ngx-acc-master-book-list',
  templateUrl: './acc-master-book-list.component.html',
  styleUrls: ['./acc-master-book-list.component.scss']
})
export class AccMasterBookListComponent extends ServerDataManagerListComponent<AccMasterBookModel> implements OnInit {

  componentName: string = 'AccMasterBookListComponent';
  formPath = '/accounting/business/form';
  apiPath = '/accounting/master-books';
  idKey = 'Code';
  formDialog = AccMasterBookFormComponent;

  reuseDialog = true;

  // Smart table
  static filterConfig: any;
  static sortConf: any;
  static pagingConf = { page: 1, perPage: 40 };

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<AccMasterBookListComponent>,
  ) {
    super(apiService, router, commonService, dialogService, toastService, ref);
  }

  async init() {
    // await this.loadCache();
    return super.init().then(rs => {

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
          width: '10%',
        },
        Branch: {
          title: this.commonService.translateText('Common.branch'),
          type: 'string',
          width: '10%',
          // filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
        },
        Year: {
          title: this.commonService.translateText('Accounting.MasterBook.year'),
          type: 'string',
          width: '10%',
        },
        Creator: {
          title: this.commonService.translateText('Common.creator'),
          type: 'string',
          width: '10%',
        },
        DateOfCreate: {
          title: this.commonService.translateText('Common.dateOfCreated'),
          type: 'datetime',
          width: '10%',
        },
        DateOfStart: {
          title: this.commonService.translateText('Accounting.MasterBook.dateOfStart'),
          type: 'datetime',
          width: '10%',
        },
        DateOfEnd: {
          title: this.commonService.translateText('Accounting.MasterBook.dateOfEnd'),
          type: 'datetime',
          width: '10%',
        },
        DateOfBeginning: {
          title: this.commonService.translateText('Accounting.MasterBook.dateOfBeginning'),
          type: 'datetime',
          width: '20%',
        },
        State: {
          title: this.commonService.translateText('Common.state'),
          type: 'custom',
          width: '10%',
          // class: 'align-right',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'checkmark-circle';
            instance.display = true;
            instance.status = 'success';
            instance.disabled = this.isChoosedMode;
            instance.title = this.commonService.translateText('Common.approved');
            instance.label = this.commonService.translateText('Common.approved');
            instance.init.subscribe(initRowData => {
              // instance.label = value.State;
              const processMap = AppModule.processMaps.accMasterBook[initRowData.State || ''];
              instance.label = this.commonService.translateText(processMap?.label);
              instance.status = processMap?.status;
              instance.outline = processMap?.outline;
              if (initRowData.State === 'CLOSE') instance.disabled = true;
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: AccMasterBookModel) => {
              if (!rowData.State) {
                this.commonService.showDiaplog(this.commonService.translateText('Accounting.MasterBook.label'), this.commonService.translateText('Accounting.MasterBook.openConfirm'), [
                  {
                    label: this.commonService.translateText('Common.goback'),
                    status: 'danger',
                    action: () => { },
                  },
                  {
                    label: this.commonService.translateText('Accounting.MasterBook.open'),
                    status: 'primary',
                    action: () => {
                      this.apiService.putPromise(this.apiPath, { open: true }, [{ Code: rowData.Code }]).then(() => this.refresh());
                    },
                  },
                ]);
              }
              if (rowData.State === 'OPEN') {
                this.commonService.showDiaplog(this.commonService.translateText('Accounting.MasterBook.label'), this.commonService.translateText('Accounting.MasterBook.confirmLockOrClose'), [
                  {
                    label: this.commonService.translateText('Common.goback'),
                    status: 'danger',
                    action: () => { },
                  },
                  {
                    label: this.commonService.translateText('Accounting.MasterBook.close'),
                    status: 'success',
                    action: () => {
                      this.apiService.putPromise(this.apiPath, { close: true }, [{ Code: rowData.Code }]).then(() => this.refresh());
                    },
                  },
                  {
                    label: this.commonService.translateText('Accounting.MasterBook.lock'),
                    status: 'primary',
                    action: () => {
                      this.apiService.putPromise(this.apiPath, { lock: true }, [{ Code: rowData.Code }]).then(() => this.refresh());
                    },
                  },
                ]);
              }
              if (rowData.State === 'LOCK') {
                this.commonService.showDiaplog(this.commonService.translateText('Accounting.MasterBook.label'), this.commonService.translateText('Accounting.MasterBook.confirmUnlockOrClose'), [
                  {
                    label: this.commonService.translateText('Common.goback'),
                    status: 'danger',
                    action: () => { },
                  },
                  {
                    label: this.commonService.translateText('Accounting.MasterBook.close'),
                    status: 'success',
                    action: () => {
                      this.apiService.putPromise(this.apiPath, { close: true }, [{ Code: rowData.Code }]).then(() => this.refresh());
                    },
                  },
                  {
                    label: this.commonService.translateText('Accounting.MasterBook.unlock'),
                    status: 'primary',
                    action: () => {
                      this.apiService.putPromise(this.apiPath, { unlock: true }, [{ Code: rowData.Code }]).then(() => this.refresh());
                    },
                  },
                ]);
              }
              if (rowData.State === 'CLOSE') {
                // this.commonService.showDiaplog(this.commonService.translateText('Accounting.MasterBook.label'), this.commonService.translateText('Accounting.MasterBook.confirmLockOrClose'), [
                //   {
                //     label: this.commonService.translateText('Common.goback'),
                //     status: 'danger',
                //     action: () => { },
                //   },
                //   {
                //     label: this.commonService.translateText('Accounting.MasterBook.close'),
                //     status: 'success',
                //     action: () => {
                //       this.apiService.putPromise(this.apiPath, { close: true }, [{ Code: rowData.Code }]);
                //     },
                //   },
                //   {
                //     label: this.commonService.translateText('Accounting.MasterBook.lock'),
                //     status: 'primary',
                //     action: () => {
                //       this.apiService.putPromise(this.apiPath, { lock: true }, [{ Code: rowData.Code }]);
                //     },
                //   },
                // ]);
              }
            });
          },
        },
        Preview: {
          title: this.commonService.translateText('Common.show'),
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
            instance.label = this.commonService.translateText('Accounting.MasterBook.headAmount');
            instance.title = this.commonService.translateText('Common.preview');
            instance.valueChange.subscribe(value => {
              // instance.icon = value ? 'unlock' : 'lock';
              // instance.status = value === 'REQUEST' ? 'warning' : 'success';
              // instance.disabled = value !== 'REQUEST';
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: AccMasterBookModel) => {
              this.commonService.openDialog(AccMasterBookHeadAmountComponent, {
                context: {
                  inputMode: 'dialog',
                  masterBook: rowData,
                  // inputId: ids,
                  // data: [{ Type: 'RECEIPT' }],
                  // onDialogSave: (newAccBusiness: AccMasterBookModel[]) => {
                  //   console.log(newAccBusiness);
                  //   // const accBusiness: any = { ...newAccBusiness[0], id: newAccBusiness[0].Code, text: newAccBusiness[0].Name };
                  //   // detailFormGroup.get('AccountingBusiness').patchValue(accBusiness);
                  // },
                  // onDialogClose: () => {

                  // },
                },
                closeOnEsc: false,
                closeOnBackdropClick: false,
              });
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

  initDataSource() {
    const source = super.initDataSource();

    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {
      params['includeParent'] = true;
      return params;
    };

    return source;
  }

}
