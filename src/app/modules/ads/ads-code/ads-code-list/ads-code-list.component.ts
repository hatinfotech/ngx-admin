import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent } from '../../../../lib/data-manager/data-manger-list.component';
import { AdsCodeModel } from '../../../../models/ads.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { AdsCodeFormComponent } from '../ads-code-form/ads-code-form.component';

@Component({
  selector: 'ngx-ads-code-list',
  templateUrl: './ads-code-list.component.html',
  styleUrls: ['./ads-code-list.component.scss'],
})
export class AdsCodeListComponent extends DataManagerListComponent<AdsCodeModel> implements OnInit {

  componentName: string = 'AdsCodeListComponent';
  formPath = '/ads/code/form';
  apiPath = '/ads/codes';
  idKey = 'Code';
  formDialog = AdsCodeFormComponent;

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
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
      Code: {
        title: 'Code',
        type: 'string',
        width: '10%',
      },
      Type: {
        title: 'Type',
        type: 'string',
        width: '10%',
      },
      Site: {
        title: 'Site',
        type: 'string',
        width: '40%',
      },
      Area: {
        title: 'Target',
        type: 'string',
        width: '30%',
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
    //       instance.click.subscribe(async (row: AdsCodeModel) => {

    //         this.commonService.openDialog(SyncFormComponent, {
    //           context: {
    //             inputMode: 'dialog',
    //             inputId: [row.Code],
    //             onDialogSave: (newData: AdsCodeModel[]) => {
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
  };

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  getList(callback: (list: AdsCodeModel[]) => void) {
    super.getList((rs) => {
      if (callback) callback(rs);
    });
  }

  // /** Implement required */
  // openFormDialplog(ids?: string[], onDialogSave?: (newData: AdsCodeModel[]) => void, onDialogClose?: () => void) {
  //   this.commonService.openDialog(AdsCodeFormComponent, {
  //     context: {
  //       inputMode: 'dialog',
  //       inputId: ids,
  //       onDialogSave: (newData: AdsCodeModel[]) => {
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
