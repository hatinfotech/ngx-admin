import { ChatRoomMemberModel } from './../../../../models/chat-room.model';
import { Title } from '@angular/platform-browser';
import { CollaboratorOrderTeleCommitFormComponent } from './../collaborator-order-tele-commit/collaborator-order-tele-commit.component';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Type } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { filter, take, takeUntil } from 'rxjs/operators';
import { AppModule } from '../../../../app.module';
import { SmartTableDateTimeComponent, SmartTableTagsComponent, SmartTableButtonComponent, SmartTableCurrencyComponent, SmartTableRelativeVouchersComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableDateRangeFilterComponent, SmartTableDateTimeRangeFilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { DataManagerPrintComponent } from '../../../../lib/data-manager/data-manager-print.component';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { ResourcePermissionEditComponent } from '../../../../lib/lib-system/components/resource-permission-edit/resource-permission-edit.component';
import { CollaboratorCommissionVoucherModel, CollaboratorOrderModel } from '../../../../models/collaborator.model';
import { PageModel } from '../../../../models/page.model';
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
import { ChatRoomModel } from '../../../../models/chat-room.model';

@Component({
  selector: 'ngx-collaborator-order-list',
  templateUrl: './collaborator-order-list.component.html',
  styleUrls: ['./collaborator-order-list.component.scss']
})
export class CollaboratorOrderListComponent extends ServerDataManagerListComponent<CollaboratorOrderModel> implements OnInit {

  componentName: string = 'CollaboratorOrderListComponent';
  formPath = '/collaborator/page/order/form';
  apiPath = '/collaborator/orders';
  idKey = 'Code';
  // formDialog = CollaboratorOrderFormComponent;
  printDialog = CollaboratorOrderPrintComponent;

  reuseDialog = true;
  static _dialog: NbDialogRef<CollaboratorOrderListComponent>;

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
    public mobileAppService: MobileAppService,
    public collaboratorService: CollaboratorService,
    // public mobileService: MobileAppService,
  ) {
    super(apiService, router, cms, dialogService, toastService, ref);
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
          title: this.cms.textTransform(this.cms.translate.instant('Collaborator.Page.title', { action: this.cms.translateText('Common.choose'), definition: '' }), 'head-title'),
          size: 'medium',
          select2: {
            data: pageList, 
            option: {
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
        // Code: {
        //   title: this.cms.textTransform(this.cms.translate.instant('Common.code'), 'head-title'),
        //   type: 'string',
        //   width: '10%',
        // },
        ObjectPhone: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.Object.title'), 'head-title'),
          type: 'html',
          width: '20%',
          filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
          valuePrepareFunction: (cell, row) => {
            return 'KH: ' + row.ObjectName + (row.ObjectPhone ? ` <br>SĐT: ${row.ObjectPhone}` : '');
          },
        },
        Code: {
          title: this.cms.textTransform(this.cms.translate.instant('Collaborator.Order.label'), 'head-title'),
          type: 'html',
          width: '25%',
          filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
          valuePrepareFunction: (cell, row) => {
            return '<b>Mã Đơn Hàng: ' + row.Code + '</b><br>' + row.Title + '';
          },
        },
        // RelationVoucher: {
        //   title: this.cms.textTransform(this.cms.translate.instant('Common.relationVoucher'), 'head-title'),
        //   type: 'string',
        //   width: '20%',
        // },
        PublisherName: {
          title: this.cms.textTransform(this.cms.translate.instant('Collaborator.Publisher.label'), 'head-title'),
          type: 'string',
          width: '15%',
          // filter: {
          //   type: 'custom',
          //   component: SmartTableDateTimeRangeFilterComponent,
          // },
          // valuePrepareFunction: (cell: string, row?: any) => {
          //   return this.cms.getObjectText(cell);
          // },
        },
        DateOfOrder: {
          title: this.cms.textTransform(this.cms.translate.instant('Collaborator.Order.dateOforder'), 'head-title'),
          type: 'custom',
          width: '15%',
          filter: {
            type: 'custom',
            component: SmartTableDateRangeFilterComponent,
          },
          renderComponent: SmartTableDateTimeComponent,
          onComponentInitFunction: (instance: SmartTableDateTimeComponent) => {
            // instance.format$.next('medium');
          },
        },
        Amount: {
          title: this.cms.textTransform(this.cms.translate.instant('Tiền hàng'), 'head-title'),
          type: 'custom',
          class: 'align-right',
          width: '10%',
          position: 'right',
          renderComponent: SmartTableCurrencyComponent,
          onComponentInitFunction: (instance: SmartTableCurrencyComponent) => {
            instance.style = 'text-align: right';
          },
        },
        Total: {
          title: this.cms.textTransform(this.cms.translate.instant('Tổng tiền'), 'head-title'),
          type: 'custom',
          class: 'align-right',
          width: '10%',
          position: 'right',
          renderComponent: SmartTableCurrencyComponent,
          onComponentInitFunction: (instance: SmartTableCurrencyComponent) => {
            instance.style = 'text-align: right';
          },
        },
        RelativeVouchers: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.relationVoucher'), 'head-title'),
          type: 'custom',
          renderComponent: SmartTableRelativeVouchersComponent,
          onComponentInitFunction: (instance: SmartTableTagsComponent) => {
            instance.click.subscribe((tag: { id: string, text: string, type: string }) => {
              if (tag.type === 'PRICEREPORT') {
                this.cms.openDialog(CollaboratorOrderTeleCommitFormComponent, {
                  context: {
                    inputId: [tag.id],
                    // inputMode: 'dialog',
                    onDialogSave: () => { },
                    onDialogClose: () => { },
                  }
                });
              } else {
                this.cms.previewVoucher(tag.type, tag.id);
              }
            });
          },
          width: '20%',
        },
        // Call: {
        //   title: 'Call',
        //   type: 'custom',
        //   width: '10%',
        //   renderComponent: SmartTableButtonComponent,
        //   onComponentInitFunction: (instance: SmartTableButtonComponent) => {
        //     instance.iconPack = 'eva';
        //     instance.icon = 'phone-call-outline';
        //     instance.display = true;
        //     instance.status = 'success';
        //     instance.valueChange.subscribe(value => {
        //     });

        //     instance.click.subscribe(async (row: CollaboratorOrderModel) => {
        //       const priceReportRef = row.RelativeVouchers?.find(f => f.type == 'PRICEREPORT');
        //       if (priceReportRef) {
        //         this.cms.showDialog('Click2Call', 'Bạn có muốn gọi cho khách hàng không ? hệ thống sẽ gọi xuống cho số nội bộ của bạn trước, hãy đảm bảo số nội bộ của bạn đang online !', [
        //           {
        //             status: 'basic',
        //             label: 'Trở về',
        //           },
        //           {
        //             status: 'success',
        //             icon: 'phone-call-outline',
        //             label: 'Gọi ngay',
        //             action: () => {
        //               this.apiService.putPromise('/collaborator/price-reports/' + priceReportRef.id, { click2call: true }, [{ Code: priceReportRef.id }]).then(rs => {
        //                 console.log(rs);
        //               });
        //             },
        //           }
        //         ]);
        //       }
        //     });
        //   },
        // },
        // Task: {
        //   title: 'Task',
        //   type: 'custom',
        //   width: '10%',
        //   renderComponent: SmartTableButtonComponent,
        //   onComponentInitFunction: (instance: SmartTableButtonComponent) => {
        //     instance.iconPack = 'eva';
        //     instance.icon = 'message-circle';
        //     instance.display = true;
        //     instance.status = 'info';
        //     instance.title = 'Tạo task trao đổi với CTV';
        //     instance.valueChange.subscribe(value => {
        //     });

        //     instance.click.subscribe(async (row: CollaboratorOrderModel) => {
        //       let task = row.RelativeVouchers?.find(f => f.type == 'CHATROOM');
        //       if (task) {
        //         this.cms.openMobileSidebar();
        //         this.mobileAppService.openChatRoom({ ChatRoom: task.id });
        //       } else {
        //         // Assign resource to chat room
        //         task = await this.apiService.putPromise<ChatRoomModel[]>('/chat/rooms', { assignResource: true }, [{
        //           Code: null,
        //           Resources: [
        //             {
        //               ResourceType: 'CLBRTORDER',
        //               Resource: row.Code,
        //               Title: row.Title,
        //               Date: row.DateOfOrder,
        //             }
        //           ]
        //         }]).then(rs => {
        //           if (rs && rs.length > 0) {
        //             // const link = rs[0].Resources[0];
        //             // if (link && link.ChatRoom) {

        //             // Add publisher to chat room
        //             this.apiService.putPromise<ChatRoomMemberModel[]>('/chat/room-members', { chatRoom: rs[0].Code }, [{
        //               ChatRoom: rs[0].Code as any,
        //               Type: 'CONTACT',
        //               RefUserUuid: this.cms.getObjectId(row.Publisher),
        //               Name: row.PublisherName,
        //               Page: row.Page,
        //               RefPlatform: 'PROBOXONE',
        //               RefType: 'PUBLISHER',
        //               id: this.cms.getObjectId(row.Publisher),
        //             }]).then(rs2 => {

        //               // Connect publisher
        //               this.apiService.putPromise<ChatRoomMemberModel[]>('/chat/room-members', { chatRoom: rs[0].Code, connectRefContactMember: true }, [{
        //                 Type: 'CONTACT',
        //                 Contact: rs2[0].Contact,
        //               }]).then(rs3 => {
        //                 this.cms.openMobileSidebar();
        //                 this.mobileAppService.openChatRoom({ ChatRoom: rs[0].Code });
        //               });

        //             });

        //             // }
        //             return { id: rs[0].Code, text: row.Title, type: 'TASK' };
        //           }
        //         });
        //       }
        //     });
        //   },
        // },
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
            // instance.style = 'text-align: right';
            // instance.class = 'align-right';
            instance.title = this.cms.translateText('Common.approved');
            instance.label = this.cms.translateText('Common.approved');
            instance.valueChange.subscribe(value => {
              const processMap = AppModule.processMaps.collaboratoOrder[value || ''];
              instance.label = this.cms.translateText(processMap?.label);
              instance.status = processMap?.status;
              instance.outline = processMap.outline;
              if (false) instance.disabled = !this.cms.checkPermission(this.componentName, processMap.nextState);// Todo: tmp disabled
              // instance.disabled = (value === 'APPROVE');
              // instance.icon = value ? 'unlock' : 'lock';
              // instance.status = value === 'REQUEST' ? 'warning' : 'success';
              // instance.disabled = value !== 'REQUEST';
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: CollaboratorOrderModel) => {
              // this.apiService.getPromise<CollaboratorOrderModel[]>(this.apiPath, { id: [rowData.Code], includeContact: true, includeDetails: true, includeTax: true, useBaseTimezone: true }).then(rs => {
              // this.refresh();
              if (rowData.State == 'PROCESSING') {
                // const priceReportRef = rowData.RelativeVouchers?.find(f => f.type == 'PRICEREPORT');
                // if (priceReportRef) {
                //   this.cms.openDialog(CollaboratorOrderTeleCommitFormComponent, {
                //     context: {
                //       inputId: [priceReportRef.id],
                //       inputMode: 'dialog',
                //       showLoadinng: true,
                //       onDialogSave: () => {
                //         this.refresh();
                //       },
                //       onDialogClose: () => { },
                //     }
                //   });
                // }
                this.openForm([rowData.Code]);
              } else {
                this.preview([rowData]);
              }

              // });
            });
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
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: CollaboratorCommissionVoucherModel) => {

              this.cms.openDialog(ResourcePermissionEditComponent, {
                context: {
                  inputMode: 'dialog',
                  inputId: [rowData.Code],
                  note: 'Click vào nút + để thêm 1 phân quyền, mỗi phân quyền bao gồm người được phân quyền và các quyền mà người đó được thao tác',
                  resourceName: this.cms.translateText('Sales.PriceReport.title', { action: '', definition: '' }) + ` ${rowData.Title || ''}`,
                  apiPath: this.apiPath,
                }
              });
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
      params['includePublisher'] = true;
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

  async preview(data: CollaboratorOrderModel[], source?: string) {
    this.cms.openDialog(CollaboratorOrderPrintComponent, {
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
        onChange: async (data: CollaboratorOrderModel, printComponent: CollaboratorOrderPrintComponent) => {

          printComponent.close();
          if (data.State === 'PROCESSING') {
            // Get relative vouchers
            // const order = await this.apiService.getPromise('/collaborator/orders/' + data.Code, {includeRelativeVouchers : true});
            // if (data.RelativeVouchers && data.RelativeVouchers.length > 0) {
            // const priceReportRef = data.RelativeVouchers.find(f => f.type === 'PRICEREPORT');
            // if (priceReportRef) {
            // this.cms.openDialog(CollaboratorOrderTeleCommitFormComponent, {
            //   context: {
            //     inputId: [priceReportRef.id],
            //     inputMode: 'dialog',
            //     onDialogSave: async (data) => {
            //       console.log(data);
            //       // setTimeout(() => {
            //       this.refresh();
            //       // }, 1000);
            //     },
            //     onDialogClose: () => { },
            //   }
            // });
            this.gotoForm(data.Code);
            // }
            // }
          } else {
            this.refresh();
          }

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

  onChangePage(page: PageModel) {
    this.collaboratorService.currentpage$.next(this.cms.getObjectId(page));
    this.cms.takeOnce(this.componentName + '_on_domain_changed', 1000).then(() => {
      this.refresh();
    });
  }

}
