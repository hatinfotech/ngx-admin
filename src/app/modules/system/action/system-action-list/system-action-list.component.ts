import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent, SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { SystemActionModel } from '../../../../models/system.model';
import { SystemActionFormComponent } from '../system-action-form/system-action-form.component';
import { ApiService } from '../../../../services/api.service';
import { RootServices } from '../../../../services/root.services';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'ngx-system-action-list',
  templateUrl: './system-action-list.component.html',
  styleUrls: ['./system-action-list.component.scss'],
})
export class SystemActionListComponent extends DataManagerListComponent<SystemActionModel> implements OnInit {

  componentName: string = 'SystemActionListComponent';
  formPath = '/system/action/form';
  apiPath = '/system/actions';
  idKey = 'Name';
  formDialog = SystemActionFormComponent;

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
          width: '30%',
        },
        ActionFunction: {
          title: 'Hàm',
          type: 'string',
          width: '30%',
        },
        Description: {
          title: 'Mô tả',
          type: 'string',
          width: '40%',
        },
      },
    });
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  getList(callback: (list: SystemActionModel[]) => void) {
    super.getList((rs) => {
      if (callback) callback(rs);
    });
  }
}
