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

  formPath: string = '/users/group/form';
  apiPath: string = '/user/groups';
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
      perPage: 100,
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
        title: 'Name',
        type: 'string',
        width: '20%',
        filterFunction: (value: string, query: string) => this.common.smartFilter(value, query),
      },
      Description: {
        title: 'Description',
        type: 'string',
        width: '30%',
        filterFunction: (value: string, query: string) => this.common.smartFilter(value, query),
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  ngOnInit() {
    super.ngOnInit();
  }

  /** Get data from api and push to list */
  loadList() {
    this.apiService.get<PbxModel[]>(this.apiPath, { limit: 999999999, offset: 0, includeParentInfo: true },
      results => this.source.load(results.map((item, index) => {
        item['No'] = index + 1;
        return item;
      })));
  }

}
