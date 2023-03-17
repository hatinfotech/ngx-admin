import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent, SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { CrawlServerModel } from '../../../../models/crawl.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SyncFormComponent } from '../../../wordpress/sync-form/sync-form.component';
import { CrawlServerFormComponent } from '../crawl-server-form/crawl-server-form.component';

@Component({
  selector: 'ngx-crawl-server-list',
  templateUrl: './crawl-server-list.component.html',
  styleUrls: ['./crawl-server-list.component.scss'],
})
export class CrawlServerListComponent extends DataManagerListComponent<CrawlServerModel> implements OnInit {

  componentName: string = 'CrawlServerListComponent';
  formPath = '/crawl/server/form';
  apiPath = '/crawl/servers';
  idKey = 'Code';
  formDialog = CrawlServerFormComponent;
  // protected _http: HttpClient;

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
          title: 'Tên',
          type: 'string',
          width: '30%',
        },
        Description: {
          title: 'Mô tả',
          type: 'string',
          width: '30%',
        },
        ApiVersion: {
          title: 'Api Version',
          type: 'string',
          width: '20%',
        },
        Action: {
          title: 'Action',
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
            instance.click.subscribe(async (row: CrawlServerModel) => {

              this.cms.openDialog(SyncFormComponent, {
                context: {
                  inputMode: 'dialog',
                  inputId: [row.Code],
                  onDialogSave: (newData: CrawlServerModel[]) => {
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

  getList(callback: (list: CrawlServerModel[]) => void) {
    super.getList((rs) => {
      // rs.map((i: any) => {
      //   i.Brandnames = i.Brandnames.map((i2: any) => i2.id).join(',');
      //   return i;
      // });
      if (callback) callback(rs);
    });
  }

  // /** Implement required */
  // openFormDialplog(ids?: string[], onDialogSave?: (newData: CrawlServerModel[]) => void, onDialogClose?: () => void) {
  //   this.cms.openDialog(CrawlServerFormComponent, {
  //     context: {
  //       inputMode: 'dialog',
  //       inputId: ids,
  //       onDialogSave: (newData: CrawlServerModel[]) => {
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

}
