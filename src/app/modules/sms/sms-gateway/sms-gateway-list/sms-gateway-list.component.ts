import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent, SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { SmsGatewayModel } from '../../../../models/sms.model';
import { ApiService } from '../../../../services/api.service';
import { RootServices } from '../../../../services/root.services';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { SmsGatewayFormComponent } from '../sms-gateway-form/sms-gateway-form.component';

@Component({
  selector: 'ngx-sms-gateway-list',
  templateUrl: './sms-gateway-list.component.html',
  styleUrls: ['./sms-gateway-list.component.scss'],
})
export class SmsGatewayListComponent extends DataManagerListComponent<SmsGatewayModel> implements OnInit {

  componentName: string = 'SmsGatewayListComponent';
  formPath = '/sms/gateway/form';
  apiPath = '/sms/gateway';
  idKey = 'Code';
  formDialog = SmsGatewayFormComponent;

  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
  ) {
    super(rsv, apiService, router, cms, dialogService, toastService);
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
      // add: {
      //   addButtonContent: '<i class="nb-edit"></i> <i class="nb-trash"></i> <i class="nb-plus"></i>',
      //   createButtonContent: '<i class="nb-checkmark"></i>',
      //   cancelButtonContent: '<i class="nb-close"></i>',
      // },
      // edit: {
      //   editButtonContent: '<i class="nb-edit"></i>',
      //   saveButtonContent: '<i class="nb-checkmark"></i>',
      //   cancelButtonContent: '<i class="nb-close"></i>',
      // },
      // delete: {
      //   deleteButtonContent: '<i class="nb-trash"></i>',
      //   confirmDelete: true,
      // },
      // pager: {
      //   display: true,
      //   perPage: 99999,
      // },
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
        Brandnames: {
          title: 'Brandnames',
          type: 'string',
          width: '20%',
        },
        ApiUrl: {
          title: 'Api',
          type: 'string',
          width: '30%',
        },
        Type: {
          title: 'Loại',
          type: 'string',
          width: '10%',
        },
      },
    });
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  getList(callback: (list: SmsGatewayModel[]) => void) {
    super.getList((rs) => {
      rs.map((i: any) => {
        if (i.Brandnames) {
          i.Brandnames = i.Brandnames.map((i2: any) => i2.id).join(',');
        }
        return i;
      });
      if (callback) callback(rs);
    });
  }

  /** Implement required */
  // openFormDialplog(ids?: string[], onDialogSave?: (newData: SmsGatewayModel[]) => void, onDialogClose?: () => void) {
  //   this.cms.openDialog(SmsGatewayFormComponent, {
  //     context: {
  //       inputMode: 'dialog',
  //       inputId: ids,
  //       onDialogSave: (newData: SmsGatewayModel[]) => {
  //         if (onDialogSave) onDialogSave(newData);
  //       },
  //       onDialogClose: () => {
  //         if (onDialogClose) onDialogClose();
  //         this.refresh();
  //       },
  //     },
  //   });
  // }

  // /** Go to form */
  // gotoForm(id?: string): false {
  //   // this.router.navigate(id ? [this.formPath, id] : [this.formPath], { queryParams: { list: this.componentName } });
  //   this.openFormDialplog(id ? id.split('&') : null);
  //   return false;
  // }

}
