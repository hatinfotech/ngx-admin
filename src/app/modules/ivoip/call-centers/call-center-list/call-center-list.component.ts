import { Component, OnInit } from '@angular/core';
import { PbxCallCenterQueueModel } from '../../../../models/pbx-center-queue.model';
import { IvoipBaseListComponent } from '../../ivoip-base-list.component';
import { LocalDataSource } from 'ng2-smart-table';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { IvoipService } from '../../ivoip-service';

@Component({
  selector: 'ngx-call-center-list',
  templateUrl: './call-center-list.component.html',
  styleUrls: ['./call-center-list.component.scss'],
})
export class CallCenterListComponent  extends IvoipBaseListComponent<PbxCallCenterQueueModel> implements OnInit {

  componentName = 'CallCenterListComponent';
  formPath = '/ivoip/call-centers/form';
  apiPath = '/ivoip/call-centers';
  idKey = 'call_center_queue_uuid';

  inboundSource: LocalDataSource = new LocalDataSource();
  outboundSource: LocalDataSource = new LocalDataSource();

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
      queue_name: {
        title: 'Tên',
        type: 'string',
        width: '20%',
      },
      queue_extension: {
        title: 'Số đại diện',
        type: 'string',
        width: '20%',
      },
      queue_strategy: {
        title: 'Thuật toán',
        type: 'string',
        width: '20%',
      },
      queue_description: {
        title: 'Mô tả',
        type: 'string',
        width: '40%',
      },
    },
  };

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

}
