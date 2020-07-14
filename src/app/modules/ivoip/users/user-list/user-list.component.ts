import { Component, OnInit } from '@angular/core';
import { IvoipBaseListComponent } from '../../ivoip-base-list.component';
import { PbxUserModel } from '../../../../models/pbx-user.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { IvoipService } from '../../ivoip-service';

@Component({
  selector: 'ngx-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent extends IvoipBaseListComponent<PbxUserModel> implements OnInit {

  componentName: string = 'UserListComponent';
  formPath = '/ivoip/users/form';
  apiPath = '/ivoip/users';
  idKey = 'user_uuid';

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public ivoipService: IvoipService,
  ) {
    super(apiService, router, commonService, dialogService, toastService, ivoipService);
  }

  editing = {};
  rows = [];

  settings = this.configSetting({
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
      No: {
        title: 'Stt',
        type: 'string',
        width: '5%',
      },
      domain_name: {
        title: 'Domain',
        type: 'string',
        width: '30%',
      },
      username: {
        title: 'Username',
        type: 'string',
        width: '30%',
      },
      groups: {
        title: 'Nhóm',
        type: 'string',
        width: '20%',
      },
      user_enabled: {
        title: 'K.hoạt',
        type: 'string',
        width: '15%',
      },
    },
  });

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

}
