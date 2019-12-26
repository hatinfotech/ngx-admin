import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { DataManagerListComponent } from '../../../lib/data-manager/data-manger-list.component';
import { CommonService } from '../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { PbxExtensionModel } from '../../../models/pbx-extension.model';

@Component({
  selector: 'ngx-extensions',
  templateUrl: './extensions.component.html',
  styleUrls: ['./extensions.component.scss'],
})
export class ExtensionsComponent extends DataManagerListComponent<PbxExtensionModel> implements OnInit {

  componentName = 'ExtensionsComponent';
  formPath = '';
  apiPath = '/ivoip/extensions';
  idKey = 'Id';

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

  // select2OptionForDomain = {
  //   placeholder: 'Chọn tổng đài...',
  //   allowClear: true,
  //   width: '100%',
  //   dropdownAutoWidth: true,
  //   minimumInputLength: 0,
  //   keyMap: {
  //     id: 'DoaminId',
  //     text: 'DoaminName',
  //   },
  // };
  // domainList: { id: string, text: string }[];

  ngOnInit() {
    this.restrict();
    // Get data from api
    // this.apiService.get<CdrModel[]>('/ivoip/cdr', { limit: 999999999, offset: 0 },
    //   priceReport => this.source.load(priceReport), e => {
    //     console.warn(e);
    //     if (e.status === 401) {
    //       this.router.navigate(['/auth/login']);
    //     }
    //   });

    super.ngOnInit();

    // this.domainList = [
    //   {
    //     DomainId: 'dfsdfdsf-dsf-sdf-sdf-dsf-sd',
    //     DomainName: 'thanphat.tongdaidientoan.com',
    //   },
    //   {
    //     DomainId: 'dfsdfdsf-dsf-sdf-sdf-dsf-231223',
    //     DomainName: 'vanthangdat.tongdaidientoan.com',
    //   },
    // ].filter(item => {
    //   item['id'] = item['DomainId'];
    //   item['text'] = item['DomainName'];
    //   return true;
    // }) as [];
  }

  onReloadBtnClick(): false {
    this.loadList();
    return false;
  }

  // onEditAction(event) {
  //   this.router.navigate(['sales/price-report/form', event.data.Code]);
  // }

  // onCreateAction(event) {
  //   this.router.navigate(['sales/price-report/form']);
  // }

  // onDeleteConfirm(event): void {
  //   if (window.confirm('Are you sure you want to delete?')) {
  //     event.confirm.resolve();
  //   } else {
  //     event.confirm.reject();
  //   }
  // }

}
