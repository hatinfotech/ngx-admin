import { Component, OnInit } from '@angular/core';
import { PbxCallCenterQueueModel } from '../../../../models/pbx-center-queue.model';
import { IvoipBaseListComponent } from '../../ivoip-base-list.component';
import { LocalDataSource } from 'ng2-smart-table';
import { ApiService } from '../../../../services/api.service';
import { RootServices } from '../../../../services/root.services';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { IvoipService } from '../../ivoip-service';
import { CallCenterFormComponent } from '../call-center-form/call-center-form.component';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';

@Component({
  selector: 'ngx-call-center-list',
  templateUrl: './call-center-list.component.html',
  styleUrls: ['./call-center-list.component.scss'],
})
export class CallCenterListComponent extends IvoipBaseListComponent<PbxCallCenterQueueModel> implements OnInit {

  componentName = 'CallCenterListComponent';
  formPath = '/ivoip/call-centers/form';
  apiPath = '/ivoip/call-centers';
  idKey = 'call_center_queue_uuid';
  formDialog = CallCenterFormComponent;

  inboundSource: LocalDataSource = new LocalDataSource();
  outboundSource: LocalDataSource = new LocalDataSource();

  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public ivoipService: IvoipService,
  ) {
    super(rsv, apiService, router, cms, dialogService, toastService, ivoipService);
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
    });
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  /** Implement required */
  // openFormDialplog(ids?: string[], onDialogSave?: (newData: PbxCallCenterQueueModel[]) => void, onDialogClose?: () => void) {
  //   this.cms.openDialog(CallCenterFormComponent, {
  //     context: {
  //       inputMode: 'dialog',
  //       inputId: ids,
  //       onDialogSave: (newData: PbxCallCenterQueueModel[]) => {
  //         if (onDialogSave) onDialogSave(newData);
  //         this.refresh();
  //       },
  //       onDialogClose: () => {
  //         if (onDialogClose) onDialogClose();
  //         // this.refresh();
  //       },
  //     },
  //     closeOnEsc: false,
  //     closeOnBackdropClick: false,
  //   });
  // }

  // /** Go to form */
  // gotoForm(id?: string): false {
  //   this.openFormDialplog(id ? decodeURIComponent(id).split('&') : null);
  //   return false;
  // }

}
