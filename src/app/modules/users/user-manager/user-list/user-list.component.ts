import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { UserModel } from '../../../../models/user.model';
import { DataManagerListComponent } from '../../../../lib/data-manager/data-manger-list.component';
import { NbDialogService, NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent extends DataManagerListComponent<UserModel> implements OnInit {

  formPath: string = 'users/user-manager/form';
  apiPath: string = '/user/users';
  idKey: string = 'Code';

  constructor(
    protected apiService: ApiService,
    protected router: Router,
    protected common: CommonService,
    protected dialogService: NbDialogService,
    protected toastService: NbToastrService,
  ) {
    super(apiService, router, common, dialogService, toastService);
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
      perPage: 100,
    },
    columns: {
      No: {
        title: 'Stt',
        type: 'number',
        width: '5%',
        class: 'no',
        filter: false,
      },
      Code: {
        title: 'Mã',
        type: 'string',
        width: '10%',
      },
      Name: {
        title: 'Name',
        type: 'string',
        width: '45%',
        filterFunction: (value: string, query: string) => this.common.smartFilter(value, query),
      },
      Username: {
        title: 'Username',
        type: 'string',
        width: '40%',
      },
    },
  };

  // source: LocalDataSource = new LocalDataSource();

  ngOnInit() {

    super.ngOnInit();

    // // Load user list
    // this.apiService.get<UserModel[]>('/user/users', { limit: 999999999, offset: 0 }, results => this.source.load(results.map((item, index) => {
    //   item['No'] = index + 1;
    //   return item;
    // })));

  }

  // onEditAction(event) {
  //   this.router.navigate(['users/user-manager/form', event.data.Code]);
  // }

  // onCreateAction(event) {
  //   this.router.navigate(['users/user-manager/form']);
  // }

  // onDeleteConfirm(event): void {
  //   if (window.confirm('Are you sure you want to delete?')) {
  //     event.confirm.resolve();
  //   } else {
  //     event.confirm.reject();
  //   }
  // }

}
