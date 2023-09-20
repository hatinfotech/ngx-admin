import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent, SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { HelpdeskParamModel } from '../../../../models/helpdesk.model';
import { HelpdeskParamFormComponent } from '../helpdesk-param-form/helpdesk-param-form.component';
import { ApiService } from '../../../../services/api.service';
import { RootServices } from '../../../../services/root.services';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'ngx-helpdesk-param-list',
  templateUrl: './helpdesk-param-list.component.html',
  styleUrls: ['./helpdesk-param-list.component.scss'],
})
export class HelpdeskParamListComponent extends DataManagerListComponent<HelpdeskParamModel> implements OnInit {

  componentName: string = 'HelpdeskParamListComponent';
  formPath = '/helpdesk/param/form';
  apiPath = '/helpdesk/params';
  idKey = 'Name';
  formDialog = HelpdeskParamFormComponent;

  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
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
      add: this.configAddButton(),
      edit: this.configEditButton(),
      delete: this.configDeleteButton(),
      pager: this.configPaging(),
      columns: {
        Name: {
          title: 'Tên',
          type: 'string',
          width: '40%',
        },
        Description: {
          title: 'Mô tả',
          type: 'string',
          width: '50%',
        },
      },
    });
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  getList(callback: (list: HelpdeskParamModel[]) => void) {
    super.getList((rs) => {
      if (callback) callback(rs);
    });
  }
}
