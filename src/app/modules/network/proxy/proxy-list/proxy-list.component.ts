import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent } from '../../../../lib/data-manager/data-manger-list.component';
import { NetworkProxyModel } from '../../../../models/network.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { ProxyFormComponent } from '../proxy-form/proxy-form.component';

@Component({
  selector: 'ngx-proxy-list',
  templateUrl: './proxy-list.component.html',
  styleUrls: ['./proxy-list.component.scss'],
})
export class ProxyListComponent extends DataManagerListComponent<NetworkProxyModel> implements OnInit {

  componentName: string = 'ProxyListComponent';
  formPath = '/network/proxy/form';
  apiPath = '/network/proxies';
  idKey = 'Code';
  formDialog = ProxyFormComponent;
  // public _http: HttpClient;

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
      Code: {
        title: 'Code',
        type: 'string',
        width: '10%',
      },
      Description: {
        title: 'Mô tả',
        type: 'string',
        width: '20%',
      },
      Protocol: {
        title: 'Protocol',
        type: 'string',
        width: '10%',
      },
      Host: {
        title: 'Host',
        type: 'string',
        width: '20%',
      },
      Port: {
        title: 'Port',
        type: 'string',
        width: '10%',
      },
      Status: {
        title: 'Status',
        type: 'string',
        width: '10%',
      },
      Enabled: {
        title: 'Enabled',
        type: 'boolean',
        editable: true,
        width: '10%',
        onChange: (value, rowData: NetworkProxyModel) => {
          // rowData.AutoUpdate = value;
          this.apiService.putPromise<NetworkProxyModel[]>('/network/proxies', {}, [{ Code: rowData.Code, Enabled: value }]).then(rs => {
            console.info(rs);
          });
        },
      },
      // Copy: {
      //   title: 'Copy',
      //   type: 'custom',
      //   width: '10%',
      //   renderComponent: SmartTableButtonComponent,
      //   onComponentInitFunction: (instance: SmartTableButtonComponent) => {
      //     instance.iconPack = 'eva';
      //     instance.icon = 'copy';
      //     instance.label = 'Copy nội dung sang site khác';
      //     instance.display = true;
      //     instance.status = 'success';
      //     instance.valueChange.subscribe(value => {
      //       // if (value) {
      //       //   instance.disabled = false;
      //       // } else {
      //       //   instance.disabled = true;
      //       // }
      //     });
      //     instance.click.subscribe(async (row: NetworkProxyModel) => {

      //       this.dialogService.open(SyncFormComponent, {
      //         context: {
      //           inputMode: 'dialog',
      //           inputId: [row.Code],
      //           onDialogSave: (newData: NetworkProxyModel[]) => {
      //             // if (onDialogSave) onDialogSave(row);
      //           },
      //           onDialogClose: () => {
      //             // if (onDialogClose) onDialogClose();
      //             this.refresh();
      //           },
      //         },
      //       });

      //     });
      //   },
      // },
    },
  });

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  getList(callback: (list: NetworkProxyModel[]) => void) {
    super.getList((rs) => {
      // rs.map((i: any) => {
      //   i.Brandnames = i.Brandnames.map((i2: any) => i2.id).join(',');
      //   return i;
      // });
      if (callback) callback(rs);
    });
  }

  /** Implement required */
  // openFormDialplog(ids?: string[], onDialogSave?: (newData: NetworkProxyModel[]) => void, onDialogClose?: () => void) {
  //   this.dialogService.open(ProxyFormComponent, {
  //     context: {
  //       inputMode: 'dialog',
  //       inputId: ids,
  //       onDialogSave: (newData: NetworkProxyModel[]) => {
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
  //   // this.router.navigate(id ? [this.formPath, id] : [this.formPath], { queryParams: { list: this.componentName } });
  //   this.openFormDialplog(id ? decodeURIComponent(id).split('&') : null);
  //   return false;
  // }

  /** Api get funciton */
  // executeGet(params: any, success: (resources: NetworkProxyModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: NetworkProxyModel[] | HttpErrorResponse) => void) {
  //   // this.apiService.get<M[]>(this.apiPath, params, success, error, complete);
  //   params['token'] = 'undefined';
  //   const obs = this._http.get<NetworkProxyModel[]>('https://local.namsoftware.com:3001/wp-sites', {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTZkYWE1ODZiM2JjODczMTU1ZmZkZTkiLCJpYXQiOjE1ODQyNDUzMzd9.DWJ9WPxxT3qRwL-vjpsvUNCq4iL9dg__VtHs71yb5hY',
  //     },
  //   })
  //     .pipe(retry(0), catchError(e => {
  //       if (error) error(e);
  //       if (complete) complete(e);
  //       return this.apiService.handleError(e, params['silent']);
  //     }))
  //     .subscribe((resources: NetworkProxyModel[]) => {
  //       success(resources);
  //       if (complete) complete(resources);
  //       obs.unsubscribe();
  //     });
  // }

  /** Api delete funciton */
  // executeDelete(id: any, success: (resp: any) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: any | HttpErrorResponse) => void) {
  //   // this.apiService.delete(this.apiPath, id, success, error, complete);
  // }

}
