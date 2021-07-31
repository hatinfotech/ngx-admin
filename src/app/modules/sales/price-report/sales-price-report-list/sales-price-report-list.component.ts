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
import { SmartTableButtonComponent, SmartTableDateTimeComponent, SmartTableTagsComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { takeUntil } from 'rxjs/operators';
import { SmartTableDateTimeRangeFilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { UserGroupModel } from '../../../../models/user-group.model';
import { SalesPriceReportPrintComponent } from '../sales-price-report-print/sales-price-report-print.component';
import { TaxModel } from '../../../../models/tax.model';
import { UnitModel } from '../../../../models/unit.model';
import { ResourcePermissionEditComponent } from '../../../../lib/lib-system/components/resource-permission-edit/resource-permission-edit.component';
import { AppModule } from '../../../../app.module';

@Component({
  selector: 'ngx-sales-price-report-list',
  templateUrl: './sales-price-report-list.component.html',
  styleUrls: ['./sales-price-report-list.component.scss'],
})
export class SalesPriceReportListComponent extends ServerDataManagerListComponent<SalesPriceReportModel> implements OnInit {

  componentName: string = 'SalesPriceReportListComponent';
  formPath = '/sales/price-report/form';
  apiPath = '/sales/price-reports';
  idKey = 'Code';
  formDialog = SalesPriceReportFormComponent;

  reuseDialog = true;
  static _dialog: NbDialogRef<SalesPriceReportListComponent>;

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
    public mobileAppService: MobileAppService
  ) {
    super(apiService, router, commonService, dialogService, toastService, ref);
  }

  async init() {
    return super.init();
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

  settings = this.configSetting({
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

          // instance.valueChange.subscribe(rowData => {

          //   if (instance.rowData?.Code === 'PBG09721100') {
          //     setInterval(() => {
          //       console.log(instance.disabled);
          //       // this.disabled = !this.disabled;
          //     }, 1000);
          //   }
          // });


          instance.click.subscribe(async (row: SalesPriceReportModel) => {

            this.apiService.getPromise<PriceReportModel[]>('/sales/price-reports/' + row.Code, { includeRelatedTasks: true }).then(rs => {
              const priceReport = rs[0];
              if (priceReport && priceReport['Tasks'] && priceReport['Tasks'].length > 0) {
                this.commonService.openMobileSidebar();
                this.mobileAppService.openChatRoom({ ChatRoom: priceReport['Tasks'][0]?.Task });
              } else {
                this.commonService.showDiaplog(this.commonService.translateText('Common.warning'), this.commonService.translateText('Chưa có task cho phiếu triển khai này, bạn có muốn tạo ngây bây giờ không ?'), [
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
                      this.apiService.putPromise<PriceReportModel[]>('/sales/price-reports', { createTask: true }, [{ Code: row?.Code }]).then(rs => {
                        if (rs && rs[0] && rs[0]['Tasks'] && rs[0]['Tasks'].length > 0)
                          this.commonService.toastService.show(this.commonService.translateText('đã tạo task cho báo giá'),
                            this.commonService.translateText('Common.notification'), {
                            status: 'success',
                          });
                        this.commonService.openMobileSidebar();
                        this.mobileAppService.openChatRoom({ ChatRoom: rs[0]['Tasks'][0]?.Task });
                      });
                    }
                  },
                ]);
              }

            }).catch(err => {
              return Promise.reject(err);
            });

            // this.commonService.openDialog(SalesPriceReportFormComponent, {
            //   context: {
            //     inputMode: 'dialog',
            //     inputId: [row.Code],
            //     isDuplicate: true,
            //     onDialogSave: (newData: SalesPriceReportModel[]) => {
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
      //     instance.click.subscribe(async (row: SalesPriceReportModel) => {

      //       this.commonService.openDialog(SalesPriceReportFormComponent, {
      //         context: {
      //           inputMode: 'dialog',
      //           inputId: [row.Code],
      //           isDuplicate: true,
      //           onDialogSave: (newData: SalesPriceReportModel[]) => {
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
          instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: SalesPriceReportModel) => {
            this.apiService.getPromise<SalesPriceReportModel[]>('/sales/price-reports', { id: [rowData.Code], includeContact: true, includeDetails: true, includeTax: true, useBaseTimezone: true }).then(rs => {
              this.preview(rs);
            });
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
          instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: SalesPriceReportModel) => {

            this.commonService.openDialog(ResourcePermissionEditComponent, {
              context: {
                inputMode: 'dialog',
                inputId: [rowData.Code],
                note: 'Click vào nút + để thêm 1 phân quyền, mỗi phân quyền bao gồm người được phân quyền và các quyền mà người đó được thao tác',
                resourceName: this.commonService.translateText('Sales.PriceReport.title', { action: '', definition: '' }) + ` ${rowData.Title || ''}`,
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
          instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: SalesPriceReportModel) => {
            this.apiService.getPromise<SalesPriceReportModel[]>('/sales/price-reports', { id: [rowData.Code], includeContact: true, includeDetails: true, includeTax: true, useBaseTimezone: true }).then(rs => {
              this.preview(rs);
            });
            // this.getFormData([rowData.Code]).then(rs => {
            //   this.preview(rs, 'list');
            // });
          });
        },
      }
    },
  });

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

  preview(data: SalesPriceReportModel[], source?: string) {
    this.commonService.openDialog(SalesPriceReportPrintComponent, {
      context: {
        showLoadinng: true,
        title: 'Xem trước',
        data: data,
        sourceOfDialog: source,
        idKey: ['Code'],
        // approvedConfirm: true,
        onChange: (data: SalesPriceReportModel) => {
          this.refresh();
        },
        // onSaveAndClose: () => {
        //   this.refresh();
        // },
      },
    });
    return false;
  }

}
