import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { UserGroupModel } from '../../../../models/user-group.model';

@Component({
  selector: 'ngx-user-group-list',
  templateUrl: './user-group-list.component.html',
  styleUrls: ['./user-group-list.component.scss']
})
export class UserGroupListComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private router: Router,
    private common: CommonService,
  ) { }

  editing = {};
  rows = [];

  settings = {
    mode: 'external',
    actions: {
      position: 'right',
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
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
      Code: {
        title: 'Mã',
        type: 'string',
      },
      Name: {
        title: 'Name',
        type: 'string',
        filterFunction: (value: string, query: string) => this.common.smartTableFilter(value, query),
      },
      Username: {
        title: 'Description',
        type: 'string',
        filterFunction: (value: string, query: string) => this.common.smartTableFilter(value, query),
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  ngOnInit() {

    // Load user list
    this.apiService.get<UserGroupModel[]>('/user/groups', { limit: 999999999, offset: 0 }, results => this.source.load(results));

  }

  onEditAction(event) {
    this.router.navigate(['users/group/form', event.data.Code]);
  }

  onCreateAction(event) {
    this.router.navigate(['users/group/form']);
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

}
