import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { PbxCallBlockModel } from '../../../../models/pbx-call-block.model';
import { IvoipBaseListComponent } from '../../ivoip-base-list.component';
import { IvoipService } from '../../ivoip-service';
import { CallBlockFormComponent } from '../call-block-form/call-block-form.component';

@Component({
  selector: 'ngx-call-block-list',
  templateUrl: './call-block-list.component.html',
  styleUrls: ['./call-block-list.component.scss'],
})
export class CallBlockListComponent extends IvoipBaseListComponent<PbxCallBlockModel> implements OnInit {

  componentName: string = 'CallBlockListComponent';
  formPath = '/ivoip/call-blocks/form';
  apiPath = '/ivoip/call-blocks';
  idKey = 'call_block_uuid';

  constructor(
    protected apiService: ApiService,
    public router: Router,
    protected commonService: CommonService,
    protected dialogService: NbDialogService,
    protected toastService: NbToastrService,
    public ivoipService: IvoipService,
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
      call_block_number: {
        title: 'Number',
        type: 'string',
        width: '10%',
      },
      call_block_name: {
        title: 'Name',
        type: 'string',
        width: '20%',
      },
      call_block_count: {
        title: 'Só lần chặn',
        type: 'string',
        width: '10%',
      },
      accountcode: {
        title: 'Số Public',
        type: 'string',
        width: '20%',
      },
      call_block_action: {
        title: 'Hành động',
        type: 'string',
        width: '20%',
      },
      date_added: {
        title: 'Ngày khai báo',
        type: 'string',
        width: '10%',
      },
      call_block_enabled: {
        title: 'Đã chặn',
        type: 'string',
        width: '10%',
      },
    },
  };

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  /** Implement required */
  openFormDialplog(ids?: string[], onDialogSave?: (newData: PbxCallBlockModel[]) => void, onDialogClose?: () => void) {
    this.dialogService.open(CallBlockFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: ids,
        onDialogSave: (newData: PbxCallBlockModel[]) => {
          if (onDialogSave) onDialogSave(newData);
        },
        onDialogClose: () => {
          if (onDialogClose) onDialogClose();
          this.refresh();
        },
      },
      closeOnEsc: false,
      closeOnBackdropClick: false,
    });
  }

  /** Go to form */
  gotoForm(id?: string): false {
    this.openFormDialplog(id ? decodeURIComponent(id).split('&') : null);
    return false;
  }

}
