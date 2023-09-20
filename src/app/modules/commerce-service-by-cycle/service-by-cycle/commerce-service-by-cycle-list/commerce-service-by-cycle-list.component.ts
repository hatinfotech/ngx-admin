import { ChatRoomModel } from './../../../../models/chat-room.model';
import { ProcessMap } from './../../../../models/process-map.model';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { takeUntil } from 'rxjs/operators';
import { AppModule } from '../../../../app.module';
import { SmartTableButtonComponent, SmartTableRelativeVouchersComponent, SmartTableTagsComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { CommerceServiceByCycleModel } from '../../../../models/commerce-service-by-cycle.model';
import { ApiService } from '../../../../services/api.service';
import { RootServices } from '../../../../services/root.services';
import { CommonService } from '../../../../services/common.service';
import { CommerceServiceByCycleFormComponent } from '../commerce-service-by-cycle-form/commerce-service-by-cycle-form.component';
import { SmartTableSelect2FilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { MobileAppService } from '../../../mobile-app/mobile-app.service';
import { ResourcePermissionEditComponent } from '../../../../lib/lib-system/components/resource-permission-edit/resource-permission-edit.component';
import * as moment from 'moment';

@Component({
  selector: 'ngx-commerce-service-by-cycle-list',
  templateUrl: './commerce-service-by-cycle-list.component.html',
  styleUrls: ['./commerce-service-by-cycle-list.component.scss']
})
export class CommerceServiceByCycleListComponent extends ServerDataManagerListComponent<CommerceServiceByCycleModel> implements OnInit {

  componentName: string = 'CommerceServiceByCycleListComponent';
  formPath = '/commerce-service-by-cycle/service-by-cycle/form';
  apiPath = '/commerce-service-by-cycle/service-by-cycles';
  idKey = 'Code';
  formDialog = CommerceServiceByCycleFormComponent;

  reuseDialog = true;

  // Smart table
  static filterConfig: any;
  static sortConf: any;
  static pagingConf = { page: 1, perPage: 40 };
  cycleMap: { [key: string]: string };
  stateList: { id: string, text: string }[];

  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<CommerceServiceByCycleListComponent>,
    public mobileAppService: MobileAppService
  ) {
    super(rsv, apiService, router, cms, dialogService, toastService, ref);
  }

  async init() {
    // await this.loadCache();
    await this.cms.waitForReady();
    this.cycleMap = {
      MONTHLY: this.cms.translateText('Common.monthly'),
      YEARLY: this.cms.translateText('Common.yearly'),
    };
    this.stateList = [
      {
        id: 'ACTIVE',
        text: this.cms.translateText('Common.activated'),
      },
      {
        id: 'INACTIVE',
        text: this.cms.translateText('Common.inactivated'),
      },
      {
        id: 'EXPIREDSOON',
        text: this.cms.translateText('Common.expiredSoon'),
      },
      {
        id: 'OVEREXPIRED',
        text: this.cms.translateText('Common.overExpired'),
      },
      {
        id: 'EXPIRED',
        text: this.cms.translateText('Common.expired'),
      },
    ];
    return super.init();
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
        Object: {
          title: this.cms.translateText('Common.object'),
          type: 'string',
          width: '10%',
          // filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
        },
        ObjectName: {
          title: this.cms.translateText('Common.objectName'),
          type: 'string',
          width: '15%',
        },
        Description: {
          title: this.cms.translateText('Common.description'),
          type: 'string',
          width: '20%',
        },
        Cycle: {
          title: this.cms.translateText('Common.cycle'),
          type: 'string',
          width: '15%',
          valuePrepareFunction: (cell: any, rowData: CommerceServiceByCycleModel) => {
            return this.cycleMap[cell] || cell;
          }
        },
        // Loop: {
        //   title: this.cms.translateText('Common.loop'),
        //   type: 'string',
        //   width: '10%',
        // },
        DateOfStart: {
          title: this.cms.translateText('Common.dateOfStart'),
          type: 'datetime',
          width: '15%',
        },
        NextRemind: {
          title: this.cms.translateText('Common.nextTime'),
          type: 'html',
          width: '15%',
          // filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
          valuePrepareFunction: (cell: any, rowData: CommerceServiceByCycleModel) => {
            return cell && this.cms.datePipe.transform(cell, 'short') + '<br>' + moment(cell).fromNow() || this.cms.translateText('Common.undefined');
          },
        },
        RelativeVouchers: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.relationVoucher'), 'head-title'),
          type: 'custom',
          renderComponent: SmartTableRelativeVouchersComponent,
          width: '10%',
        },
        Task: {
          title: 'Task',
          type: 'custom',
          width: '5%',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'message-circle';
            // instance.label = this.cms.translateText('Common.copy');
            instance.display = true;
            instance.status = 'info';
            instance.init.subscribe(initRowData => {
            });


            instance.click.subscribe(async (row: CommerceServiceByCycleModel) => {
              // const chatRoomId = row['ChatRooms'] && row['ChatRooms'][0] && row['ChatRooms'][0]['id'] || '';
              this.apiService.putPromise<ChatRoomModel[]>('/chat/rooms', { assignResource: true }, [{
                Code: null,
                Resources: [
                  {
                    ResourceType: 'SERVICEBYCYCLE',
                    Resource: row.Code,
                    Title: row.Description,
                    Date: row.DateOfStart,
                  }
                ]
              }]).then(rs => {
                if (rs && rs.length > 0 && rs[0].Resources && rs[0].Resources.length > 0) {
                  const link = rs[0].Resources[0];
                  if (link && link.ChatRoom) {
                    // if (!Array.isArray(row['ChatRooms'])) row['ChatRooms'] = [];
                    // row['ChatRooms'].push({ id: link.ChatRoom, text: link.Title });
                    this.cms.openMobileSidebar();
                    this.mobileAppService.openChatRoom({ ChatRoom: link.ChatRoom });
                  }
                  // else {
                  //   this.cms.showDiaplog(this.cms.translateText('Common.warning'), this.cms.translateText('Chưa có phòng chat cho dịch vụ chu kỳ này, bạn có muốn tạo ngây bây giờ không ?'), [
                  //     {
                  //       label: this.cms.translateText('Common.goback'),
                  //       status: 'danger',
                  //       icon: 'arrow-ios-back',
                  //     },
                  //     {
                  //       label: this.cms.translateText('Common.create'),
                  //       status: 'success',
                  //       icon: 'message-circle-outline',
                  //       action: () => {
                  //         this.apiService.putPromise<CommerceServiceByCycleModel[]>('/sales/price-reports', { createTask: true }, [{ Code: row?.Code }]).then(rs => {
                  //           if (rs && rs[0] && rs[0]['Tasks'] && rs[0]['Tasks'].length > 0)
                  //             this.cms.toastService.show(this.cms.translateText('đã tạo task cho báo giá'),
                  //               this.cms.translateText('Common.notification'), {
                  //               status: 'success',
                  //             });
                  //           this.cms.openMobileSidebar();
                  //           this.mobileAppService.openChatRoom({ ChatRoom: rs[0]['Tasks'][0]?.Task });
                  //         });
                  //       }
                  //     },
                  //   ]);
                  // }
                }
              });
            });
          }
        },
        Status: {
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
            instance.disabled = this.isChoosedMode;
            instance.title = this.cms.translateText('Common.state');
            instance.label = this.cms.translateText('Common.state');
            instance.valueChange.subscribe(value => {
              const processMap = AppModule.processMaps.commerceServiceByCycle[value || ''];
              instance.label = this.cms.translateText(processMap?.label);
              instance.status = processMap?.status;
              instance.outline = processMap?.outline;
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: CommerceServiceByCycleModel) => {
              this.changeStateConfirm(instance.rowData).then(status => {
                if (status) this.refresh();
              });
            });
          },
          filter: {
            type: 'custom',
            component: SmartTableSelect2FilterComponent,
            config: {
              delay: 0,
              condition: 'eq',
              select2Option: {
                placeholder: this.cms.translateText('Common.state') + '...',
                allowClear: true,
                width: '100%',
                dropdownAutoWidth: true,
                minimumInputLength: 0,
                keyMap: {
                  id: 'id',
                  text: 'text',
                },
                // multiple: true,
                ajax: {
                  url: (params: any) => {
                    return 'data:text/plan,[]';
                  },
                  delay: 0,
                  processResults: (data: any, params: any) => {
                    return {
                      results: this.stateList.filter(cate => !params.term || this.cms.smartFilter(cate.text, params.term)),
                    };
                  },
                },
              },
            },
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
            instance.disabled = this.isChoosedMode;
            instance.title = this.cms.translateText('Common.state');
            instance.label = this.cms.translateText('Common.state');
            instance.valueChange.subscribe(value => {
              const processMap = AppModule.processMaps.commerceServiceByCycle[value || ''];
              instance.label = this.cms.translateText(processMap?.label);
              instance.status = processMap?.status;
              instance.outline = processMap?.outline;
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: CommerceServiceByCycleModel) => {
              this.changeStateConfirm(instance.rowData).then(status => {
                if (status) this.refresh();
              });
            });
          },
          filter: {
            type: 'custom',
            component: SmartTableSelect2FilterComponent,
            config: {
              delay: 0,
              condition: 'eq',
              select2Option: {
                placeholder: this.cms.translateText('Common.state') + '...',
                allowClear: true,
                width: '100%',
                dropdownAutoWidth: true,
                minimumInputLength: 0,
                keyMap: {
                  id: 'id',
                  text: 'text',
                },
                // multiple: true,
                ajax: {
                  url: (params: any) => {
                    return 'data:text/plan,[]';
                  },
                  delay: 0,
                  processResults: (data: any, params: any) => {
                    return {
                      results: this.stateList.filter(cate => !params.term || this.cms.smartFilter(cate.text, params.term)),
                    };
                  },
                },
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
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: CommerceServiceByCycleModel) => {

              this.cms.openDialog(ResourcePermissionEditComponent, {
                context: {
                  inputMode: 'dialog',
                  inputId: [rowData.Code],
                  note: 'Click vào nút + để thêm 1 phân quyền, mỗi phân quyền bao gồm người được phân quyền và các quyền mà người đó được thao tác',
                  resourceName: this.cms.translateText('Sales.PriceReport.title', { action: '', definition: '' }) + ` ${rowData.Title || ''}`,
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
      params['includeRelativeVouchers'] = true;
      params['sort_DateOfStart'] = 'asc';
      return params;
    };

    return source;
  }

  changeStateConfirm(data: CommerceServiceByCycleModel) {
    const params = { id: [data.Code] };
    const processMap: ProcessMap = AppModule.processMaps.commerceServiceByCycle[data.State || ''];
    params['changeState'] = processMap?.nextState;

    return new Promise(resolve => {
      this.cms.showDialog(this.cms.translateText('Common.confirm'), this.cms.translateText(processMap?.confirmText, { object: this.cms.translateText('CommerceServiceByCycle.ServieByCycle.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
        {
          label: this.cms.translateText('Common.goback'),
          status: 'primary',
          action: () => {
            resolve(false);
          },
        },
        {
          label: this.cms.translateText(processMap?.nextStateLabel),
          status: AppModule.processMaps.commerceServiceByCycle[processMap.nextState || ''].status,
          action: async () => {
            this.loading = true;
            return this.apiService.putPromise<CommerceServiceByCycleModel[]>(this.apiPath, params, [{ Code: data.Code }]).then(rs => {
              this.loading = false;
              this.cms.toastService.show(this.cms.translateText(processMap?.responseText, { object: this.cms.translateText('CommerceServiceByCycle.ServieByCycle.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), this.cms.translateText(processMap?.responseTitle), {
                status: 'success',
              });
              if (processMap?.nextState === 'ACTIVE') {
                this.apiService.putPromise<ChatRoomModel[]>('/chat/rooms', { assignResource: true }, [{
                  Code: null,
                  Resources: [
                    {
                      ResourceType: 'SERVICEBYCYCLE',
                      Resource: data.Code,
                      Title: data.Description,
                      Date: data.DateOfStart,
                    }
                  ]
                }]).then(rs => {
                  if (rs && rs.length > 0 && rs[0].Resources && rs[0].Resources.length > 0) {
                    const link = rs[0].Resources[0];
                    if (link && link.ChatRoom) {
                      this.cms.openMobileSidebar();
                      this.mobileAppService.openChatRoom({ ChatRoom: link.ChatRoom });
                      this.refresh();
                    }
                  }
                });
              }
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
