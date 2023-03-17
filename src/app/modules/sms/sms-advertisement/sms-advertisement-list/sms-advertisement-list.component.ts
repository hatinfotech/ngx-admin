import { Component, OnInit } from '@angular/core';
import { SmsModel } from '../../../../models/sms.model';
import { CommonService } from '../../../../services/common.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { NbDialogService, NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme';
import { DataManagerListComponent, SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { ShowcaseDialogComponent } from '../../../dialog/showcase-dialog/showcase-dialog.component';
import { SmsAdvertisementFormComponent } from '../sms-advertisement-form/sms-advertisement-form.component';
import { SmsSentStatsListComponent } from '../../sms-sent-stats-list/sms-sent-stats-list.component';

@Component({
  selector: 'ngx-sms-advertisement-list',
  templateUrl: './sms-advertisement-list.component.html',
  styleUrls: ['./sms-advertisement-list.component.scss'],
})
export class SmsAdvertisementListComponent extends DataManagerListComponent<SmsModel> implements OnInit {

  componentName: string = 'SmsAdvertisementListComponent';
  formPath = '/sms/ads-sms/form';
  apiPath = '/sms/ads-sms';
  idKey = 'Id';
  formDialog = SmsAdvertisementFormComponent;

  constructor(
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
  ) {
    super(apiService, router, cms, dialogService, toastService);
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
      // add: this.configAddButton(),
      // edit: this.configEditButton(),
      // delete: this.configDeleteButton(),
      // pager: this.configPaging(),
      columns: {
        Id: {
          title: 'Id',
          type: 'string',
          width: '5%',
        },
        Content: {
          title: 'Nội dung',
          type: 'string',
          width: '30%',
        },
        SentAlgorithm: {
          title: 'Thuật toán',
          type: 'string',
          width: '10%',
        },
        Template: {
          title: 'Sms mẫu',
          type: 'string',
          width: '10%',
        },
        GatewayGroup: {
          title: 'Nhóm Gateway',
          type: 'string',
          width: '10%',
        },
        SentCount: {
          title: 'Đã gửi',
          type: 'string',
          width: '10%',
        },
        SendingDate: {
          title: 'Lần gửi cuối',
          type: 'string',
          width: '15%',
        },
        // State: {
        //   title: 'Trạng thái',
        //   type: 'string',
        //   width: '10%',
        // },
        Detail: {
          title: 'Chi tết',
          type: 'custom',
          width: '10%',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'list-outline';
            instance.label = 'Trạng thái đã gửi';
            instance.display = true;
            instance.status = 'success';
            instance.valueChange.subscribe(value => {
            });
            instance.click.subscribe(async (row: SmsModel) => {
              this.openSentStateList(row);
            });
          },
        },
        State: {
          title: 'Trạng thái',
          type: 'custom',
          width: '10%',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'play-circle';
            instance.label = 'Start';
            instance.display = true;
            instance.status = 'danger';
            instance.valueChange.subscribe(value => {
              if (value !== 'SENDING') {
                instance.label = 'Start';
                instance.icon = 'play-circle';
                instance.status = 'danger';
              } else {
                instance.label = 'Stop';
                instance.icon = 'stop-circle';
                instance.status = 'warning';
              }
            });
            instance.click.subscribe(async (row: SmsModel) => {
              if (row.State !== 'SENDING') {
                this.cms.openDialog(ShowcaseDialogComponent, {
                  context: {
                    title: 'Xác nhận',
                    content: 'Bạn có muốn bắt đầu tiến trình gửi mail ?',
                    actions: [
                      {
                        label: 'Start',
                        icon: 'start',
                        status: 'danger',
                        action: () => {
                          this.apiService.putPromise<SmsModel[]>('/sms/ads-sms', { id: [row['Id']], startSentSms: true }, [{ Id: row.Id }]).then(rs => {
                            this.toastService.show('success', 'Tiến trình gửi mail đã bắt đầu chạy', {
                              status: 'danger',
                              hasIcon: true,
                              position: NbGlobalPhysicalPosition.TOP_RIGHT,
                              // duration: 5000,
                            });
                            this.refresh();
                          });
                        },
                      },
                      {
                        label: 'Trở về',
                        icon: 'back',
                        status: 'success',
                        action: () => { },
                      },
                    ],
                  },
                });
              } else {
                this.cms.openDialog(ShowcaseDialogComponent, {
                  context: {
                    title: 'Xác nhận',
                    content: 'Bạn có muốn dừng trình gửi mail ?',
                    actions: [
                      {
                        label: 'Stop',
                        icon: 'stop',
                        status: 'warning',
                        action: () => {
                          this.apiService.putPromise<SmsModel[]>('/sms/ads-sms', { id: [row['Id']], stopSentSms: true }, [{ Id: row.Id }]).then(rs => {
                            this.toastService.show('success', 'Tiến trình gửi mail đã dừng', {
                              status: 'warning',
                              hasIcon: true,
                              position: NbGlobalPhysicalPosition.TOP_RIGHT,
                              // duration: 5000,
                            });
                            this.refresh();
                          });
                        },
                      },
                      {
                        label: 'Trở về',
                        icon: 'back',
                        status: 'success',
                        action: () => { },
                      },
                    ],
                  },
                });
              }
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

  /** Api get funciton */
  executeGet(params: any, success: (resources: SmsModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: SmsModel[] | HttpErrorResponse) => void) {
    params['sort_Id'] = 'desc';
    params['includeSentCount'] = true;
    super.executeGet(params, (list) => {
      list.forEach(item => {
        item['SentCount'] = `${item['SentCount'] ? item['SentCount'] : 0}/${item['TotalRecipient'] ? item['TotalRecipient'] : 0}`;
      });
      success(list);
    }, error, complete);
  }

  getList(callback: (list: SmsModel[]) => void) {
    super.getList((rs) => {
      // rs.forEach(item => {
      //   item.Content = item.Content.substring(0, 256) + '...';
      // });
      if (callback) callback(rs);
    });
  }

  /** Implement required */
  // openFormDialplog(ids?: string[], onDialogSave?: (newData: SmsModel[]) => void, onDialogClose?: () => void) {
  //   this.cms.openDialog(SmsAdvertisementFormComponent, {
  //     context: {
  //       inputMode: 'dialog',
  //       inputId: ids,
  //       onDialogSave: (newData: SmsModel[]) => {
  //         if (onDialogSave) onDialogSave(newData);
  //       },
  //       onDialogClose: () => {
  //         if (onDialogClose) onDialogClose();
  //         this.refresh();
  //       },
  //     },
  //   });
  // }

  /** Go to form */
  // gotoForm(id?: string): false {
  //   this.openFormDialplog(id ? decodeURIComponent(id).split('&') : null);
  //   return false;
  // }

  openSentStateList(sms: SmsModel) {
    this.cms.openDialog(SmsSentStatsListComponent, {
      context: {
        inputMode: 'dialog',
        inputId: [sms.PhoneNumberList],
        inputSms: sms.Id,
        onDialogSave: (newData: SmsModel[]) => { },
        onDialogClose: () => {
          // this.refresh();
        },
      },
    });
  }

}
