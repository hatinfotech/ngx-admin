import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent } from '../../../../lib/data-manager/data-manger-list.component';
import { EmailAddressListModel } from '../../../../models/email.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EmailAddressFormComponent } from '../email-address-form/email-address-form.component';

@Component({
  selector: 'ngx-email-address-list',
  templateUrl: './email-address-list.component.html',
  styleUrls: ['./email-address-list.component.scss'],
})
export class EmailAddressListComponent extends DataManagerListComponent<EmailAddressListModel> implements OnInit {

  componentName: string = 'EmailAddressListComponent';
  formPath = '/email-marketing/address/form';
  apiPath = '/email-marketing/address-lists';
  idKey = 'Code';

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
      Code: {
        title: 'Code',
        type: 'string',
        width: '10%',
      },
      Name: {
        title: 'Tên',
        type: 'string',
        width: '30%',
      },
      Description: {
        title: 'Mô tả',
        type: 'string',
        width: '50%',
      },
      //   Copy: {
      //     title: 'Copy',
      //     type: 'custom',
      //     width: '10%',
      //     renderComponent: SmartTableButtonComponent,
      //     onComponentInitFunction: (instance: SmartTableButtonComponent) => {
      //       instance.iconPack = 'eva';
      //       instance.icon = 'copy';
      //       instance.label = 'Copy nội dung sang site khác';
      //       instance.display = true;
      //       instance.status = 'success';
      //       instance.valueChange.subscribe(value => {
      //         // if (value) {
      //         //   instance.disabled = false;
      //         // } else {
      //         //   instance.disabled = true;
      //         // }
      //       });
      //       instance.click.subscribe(async (row: EmailAddressListModel) => {

      //         this.dialogService.open(SyncFormComponent, {
      //           context: {
      //             inputMode: 'dialog',
      //             inputId: [row.Code],
      //             onDialogSave: (newData: EmailAddressListModel[]) => {
      //               // if (onDialogSave) onDialogSave(row);
      //             },
      //             onDialogClose: () => {
      //               // if (onDialogClose) onDialogClose();
      //               this.refresh();
      //             },
      //           },
      //         });

      //       });
      //     },
      //   },
    },
  });

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  /** Api get funciton */
  executeGet(params: any, success: (resources: EmailAddressListModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: EmailAddressListModel[] | HttpErrorResponse) => void) {
    // params['includeParent'] = true;
    super.executeGet(params, success, error, complete);
  }

  getList(callback: (list: EmailAddressListModel[]) => void) {
    super.getList((rs) => {
      // rs.forEach(item => {
      //   item.Content = item.Content.substring(0, 256) + '...';
      // });
      if (callback) callback(rs);
    });
  }

  /** Implement required */
  openFormDialplog(ids?: string[], onDialogSave?: (newData: EmailAddressListModel[]) => void, onDialogClose?: () => void) {
    this.dialogService.open(EmailAddressFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: ids,
        onDialogSave: (newData: EmailAddressListModel[]) => {
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
