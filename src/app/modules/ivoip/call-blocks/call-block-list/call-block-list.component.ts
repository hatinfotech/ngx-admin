import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent } from '../../../../lib/data-manager/data-manger-list.component';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { PbxCallBlockModel } from '../../../../models/pbx-call-block.model';

@Component({
  selector: 'ngx-call-block-list',
  templateUrl: './call-block-list.component.html',
  styleUrls: ['./call-block-list.component.scss']
})
export class CallBlockListComponent extends DataManagerListComponent<PbxCallBlockModel> implements OnInit {

  formPath = '/ivoip/call-blocks/form';
  apiPath = '/ivoip/call-blocks';
  idKey = 'call_block_uuid';

  constructor(
    protected apiService: ApiService,
    protected router: Router,
    protected commonService: CommonService,
    protected dialogService: NbDialogService,
    protected toastService: NbToastrService,
  ) {
    super(apiService, router, commonService, dialogService, toastService);
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
        filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
      },
      call_block_name: {
        title: 'Name',
        type: 'string',
      },
      call_block_count: {
        title: 'Só lần chặn',
        type: 'string',
      },
      accountcode: {
        title: 'Số Public',
        type: 'string',
      },
      call_block_action: {
        title: 'Hành động',
        type: 'string',
      },
      date_added: {
        title: 'Ngày khai báo',
        type: 'string',
      },
      call_block_enabled: {
        title: 'Đã chặn',
        type: 'string',
      },
    },
  };

  ngOnInit() {
    super.ngOnInit();
  }

}
