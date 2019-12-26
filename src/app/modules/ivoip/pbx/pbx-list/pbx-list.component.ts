import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { DataManagerListComponent } from '../../../../lib/data-manager/data-manger-list.component';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { PbxModel } from '../../../../models/pbx.model';

@Component({
  selector: 'ngx-pbx-list',
  templateUrl: './pbx-list.component.html',
  styleUrls: ['./pbx-list.component.scss'],
})
export class PbxListComponent extends DataManagerListComponent<PbxModel> implements OnInit {

  componentName = 'PbxListComponent';
  formPath: string = '/ivoip/pbxs/form';
  apiPath: string = '/ivoip/pbxs';
  idKey: string = 'Code';

  constructor(
    protected apiService: ApiService,
    protected router: Router,
    protected common: CommonService,
    protected dialogService: NbDialogService,
    protected toastService: NbToastrService,
  ) {
    super(apiService, router, common, dialogService, toastService);
    // this.apiPath = '/user/groups';
    // this.idKey = 'Code';
  }

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
      perPage: 9999999,
    },
    columns: {
      No: {
        title: 'Stt',
        type: 'text',
        width: '5%',
        class: 'no',
        filter: false,
      },
      Code: {
        title: 'Mã',
        type: 'string',
        width: '15%',
      },
      Name: {
        title: 'Tên',
        type: 'string',
        width: '30%',
        filterFunction: (value: string, query: string) => this.common.smartFilter(value, query),
      },
      Description: {
        title: 'Mô tả',
        type: 'string',
        width: '50%',
        filterFunction: (value: string, query: string) => this.common.smartFilter(value, query),
      },
      ApiVersion: {
        title: 'Version',
        type: 'string',
        width: '10%',
      },
    },
  };

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  onDeclareNewDomainForPbx(): false {

    return false;
  }

}
