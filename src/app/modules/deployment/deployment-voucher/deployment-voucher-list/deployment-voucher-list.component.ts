import { MobileAppService } from './../../../mobile-app/mobile-app.service';
// import { DeploymentModule } from './../../deployment.module';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { takeUntil } from 'rxjs/operators';
import { SmartTableDateTimeComponent, SmartTableButtonComponent, SmartTableTagsComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableDateTimeRangeFilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { ResourcePermissionEditComponent } from '../../../../lib/lib-system/components/resource-permission-edit/resource-permission-edit.component';
import { DeploymentVoucherModel } from '../../../../models/deployment.model';
import { UserGroupModel } from '../../../../models/user-group.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { DeploymentVoucherFormComponent } from '../deployment-voucher-form/deployment-voucher-form.component';
import { DeploymentVoucherPrintComponent } from '../deployment-voucher-print/deployment-voucher-print.component';
import { AppModule } from '../../../../app.module';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';

@Component({
  selector: 'ngx-deployment-voucher-list',
  templateUrl: './deployment-voucher-list.component.html',
  styleUrls: ['./deployment-voucher-list.component.scss']
})
export class DeploymentVoucherListComponent extends ServerDataManagerListComponent<DeploymentVoucherModel> implements OnInit {

  componentName: string = 'DeploymentVoucherListComponent';
  formPath = '/deployment/voucher/form';
  apiPath = '/deployment/vouchers';
  idKey = 'Code';
  formDialog = DeploymentVoucherFormComponent;
  printDialog = DeploymentVoucherPrintComponent;

  reuseDialog = true;
  static _dialog: NbDialogRef<DeploymentVoucherListComponent>;

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
    public ref: NbDialogRef<DeploymentVoucherListComponent>,
    public mobileAppService: MobileAppService,
  ) {
    super(apiService, router, commonService, dialogService, toastService, ref);
  }

  async init() {
    return super.init();
  }

  editing = {};
  rows = [];

  stateDic = {
    APPROVED: { label: this.commonService.translateText('Common.approved'), status: 'success', outline: false },
    DEPLOYMENT: { label: this.commonService.translateText('Common.implement'), status: 'warning', outline: false },
    // ACCEPTANCEREQUEST: { label: this.commonService.translateText('Common.completeRequest'), status: 'primary', outline: false },
    ACCEPTANCE: { label: this.commonService.translateText('Common.acceptance'), status: 'info', outline: false },
    COMPLETE: { label: this.commonService.translateText('Common.completed'), status: 'success', outline: true },
    CANCEL: { label: this.commonService.translateText('Common.cancel'), status: 'info', outline: true },
  };

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
        ObjectName: {
          title: this.commonService.textTransform(this.commonService.translate.instant('Common.Object.title'), 'head-title'),
          type: 'string',
          width: '20%',
          filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
        },
        Title: {
          title: this.commonService.textTransform(this.commonService.translate.instant('Common.title'), 'head-title'),
          type: 'string',
          width: '40%',
          filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
        },
        // RelationVoucher: {
        //   title: this.commonService.textTransform(this.commonService.translate.instant('Common.relationVoucher'), 'head-title'),
        //   type: 'string',
        //   width: '20%',
        // },
        Code: {
          title: this.commonService.textTransform(this.commonService.translate.instant('Common.code'), 'head-title'),
          type: 'string',
          width: '5%',
        },
        Creator: {
          title: this.commonService.textTransform(this.commonService.translate.instant('Common.creator'), 'head-title'),
          type: 'string',
          width: '10%',
          // filter: {
          //   type: 'custom',
          //   component: SmartTableDateTimeRangeFilterComponent,
          // },
          valuePrepareFunction: (cell: string, row?: any) => {
            return this.commonService.getObjectText(cell);
          },
        },
        Created: {
          title: this.commonService.textTransform(this.commonService.translate.instant('Common.created'), 'head-title'),
          type: 'custom',
          width: '8%',
          filter: {
            type: 'custom',
            component: SmartTableDateTimeRangeFilterComponent,
          },
          renderComponent: SmartTableDateTimeComponent,
          onComponentInitFunction: (instance: SmartTableDateTimeComponent) => {
            // instance.format$.next('medium');
          },
        },
        // Amount: {
        //   title: this.commonService.textTransform(this.commonService.translate.instant('Common.numOfMoney'), 'head-title'),
        //   type: 'custom',
        //   class: 'align-right',
        //   width: '10%',
        //   position: 'right',
        //   renderComponent: SmartTableCurrencyComponent,
        //   onComponentInitFunction: (instance: SmartTableCurrencyComponent) => {
        //     // instance.format$.next('medium');
        //     instance.style = 'text-align: right';
        //   },
        // },
        RelativeVouchers: {
          title: this.commonService.textTransform(this.commonService.translate.instant('Common.relationVoucher'), 'head-title'),
          type: 'custom',
          renderComponent: SmartTableTagsComponent,
          onComponentInitFunction: (instance: SmartTableTagsComponent) => {
            instance.click.subscribe((tag: { id: string, text: string, type: string }) => this.commonService.previewVoucher(tag.type, tag.id));
          },
          width: '15%',
        },
        Task: {
          title: 'Task',
          type: 'custom',
          width: '10%',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'message-circle';
            // instance.label = this.commonService.translateText('Common.copy');
            instance.display = true;
            instance.status = 'info';
            instance.valueChange.subscribe(value => {
              // if (value) {
              //   instance.disabled = false;
              // } else {
              //   instance.disabled = true;
              // }
            });
            instance.click.subscribe(async (row: DeploymentVoucherModel) => {

              this.apiService.getPromise<DeploymentVoucherModel[]>('/deployment/vouchers/' + row.Code, { includeRelatedTasks: true }).then(rs => {
                const priceReport = rs[0];
                if (priceReport && priceReport['Tasks'] && priceReport['Tasks'].length > 0) {
                  this.commonService.openMobileSidebar();
                  this.mobileAppService.openChatRoom({ ChatRoom: priceReport['Tasks'][0]?.Task });
                } else {

                  this.commonService.showDialog(this.commonService.translateText('Common.warning'), this.commonService.translateText('Chưa có task cho phiếu triển khai này, bạn có muốn tạo ngây bây giờ không ?'), [
                    {
                      label: this.commonService.translateText('Common.goback'),
                      status: 'danger',
                      icon: 'arrow-ios-back',
                    },
                    {
                      label: this.commonService.translateText('Common.create'),
                      status: 'success',
                      icon: 'message-circle-outline',
                      action: () => {
                        this.apiService.putPromise<DeploymentVoucherModel[]>('/deployment/vouchers', { createTask: true }, [{ Code: row?.Code }]).then(rs => {
                          if (rs && rs[0] && rs[0]['Tasks'] && rs[0]['Tasks'].length > 0)
                            this.commonService.toastService.show(this.commonService.translateText('đã tạo task cho phiếu triển khai'),
                              this.commonService.translateText('Common.notification'), {
                              status: 'success',
                            });
                          this.commonService.openMobileSidebar();
                          this.mobileAppService.openChatRoom({ ChatRoom: rs[0]['Tasks'][0]?.Task });
                        });
                      }
                    },
                  ]);

                  // this.commonService.toastService.show(this.commonService.translateText('chưa có liên kết với nhiệm vụ nào'), this.commonService.translateText('Thông báo'), {
                  //   status: 'warning',
                  // })
                }
              }).catch(err => {
                return Promise.reject(err);
              });

              // this.commonService.openDialog(DeploymentVoucherFormComponent, {
              //   context: {
              //     inputMode: 'dialog',
              //     inputId: [row.Code],
              //     isDuplicate: true,
              //     onDialogSave: (newData: DeploymentVoucherModel[]) => {
              //       // if (onDialogSave) onDialogSave(row);
              //     },
              //     onDialogClose: () => {
              //       // if (onDialogClose) onDialogClose();
              //       this.refresh();
              //     },
              //   },
              // });

            });
          },
        },
        // Copy: {
        //   title: 'Copy',
        //   type: 'custom',
        //   width: '10%',
        //   renderComponent: SmartTableButtonComponent,
        //   onComponentInitFunction: (instance: SmartTableButtonComponent) => {
        //     instance.iconPack = 'eva';
        //     instance.icon = 'copy';
        //     // instance.label = this.commonService.translateText('Common.copy');
        //     instance.display = true;
        //     instance.status = 'warning';
        //     instance.valueChange.subscribe(value => {
        //       // if (value) {
        //       //   instance.disabled = false;
        //       // } else {
        //       //   instance.disabled = true;
        //       // }
        //     });
        //     instance.click.subscribe(async (row: DeploymentVoucherModel) => {

        //       this.commonService.openDialog(DeploymentVoucherFormComponent, {
        //         context: {
        //           inputMode: 'dialog',
        //           inputId: [row.Code],
        //           isDuplicate: true,
        //           onDialogSave: (newData: DeploymentVoucherModel[]) => {
        //             // if (onDialogSave) onDialogSave(row);
        //           },
        //           onDialogClose: () => {
        //             // if (onDialogClose) onDialogClose();
        //             this.refresh();
        //           },
        //         },
        //       });

        //     });
        //   },
        // },
        State: {
          title: this.commonService.translateText('Common.state'),
          type: 'custom',
          width: '5%',
          // class: 'align-right',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'checkmark-circle';
            instance.display = true;
            instance.status = 'success';
            // instance.style = 'text-align: right';
            // instance.class = 'align-right';
            instance.title = this.commonService.translateText('Common.approved');
            instance.label = this.commonService.translateText('Common.approved');
            instance.valueChange.subscribe(value => {
              const processMap = AppModule.processMaps.deploymentVoucher[value || ''];
              instance.label = this.commonService.translateText(processMap?.label);// this.stateDic[value]?.label || this.commonService.translateText('Common.notJustApproved');
              instance.status = processMap?.status;//this.stateDic[value]?.status || 'danger';
              instance.outline = processMap.outline;//this.stateDic[value]?.outline || false;
              // instance.disabled = (value === 'APPROVE');
              // instance.icon = value ? 'unlock' : 'lock';
              // instance.status = value === 'REQUEST' ? 'warning' : 'success';
              // instance.disabled = value !== 'REQUEST';
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: DeploymentVoucherModel) => {
              // this.getFormData([rowData.Code]).then(rs => {
                this.preview([rowData], 'list');
              // });
              // this.apiService.getPromise<DeploymentVoucherModel[]>(this.apiPath, { id: [rowData.Code], includeContact: true, includeDetails: true, useBaseTimezone: true }).then(rs => {
              //   this.preview(rs);
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
              // instance.icon = value ? 'unlock' : 'lock';
              // instance.status = value === 'REQUEST' ? 'warning' : 'success';
              // instance.disabled = value !== 'REQUEST';
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: DeploymentVoucherModel) => {

              this.commonService.openDialog(ResourcePermissionEditComponent, {
                context: {
                  inputMode: 'dialog',
                  inputId: [rowData.Code],
                  note: 'Click vào nút + để thêm 1 phân quyền, mỗi phân quyền bao gồm người được phân quyền và các quyền mà người đó được thao tác',
                  resourceName: this.commonService.translateText('Deployment.Voucher.title', { action: '', definition: '' }) + ` ${rowData.Title || ''}`,
                  // resrouce: rowData,
                  apiPath: this.apiPath,
                }
              });

              // this.getFormData([rowData.Code]).then(rs => {
              //   this.preview(rs);
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
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: DeploymentVoucherModel) => {
              // this.getFormData([rowData.Code]).then(rs => {
                this.preview([rowData], 'list');
              // });
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

  async getFormData(ids: string[]) {
    return this.apiService.getPromise<DeploymentVoucherModel[]>(this.apiPath, { id: ids, includeContact: true, includeDetails: true, useBaseTimezone: true });
  }

  initDataSource() {
    const source = super.initDataSource();

    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {
      params['includeCreator'] = true;
      params['includeRelativeVouchers'] = true;
      params['sort_Id'] = 'desc';
      // params['eq_Type'] = 'PAYMENT';
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

  // preview(data: DeploymentVoucherModel[], source?: string) {
  //   this.commonService.openDialog(DeploymentVoucherPrintComponent, {
  //     context: {
  //       showLoadinng: true,
  //       title: 'Xem trước',
  //       data: data,
  //       sourceOfDialog: source,
  //       idKey: ['Code'],
  //       // approvedConfirm: true,
  //       onChange: (data: DeploymentVoucherModel) => {
  //         this.refresh();
  //       },
  //       // onSaveAndClose: () => {
  //       //   this.refresh();
  //       // },
  //     },
  //   });
  //   return false;
  // }

}
