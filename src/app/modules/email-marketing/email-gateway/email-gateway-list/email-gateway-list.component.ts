import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent } from '../../../../lib/data-manager/data-manger-list.component';
import { EmailGatewayModel } from '../../../../models/email.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { SmsGatewayFormComponent } from '../../../sms/sms-gateway/sms-gateway-form/sms-gateway-form.component';
import { EmailGatewayFormComponent } from '../email-gateway-form/email-gateway-form.component';

@Component({
  selector: 'ngx-email-gateway-list',
  templateUrl: './email-gateway-list.component.html',
  styleUrls: ['./email-gateway-list.component.scss'],
})
export class EmailGatewayListComponent extends DataManagerListComponent<EmailGatewayModel> implements OnInit {

  componentName: string = 'EmailGatewayListComponent';
  formPath = '/email-marketing/gateway/form';
  apiPath = '/email-marketing/gateway';
  idKey = 'Code';

  constructor(
    protected apiService: ApiService,
    public router: Router,
    protected commonService: CommonService,
    protected dialogService: NbDialogService,
    protected toastService: NbToastrService,
  ) {
    super(apiService, router, commonService, dialogService, toastService);
  }

  editing = {};
  rows = [];

  settings = {
    mode: 'external',
    selectMode: 'multi',
    actions: {
      position: 'right',
    },
    add: {
      addButtonContent: '<i class="nb-edit"></i> <i class="nb-trash"></i> <i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    pager: {
      display: true,
      perPage: 99999,
    },
    columns: {
      Code: {
        title: 'Mã',
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
        width: '30%',
      },
      ApiUrl: {
        title: 'Api',
        type: 'string',
        width: '30%',
      },
    },
  };

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  getList(callback: (list: EmailGatewayModel[]) => void) {
    super.getList((rs) => {
      // rs.map((i: any) => {
      //   i.Brandnames = i.Brandnames.map((i2: any) => i2.id).join(',');
      //   return i;
      // });
      if (callback) callback(rs);
    });
  }

  /** Implement required */
  openFormDialplog(ids?: string[], onDialogSave?: (newData: EmailGatewayModel[]) => void, onDialogClose?: () => void) {
    this.dialogService.open(EmailGatewayFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: ids,
        onDialogSave: (newData: EmailGatewayModel[]) => {
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
    // this.router.navigate(id ? [this.formPath, id] : [this.formPath], { queryParams: { list: this.componentName } });
    this.openFormDialplog(id ? decodeURIComponent(id).split('&') : null);
    return false;
  }

}
