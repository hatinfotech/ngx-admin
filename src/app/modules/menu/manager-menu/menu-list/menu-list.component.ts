import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { LocalDataSource } from 'ng2-smart-table';
import { MenuItemModel } from '../../../../models/menu-item.model';
import { ɵbo as Ng2SmartTableComponent, ɵbp as Row } from 'ng2-smart-table';
import { ShowcaseDialogComponent } from '../../../showcase-dialog/showcase-dialog.component';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { isNgTemplate } from '@angular/compiler';
import { DataManagerListComponent } from '../../../../lib/data-manager/data-manger-list.component';

@Component({
  selector: 'ngx-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss'],
})
export class MenuListComponent extends DataManagerListComponent<MenuItemModel> implements OnInit {

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
      No: {
        title: 'Stt',
        type: 'text',
        width: '5%',
        class: 'no',
        filter: false,
      },
      ParentTitle: {
        title: 'Menu cha',
        type: 'string',
        width: '20%',
        filterFunction: (value: string, query: string) => this.common.smartTableFilter(value, query),
      },
      Code: {
        title: 'Mã',
        type: 'string',
        width: '10%',
      },
      Title: {
        title: 'Tiêu đề',
        type: 'string',
        width: '25%',
        filterFunction: (value: string, query: string) => this.common.smartTableFilter(value, query),
      },
      Link: {
        title: 'Link',
        type: 'string',
        width: '20%',
      },
      Icon: {
        title: 'Icon',
        type: 'string',
        width: '10%',
      },
      Group: {
        title: 'Group',
        type: 'boolean',
        width: '10%',
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
    this.apiPath = '/menu/menu-items';
    this.idKey = 'Code';
  }

  ngOnInit() {
    super.ngOnInit();
  }

  gotoForm(id?: string): void {
    this.router.navigate(['menu/manager/form', id]);
  }

}
