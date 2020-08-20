import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent } from '../../../../lib/data-manager/data-manger-list.component';
import { HelpdeskProcedureModel } from '../../../../models/helpdesk.model';
import { HelpdeskProcedureFormComponent } from '../helpdesk-procedure-form/helpdesk-procedure-form.component';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'ngx-helpdesk-procedure-list',
  templateUrl: './helpdesk-procedure-list.component.html',
  styleUrls: ['./helpdesk-procedure-list.component.scss'],
})
export class HelpdeskProcedureListComponent extends DataManagerListComponent<HelpdeskProcedureModel> implements OnInit {

  componentName: string = 'HelpdeskProcedureListComponent';
  formPath = '/helpdesk/procedure/form';
  apiPath = '/helpdesk/procedures';
  idKey = 'Code';
  formDialog = HelpdeskProcedureFormComponent;

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
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
        title: this.commonService.translateText('Common.code'),
        type: 'string',
        width: '10%',
      },
      Name: {
        title: this.commonService.translateText('Common.name'),
        type: 'string',
        width: '40%',
      },
      Description: {
        title: this.commonService.translateText('Common.decription'),
        type: 'string',
        width: '50%',
      },
    },
  });

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  getList(callback: (list: HelpdeskProcedureModel[]) => void) {
    super.getList((rs) => {
      if (callback) callback(rs);
    });
  }
}
