import { LocalDataSource } from 'ng2-smart-table';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../../modules/dialog/showcase-dialog/showcase-dialog.component';
import { OnInit } from '@angular/core';
import { BaseComponent } from '../base-component';

export abstract class DataManagerListComponent<M> extends BaseComponent implements OnInit {

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
    protected commonService: CommonService,
    protected dialogService: NbDialogService,
    protected toastService: NbToastrService,
  ) {
    super(commonService, router, apiService);
  }

  /** List init event */
  ngOnInit() {
    this.loadList();
  }

  getList(callback: (list: M[]) => void) {
    this.apiService.get<M[]>(this.apiPath, { limit: 999999999, offset: 0 }, results => callback(results));
  }

  /** Get data from api and push to list */
  loadList(callback?: (list: M[]) => void) {
    this.getList(list => {
      this.source.load(list.map((item, index) => {
        item['No'] = index + 1;
        return item;
      }));
      if (callback) callback(list);
    });
  }

  onReloadBtnClick(): false {
    this.loadList();
    return false;
  }

  /** Go to form */
  gotoForm(id?: string): void {
    this.router.navigate(id ? [this.formPath, id] : [this.formPath]);
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
  onSerialAction(event: any) {
    if (this.selectedIds.length > 0) {
      this.dialogService.open(ShowcaseDialogComponent, {
        context: {
          title: 'Xác nhận',
          content: 'Bạn muốn chỉnh sửa các dữ liệu đã chọn hay xoá chúng ?',
          actions: [
            {
              label: 'Xoá',
              icon: 'delete',
              status: 'danger',
              action: () => {
                this.deleteConfirm(this.selectedIds, () => this.loadList());
                // this.dialogService.open(ShowcaseDialogComponent, {
                //   context: {
                //     title: 'Xác nhận xoá dữ liệu',
                //     content: 'Dữ liệu sẽ bị xoá, bạn chắc chắn chưa ?',
                //     actions: [
                //       {
                //         label: 'Trở về',
                //         icon: 'back',
                //         status: 'info',
                //         action: () => { },
                //       },
                //       {
                //         label: 'Xoá',
                //         icon: 'delete',
                //         status: 'danger',
                //         action: () => {
                //           this.apiService.delete(this.apiPath, this.selectedIds, result => {
                //             this.loadList();
                //           });
                //         },
                //       },
                //     ],
                //   },
                // });
              },
            },
            {
              label: 'Trở về',
              icon: 'back',
              status: 'success',
              action: () => { },
            },
            {
              label: 'Chỉnh',
              icon: 'edit',
              status: 'warning',
              action: () => {
                // this.router.navigate(['modules/manager/form/', this.selectedIds.join('-')]);
                this.gotoForm(this.selectedIds.map(item => encodeURIComponent(item)).join(encodeURIComponent('&')));
              },
            },
          ],
        },
      });
    } else {
      // this.router.navigate(['modules/manager/form']);
      this.gotoForm();
    }
  }

  deleteConfirm(ids: string[], callback?: () => void) {
    this.dialogService.open(ShowcaseDialogComponent, {
      context: {
        title: 'Xác nhận xoá dữ liệu',
        content: 'Dữ liệu sẽ bị xoá, bạn chắc chắn chưa ?',
        actions: [
          {
            label: 'Trở về',
            icon: 'back',
            status: 'info',
            action: () => { },
          },
          {
            label: 'Xoá',
            icon: 'delete',
            status: 'danger',
            action: () => {
              // this.apiService.delete(this.apiPath, ids, result => {
              //   if (callback) callback();
              // });
              this.executeDelete(ids, callback);
            },
          },
        ],
      },
    });
  }

  executeDelete(ids: string[], callback: (result: any) => void) {
    this.apiService.delete(this.apiPath, ids, result => {
      if (callback) callback(result);
    });
  }

  /** Delete action */
  delete(event: any): void {
    this.deleteConfirm([event.data[this.idKey]], () => this.loadList());
    //   if (window.confirm('Bạn có muốn xoá dữ liệu \'' + event.data.Name + '\' không?')) {
    //     this.apiService.delete(this.apiPath, event.data.Name, result => {
    //       // event.confirm.resolve();
    //       // event._dataSet.data.splice(event.index, 1);
    //       this.source.remove(event.data);
    //     });
    //   } else {
    //     event.confirm.reject();
    //   }
  }
}
