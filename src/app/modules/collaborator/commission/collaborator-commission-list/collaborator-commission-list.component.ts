import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { takeUntil } from 'rxjs/operators';
import { AppModule } from '../../../../app.module';
import { SmartTableCurrencyComponent, SmartTableButtonComponent, SmartTableTagsComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { ResourcePermissionEditComponent } from '../../../../lib/lib-system/components/resource-permission-edit/resource-permission-edit.component';
import { CollaboratorCommissionVoucherModel } from '../../../../models/collaborator.model';
import { ProcessMap } from '../../../../models/process-map.model';
import { UserGroupModel } from '../../../../models/user-group.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { CollaboratorCommissionFormComponent } from '../collaborator-commission-form/collaborator-commission-form.component';
import { CollaboratorCommissionPrintComponent } from '../collaborator-commission-print/collaborator-commission-print.component';

@Component({
  selector: 'ngx-collaborator-commission-list',
  templateUrl: './collaborator-commission-list.component.html',
  styleUrls: ['./collaborator-commission-list.component.scss']
})
export class CollaboratorCommissionListComponent extends ServerDataManagerListComponent<CollaboratorCommissionVoucherModel> implements OnInit {

  componentName: string = 'CollaboratorCommissionListComponent';
  formPath = '/collaborator/commission-voucher/form';
  apiPath = '/collaborator/commission-vouchers';
  idKey = 'Code';
  formDialog = CollaboratorCommissionFormComponent;

  @Input('context') context?: any;

  reuseDialog = true;
  static _dialog: NbDialogRef<CollaboratorCommissionListComponent>;

  // Smart table
  static filterConfig: any;
  static sortConf: any;
  static pagingConf = { page: 1, perPage: 40 };

  @Input('filter') filter: any;

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<CollaboratorCommissionListComponent>,
  ) {
    super(apiService, router, commonService, dialogService, toastService, ref);
  }

  async init() {
    // await this.loadCache();
    return super.init().then(rs => {
      const addButton = this.actionButtonList.find(f => f.name === 'add');
      if (addButton) {
        addButton.label = this.commonService.translateText('Collaborator.Commission.label');
        addButton.icon = 'flash-outline';
        addButton.status = 'primary';
        // addButton.click = () => {
        //   this.commonService.openDialog(CollaboartorCommissionDetailComponent, {
        //     context: {

        //     }
        //   })
        // };
      }
      return rs;
    });
  }

  editing = {};
  rows = [];

  loadListSetting(): SmartTableSetting {
    return this.configSetting({
      mode: 'external',
      selectMode: 'multi',
      actions: {
        position: 'right',
      },
      add: this.configAddButton(),
      edit: this.configEditButton(),
      delete: this.configDeleteButton(),
      pager: this.configPaging(),
      columns: {
        No: {
          title: 'No.',
          type: 'string',
          width: '5%',
          filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
        },
        // Cycle: {
        //   title: this.commonService.textTransform(this.commonService.translate.instant('Common.cycle'), 'head-title'),
        //   type: 'string',
        //   width: '5%',
        //   filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
        // },
        PublisherName: {
          title: this.commonService.textTransform(this.commonService.translate.instant('Common.Object.title'), 'head-title'),
          type: 'string',
          width: '10%',
          filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
        },
        Description: {
          title: this.commonService.textTransform(this.commonService.translate.instant('Common.description'), 'head-title'),
          type: 'string',
          width: '25%',
          filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
        },
        RelativeVouchers: {
          title: this.commonService.textTransform(this.commonService.translate.instant('Common.relationVoucher'), 'head-title'),
          type: 'custom',
          renderComponent: SmartTableTagsComponent,
          onComponentInitFunction: (instance: SmartTableTagsComponent) => {
            instance.click.subscribe((tag: { id: string, text: string, type: string }) => this.commonService.previewVoucher(tag.type, tag.id));
          },
          width: '10%',
        },
        Code: {
          title: this.commonService.textTransform(this.commonService.translate.instant('Common.code'), 'head-title'),
          type: 'string',
          width: '10%',
        },
        CommissionFrom: {
          title: this.commonService.textTransform(this.commonService.translate.instant('Common.fromDate'), 'head-title'),
          type: 'datetime',
          width: '10%',
        },
        CommissionTo: {
          title: this.commonService.textTransform(this.commonService.translate.instant('Common.toDate'), 'head-title'),
          type: 'datetime',
          width: '10%',
        },
        Amount: {
          title: this.commonService.textTransform(this.commonService.translate.instant('Common.numOfMoney'), 'head-title'),
          type: 'custom',
          class: 'align-right',
          width: '10%',
          position: 'right',
          renderComponent: SmartTableCurrencyComponent,
          onComponentInitFunction: (instance: SmartTableCurrencyComponent) => {
            // instance.format$.next('medium');
            instance.style = 'text-align: right';
          },
        },
        State: {
          title: this.commonService.translateText('Common.approve'),
          type: 'custom',
          width: '5%',
          // class: 'align-right',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'checkmark-circle';
            instance.display = true;
            instance.status = 'success';
            // instance.disabled = this.isChoosedMode;
            instance.title = this.commonService.translateText('Common.approved');
            instance.label = this.commonService.translateText('Common.approved');
            instance.init.subscribe(awardVoucher => {
              const processMap = AppModule.processMaps.commissionVoucher[awardVoucher.State || ''];
              instance.label = this.commonService.translateText(processMap?.label);
              instance.status = processMap?.status;
              instance.outline = processMap?.outline;
              instance.disabled = !this.commonService.checkPermission(this.componentName, processMap.nextState);
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: CollaboratorCommissionVoucherModel) => {
              // this.apiService.getPromise<CollaboratorCommissionVoucherModel[]>(this.apiPath, { id: [rowData.Code], includeContact: true, includeDetails: true, useBaseTimezone: true }).then(rs => {
              this.preview([rowData['Code']]);
              // });
            });
          },
        },
        Permission: {
          title: this.commonService.translateText('Common.permission'),
          type: 'custom',
          width: '5%',
          class: 'align-right',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'shield';
            instance.display = true;
            instance.status = 'danger';
            instance.style = 'text-align: right';
            instance.class = 'align-right';
            instance.title = this.commonService.translateText('Common.preview');
            instance.valueChange.subscribe(value => {
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: CollaboratorCommissionVoucherModel) => {

              this.commonService.openDialog(ResourcePermissionEditComponent, {
                context: {
                  inputMode: 'dialog',
                  inputId: [rowData.Code],
                  note: 'Click vào nút + để thêm 1 phân quyền, mỗi phân quyền bao gồm người được phân quyền và các quyền mà người đó được thao tác',
                  resourceName: this.commonService.translateText('Sales.PriceReport.title', { action: '', definition: '' }) + ` ${rowData.Title || ''}`,
                  apiPath: this.apiPath,
                }
              });
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
            instance.title = this.commonService.translateText('Common.preview');
            instance.valueChange.subscribe(value => {
              // instance.icon = value ? 'unlock' : 'lock';
              // instance.status = value === 'REQUEST' ? 'warning' : 'success';
              // instance.disabled = value !== 'REQUEST';
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: CollaboratorCommissionVoucherModel) => {
              this.getFormData([rowData.Code]).then(rs => {
                this.preview(rs);
              });
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

  initDataSource() {
    const source = super.initDataSource();

    // Set DataSource: prepareData
    // source.prepareData = (data: UserGroupModel[]) => {
    //   // const paging = source.getPaging();
    //   // data.map((product: any, index: number) => {
    //   //   product['No'] = (paging.page - 1) * paging.perPage + index + 1;
    //   //   return product;
    //   // });
    //   return data;
    // };

    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {
      // params['includeParent'] = true;
      params['includeRelativeVouchers'] = true;
      params['sort_Created'] = 'desc';
      // params['eq_Type'] = 'RECEIPT';
      if (this.filter) {
        for (const key in this.filter) {
          params[key] = this.filter[key];
        }
      }
      return params;
    };

    return source;
  }

  /** Api get funciton */
  // executeGet(params: any, success: (resources: UserGroupModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: UserGroupModel[] | HttpErrorResponse) => void) {
  //   params['includeCategories'] = true;
  //   super.executeGet(params, success, error, complete);
  // }

  getList(callback: (list: UserGroupModel[]) => void) {
    super.getList((rs) => {
      // rs.map((product: any) => {
      //   product['Unit'] = product['Unit']['Name'];
      //   if (product['Categories']) {
      //     product['CategoriesRendered'] = product['Categories'].map(cate => cate['text']).join(', ');
      //   }
      //   return product;
      // });
      if (callback) callback(rs);
    });
  }

  async getFormData(ids: string[]) {
    return this.apiService.getPromise<CollaboratorCommissionVoucherModel[]>(this.apiPath, { id: ids, includeContact: true, includeDetails: true });
  }

  async preview(ids: any[]) {
    this.commonService.openDialog(CollaboratorCommissionPrintComponent, {
      context: {
        showLoadinng: true,
        title: 'Xem trước',
        id: typeof ids[0] === 'string' ? ids as any : null,
        data: typeof ids[0] !== 'string' ? ids as any : null,
        idKey: ['Code'],
        sourceOfDialog: 'list',
        // approvedConfirm: true,
        onClose: (data: CollaboratorCommissionVoucherModel) => {
          this.refresh();
        },
      },
    });
    return false;
  }

  changeStateConfirm(data: CollaboratorCommissionVoucherModel) {
    const params = { id: [data.Code] };
    const processMap: ProcessMap = AppModule.processMaps.commissionVoucher[data.State || ''];
    params['changeState'] = processMap?.nextState;

    return new Promise(resolve => {
      this.commonService.showDialog(this.commonService.translateText('Common.confirm'), this.commonService.translateText(processMap?.confirmText, { object: this.commonService.translateText('CommerceServiceByCycle.ServieByCycle.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
        {
          label: this.commonService.translateText('Common.goback'),
          status: 'primary',
          action: () => {
            resolve(false);
          },
        },
        {
          label: this.commonService.translateText(processMap?.nextStateLabel),
          status: AppModule.processMaps.commerceServiceByCycle[processMap.nextState || ''].status,
          action: async () => {
            this.loading = true;
            return this.apiService.putPromise<CollaboratorCommissionVoucherModel[]>(this.apiPath, params, [{ Code: data.Code }]).then(rs => {
              this.loading = false;
              this.commonService.showToast(this.commonService.translateText(processMap?.responseText, { object: this.commonService.translateText('Phân quyền', { definition: '', action: '' }) + ': `' + data.Title + '`' }), this.commonService.translateText(processMap?.responseTitle), {
                status: 'success',
              });
              resolve(true);
              return true;
            }).catch(err => {
              this.loading = false;
              resolve(false);
              return false;
            });
          },
        },
      ], () => {
        resolve(false);
      });
    });
  }

}
