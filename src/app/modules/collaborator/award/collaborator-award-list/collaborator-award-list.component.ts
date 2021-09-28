import { State } from '../../../mobile-app/f7pages/messages.page';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { takeUntil } from 'rxjs/operators';
import { AppModule } from '../../../../app.module';
import { SmartTableDateTimeComponent, SmartTableCurrencyComponent, SmartTableButtonComponent, SmartTableTagsComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableDateTimeRangeFilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { ResourcePermissionEditComponent } from '../../../../lib/lib-system/components/resource-permission-edit/resource-permission-edit.component';
import { CollaboratorAwardVoucherModel } from '../../../../models/collaborator.model';
import { UserGroupModel } from '../../../../models/user-group.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { CollaboratorAwardFormComponent } from '../collaborator-award-form/collaborator-award-form.component';
import { CollaboratorAwardPrintComponent } from '../collaborator-award-print/collaborator-award-print.component';
import { CollaboartorAwardDetailComponent } from '../collaborator-award-form/collaboartor-award-detail/collaboartor-award-detail.component';

@Component({
  selector: 'ngx-collaborator-award-list',
  templateUrl: './collaborator-award-list.component.html',
  styleUrls: ['./collaborator-award-list.component.scss']
})
export class CollaboratorAwardListComponent extends ServerDataManagerListComponent<CollaboratorAwardVoucherModel> implements OnInit {

  componentName: string = 'CollaboratorAwardListComponent';
  formPath = '/collaborator/award-voucher/form';
  apiPath = '/collaborator/award-vouchers';
  idKey = 'Code';
  formDialog = CollaboratorAwardFormComponent;

  reuseDialog = true;
  static _dialog: NbDialogRef<CollaboratorAwardListComponent>;

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
    public ref: NbDialogRef<CollaboratorAwardListComponent>,
  ) {
    super(apiService, router, commonService, dialogService, toastService, ref);
  }

  async init() {
    // await this.loadCache();
    return super.init().then(rs => {
      const addButton = this.actionButtonList.find(f => f.name === 'add');
      if (addButton) {
        addButton.label = this.commonService.translateText('Collaborator.Award.label');
        addButton.icon = 'flash-outline';
        addButton.status = 'primary';
        // addButton.click = () => {
        //   this.commonService.openDialog(CollaboartorAwardDetailComponent, {
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
        PublisherName: {
          title: this.commonService.textTransform(this.commonService.translate.instant('Common.Object.title'), 'head-title'),
          type: 'string',
          width: '15%',
          filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
        },
        Description: {
          title: this.commonService.textTransform(this.commonService.translate.instant('Common.description'), 'head-title'),
          type: 'string',
          width: '20%',
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
        Created: {
          title: this.commonService.textTransform(this.commonService.translate.instant('Common.created'), 'head-title'),
          type: 'custom',
          width: '10%',
          filter: {
            type: 'custom',
            component: SmartTableDateTimeRangeFilterComponent,
          },
          renderComponent: SmartTableDateTimeComponent,
          onComponentInitFunction: (instance: SmartTableDateTimeComponent) => {
            // instance.format$.next('medium');
          },
        },
        DateOfVoucher: {
          title: this.commonService.textTransform(this.commonService.translate.instant('Collaborator.Award.awardTo'), 'head-title'),
          type: 'custom',
          width: '10%',
          filter: {
            type: 'custom',
            component: SmartTableDateTimeRangeFilterComponent,
          },
          renderComponent: SmartTableDateTimeComponent,
          onComponentInitFunction: (instance: SmartTableDateTimeComponent) => {
            // instance.format$.next('medium');
          },
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
              const processMap = AppModule.processMaps.awardVoucher[awardVoucher.State || ''];
              instance.label = this.commonService.translateText(processMap?.label);
              instance.status = processMap?.status;
              instance.outline = processMap?.outline;
              instance.disabled = !this.commonService.checkPermission(this.componentName, processMap.nextState);
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: CollaboratorAwardVoucherModel) => {
              // this.apiService.getPromise<CollaboratorAwardVoucherModel[]>(this.apiPath, { id: [rowData.Code], includeContact: true, includeDetails: true, useBaseTimezone: true }).then(rs => {
              this.preview([rowData['Code']]);
              // });
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
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: CollaboratorAwardVoucherModel) => {
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
    return this.apiService.getPromise<CollaboratorAwardVoucherModel[]>(this.apiPath, { id: ids, includeContact: true, includeDetails: true });
  }

  preview(ids: any[]) {
    this.commonService.openDialog(CollaboratorAwardPrintComponent, {
      context: {
        showLoadinng: true,
        title: 'Xem trước',
        id: typeof ids[0] === 'string' ? ids as any : null,
        data: typeof ids[0] !== 'string' ? ids as any : null,
        idKey: ['Code'],
        // approvedConfirm: true,
        onClose: (data: CollaboratorAwardVoucherModel) => {
          this.refresh();
        },
      },
    });
    return false;
  }

}
