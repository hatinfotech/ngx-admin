import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { LocalDataSource } from 'ng2-smart-table';
import { MenuItemModel } from '../../../models/menu/menu-item.model';
import { ɵbo as Ng2SmartTableComponent, ɵbp as Row } from 'ng2-smart-table';
import { ShowcaseDialogComponent } from '../../../showcase-dialog/showcase-dialog.component';
import { NbDialogService } from '@nebular/theme';
import { isNgTemplate } from '@angular/compiler';

@Component({
  selector: 'ngx-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss'],
})
export class MenuListComponent implements OnInit, AfterViewInit {

  @ViewChild('table', { static: false }) table: Ng2SmartTableComponent;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private common: CommonService,
    private dialogService: NbDialogService,
  ) { }

  editing = {};
  rows = [];
  hasSelect = 'none';

  selectedRows: string[] = [];
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
      perPage: 20,
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

  source: LocalDataSource = new LocalDataSource();

  ngOnInit() {
    // Load user list
    // this.apiService.get<MenuItemModel[]>('/menu/menu-items', { limit: 999999999, offset: 0, sort_ParentTitle: 'asc' }, results => this.source.load(results.map((item, index) => {
    //   item['No'] = index + 1;
    //   item['Select'] = 0;
    //   return item;
    // })));

    this.reloadSource();

  }

  reloadSource() {
    this.apiService.get<MenuItemModel[]>('/menu/menu-items', { limit: 999999999, offset: 0, sort_ParentTitle: 'asc' }, results => this.source.load(results.map((item, index) => {
      item['No'] = index + 1;
      item['Select'] = 0;
      return item;
    })));
  }

  ngAfterViewInit(): void {
    // this.table.grid.getRows().forEach((row: Row) => {
    //   this.table.grid.multipleSelectRow(row);
    // });
  }

  onUserRowSelect(event) {
    this.selectedRows = event.selected.map((item: MenuItemModel) => {
      return item.Code;
    });
    console.info(event);
    if (this.selectedRows.length > 0) {
      this.hasSelect = 'selected';
    } else {
      this.hasSelect = 'none';
    }
  }

  onRowSelect(event) {
    // console.info(event);
  }

  onToggleRowSelect(event) {
    // console.info(event);
  }

  onEditAction(event: { data: MenuItemModel }) {
    this.router.navigate(['menu/manager/form', event.data.Code]);
  }

  onCreateAction() {
    if (this.selectedRows.length > 0) {
      this.dialogService.open(ShowcaseDialogComponent, {
        context: {
          title: 'Xác nhận',
          content: 'Bạn muốn chỉnh sửa các dữ liệu đã chọn hay xoá chúng ?',
          actions: [
            {
              label: 'Chỉnh',
              icon: 'edit',
              status: 'primary',
              action: () => {
                this.router.navigate(['menu/manager/form/', this.selectedRows.join('-')]);
              },
            },
            {
              label: 'Xoá',
              icon: 'delete',
              status: 'danger',
              action: () => {
                this.dialogService.open(ShowcaseDialogComponent, {
                  context: {
                    title: 'Xác nhận xoá dữ liệu',
                    content: 'Dữ liệu sẽ bị xoá, bạn chắc chắn chưa ?',
                    actions: [
                      {
                        label: 'Xoá',
                        icon: 'delete',
                        status: 'danger',
                        action: () => {
                          this.apiService.delete('/menu/menu-items', this.selectedRows, result => {
                            this.reloadSource();
                          });
                        },
                      },
                      {
                        label: 'Trở về',
                        icon: 'back',
                        status: 'info',
                      },
                    ],
                  },
                });
              },
            },
            {
              label: 'Trở về',
              icon: 'back',
              status: 'info',
              action: () => {

              },
            },
          ],
        },
      });
    } else {
      this.router.navigate(['menu/manager/form']);
    }
  }

  delete(event): void {
    if (window.confirm('Bạn có muốn xoá menu item ' + event.data.Title + ' này không?')) {
      this.apiService.delete('/menu/menu-items', event.data.Code, result => {
        // event.confirm.resolve();
        // event._dataSet.data.splice(event.index, 1);
        this.source.remove(event.data);
      });
    } else {
      event.confirm.reject();
    }
  }
}
