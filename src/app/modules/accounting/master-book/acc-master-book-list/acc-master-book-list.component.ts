import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { takeUntil } from 'rxjs/operators';
import { AppModule } from '../../../../app.module';
import { SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { AccMasterBookModel } from '../../../../models/accounting.model';
import { ApiService } from '../../../../services/api.service';
import { RootServices } from '../../../../services/root.services';
import { CommonService } from '../../../../services/common.service';
import { DialogFormComponent } from '../../../dialog/dialog-form/dialog-form.component';
import { AccBusinessFormComponent } from '../../acc-business/acc-business-form/acc-business-form.component';
import { AccMasterBookFormComponent } from '../acc-master-book-form/acc-master-book-form.component';
import { AccMasterBookHeadAmountComponent } from '../acc-master-book-head-amount/acc-master-book-head-amount.component';

@Component({
  selector: 'ngx-acc-master-book-list',
  templateUrl: './acc-master-book-list.component.html',
  styleUrls: ['./acc-master-book-list.component.scss'],
  providers: [
    DatePipe,
  ]
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
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<AccMasterBookListComponent>,
  ) {
    super(rsv, apiService, router, cms, dialogService, toastService, ref);
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
          title: this.cms.translateText('Common.code'),
          type: 'string',
          width: '10%',
        },
        Branch: {
          title: this.cms.translateText('Common.branch'),
          type: 'string',
          width: '10%',
          // filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
        },
        Year: {
          title: this.cms.translateText('Accounting.MasterBook.year'),
          type: 'string',
          width: '10%',
        },
        Creator: {
          title: this.cms.translateText('Common.creator'),
          type: 'string',
          width: '10%',
        },
        DateOfCreate: {
          title: this.cms.translateText('Common.dateOfCreated'),
          type: 'datetime',
          width: '10%',
        },
        DateOfStart: {
          title: this.cms.translateText('Accounting.MasterBook.dateOfStart'),
          type: 'datetime',
          width: '10%',
        },
        DateOfEnd: {
          title: this.cms.translateText('Accounting.MasterBook.dateOfEnd'),
          type: 'datetime',
          width: '10%',
        },
        DateOfBeginning: {
          title: this.cms.translateText('Accounting.MasterBook.dateOfBeginning'),
          type: 'datetime',
          width: '20%',
        },
        Commited: {
          title: this.cms.translateText('Chốt sổ'),
          type: 'custom',
          width: '5%',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'lock-outline';
            instance.display = true;
            instance.status = 'danger';
            instance.valueChange.subscribe(value => {
              instance.label = instance.rowData.Commited ? this.cms.datePipe.transform(instance.rowData.Commited, 'shortDate') : this.cms.translateText('Chưa chốt sổ');
              instance.title = instance.rowData.Commited ? ('Chốt sổ đến hết ngày: ' + this.cms.datePipe.transform(instance.rowData.Commited, 'shortDate')) : 'Chưa chốt sổ';
              if (instance.rowData.Commited) {
                instance.icon = 'lock-outline';
              } else {
                instance.icon = 'unlock-outline';
              }
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: AccMasterBookModel) => {
              this.cms.openDialog(DialogFormComponent, {
                context: {
                  title: 'Chốt sổ kế toán',
                  cardStyle: { width: '377px' },
                  onInit: async (form, dialog) => {
                    return true;
                  },
                  controls: [
                    {
                      name: 'Commmited',
                      label: 'Chốt sổ đến ngày',
                      placeholder: 'Chốt sổ đến ngày',
                      type: 'date',
                      initValue: instance.rowData.Commited && new Date(instance.rowData.Commited) || new Date(),
                      focus: true,
                    },
                  ],
                  actions: [
                    {
                      label: 'Esc - Trở về',
                      icon: 'back',
                      status: 'basic',
                      keyShortcut: 'Escape',
                      action: async () => { return true; },
                    },
                    {
                      label: 'Chốt sổ',
                      icon: 'lock-outline',
                      status: 'danger',
                      disabled: (actionParams, form: FormGroup, dialog) => {
                        const oldCommited = instance.rowData.Commited && new Date(instance.rowData.Commited) || null;
                        const commited = (form.get('Commmited').value as Date);
                        if (oldCommited && commited && oldCommited.getFullYear() == commited.getFullYear() && oldCommited.getMonth() == commited.getMonth() && oldCommited.getDate() == commited.getDate()) {
                          return true;
                        }
                        return false;
                      },
                      // keyShortcut: 'Enter',
                      action: async (form: FormGroup, formDialogConpoent: DialogFormComponent) => {
                        const commited = (form.get('Commmited').value as Date);
                        commited.setHours(23, 59, 59, 999);
                        formDialogConpoent.startProcessing();
                        await this.apiService.putPromise('/accounting/master-books/' + instance.rowData.Code, {}, [{ Code: instance.rowData.Code, Commited: commited.toISOString() }]).then(rs => {
                          console.log(rs);
                          this.cms.toastService.show('Đã chốt sổ kế toán đến ngày ' + this.cms.datePipe.transform(commited.toISOString(), 'short') + ', các chứng từ trước ngày chốt sổ sẽ không thể điều chỉnh được nữa !', 'Chốt sổ kế toán', { status: 'success', duration: 15000 });
                          this.refresh();
                          return rs;
                        }).catch(err => {
                          console.error(err);
                          formDialogConpoent.stopProcessing();
                        });
                        formDialogConpoent.stopProcessing();
                        return true;
                      },
                    },
                    {
                      label: 'Mở khóa',
                      icon: 'unlock-outline',
                      status: 'primary',
                      keyShortcut: 'Escape',
                      action: async (form: FormGroup, formDialogConpoent: DialogFormComponent) => {
                        formDialogConpoent.startProcessing();
                        await this.apiService.putPromise('/accounting/master-books/' + instance.rowData.Code, {}, [{ Code: instance.rowData.Code, Commited: null }]).then(rs => {
                          console.log(rs);
                          this.cms.toastService.show('Đã mở chốt sổ kế toán !', 'Chốt sổ kế toán', { status: 'success', duration: 15000 });
                          this.refresh();
                          return rs;
                        }).catch(err => {
                          console.error(err);
                          formDialogConpoent.stopProcessing();
                        });
                        formDialogConpoent.stopProcessing();
                        return true;
                      },
                    },
                  ],
                },
              });
            });
          },
        },
        State: {
          title: this.cms.translateText('Common.state'),
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
            instance.title = this.cms.translateText('Common.approved');
            instance.label = this.cms.translateText('Common.approved');
            instance.init.subscribe(initRowData => {
              // instance.label = value.State;
              const processMap = AppModule.processMaps.accMasterBook[initRowData.State || ''];
              instance.label = this.cms.translateText(processMap?.label);
              instance.status = processMap?.status;
              instance.outline = processMap?.outline;
              if (initRowData.State === 'CLOSE') instance.disabled = true;
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: AccMasterBookModel) => {
              if (!rowData.State) {
                this.cms.showDialog(this.cms.translateText('Accounting.MasterBook.label'), this.cms.translateText('Accounting.MasterBook.openConfirm'), [
                  {
                    label: this.cms.translateText('Common.goback'),
                    status: 'danger',
                    action: () => { },
                  },
                  {
                    label: this.cms.translateText('Accounting.MasterBook.open'),
                    status: 'primary',
                    action: () => {
                      this.apiService.putPromise(this.apiPath, { open: true }, [{ Code: rowData.Code }]).then(() => this.refresh());
                    },
                  },
                ]);
              }
              if (rowData.State === 'OPEN') {
                this.cms.showDialog(this.cms.translateText('Accounting.MasterBook.label'), this.cms.translateText('Accounting.MasterBook.confirmLockOrClose'), [
                  {
                    label: this.cms.translateText('Common.goback'),
                    status: 'danger',
                    action: () => { },
                  },
                  {
                    label: this.cms.translateText('Accounting.MasterBook.close'),
                    status: 'success',
                    action: () => {
                      this.apiService.putPromise(this.apiPath, { close: true }, [{ Code: rowData.Code }]).then(() => this.refresh());
                    },
                  },
                  {
                    label: this.cms.translateText('Accounting.MasterBook.lock'),
                    status: 'primary',
                    action: () => {
                      this.apiService.putPromise(this.apiPath, { lock: true }, [{ Code: rowData.Code }]).then(() => this.refresh());
                    },
                  },
                ]);
              }
              if (rowData.State === 'LOCK') {
                this.cms.showDialog(this.cms.translateText('Accounting.MasterBook.label'), this.cms.translateText('Accounting.MasterBook.confirmUnlockOrClose'), [
                  {
                    label: this.cms.translateText('Common.goback'),
                    status: 'danger',
                    action: () => { },
                  },
                  {
                    label: this.cms.translateText('Accounting.MasterBook.close'),
                    status: 'success',
                    action: () => {
                      this.apiService.putPromise(this.apiPath, { close: true }, [{ Code: rowData.Code }]).then(() => this.refresh());
                    },
                  },
                  {
                    label: this.cms.translateText('Accounting.MasterBook.unlock'),
                    status: 'primary',
                    action: () => {
                      this.apiService.putPromise(this.apiPath, { unlock: true }, [{ Code: rowData.Code }]).then(() => this.refresh());
                    },
                  },
                ]);
              }
              if (rowData.State === 'CLOSE') {
                // this.cms.showDiaplog(this.cms.translateText('Accounting.MasterBook.label'), this.cms.translateText('Accounting.MasterBook.confirmLockOrClose'), [
                //   {
                //     label: this.cms.translateText('Common.goback'),
                //     status: 'danger',
                //     action: () => { },
                //   },
                //   {
                //     label: this.cms.translateText('Accounting.MasterBook.close'),
                //     status: 'success',
                //     action: () => {
                //       this.apiService.putPromise(this.apiPath, { close: true }, [{ Code: rowData.Code }]);
                //     },
                //   },
                //   {
                //     label: this.cms.translateText('Accounting.MasterBook.lock'),
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
          title: this.cms.translateText('Common.show'),
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
            instance.label = this.cms.translateText('Accounting.MasterBook.headAmount');
            instance.title = this.cms.translateText('Common.preview');
            instance.valueChange.subscribe(value => {
              // instance.icon = value ? 'unlock' : 'lock';
              // instance.status = value === 'REQUEST' ? 'warning' : 'success';
              // instance.disabled = value !== 'REQUEST';
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: AccMasterBookModel) => {
              this.cms.openDialog(AccMasterBookHeadAmountComponent, {
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
