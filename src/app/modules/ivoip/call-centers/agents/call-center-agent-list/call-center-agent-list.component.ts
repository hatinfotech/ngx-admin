import { Component, OnInit } from '@angular/core';
import { PbxCallCenterAgentModel } from '../../../../../models/pbx-center-agent.model';
import { IvoipBaseListComponent } from '../../../ivoip-base-list.component';
import { ApiService } from '../../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { IvoipService } from '../../../ivoip-service';

@Component({
  selector: 'ngx-call-center-agent-list',
  templateUrl: './call-center-agent-list.component.html',
  styleUrls: ['./call-center-agent-list.component.scss'],
})
export class CallCenterAgentListComponent extends IvoipBaseListComponent<PbxCallCenterAgentModel> implements OnInit {

  componentName: string = 'CallCenterAgentListComponent';
  formPath = '/ivoip/call-centers/agents/form';
  apiPath = '/ivoip/call-center-agents';
  idKey = 'call_center_agent_uuid';

  constructor(
    protected apiService: ApiService,
    protected router: Router,
    protected commonService: CommonService,
    protected dialogService: NbDialogService,
    protected toastService: NbToastrService,
    protected ivoipService: IvoipService,
  ) {
    super(apiService, router, commonService, dialogService, toastService, ivoipService);
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
      agent_name: {
        title: 'Tên',
        type: 'string',
        width: '10%',
      },
      agent_id: {
        title: 'ID',
        type: 'string',
        width: '10%',
      },
      agent_type: {
        title: 'Loại',
        type: 'string',
        width: '10%',
      },
      agent_call_timeout: {
        title: 'Thời gian ngắt',
        type: 'string',
        width: '10%',
      },
      agent_contact: {
        title: 'Liên hệ',
        type: 'string',
        width: '20%',
      },
      agent_max_no_answer: {
        title: 'Số lần không nhấc máy tối đa',
        type: 'string',
        width: '20%',
      },
      agent_status: {
        title: 'Trạng thái mặc định',
        type: 'string',
        width: '20%',
      },
    },
  };

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

}
