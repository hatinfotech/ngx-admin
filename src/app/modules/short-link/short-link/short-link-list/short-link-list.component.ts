import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent, SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { ShortLinkModel } from '../../../../models/short-link.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { ShortLinkFormComponent } from '../short-link-form/short-link-form.component';

@Component({
  selector: 'ngx-short-link-list',
  templateUrl: './short-link-list.component.html',
  styleUrls: ['./short-link-list.component.scss'],
})
export class ShortLinkListComponent extends DataManagerListComponent<ShortLinkModel> implements OnInit {

  componentName: string = 'ShortLinkListComponent';
  formPath = '/short-link/short-link/form';
  apiPath = '/short-link/short-links';
  idKey = 'Hash';
  formDialog = ShortLinkFormComponent;

  constructor(
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
  ) {
    super(apiService, router, cms, dialogService, toastService);
  }

  editing = {};
  rows = [];

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
        Hash: {
          title: 'Code',
          type: 'string',
          width: '30%',
        },
        Target: {
          title: 'Target',
          type: 'string',
          width: '30%',
        },
        Owner: {
          title: 'Owner',
          type: 'string',
          width: '10%',
        },
        Created: {
          title: 'Created',
          type: 'string',
          width: '10%',
        },
        Active: {
          title: 'Active',
          type: 'boolean',
          width: '10%',
        },
        //   Copy: {
        //     title: 'Copy',
        //     type: 'custom',
        //     width: '10%',
        //     renderComponent: SmartTableButtonComponent,
        //     onComponentInitFunction: (instance: SmartTableButtonComponent) => {
        //       instance.iconPack = 'eva';
        //       instance.icon = 'copy';
        //       instance.label = 'Copy nội dung sang site khác';
        //       instance.display = true;
        //       instance.status = 'success';
        //       instance.valueChange.subscribe(value => {
        //         // if (value) {
        //         //   instance.disabled = false;
        //         // } else {
        //         //   instance.disabled = true;
        //         // }
        //       });
        //       instance.click.subscribe(async (row: ShortLinkModel) => {

        //         this.cms.openDialog(SyncFormComponent, {
        //           context: {
        //             inputMode: 'dialog',
        //             inputId: [row.Code],
        //             onDialogSave: (newData: ShortLinkModel[]) => {
        //               // if (onDialogSave) onDialogSave(row);
        //             },
        //             onDialogClose: () => {
        //               // if (onDialogClose) onDialogClose();
        //               this.refresh();
        //             },
        //           },
        //         });

        //       });
        //     },
        //   },
      },
    });
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  getList(callback: (list: ShortLinkModel[]) => void) {
    super.getList((rs) => {
      if (callback) callback(rs);
    });
  }

  /** Implement required */
  // openFormDialplog(ids?: string[], onDialogSave?: (newData: ShortLinkModel[]) => void, onDialogClose?: () => void) {
  //   this.cms.openDialog(ShortLinkFormComponent, {
  //     context: {
  //       inputMode: 'dialog',
  //       inputId: ids,
  //       onDialogSave: (newData: ShortLinkModel[]) => {
  //         if (onDialogSave) onDialogSave(newData);
  //       },
  //       onDialogClose: () => {
  //         if (onDialogClose) onDialogClose();
  //         this.refresh();
  //       },
  //     },
  //   });
  // }

  // /** Go to form */
  // gotoForm(id?: string): false {
  //   this.openFormDialplog(id ? decodeURIComponent(id).split('&') : null);
  //   return false;
  // }

}
