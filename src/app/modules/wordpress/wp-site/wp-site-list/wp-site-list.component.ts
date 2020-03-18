import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent } from '../../../../lib/data-manager/data-manger-list.component';
import { WpSiteModel } from '../../../../models/wordpress.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { WpSiteFormComponent } from '../wp-site-form/wp-site-form.component';
import { HttpClient } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table-checkbox.component';
import { SyncFormComponent } from '../../sync-form/sync-form.component';

@Component({
  selector: 'ngx-wp-site-list',
  templateUrl: './wp-site-list.component.html',
  styleUrls: ['./wp-site-list.component.scss'],
})
export class WpSiteListComponent extends DataManagerListComponent<WpSiteModel> implements OnInit {

  componentName: string = 'EmailGatewayListComponent';
  formPath = '/email-marketing/gateway/form';
  apiPath = '/wordpress/wp-sites';
  idKey = 'Code';
  // protected _http: HttpClient;

  constructor(
    protected apiService: ApiService,
    public router: Router,
    protected commonService: CommonService,
    protected dialogService: NbDialogService,
    protected toastService: NbToastrService,
    protected _http: HttpClient,
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
      Name: {
        title: 'Name',
        type: 'string',
        width: '30%',
      },
      Domain: {
        title: 'Domain',
        type: 'string',
        width: '20%',
      },
      ApiUrl: {
        title: 'API',
        type: 'string',
        width: '20%',
      },
      ApiUsername: {
        title: 'Username',
        type: 'string',
        width: '20%',
      },
      Copy: {
        title: 'Copy',
        type: 'custom',
        width: '10%',
        renderComponent: SmartTableButtonComponent,
        onComponentInitFunction: (instance: SmartTableButtonComponent) => {
          instance.iconPack = 'eva';
          instance.icon = 'copy';
          instance.label = 'Copy nội dung sang site khác';
          instance.display = true;
          instance.status = 'success';
          instance.valueChange.subscribe(value => {
            // if (value) {
            //   instance.disabled = false;
            // } else {
            //   instance.disabled = true;
            // }
          });
          instance.click.subscribe(async (row: WpSiteModel) => {

            this.dialogService.open(SyncFormComponent, {
              context: {
                inputMode: 'dialog',
                inputId: [row.Code],
                onDialogSave: (newData: WpSiteModel[]) => {
                  // if (onDialogSave) onDialogSave(row);
                },
                onDialogClose: () => {
                  // if (onDialogClose) onDialogClose();
                  this.refresh();
                },
              },
            });

          });
        },
      },
    },
  };

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  getList(callback: (list: WpSiteModel[]) => void) {
    super.getList((rs) => {
      // rs.map((i: any) => {
      //   i.Brandnames = i.Brandnames.map((i2: any) => i2.id).join(',');
      //   return i;
      // });
      if (callback) callback(rs);
    });
  }

  /** Implement required */
  openFormDialplog(ids?: string[], onDialogSave?: (newData: WpSiteModel[]) => void, onDialogClose?: () => void) {
    this.dialogService.open(WpSiteFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: ids,
        onDialogSave: (newData: WpSiteModel[]) => {
          if (onDialogSave) onDialogSave(newData);
        },
        onDialogClose: () => {
          if (onDialogClose) onDialogClose();
          this.refresh();
        },
      },
    });
  }

  /** Go to form */
  gotoForm(id?: string): false {
    // this.router.navigate(id ? [this.formPath, id] : [this.formPath], { queryParams: { list: this.componentName } });
    this.openFormDialplog(id ? decodeURIComponent(id).split('&') : null);
    return false;
  }

  /** Api get funciton */
  // executeGet(params: any, success: (resources: WpSiteModel[]) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: WpSiteModel[] | HttpErrorResponse) => void) {
  //   // this.apiService.get<M[]>(this.apiPath, params, success, error, complete);
  //   params['token'] = 'undefined';
  //   const obs = this._http.get<WpSiteModel[]>('https://local.namsoftware.com:3001/wp-sites', {
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
  //     .subscribe((resources: WpSiteModel[]) => {
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
