// import { SalesModule } from './../../sales.module';
import { ProcessMap } from './../../../../models/process-map.model';
import { MobileAppService } from './../../../mobile-app/mobile-app.service';
import { PriceReportModel } from './../../../../models/price-report.model';
import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { SalesPriceReportDetailModel, SalesPriceReportModel, SalesVoucherModel } from '../../../../models/sales.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { SalesPriceReportFormComponent } from '../sales-price-report-form/sales-price-report-form.component';
import { SmartTableButtonComponent, SmartTableDateTimeComponent, SmartTableRelativeVouchersComponent, SmartTableTagsComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { takeUntil } from 'rxjs/operators';
import { SmartTableDateRangeFilterComponent, SmartTableDateTimeRangeFilterComponent, SmartTableSelect2FilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { UserGroupModel } from '../../../../models/user-group.model';
import { SalesPriceReportPrintComponent } from '../sales-price-report-print/sales-price-report-print.component';
import { TaxModel } from '../../../../models/tax.model';
import { UnitModel } from '../../../../models/unit.model';
import { ResourcePermissionEditComponent } from '../../../../lib/lib-system/components/resource-permission-edit/resource-permission-edit.component';
import { AppModule } from '../../../../app.module';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';

@Component({
  selector: 'ngx-sales-price-report-list',
  templateUrl: './sales-price-report-list.component.html',
  styleUrls: ['./sales-price-report-list.component.scss'],
})
export class SalesPriceReportListComponent extends ServerDataManagerListComponent<SalesPriceReportModel> implements OnInit {

  componentName: string = 'SalesPriceReportListComponent';
  formPath = '/sales/price-report/form';
  apiPath = '/sales/price-quotations';
  idKey = 'Code';
  formDialog = SalesPriceReportFormComponent;
  printDialog = SalesPriceReportPrintComponent;

  reuseDialog = true;
  static _dialog: NbDialogRef<SalesPriceReportListComponent>;

  // Smart table
  static filterConfig: any;
  static sortConf: any;
  static pagingConf = { page: 1, perPage: 40 };

  constructor(
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<SalesPriceReportListComponent>,
    public mobileAppService: MobileAppService
  ) {
    super(apiService, router, cms, dialogService, toastService, ref);
  }

  async init() {
    return super.init();
  }

  editing = {};
  rows = [];

  stateDic = {
    APPROVED: { label: this.cms.translateText('Common.approved'), status: 'success', outline: false },
    DEPLOYMENT: { label: this.cms.translateText('Common.implement'), status: 'warning', outline: false },
    // ACCEPTANCEREQUEST: { label: this.cms.translateText('Common.completeRequest'), status: 'primary', outline: false },
    ACCEPTANCE: { label: this.cms.translateText('Common.acceptance'), status: 'info', outline: false },
    COMPLETE: { label: this.cms.translateText('Common.completed'), status: 'success', outline: true },
    CANCEL: { label: this.cms.translateText('Common.cancel'), status: 'info', outline: true },
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
          filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
        },
        Code: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.code'), 'head-title'),
          type: 'string',
          width: '10%',
        },
        Object: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.Object.title'), 'head-title'),
          type: 'string',
          width: '15%',
          // filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
          valuePrepareFunction: (cell: any, row: SalesVoucherModel) => {
            return row.ObjectName;
          },
          filter: {
            type: 'custom',
            component: SmartTableSelect2FilterComponent,
            config: {
              delay: 0,
              condition: 'eq',
              select2Option: {
                ...this.cms.makeSelect2AjaxOption('/contact/contacts', {includeIdText: true, includeGroups: true}, { placeholder: 'Chọn liên hệ...', limit: 10, prepareReaultItem: (item) => {
                  item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
                  return item;
                }}),
                multiple: true,
                logic: 'OR',
                allowClear: true,
              },
            },
          },
        },
        Title: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.title'), 'head-title'),
          type: 'string',
          width: '15%',
          filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
        },
        // RelationVoucher: {
        //   title: this.cms.textTransform(this.cms.translate.instant('Common.relationVoucher'), 'head-title'),
        //   type: 'string',
        //   width: '20%',
        // },
        Creator: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.creator'), 'head-title'),
          type: 'string',
          width: '10%',
          // filter: {
          //   type: 'custom',
          //   component: SmartTableDateTimeRangeFilterComponent,
          // },
          valuePrepareFunction: (cell: string, row?: any) => {
            return this.cms.getObjectText(cell);
          },
          filter: {
            type: 'custom',
            component: SmartTableSelect2FilterComponent,
            config: {
              delay: 0,
              condition: 'eq',
              select2Option: {
                logic: 'OR',
                placeholder: 'Chọn người tạo...',
                allowClear: true,
                width: '100%',
                dropdownAutoWidth: true,
                minimumInputLength: 0,
                keyMap: {
                  id: 'id',
                  text: 'text',
                },
                multiple: true,
                ajax: {
                  transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
                    console.log(settings);
                    const params = settings.data;
                    this.apiService.getPromise('/user/users', { 'search': params['term'], includeIdText: true }).then(rs => {
                      success(rs);
                    }).catch(err => {
                      console.error(err);
                      failure();
                    });
                  },
                  delay: 300,
                  processResults: (data: any, params: any) => {
                    // console.info(data, params);
                    return {
                      results: data.map(item => {
                        return item;
                      }),
                    };
                  },
                },
              },
            },
          },
        },
        Created: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.created'), 'head-title'),
          type: 'custom',
          width: '10%',
          filter: {
            type: 'custom',
            component: SmartTableDateRangeFilterComponent,
          },
          renderComponent: SmartTableDateTimeComponent,
          onComponentInitFunction: (instance: SmartTableDateTimeComponent) => {
            // instance.format$.next('medium');
          },
        },
        Reported: {
          title: this.cms.textTransform(this.cms.translate.instant('Sales.dateOfReported'), 'head-title'),
          type: 'custom',
          width: '10%',
          filter: {
            type: 'custom',
            component: SmartTableDateRangeFilterComponent,
          },
          renderComponent: SmartTableDateTimeComponent,
          onComponentInitFunction: (instance: SmartTableDateTimeComponent) => {
            // instance.format$.next('medium');
          },
        },
        // Amount: {
        //   title: this.cms.textTransform(this.cms.translate.instant('Common.numOfMoney'), 'head-title'),
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
          title: this.cms.textTransform(this.cms.translate.instant('Common.relationVoucher'), 'head-title'),
          type: 'custom',
          renderComponent: SmartTableRelativeVouchersComponent,
          width: '15%',
        },
        Amount: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.amount'), 'head-title'),
          type: 'currency',
          width: '5%',
          class: 'align-right',
          position: 'right',
        },
        Task: {
          title: 'Task',
          type: 'custom',
          width: '10%',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'message-circle';
            instance.display = true;
            instance.status = 'info';
            instance.valueChange.subscribe(value => {
            });

            instance.click.subscribe(async (row: SalesPriceReportModel) => {
              let task = row.RelativeVouchers?.find(f => f.type == 'CHATROOM');
              if (task) {
                this.cms.openMobileSidebar();
                this.mobileAppService.openChatRoom({ ChatRoom: task.id });
              } else {
                this.apiService.getPromise<PriceReportModel[]>('/sales/price-reports/' + row.Code, { includeRelatedTasks: true }).then(rs => {
                  const priceReport = rs[0];
                  if (priceReport && priceReport['Tasks'] && priceReport['Tasks'].length > 0) {

                    task = row.RelativeVouchers?.find(f => f.type == 'CHATROOM');
                    if (task) {
                      this.cms.openMobileSidebar();
                      this.mobileAppService.openChatRoom({ ChatRoom: task.id });
                    }
                  }
                  if (!task) {
                    this.cms.showDialog(this.cms.translateText('Common.warning'), this.cms.translateText('Chưa có task cho phiếu triển khai này, bạn có muốn tạo ngây bây giờ không ?'), [
                      {
                        label: this.cms.translateText('Common.goback'),
                        status: 'danger',
                        icon: 'arrow-ios-back',
                      },
                      {
                        label: this.cms.translateText('Common.create'),
                        status: 'success',
                        icon: 'message-circle-outline',
                        action: () => {
                          this.apiService.putPromise<PriceReportModel[]>('/sales/price-reports', { createTask: true }, [{ Code: row?.Code }]).then(rs => {
                            if (rs && rs[0] && rs[0]['Tasks'] && rs[0]['Tasks'].length > 0)
                              this.cms.toastService.show(this.cms.translateText('đã tạo task cho báo giá'),
                                this.cms.translateText('Common.notification'), {
                                status: 'success',
                              });
                            this.apiService.getPromise<PriceReportModel[]>('/sales/price-reports/' + row.Code, { includeRelativeVouchers: true }).then(rs => {
                              this.updateGridItems([row], rs);
                            });
                            setTimeout(() => {
                              this.cms.openMobileSidebar();
                              this.mobileAppService.openChatRoom({ ChatRoom: rs[0]['Tasks'][0]?.Task });
                            }, 500);
                          });
                        }
                      },
                    ]);
                  }
                }).catch(err => {
                  return Promise.reject(err);
                });
              }
            });
          },
        },
        State: {
          title: this.cms.translateText('Common.state'),
          type: 'custom',
          width: '5%',
          // class: 'align-right',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'checkmark-circle';
            instance.display = true;
            instance.status = 'success';
            instance.title = this.cms.translateText('Common.approved');
            instance.label = this.cms.translateText('Common.approved');
            instance.valueChange.subscribe(value => {
              const processMap = AppModule.processMaps.priceReport[value || ''];
              instance.label = this.cms.translateText(processMap?.label);
              instance.status = processMap?.status;
              instance.outline = processMap.outline;
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: SalesPriceReportModel) => {
              this.preview([rowData]);
            });
          },
          filter: {
            type: 'custom',
            component: SmartTableSelect2FilterComponent,
            config: {
              delay: 0,
              condition: 'eq',
              select2Option: {
                logic: 'OR',
                placeholder: 'Chọn trạng thái...',
                allowClear: true,
                width: '100%',
                dropdownAutoWidth: true,
                minimumInputLength: 0,
                keyMap: {
                  id: 'id',
                  text: 'text',
                },
                multiple: true,
                data: Object.keys(AppModule.processMaps.priceReport).map(stateId => ({
                  id: stateId,
                  text: this.cms.translateText(AppModule.processMaps.priceReport[stateId].label)
                })).filter(f => f.id != '')
              },
            },
          },
        },
        Permission: {
          title: this.cms.translateText('Common.permission'),
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
            instance.title = this.cms.translateText('Common.preview');
            instance.valueChange.subscribe(value => {
              // instance.icon = value ? 'unlock' : 'lock';
              // instance.status = value === 'REQUEST' ? 'warning' : 'success';
              // instance.disabled = value !== 'REQUEST';
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: SalesPriceReportModel) => {

              this.cms.openDialog(ResourcePermissionEditComponent, {
                context: {
                  inputMode: 'dialog',
                  inputId: [rowData.Code],
                  note: 'Click vào nút + để thêm 1 phân quyền, mỗi phân quyền bao gồm người được phân quyền và các quyền mà người đó được thao tác',
                  resourceName: this.cms.translateText('Sales.PriceReport.title', { action: '', definition: '' }) + ` ${rowData.Title || ''}`,
                  // resrouce: rowData,
                  apiPath: '/sales/price-reports',
                }
              });

              // this.getFormData([rowData.Code]).then(rs => {
              //   this.preview(rs);
              // });
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
            instance.title = this.cms.translateText('Common.preview');
            instance.valueChange.subscribe(value => {
              // instance.icon = value ? 'unlock' : 'lock';
              // instance.status = value === 'REQUEST' ? 'warning' : 'success';
              // instance.disabled = value !== 'REQUEST';
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: SalesPriceReportModel) => {
              // this.apiService.getPromise<SalesPriceReportModel[]>('/sales/price-reports', { id: [rowData.Code], includeContact: true, includeDetails: true, includeTax: true, useBaseTimezone: true }).then(rs => {
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
    return this.apiService.getPromise<SalesPriceReportModel[]>('/sales/price-reports', { id: ids, includeContact: true, includeDetails: true, useBaseTimezone: true });
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

  // preview(data: SalesPriceReportModel[], source?: string) {
  //   this.cms.openDialog(SalesPriceReportPrintComponent, {
  //     context: {
  //       showLoadinng: true,
  //       title: 'Xem trước',
  //       // data: data,
  //       id: data.map(m => m[this.idKey]),
  //       sourceOfDialog: 'list',
  //       mode: 'print',
  //       idKey: ['Code'],
  //       // approvedConfirm: true,
  //       onChange: (data: SalesPriceReportModel) => {
  //         this.refresh();
  //       },
  //       onSaveAndClose: () => {
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
