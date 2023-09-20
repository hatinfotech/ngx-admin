import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../../../../services/common.service';
import { DataManagerListComponent, SmartTableSetting } from '../../../../../lib/data-manager/data-manger-list.component';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { ResourceModel } from '../../../../../models/resource.model';
import { RootServices } from '../../../../../services/root.services';
import { ApiService } from '../../../../../services/api.service';

@Component({
  selector: 'ngx-resource-list',
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.scss'],
})
export class ResourceListComponent extends DataManagerListComponent<ResourceModel> implements OnInit {

  componentName = 'ResourceListComponent';
  formPath: string = 'modules/resources/form';
  apiPath: string = '/module/resources';
  idKey: string = 'Name';

  /** Table settings */
  loadListSetting(): SmartTableSetting {
    return this.configSetting({
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
          filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
        },
        Description: {
          title: 'Diễn giải',
          type: 'string',
          width: '50%',
        },
      },
    });
  }

  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
  ) {
    super(rsv, apiService, router, cms, dialogService, toastService);
    // this.apiPath = '/module/modules';
    // this.idKey = 'Name';
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

}
