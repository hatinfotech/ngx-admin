import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { NbDialogService } from '@nebular/theme';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { LocalDataSource } from 'ng2-smart-table';
import { UserModel } from '../../../models/users/user.model';
import { ModuleModel } from '../../../models/modules/module.model';

@Component({
  selector: 'ngx-module-list',
  templateUrl: './module-list.component.html',
  styleUrls: ['./module-list.component.scss']
})
export class ModuleListComponent implements OnInit {

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
      No: {
        title: 'Stt',
        type: 'number',
        width: '5%',
        class: 'no',
        filter: false,
      },
      Name: {
        title: 'Name',
        type: 'string',
        width: '45%',
        filterFunction: (value: string, query: string) => this.common.smartTableFilter(value, query),
      },
      Description: {
        title: 'Diễn giải',
        type: 'string',
        width: '50%',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  ngOnInit() {
    // Load user list
    this.apiService.get<ModuleModel[]>('/module/modules', { limit: 999999999, offset: 0 }, results => this.source.load(results.map((item, index) => {
      item['No'] = index + 1;
      return item;
    })));
  }

  onEditAction(event: {data: ModuleModel}) {
    this.router.navigate(['modules/manager/form', event.data.Name]);
  }

  onCreateAction(event) {
    this.router.navigate(['modules/manager/form']);
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

}
