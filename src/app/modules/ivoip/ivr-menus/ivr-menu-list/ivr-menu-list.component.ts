import { Component, OnInit } from '@angular/core';
import { IvoipBaseListComponent } from '../../ivoip-base-list.component';
import { PbxIvrMenuModel } from '../../../../models/pbx-ivr-menu.model';
import { LocalDataSource } from 'ng2-smart-table';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { IvoipService } from '../../ivoip-service';
import { PbxDialplanDetailModel } from '../../../../models/pbx-dialplan-detail.model';
import { PbxIvrMenuOptionModel } from '../../../../models/pbx-ivr-menu-option.model';

@Component({
  selector: 'ngx-ivr-menu-list',
  templateUrl: './ivr-menu-list.component.html',
  styleUrls: ['./ivr-menu-list.component.scss'],
})
export class IvrMenuListComponent extends IvoipBaseListComponent<PbxIvrMenuModel> implements OnInit {

  formPath = '/ivoip/ivr-menus/form';
  apiPath = '/ivoip/ivr-menus';
  idKey = 'ivr_menu_uuid';

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
      // app_name: {
      //   title: 'Ứng dụng',
      //   type: 'string',
      //   width: '10%',
      // },
      ivr_menu_name: {
        title: 'Tên',
        type: 'string',
        width: '20%',
      },
      ivr_menu_extension: {
        title: 'Số',
        type: 'string',
        width: '20%',
      },
      ivr_menu_description: {
        title: 'Mô tả',
        type: 'string',
        width: '40%',
      },
      ivr_menu_enabled: {
        title: 'Kích hoạt',
        type: 'string',
        width: '10%',
      },
    },
  };

  ngOnInit() {
    super.ngOnInit();
  }

}
