import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { filter, take, takeUntil } from 'rxjs/operators';
import { AppModule } from '../../../../app.module';
import { SmartTableDateTimeComponent, SmartTableTagsComponent, SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableDateTimeRangeFilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { ResourcePermissionEditComponent } from '../../../../lib/lib-system/components/resource-permission-edit/resource-permission-edit.component';
import { CollaboratorOrderModel, CollaboratorPageModel } from '../../../../models/collaborator.model';
import { PriceReportModel } from '../../../../models/price-report.model';
import { UserGroupModel } from '../../../../models/user-group.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { MobileAppService } from '../../../mobile-app/mobile-app.service';
import { SalesPriceReportListComponent } from '../../../sales/price-report/sales-price-report-list/sales-price-report-list.component';
import { SalesPriceReportPrintComponent } from '../../../sales/price-report/sales-price-report-print/sales-price-report-print.component';
import { CollaboratorService } from '../../collaborator.service';
import { CollaboratorOrderFormComponent } from '../collaborator-order-form/collaborator-order-form.component';
import { CollaboratorOrderPrintComponent } from '../collaborator-order-print/collaborator-order-print.component';

@Component({
  selector: 'ngx-collaborator-order-list',
  templateUrl: './collaborator-order-list.component.html',
  styleUrls: ['./collaborator-order-list.component.scss']
})
export class CollaboratorOrderListComponent extends ServerDataManagerListComponent<CollaboratorOrderModel> implements OnInit {

  componentName: string = 'CollaboratorOrderListComponent';
  formPath = '/sales/order/form';
  apiPath = '/collaborator/orders';
  idKey = 'Code';
  formDialog = CollaboratorOrderFormComponent;

  reuseDialog = true;
  static _dialog: NbDialogRef<CollaboratorOrderListComponent>;

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
    public ref: NbDialogRef<SalesPriceReportListComponent>,
    public mobileAppService: MobileAppService,
    public collaboratorService: CollaboratorService,
  ) {
    super(apiService, router, commonService, dialogService, toastService, ref);
  }

  async init() {
    return super.init().then(rs => {
      // Add page choosed
      this.collaboratorService.pageList$.pipe(take(1), filter(f => f && f.length > 0)).toPromise().then(pageList => {
        this.actionButtonList.unshift({
          type: 'select2',
          name: 'pbxdomain',
          status: 'success',
          label: 'Select page',
          icon: 'plus',
          title: this.commonService.textTransform(this.commonService.translate.instant('Common.createNew'), 'head-title'),
          size: 'medium',
          select2: {
            data: pageList, option: {
              placeholder: 'Chọn trang...',
              allowClear: true,
              width: '100%',
              dropdownAutoWidth: true,
              minimumInputLength: 0,
              keyMap: {
                id: 'id',
                text: 'text',
              },
            }
          },
          value: () => this.collaboratorService.currentpage$.value,
          change: (value: any, option: any) => {
            this.onChangePage(value);
          },
          disabled: () => {
            return false;
          },
          click: () => {
            // this.gotoForm();
            return false;
          },
        });
      });
      return rs;
    });
  }

  editing = {};
  rows = [];

  stateDic = {
    APPROVE: { label: this.commonService.translateText('Common.approved'), status: 'success', outline: false },
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
      actions: this.isChoosedMode ? false : {
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
          width: '20%',
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
          width: '10%',
        },
        Publisher: {
          title: this.commonService.textTransform(this.commonService.translate.instant('Collaborator.Publisher.label'), 'head-title'),
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
        DateOfOrder: {
          title: this.commonService.textTransform(this.commonService.translate.instant('Common.created'), 'head-title'),
          type: 'custom',
          width: '15%',
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
          width: '20%',
        },
        // Task: {
        //   title: 'Task',
        //   type: 'custom',
        //   width: '10%',
        //   renderComponent: SmartTableButtonComponent,
        //   onComponentInitFunction: (instance: SmartTableButtonComponent) => {
        //     instance.iconPack = 'eva';
        //     instance.icon = 'message-circle';
        //     // instance.label = this.commonService.translateText('Common.copy');
        //     instance.display = true;
        //     instance.status = 'info';
        //     instance.valueChange.subscribe(value => {
        //       // if (value) {
        //       //   instance.disabled = false;
        //       // } else {
        //       //   instance.disabled = true;
        //       // }
        //     });

        //     // instance.valueChange.subscribe(rowData => {

        //     //   if (instance.rowData?.Code === 'PBG09721100') {
        //     //     setInterval(() => {
        //     //       console.log(instance.disabled);
        //     //       // this.disabled = !this.disabled;
        //     //     }, 1000);
        //     //   }
        //     // });


        //     instance.click.subscribe(async (row: CollaboratorOrderModel) => {

        //       this.apiService.getPromise<PriceReportModel[]>('/sales/price-reports/' + row.Code, { includeRelatedTasks: true }).then(rs => {
        //         const priceReport = rs[0];
        //         if (priceReport && priceReport['Tasks'] && priceReport['Tasks'].length > 0) {
        //           this.commonService.openMobileSidebar();
        //           this.mobileAppService.openChatRoom({ ChatRoom: priceReport['Tasks'][0]?.Task });
        //         } else {
        //           this.commonService.showDiaplog(this.commonService.translateText('Common.warning'), this.commonService.translateText('Chưa có task cho phiếu triển khai này, bạn có muốn tạo ngây bây giờ không ?'), [
        //             {
        //               label: this.commonService.translateText('Common.goback'),
        //               status: 'danger',
        //               icon: 'arrow-ios-back',
        //             },
        //             {
        //               label: this.commonService.translateText('Common.create'),
        //               status: 'success',
        //               icon: 'message-circle-outline',
        //               action: () => {
        //                 this.apiService.putPromise<PriceReportModel[]>('/sales/price-reports', { createTask: true }, [{ Code: row?.Code }]).then(rs => {
        //                   if (rs && rs[0] && rs[0]['Tasks'] && rs[0]['Tasks'].length > 0)
        //                     this.commonService.toastService.show(this.commonService.translateText('đã tạo task cho báo giá'),
        //                       this.commonService.translateText('Common.notification'), {
        //                       status: 'success',
        //                     });
        //                   this.commonService.openMobileSidebar();
        //                   this.mobileAppService.openChatRoom({ ChatRoom: rs[0]['Tasks'][0]?.Task });
        //                 });
        //               }
        //             },
        //           ]);
        //         }

        //       }).catch(err => {
        //         return Promise.reject(err);
        //       });

        //       // this.commonService.openDialog(SalesPriceReportFormComponent, {
        //       //   context: {
        //       //     inputMode: 'dialog',
        //       //     inputId: [row.Code],
        //       //     isDuplicate: true,
        //       //     onDialogSave: (newData: CollaboratorOrderModel[]) => {
        //       //       // if (onDialogSave) onDialogSave(row);
        //       //     },
        //       //     onDialogClose: () => {
        //       //       // if (onDialogClose) onDialogClose();
        //       //       this.refresh();
        //       //     },
        //       //   },
        //       // });

        //     });
        //   },
        // },
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
        //     instance.click.subscribe(async (row: CollaboratorOrderModel) => {

        //       this.commonService.openDialog(SalesPriceReportFormComponent, {
        //         context: {
        //           inputMode: 'dialog',
        //           inputId: [row.Code],
        //           isDuplicate: true,
        //           onDialogSave: (newData: CollaboratorOrderModel[]) => {
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
              const processMap = AppModule.processMaps.priceReport[value || ''];
              instance.label = this.commonService.translateText(processMap?.label);
              instance.status = processMap?.status;
              instance.outline = processMap.outline;
              // instance.disabled = (value === 'APPROVE');
              // instance.icon = value ? 'unlock' : 'lock';
              // instance.status = value === 'REQUEST' ? 'warning' : 'success';
              // instance.disabled = value !== 'REQUEST';
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: CollaboratorOrderModel) => {
              // this.apiService.getPromise<CollaboratorOrderModel[]>(this.apiPath, { id: [rowData.Code], includeContact: true, includeDetails: true, includeTax: true, useBaseTimezone: true }).then(rs => {
              this.preview([rowData]);
              // });
            });
          },
        },
        // Permission: {
        //   title: this.commonService.translateText('Common.permission'),
        //   type: 'custom',
        //   width: '5%',
        //   class: 'align-right',
        //   renderComponent: SmartTableButtonComponent,
        //   onComponentInitFunction: (instance: SmartTableButtonComponent) => {
        //     instance.iconPack = 'eva';
        //     instance.icon = 'shield';
        //     instance.display = true;
        //     instance.status = 'danger';
        //     instance.style = 'text-align: right';
        //     instance.class = 'align-right';
        //     instance.title = this.commonService.translateText('Common.preview');
        //     instance.valueChange.subscribe(value => {
        //       // instance.icon = value ? 'unlock' : 'lock';
        //       // instance.status = value === 'REQUEST' ? 'warning' : 'success';
        //       // instance.disabled = value !== 'REQUEST';
        //     });
        //     instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: CollaboratorOrderModel) => {

        //       this.commonService.openDialog(ResourcePermissionEditComponent, {
        //         context: {
        //           inputMode: 'dialog',
        //           inputId: [rowData.Code],
        //           note: 'Click vào nút + để thêm 1 phân quyền, mỗi phân quyền bao gồm người được phân quyền và các quyền mà người đó được thao tác',
        //           resourceName: this.commonService.translateText('Sales.PriceReport.title', { action: '', definition: '' }) + ` ${rowData.Title || ''}`,
        //           // resrouce: rowData,
        //           apiPath: '/sales/price-reports',
        //         }
        //       });

        //       // this.getFormData([rowData.Code]).then(rs => {
        //       //   this.preview(rs);
        //       // });
        //     });
        //   },
        // },
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
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: CollaboratorOrderModel) => {
              // this.apiService.getPromise<CollaboratorOrderModel[]>('/sales/price-reports', { id: [rowData.Code], includeContact: true, includeDetails: true, includeTax: true, useBaseTimezone: true }).then(rs => {
              this.preview([rowData]);
              // });
              // this.getFormData([rowData.Code]).then(rs => {
              //   this.preview(rs, 'list');
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
    return this.apiService.getPromise<CollaboratorOrderModel[]>('/sales/price-reports', { id: ids, includeContact: true, includeDetails: true, useBaseTimezone: true });
  }

  initDataSource() {
    const source = super.initDataSource();

    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {
      params['includeCreator'] = true;
      params['includeRelativeVouchers'] = true;
      params['sort_Id'] = 'desc';
      params['page'] = this.collaboratorService?.currentpage$?.value || null;
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

  preview(data: CollaboratorOrderModel[], source?: string) {
    this.commonService.openDialog(CollaboratorOrderPrintComponent, {
      context: {
        showLoadinng: true,
        title: 'Xem trước',
        // data: data,
        // id: data.map(m => m[this.idKey]),
        id: data.map(item => this.makeId(item)),
        sourceOfDialog: 'list',
        mode: 'print',
        idKey: ['Code'],
        // approvedConfirm: true,
        onChange: (data: CollaboratorOrderModel) => {
          this.refresh();
        },
        onSaveAndClose: () => {
          this.refresh();
        },
        // onSaveAndClose: () => {
        //   this.refresh();
        // },
      },
    });
    return false;
  }

  onChangePage(page: CollaboratorPageModel) {
    this.collaboratorService.currentpage$.next(this.commonService.getObjectId(page));
    this.commonService.takeOnce(this.componentName + '_on_domain_changed', 1000).then(() => {
      this.refresh();
    });
  }

}
