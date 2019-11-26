import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { UserGroupModel } from '../../../../models/user-group.model';
import { DataManagerListComponent } from '../../../../lib/data-manager/data-manger-list.component';
import { NbDialogService, NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-user-group-list',
  templateUrl: './user-group-list.component.html',
  styleUrls: ['./user-group-list.component.scss'],
})
export class UserGroupListComponent extends DataManagerListComponent<UserGroupModel> implements OnInit {

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
        width: '30%',
        filterFunction: (value: string, query: string) => this.common.smartTableFilter(value, query),
      },
      Description: {
        title: 'Description',
        type: 'string',
        width: '50%',
        filterFunction: (value: string, query: string) => this.common.smartTableFilter(value, query),
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  ngOnInit() {
    super.ngOnInit();
    // Load user list
    // this.apiService.get<UserGroupModel[]>('/user/groups', { limit: 999999999, offset: 0 }, results => this.source.load(results));

  }

  // onEditAction(event) {
  //   this.router.navigate(['users/group/form', event.data.Code]);
  // }

  // onCreateAction(event) {
  //   this.router.navigate(['users/group/form']);
  // }

  // onDeleteConfirm(event): void {
  //   if (window.confirm('Are you sure you want to delete?')) {
  //     event.confirm.resolve();
  //   } else {
  //     event.confirm.reject();
  //   }
  // }

// gotoForm(id?: string): void {
//     this.router.navigate(['users/group/form', id]);
//   }

}
