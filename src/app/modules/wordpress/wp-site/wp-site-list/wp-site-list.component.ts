import { DialogFormComponent } from './../../../dialog/dialog-form/dialog-form.component';
import { Component, OnInit } from '@angular/core';
import { DataManagerListComponent, SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { WpSiteModel } from '../../../../models/wordpress.model';
import { ApiService } from '../../../../services/api.service';
import { RootServices } from '../../../../services/root.services';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { WpSiteFormComponent } from '../wp-site-form/wp-site-form.component';
import { HttpClient } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SyncFormComponent } from '../../sync-form/sync-form.component';
import { FormGroup } from '@angular/forms';

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
  formDialog = WpSiteFormComponent;

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

              this.cms.openDialog(SyncFormComponent, {
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
        Webhook: {
          title: 'Webhook',
          type: 'custom',
          width: '10%',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'settings-outline';
            instance.label = 'Tạo webhook';
            instance.display = true;
            instance.status = 'danger';
            instance.valueChange.subscribe(value => {
              // if (value) {
              //   instance.disabled = false;
              // } else {
              //   instance.disabled = true;
              // }
            });
            instance.click.subscribe(async (row: WpSiteModel) => {
              this.loading = true;
              try {
                const results = await this.apiService.putPromise<WpSiteModel>('/wordpress/sites/' + row.Code, { generateWebhookToken: true }, [
                  {
                    Code: row.Code,
                  }
                ]);
                this.loading = false;
                const result = results[0];
                // this.cms.showDialog('Thông tin webhook', `Webhook: ${row.BaseUrl}\nToken: ${result.WebhookToken}`, []);
                const domain = this.cms.systemConfigs$?.value?.LICENSE_INFO?.register?.domain[0];
                const webhook = `https://${domain}/v3/wordpress/webhooks?token=${result.WebhookToken}`;
                this.cms.openDialog(DialogFormComponent, {
                  context: {
                    cardStyle: { width: '500px' },
                    title: 'Thông tin webhook',
                    onInit: async (form, dialog) => {
                      return true;
                    },
                    onClose: async (form, dialog) => {
                      // ev.target.
                      return true;
                    },
                    controls: [
                      {
                        name: 'Webhook',
                        label: 'Webhook',
                        placeholder: 'Webhook',
                        type: 'text',
                        initValue: webhook,
                        // focus: true,
                      },
                    ],
                    actions: [
                      {
                        label: 'Esc - Trở về',
                        icon: 'back',
                        status: 'basic',
                        keyShortcut: 'Escape',
                        action: async () => { return true; },
                      },
                      {
                        label: 'Copy',
                        icon: 'generate',
                        status: 'primary',
                        // keyShortcut: 'Enter',
                        action: async (form: FormGroup, formDialogConpoent: DialogFormComponent) => {
                          this.cms.copyTextToClipboard(webhook);
                          return false;
                        },
                      },
                    ],
                  },
                  closeOnEsc: false,
                  closeOnBackdropClick: false,
                });
              } catch (err) {
                this.loading = false;
              }
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

  getList(callback: (list: WpSiteModel[]) => void) {
    super.getList((rs) => {
      if (callback) callback(rs);
    });
  }

  /** Implement required */
  // openFormDialplog(ids?: string[], onDialogSave?: (newData: WpSiteModel[]) => void, onDialogClose?: () => void) {
  //   this.cms.openDialog(WpSiteFormComponent, {
  //     context: {
  //       inputMode: 'dialog',
  //       inputId: ids,
  //       onDialogSave: (newData: WpSiteModel[]) => {
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
