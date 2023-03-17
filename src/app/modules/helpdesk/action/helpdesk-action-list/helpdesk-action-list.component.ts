import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent, SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { HelpdeskActionModel } from '../../../../models/helpdesk.model';
import { HelpdeskActionFormComponent } from '../helpdesk-action-form/helpdesk-action-form.component';

@Component({
  selector: 'ngx-helpdesk-action-list',
  templateUrl: './helpdesk-action-list.component.html',
  styleUrls: ['./helpdesk-action-list.component.scss'],
})
export class HelpdeskActionListComponent extends DataManagerListComponent<HelpdeskActionModel> implements OnInit {

  componentName: string = 'HelpdeskActionListComponent';
  formPath = '/helpdesk/action/form';
  apiPath = '/helpdesk/actions';
  idKey = 'Name';
  formDialog = HelpdeskActionFormComponent;

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

  getList(callback: (list: HelpdeskActionModel[]) => void) {
    super.getList((rs) => {
      if (callback) callback(rs);
    });
  }
}
