import { Component, OnInit } from '@angular/core';
import { SystemParameterModel } from '../../../../models/system.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { SystemParameterFormComponent } from '../system-parameter-form/system-parameter-form.component';

@Component({
  selector: 'ngx-system-parameter-list',
  templateUrl: './system-parameter-list.component.html',
  styleUrls: ['./system-parameter-list.component.scss'],
})
export class SystemParameterListComponent extends ServerDataManagerListComponent<SystemParameterModel> implements OnInit {

  componentName: string = 'SystemParameterListComponent';
  formPath = '/system/parameter/form';
  apiPath = '/system/parameters';
  idKey = 'Name';
  formDialog = SystemParameterFormComponent;

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

  initDataSource() {
    const source = super.initDataSource();

    // Set DataSource: prepareData
    source.prepareData = (data: SystemParameterModel[]) => {
      // data.forEach(item => {
      //   item['Thumbnail'] += '?token=' + this.apiService.getAccessToken();
      //   item['DownloadLink'] += '?token=' + this.apiService.getAccessToken();
      // });
      return data;
    };

    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {
      // params['sort_Id'] = 'desc';
      return params;
    };

    return source;
  }

  /** Api get funciton */
  executeGet(params: any, success: (resources: SystemParameterModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: SystemParameterModel[] | HttpErrorResponse) => void) {
    params['useBaseTimezone'] = true;
    super.executeGet(params, success, error, complete);
  }

  editing = {};
  rows = [];

  settings = this.configSetting({
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
      Name: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.name'), 'head-title'),
        type: 'string',
        width: '30%',
      },
      Type: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.type'), 'head-title'),
        type: 'string',
        width: '10%',
      },
      Value: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.value'), 'head-title'),
        type: 'string',
        width: '30%',
      },
      Module: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.module'), 'head-title'),
        type: 'string',
        width: '20%',
      },
      IsApplied: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.enable'), 'head-title'),
        type: 'boolean',
        editable: true,
        width: '10%',
        onChange: (value, rowData: SystemParameterModel) => {
          // rowData.AutoUpdate = value;
          this.apiService.putPromise<SystemParameterModel[]>('/system/parameters', {}, [{ Name: rowData.Name, IsApplied: value }]).then(rs => {
            console.info(rs);
          });
        },
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
      //       instance.click.subscribe(async (row: ParameterModel) => {

      //         this.dialogService.open(SyncFormComponent, {
      //           context: {
      //             inputMode: 'dialog',
      //             inputId: [row.Code],
      //             onDialogSave: (newData: ParameterModel[]) => {
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

  ngOnInit() {
    this.restrict();
    super.ngOnInit();

    // this.apiService.getObservable<ProductModel[]>('/admin-product/products', {})
    //   .pipe(map(product => {
    //     return {
    //       product: product,
    //     };
    //   }));
  }

  getList(callback: (list: SystemParameterModel[]) => void) {
    super.getList((rs) => {
      if (callback) callback(rs);
    });
  }

  /** Implement required */
  // openFormDialplog(ids?: string[], onDialogSave?: (newData: SystemParameterModel[]) => void, onDialogClose?: () => void) {
  //   this.dialogService.open(SystemParameterFormComponent, {
  //     context: {
  //       inputMode: 'dialog',
  //       inputId: ids,
  //       onDialogSave: (newData: SystemParameterModel[]) => {
  //         if (onDialogSave) onDialogSave(newData);
  //       },
  //       onDialogClose: () => {
  //         if (onDialogClose) onDialogClose();
  //         this.refresh();
  //       },
  //     },
  //     closeOnEsc: false,
  //     closeOnBackdropClick: false,
  //   });
  // }

  // /** Go to form */
  // gotoForm(id?: string): false {
  //   this.openFormDialplog(id ? decodeURIComponent(id).split('&') : null);
  //   return false;
  // }

}
