import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent } from '../../../../lib/data-manager/data-manger-list.component';
import { PbxDomainModel } from '../../../../models/pbx-domain.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-domain-list',
  templateUrl: './domain-list.component.html',
  styleUrls: ['./domain-list.component.scss']
})
export class DomainListComponent  extends DataManagerListComponent<PbxDomainModel> implements OnInit {

  formPath: string = '/ivoip/domains/form';
  apiPath: string = '/ivoip/domains';
  idKey: string = 'Id';

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
      PbxDescription: {
        title: 'Tổng đài',
        type: 'string',
        width: '30%',
      },
      DomainName: {
        title: 'Domain',
        type: 'string',
        width: '30%',
      },
      Description: {
        title: 'Mô tả',
        type: 'string',
        width: '40%',
        filterFunction: (value: string, query: string) => this.common.smartFilter(value, query),
      },
    },
  };

  ngOnInit() {
    super.ngOnInit();
  }

  getList(callback: (list: PbxDomainModel[]) => void) {
    this.apiService.get<PbxDomainModel[]>(this.apiPath, { limit: 999999999, offset: 0, includePbxDescription: true }, results => callback(results));
  }

  onDeclareNewDomainForPbx(): false {

    return false;
  }

}
