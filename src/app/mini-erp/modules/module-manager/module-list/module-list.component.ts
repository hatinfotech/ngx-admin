import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { ModuleModel } from '../../../models/modules/module.model';
import { DataManagerListComponent } from '../../../lib/data-manager/data-manger-list.component';

@Component({
  selector: 'ngx-module-list',
  templateUrl: './module-list.component.html',
  styleUrls: ['./module-list.component.scss'],
})
export class ModuleListComponent extends DataManagerListComponent<ModuleModel> implements OnInit {

  /** Table settings */
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

  constructor(
    protected apiService: ApiService,
    protected router: Router,
    protected common: CommonService,
    protected dialogService: NbDialogService,
    protected toastService: NbToastrService,
  ) {
    super(apiService, router, common, dialogService, toastService);
    this.apiPath = '/module/modules';
    this.idKey = 'Name';
  }

  ngOnInit() {
    super.ngOnInit();
  }

  gotoForm(id?: string) {
    this.router.navigate(['modules/manager/form', id]);
  }

}
