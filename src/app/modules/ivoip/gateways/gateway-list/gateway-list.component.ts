import { Component, OnInit } from '@angular/core';
import { IvoipBaseListComponent } from '../../ivoip-base-list.component';
import { PbxGatewayModel } from '../../../../models/pbx-gateway.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { IvoipService } from '../../ivoip-service';
import { GatewayFormComponent } from '../gateway-form/gateway-form.component';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';

@Component({
  selector: 'ngx-gateway-list',
  templateUrl: './gateway-list.component.html',
  styleUrls: ['./gateway-list.component.scss'],
})
export class GatewayListComponent extends IvoipBaseListComponent<PbxGatewayModel> implements OnInit {

  componentName = 'GatewayListComponent';
  formPath = '/ivoip/gateways/form';
  apiPath = '/ivoip/gateways';
  idKey = 'gateway_uuid';
  formDialog = GatewayFormComponent;

  constructor(
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public ivoipService: IvoipService,
  ) {
    super(apiService, router, cms, dialogService, toastService, ivoipService);
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
        gateway: {
          title: 'Gateway',
          type: 'string',
          width: '20%',
          // filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
        },
        context: {
          title: 'Context',
          type: 'string',
          width: '10%',
        },
        status: {
          title: 'Trạng thái',
          type: 'string',
          width: '10%',
        },
        state: {
          title: 'Đăng ký',
          type: 'string',
          width: '10%',
        },
        hostname: {
          title: 'Hostname',
          type: 'string',
          width: '20%',
        },
        description: {
          title: 'Mô tả',
          type: 'string',
          width: '30%',
        },
        enabled: {
          title: 'Kích hoạt',
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

}
