import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent } from '../../../../lib/data-manager/data-manger-list.component';
import { PbxExtensionModel } from '../../../../models/pbx-extension.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'ngx-extension-list',
  templateUrl: './extension-list.component.html',
  styleUrls: ['./extension-list.component.scss']
})
export class ExtensionListComponent extends DataManagerListComponent<PbxExtensionModel> implements OnInit {

  formPath = '/ivoip/extensions/form';
  apiPath = '/ivoip/extensions';
  idKey = 'extension_uuid';

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
      extension: {
        title: 'Extension',
        type: 'string',
      },
      description: {
        title: 'Diễn giải',
        type: 'string',
        filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
      },
      number_alias: {
        title: 'Alias',
        type: 'string',
      },
      accountcode: {
        title: 'Số Public',
        type: 'string',
      },
      call_group: {
        title: 'Nhóm',
        type: 'string',
      },
      user_record: {
        title: 'Ghi âm',
        type: 'string',
      },
      enabled: {
        title: 'Kích hoạt',
        type: 'string',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  ngOnInit() {
    super.ngOnInit();
  }

  onReloadBtnClick(): false {
    this.loadList();
    return false;
  }

  // onGenerateExtensionsBtnClick(): false {
  //   this.router.navigate([this.formPath, '']);
  //   return false;
  // }

}
