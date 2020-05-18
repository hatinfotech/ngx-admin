import { Component, OnInit } from '@angular/core';
import { EmailModel } from '../../../../models/email.model';
import { CommonService } from '../../../../services/common.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { NbDialogService, NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme';
import { DataManagerListComponent } from '../../../../lib/data-manager/data-manger-list.component';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EmailAdvertisementFormComponent } from '../email-advertisement-form/email-advertisement-form.component';
import { SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { ShowcaseDialogComponent } from '../../../dialog/showcase-dialog/showcase-dialog.component';

// interface MnfiniteLoadModel<M> {
//   data: (M & { selected: boolean })[];
//   placeholders: any[];
//   loading: boolean;
//   pageToLoadNext: number;
// }

@Component({
  selector: 'ngx-email-advertisement-list',
  templateUrl: './email-advertisement-list.component.html',
  styleUrls: ['./email-advertisement-list.component.scss'],
})
export class EmailAdvertisementListComponent extends DataManagerListComponent<EmailModel> implements OnInit {

  componentName: string = 'EmailAdvertisementListComponent';
  formPath = '/email-marketing/ads-email/form';
  apiPath = '/email-marketing/ads-emails';
  idKey = 'Id';

  constructor(
    protected apiService: ApiService,
    public router: Router,
    protected commonService: CommonService,
    protected dialogService: NbDialogService,
    protected toastService: NbToastrService,
    protected _http: HttpClient,
  ) {
    super(apiService, router, commonService, dialogService, toastService);
  }

  editing = {};
  rows = [];

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
      Id: {
        title: 'Id',
        type: 'string',
        width: '5%',
      },
      Subject: {
        title: 'Tiêu đề',
        type: 'string',
        width: '30%',
      },
      SentAlgorithm: {
        title: 'Thuật toán',
        type: 'string',
        width: '10%',
      },
      Template: {
        title: 'Email mẫu',
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
          instance.click.subscribe(async (row: EmailModel) => {
            if (row.State !== 'SENDING') {
              this.dialogService.open(ShowcaseDialogComponent, {
                context: {
                  title: 'Xác nhận',
                  content: 'Bạn có muốn bắt đầu tiến trình gửi mail ?',
                  actions: [
                    {
                      label: 'Start',
                      icon: 'start',
                      status: 'danger',
                      action: () => {
                        this.apiService.putPromise<EmailModel[]>('/email-marketing/ads-emails', { id: [row['Id']], startSentMail: true }, [{ Id: row.Id }]).then(rs => {
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
              this.dialogService.open(ShowcaseDialogComponent, {
                context: {
                  title: 'Xác nhận',
                  content: 'Bạn có muốn dừng trình gửi mail ?',
                  actions: [
                    {
                      label: 'Stop',
                      icon: 'stop',
                      status: 'warning',
                      action: () => {
                        this.apiService.putPromise<EmailModel[]>('/email-marketing/ads-emails', { id: [row['Id']], stopSentMail: true }, [{ Id: row.Id }]).then(rs => {
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

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  /** Api get funciton */
  executeGet(params: any, success: (resources: EmailModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: EmailModel[] | HttpErrorResponse) => void) {
    params['sort_Id'] = 'desc';
    params['includeSentCount'] = true;
    super.executeGet(params, (list) => {
      list.forEach(item => {
          item['SentCount'] = `${item['NumOfSent']}/${item['Total']}`;
      });
      success(list);
    }, error, complete);
  }

  getList(callback: (list: EmailModel[]) => void) {
    super.getList((rs) => {
      // rs.forEach(item => {
      //   item.Content = item.Content.substring(0, 256) + '...';
      // });
      if (callback) callback(rs);
    });
  }

  /** Implement required */
  openFormDialplog(ids?: string[], onDialogSave?: (newData: EmailModel[]) => void, onDialogClose?: () => void) {
    this.dialogService.open(EmailAdvertisementFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: ids,
        onDialogSave: (newData: EmailModel[]) => {
          if (onDialogSave) onDialogSave(newData);
        },
        onDialogClose: () => {
          if (onDialogClose) onDialogClose();
          this.refresh();
        },
      },
    });
  }

  /** Go to form */
  gotoForm(id?: string): false {
    this.openFormDialplog(id ? decodeURIComponent(id).split('&') : null);
    return false;
  }

}
