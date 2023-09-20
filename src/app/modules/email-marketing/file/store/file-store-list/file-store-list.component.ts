import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { takeUntil } from "rxjs/operators";
import { SmartTableButtonComponent } from "../../../../../lib/custom-element/smart-table/smart-table.component";
import { DataManagerListComponent, SmartTableSetting } from "../../../../../lib/data-manager/data-manger-list.component";
import { FileStoreModel } from "../../../../../models/file.model";
import { ApiService } from "../../../../../services/api.service";
import { CommonService } from "../../../../../services/common.service";
import { RootServices } from "../../../../../services/root.services";
import { ShowcaseDialogComponent } from "../../../../dialog/showcase-dialog/showcase-dialog.component";
import { FileStoreFormComponent } from "../file-store-form/file-store-form.component";

@Component({
  selector: 'ngx-file-store-list',
  templateUrl: './file-store-list.component.html',
  styleUrls: ['./file-store-list.component.scss'],
})
export class FileStoreListComponent extends DataManagerListComponent<FileStoreModel> implements OnInit {

  componentName: string = 'FileStoreListComponent';
  formPath = '/file/store/form';
  apiPath = '/file/file-stores';
  idKey = 'Code';
  formDialog = FileStoreFormComponent;

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
        Code: {
          title: 'Code',
          type: 'string',
          width: '10%',
        },
        Name: {
          title: 'Tên',
          type: 'string',
          width: '40%',
        },
        Host: {
          title: 'Host',
          type: 'string',
          width: '40%',
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
        //       instance.click.subscribe(async (row: FileStoreModel) => {

        //         this.cms.openDialog(SyncFormComponent, {
        //           context: {
        //             inputMode: 'dialog',
        //             inputId: [row.Code],
        //             onDialogSave: (newData: FileStoreModel[]) => {
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
        Token: {
          title: this.cms.translateText('Common.token'),
          type: 'custom',
          width: '10%',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.label = 'Tạo token';
            instance.iconPack = 'eva';
            instance.icon = 'unlock';
            instance.display = true;
            instance.status = 'danger';
            instance.title = this.cms.translateText('ZaloOa.Webhook.token');
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((fileStore: FileStoreModel) => {
              this.apiService.getPromise<FileStoreModel[]>('/file/file-stores', { 'generateToken': true, id: [fileStore.Code] }).then(token => {
                this.cms.openDialog(ShowcaseDialogComponent, {
                  context: {
                    title: this.cms.translateText('File.FileStore.token'),
                    content: token[0].Token,
                    actions: [
                      {
                        label: this.cms.translateText('Common.close'),
                        status: 'danger',
                      },
                    ],
                  },
                });
              });
            });
          },
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
    public _http: HttpClient,
  ) {
    super(rsv, apiService, router, cms, dialogService, toastService);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  /** Api get funciton */
  executeGet(params: any, success: (resources: FileStoreModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: FileStoreModel[] | HttpErrorResponse) => void) {
    // params['includeParent'] = true;
    super.executeGet(params, success, error, complete);
  }

  getList(callback: (list: FileStoreModel[]) => void) {
    super.getList((rs) => {
      // rs.forEach(item => {
      //   item.Content = item.Content.substring(0, 256) + '...';
      // });
      if (callback) callback(rs);
    });
  }

  /** Implement required */
  // openFormDialplog(ids?: string[], onDialogSave?: (newData: FileStoreModel[]) => void, onDialogClose?: () => void) {
  //   this.cms.openDialog(FileStoreFormComponent, {
  //     context: {
  //       inputMode: 'dialog',
  //       inputId: ids,
  //       onDialogSave: (newData: FileStoreModel[]) => {
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
