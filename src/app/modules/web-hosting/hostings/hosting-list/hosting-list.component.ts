import { Component, OnInit } from '@angular/core';
import { WhHostingModel } from '../../../../models/wh-hosting.model';
import { WebHostingBaseListComponent } from '../../web-hosting-base-list.component';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { WebHostingService } from '../../web-hosting-service';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';

@Component({
  selector: 'ngx-hosting-list',
  templateUrl: './hosting-list.component.html',
  styleUrls: ['./hosting-list.component.scss'],
})
export class HostingListComponent extends WebHostingBaseListComponent<WhHostingModel> implements OnInit {

  componentName: string = 'HostingListComponent';
  formPath = '/web-hosting/hostings/form';
  apiPath = '/web-hosting/hostings';
  idKey = 'Code';

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public webHostingService: WebHostingService,
  ) {
    super(apiService, router, commonService, dialogService, toastService, webHostingService);
  }

  loadListSetting(): SmartTableSetting {
    return this.configSetting({
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
          title: 'Mã',
          type: 'string',
          width: '10%',
        },
        Host: {
          title: 'Host',
          type: 'string',
          width: '20%',
        },
        HostIp: {
          title: 'Host IP',
          type: 'string',
          width: '20%',
        },
        Username: {
          title: 'Username',
          type: 'string',
          width: '10%',
        },
        ClientId: {
          title: 'Client ID',
          type: 'string',
          width: '20%',
        },
        ApiVersion: {
          title: 'Ngày khai báo',
          type: 'string',
          width: '10%',
        },
        Enabled: {
          title: 'H.hoạt',
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
