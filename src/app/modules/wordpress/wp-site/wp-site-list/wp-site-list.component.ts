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
import { SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SyncFormComponent } from '../../sync-form/sync-form.component';

@Component({
  selector: 'ngx-wp-site-list',
  templateUrl: './wp-site-list.component.html',
  styleUrls: ['./wp-site-list.component.scss'],
})
export class WpSiteListComponent extends DataManagerListComponent<WpSiteModel> implements OnInit {

  componentName: string = 'WpSiteListComponent';
  formPath = '/wordpress/site/form';
  apiPath = '/wordpress/wp-sites';
  idKey = 'Code';

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
    this.openFormDialplog(id ? decodeURIComponent(id).split('&') : null);
    return false;
  }

}
