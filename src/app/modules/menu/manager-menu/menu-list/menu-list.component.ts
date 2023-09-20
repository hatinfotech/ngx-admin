import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { RootServices } from '../../../../services/root.services';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { MenuItemModel } from '../../../../models/menu-item.model';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { DataManagerListComponent, SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';

@Component({
  selector: 'ngx-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss'],
})
export class MenuListComponent extends DataManagerListComponent<MenuItemModel> implements OnInit {

  componentName = 'MenuListComponent';
  formPath = 'menu/manager/form';
  apiPath = '/menu/menu-items';
  idKey = 'Code';

  loadListSetting(): SmartTableSetting {
    return this.configSetting({
      mode: 'external',
      selectMode: 'multi',
      actions: {
        position: 'right',
      },
      add: this.configAddButton(),
      edit: this.configEditButton(),
      delete: this.configDeleteButton(),
      pager: this.configPaging(),
      columns: {
        No: {
          title: 'Stt',
          type: 'text',
          width: '5%',
          // class: 'no',
          // filter: false,
        },
        ParentTitle: {
          title: 'Menu cha',
          type: 'string',
          width: '20%',
          filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
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
          filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
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
    // this.apiPath = '/menu/menu-items';
    // this.idKey = 'Code';
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  /** Get data from api and push to list */
  loadList(callback?: (list: MenuItemModel[]) => void) {
    super.loadList((list) => {
      callback(list.map(item => {
        item.Title = this.cms.translateText(item.Title, null, 'title');
        item.ParentTitle = this.cms.translateText(item.ParentTitle, null, 'title');
        return item;
      }));
    });
  }

}
