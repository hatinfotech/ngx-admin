import { LocalDataSource } from 'ng2-smart-table';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../../modules/dialog/showcase-dialog/showcase-dialog.component';
import { OnInit } from '@angular/core';

export abstract class DataManagerListComponent<M> implements OnInit {

  editing = {};
  rows = [];
  hasSelect = 'none';
  settings: any;

  /** Seleted ids */
  selectedIds: string[] = [];

  /** Local dat source */
  source: LocalDataSource = new LocalDataSource();

  abstract formPath: string;

  /** Restful api path */
  abstract apiPath: string;

  /** Resource id key */
  abstract idKey: string;

  constructor(
    protected apiService: ApiService,
    protected router: Router,
    protected common: CommonService,
    protected dialogService: NbDialogService,
    protected toastService: NbToastrService,
  ) {

  }

  /** List init event */
  ngOnInit() {
    this.loadList();
  }

  /** Get data from api and push to list */
  loadList() {
    this.apiService.get<M[]>(this.apiPath, { limit: 999999999, offset: 0 }, results => this.source.load(results.map((item, index) => {
      item['No'] = index + 1;
      return item;
    })));
  }

  /** Go to form */
  gotoForm(id?: string): void {
    this.router.navigate(id ? [this.formPath, id ] : [this.formPath]);
  }

  /** User select event */
  onUserRowSelect(event: any) {
    this.selectedIds = event.selected.map((item: M) => {
      return item[this.idKey];
    });
    console.info(event);
    if (this.selectedIds.length > 0) {
      this.hasSelect = 'selected';
    } else {
      this.hasSelect = 'none';
    }
  }

  /** Row select event */
  onRowSelect(event) {
    // console.info(event);
  }

  /** Edit event */
  onEditAction(event: { data: M }) {
    // this.router.navigate(['modules/manager/form', event.data[this.idKey]]);
    this.gotoForm(event.data[this.idKey]);
  }

  /** Create and multi edit/delete action */
  onCreateAction(event: any) {
    if (this.selectedIds.length > 0) {
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
                // this.router.navigate(['modules/manager/form/', this.selectedIds.join('-')]);
                this.gotoForm(this.selectedIds.join('-'));
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
                          this.apiService.delete(this.apiPath, this.selectedIds, result => {
                            this.loadList();
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
            },
          ],
        },
      });
    } else {
      // this.router.navigate(['modules/manager/form']);
      this.gotoForm();
    }
  }

  /** Delete action */
  delete(event): void {
    if (window.confirm('Bạn có muốn xoá dữ liệu \'' + event.data.Name + '\' không?')) {
      this.apiService.delete(this.apiPath, event.data.Name, result => {
        // event.confirm.resolve();
        // event._dataSet.data.splice(event.index, 1);
        this.source.remove(event.data);
      });
    } else {
      event.confirm.reject();
    }
  }
}
