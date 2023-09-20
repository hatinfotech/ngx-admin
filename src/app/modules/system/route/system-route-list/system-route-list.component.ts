import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent, SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { SystemRouteModel } from '../../../../models/system.model';
import { SystemRouteFormComponent } from '../system-route-form/system-route-form.component';
import { ApiService } from '../../../../services/api.service';
import { RootServices } from '../../../../services/root.services';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';

@Component({
  selector: 'ngx-system-route-list',
  templateUrl: './system-route-list.component.html',
  styleUrls: ['./system-route-list.component.scss'],
})
export class SystemRouteListComponent extends ServerDataManagerListComponent<SystemRouteModel> implements OnInit {

  componentName: string = 'SystemRouteListComponent';
  formPath = '/system/route/form';
  apiPath = '/system/routes';
  idKey = 'Code';
  formDialog = SystemRouteFormComponent;

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
          width: '30%',
        },
        Description: {
          title: 'Mô tả',
          type: 'string',
          width: '30%',
        },
        Priority: {
          title: 'Ưu tiên',
          type: 'string',
          width: '10%',
        },
        Enable: {
          title: 'Kích hoạt',
          type: 'boolean',
          width: '10%',
        },
        Copy: {
          title: 'Copy',
          type: 'custom',
          width: '10%',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'copy';
            instance.label = this.cms.translateText('Common.copy');
            instance.display = true;
            instance.status = 'success';
            instance.valueChange.subscribe(value => {
              // if (value) {
              //   instance.disabled = false;
              // } else {
              //   instance.disabled = true;
              // }
            });
            instance.click.subscribe(async (row: SystemRouteModel) => {

              this.cms.openDialog(SystemRouteFormComponent, {
                context: {
                  inputMode: 'dialog',
                  inputId: [row.Code],
                  isDuplicate: true,
                  onDialogSave: (newData: SystemRouteModel[]) => {
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
    });
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  getList(callback: (list: SystemRouteModel[]) => void) {
    super.getList((rs) => {
      if (callback) callback(rs);
    });
  }

  initDataSource() {
    const source = super.initDataSource();

    // Set DataSource: prepareData
    source.prepareData = (data: SystemRouteModel[]) => {
      data.forEach(item => {
        // item['Thumbnail'] += '?token=' + this.apiService.getAccessToken();
        // item['DownloadLink'] += '?token=' + this.apiService.getAccessToken();
      });
      return data;
    };

    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {
      params['sort_Priority'] = 'asc';
      return params;
    };

    return source;
  }
}
