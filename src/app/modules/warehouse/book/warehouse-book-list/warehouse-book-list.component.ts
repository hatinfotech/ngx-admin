import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent } from '../../../../lib/data-manager/data-manger-list.component';
import { WarehouseBookModel } from '../../../../models/warehouse.model';
import { WarehouseBookFormComponent } from '../warehouse-book-form/warehouse-book-form.component';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { WarehouseBookCommitComponent } from '../warehouse-book-commit/warehouse-book-commit.component';

@Component({
  selector: 'ngx-warehouse-book-list',
  templateUrl: './warehouse-book-list.component.html',
  styleUrls: ['./warehouse-book-list.component.scss'],
})
export class WarehouseBookListComponent extends DataManagerListComponent<WarehouseBookModel> implements OnInit {

  componentName: string = 'WarehouseBookListComponent';
  formPath = '/warehouse/book/form';
  apiPath = '/warehouse/books';
  idKey = 'Code';
  formDialog = WarehouseBookFormComponent;

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
  ) {
    super(apiService, router, commonService, dialogService, toastService);

    this.actionButtonList.map(button => {
      if (button.name === 'add') {
        button.name = 'openbook';
        button.icon = 'book-open';
        button.label = this.commonService.translateText('Common.openBook');
        button.title = this.commonService.translateText('Common.openBook');
        // button.click = () => {};
      }
      if (button.name === 'delete') {
        button.name = 'closebook';
        button.icon = 'lock';
        button.label = this.commonService.translateText('Common.lockBook');
        button.title = this.commonService.translateText('Common.lockBook');
        button.click = () => {};
      }
      return button;
    });
    this.actionButtonList.splice(2, 0,
      {
        name: 'commit',
        status: 'primary',
        label: this.commonService.translateText('Warehouse.Book.commit', 'head-title'),
        icon: 'lock',
        title: this.commonService.translateText('Warehouse.Book.commit', 'head-title'),
        size: 'medium',
        disabled: () => this.selectedIds.length === 0,
        click: () => {
          this.commonService.openDialog(WarehouseBookCommitComponent, {
            context: {
              inputWarehouseBooks: this.selectedItems,
              onDialogSave: (rs) => {
                this.refresh();
              },
            },
          });
          return false;
        },
      },
    );

    // Remove edit button
    this.actionButtonList = this.actionButtonList.filter(button => button.name !== 'edit');
  }

  editing = {};
  rows = [];

  settings = this.configSetting({
    mode: 'external',
    selectMode: 'multi',
    actions: {
      position: 'right',
    },
    // add: this.configAddButton(),
    // edit: this.configEditButton(),
    // delete: this.configDeleteButton(),
    // pager: this.configPaging(),
    columns: {
      Warehouse: {
        title: this.commonService.translateText('Common.warehouse'),
        type: 'string',
        width: '30%',
      },
      Note: {
        title: this.commonService.translateText('Common.note'),
        type: 'string',
        width: '30%',
      },
      Commited: {
        title: this.commonService.translateText('Warehouse.Book.commit'),
        type: 'datetime',
        width: '15%',
      },
      State: {
        title: this.commonService.translateText('Common.state'),
        type: 'string',
        width: '15%',
      },
    },
  });

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  /** Api get funciton */
  executeGet(params: any, success: (resources: WarehouseBookModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: WarehouseBookModel[] | HttpErrorResponse) => void) {
    params['includeParent'] = true;
    params['includePath'] = true;
    params['includeWarehouse'] = true;
    super.executeGet(params, success, error, complete);
  }

  getList(callback: (list: WarehouseBookModel[]) => void) {
    super.getList((rs) => {
      // rs.forEach(item => {
      //   item.Content = item.Content.substring(0, 256) + '...';
      // });
      if (callback) callback(rs.map(item => ({ ...item, Warehouse: this.commonService.getObjectText(item.Warehouse) })));
    });
  }

}

