import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { takeUntil } from 'rxjs/operators';
import { AppModule } from '../../../../app.module';
import { SmartTableTagsComponent, SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableSelect2FilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { ResourcePermissionEditComponent } from '../../../../lib/lib-system/components/resource-permission-edit/resource-permission-edit.component';
import { ChatRoomModel } from '../../../../models/chat-room.model';
import { ProcessMap } from '../../../../models/process-map.model';
import { ApiService } from '../../../../services/api.service';
import { RootServices } from '../../../../services/root.services';
import { CommonService } from '../../../../services/common.service';
import { MobileAppService } from '../../../mobile-app/mobile-app.service';
import { CollaboratorPageFormComponent } from '../collaborator-page-form/collaborator-page-form.component';
import { ShowcaseDialogComponent } from '../../../dialog/showcase-dialog/showcase-dialog.component';
import { PageModel } from '../../../../models/page.model';

@Component({
  selector: 'ngx-collaborator-page-list',
  templateUrl: './collaborator-page-list.component.html',
  styleUrls: ['./collaborator-page-list.component.scss']
})
export class CollaboratorPageListComponent extends ServerDataManagerListComponent<PageModel> implements OnInit {

  componentName: string = 'CollaboratorPageListComponent';
  formPath = '/collaborator/page/form';
  apiPath = '/collaborator/pages';
  idKey = 'Code';
  formDialog = CollaboratorPageFormComponent;

  reuseDialog = true;

  // Smart table
  static filterConfig: any;
  static sortConf: any;
  static pagingConf = { page: 1, perPage: 40 };
  cycleMap: { [key: string]: string };
  stateList: { id: string, text: string }[];

  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<CollaboratorPageListComponent>,
    public mobileAppService: MobileAppService
  ) {
    super(rsv, apiService, router, cms, dialogService, toastService, ref);
  }

  async init() {
    // await this.loadCache();
    await this.cms.waitForReady();
    this.cycleMap = {
      MONTHLY: this.cms.translateText('Common.monthly'),
      YEARLY: this.cms.translateText('Common.yearly'),
    };
    this.stateList = [
      {
        id: 'ACTIVE',
        text: this.cms.translateText('Common.activated'),
      },
      {
        id: 'INACTIVE',
        text: this.cms.translateText('Common.inactivated'),
      },
      {
        id: 'EXPIREDSOON',
        text: this.cms.translateText('Common.expiredSoon'),
      },
      {
        id: 'OVEREXPIRED',
        text: this.cms.translateText('Common.overExpired'),
      },
      {
        id: 'EXPIRED',
        text: this.cms.translateText('Common.expired'),
      },
    ];
    return super.init().then(rs => {

      this.actionButtonList.unshift({
        type: 'button',
        name: 'generateConnectionString',
        label: this.cms.translateText(''),
        icon: 'cloud-upload-outline',
        status: 'danger',
        size: 'medium',
        title: this.cms.translateText('Tạo chuỗi kết nối'),
        click: () => {
          this.apiService.postPromise(this.apiPath, { generateConnectionString: true }, []).then(rs => {
            this.cms.showDialog('Chuỗi kết nối core', rs['data'], [
              {
                label: 'Đóng',
                status: 'basic',
                action: () => {

                },
              },
              {
                label: 'Copy',
                status: 'success',
                action: () => {

                },
              },
            ])
          });
        },
      });

      return rs;
    });
  }

  editing = {};
  rows = [];

  loadListSetting(): SmartTableSetting {
    return this.configSetting({
      columns: {
        Code: {
          title: this.cms.translateText('Common.code'),
          type: 'string',
          width: '10%',
        },
        Name: {
          title: this.cms.translateText('Common.name'),
          type: 'string',
          width: '20%',
        },
        Description: {
          title: this.cms.translateText('Common.description'),
          type: 'string',
          width: '40%',
        },
        PriceTable: {
          title: this.cms.translateText('Sales.priceTable '),
          type: 'string',
          width: '10%',
        },
        Created: {
          title: this.cms.translateText('Common.created'),
          type: 'datetime',
          width: '15%',
        },
        Push: {
          title: this.cms.translateText('Collaborator.Page.pushProductLabel'),
          type: 'custom',
          width: '10%',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'cloud-upload-outline';
            instance.display = true;
            instance.status = 'danger';
            instance.disabled = this.isChoosedMode;
            instance.title = this.cms.translateText('Collaborator.Page.pushProductLabel');
            instance.label = this.cms.translateText('Collaborator.Page.pushProductLabel');
            instance.init.subscribe((page: PageModel) => {
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: PageModel) => {
              this.cms.openDialog(ShowcaseDialogComponent, {
                closeOnBackdropClick: false,
                closeOnEsc: false,
                context: {
                  title: this.cms.translateText('Common.subscribe'),
                  content: this.cms.translateText('Collaborator.Page.pushProductConfirmText'),
                  actions: [
                    {
                      label: this.cms.translateText('Common.close'),
                      icon: 'arrow-ios-back-outline',
                      status: 'primary',
                    },
                    {
                      label: this.cms.translateText('Collaborator.Page.pushProductLabel'),
                      status: 'danger',
                      icon: 'cloud-upload-outline',
                      action: async (item, dialog) => {
                        dialog.setLoading(true);
                        try {
                          await this.apiService.putPromise<PageModel[]>('/collaborator/pages', { id: [rowData.Code], push: true }, [{ Code: rowData.Code }]).then(rs => {
                            this.cms.toastService.show(this.cms.translateText('Common.success'), this.cms.translateText('Collaborator.Page.pushProductSuccessText'), {
                              status: 'success',
                            });
                          });
                        } catch (err) {
                          dialog.setLoading(false);
                          this.cms.toastService.show('Lỗi đồng bộ', err?.logs?.join(', '), { status: 'dander' });
                        }
                        dialog.setLoading(false);
                        this.refresh();
                      }
                    },
                  ],
                },
              });
            });
          },
        },
        // Token: {
        //   title: this.cms.translateText('Common.token'),
        //   type: 'custom',
        //   width: '5%',
        //   // class: 'align-right',
        //   renderComponent: SmartTableButtonComponent,
        //   onComponentInitFunction: (instance: SmartTableButtonComponent) => {
        //     instance.iconPack = 'eva';
        //     instance.icon = 'award-outline';
        //     instance.display = true;
        //     instance.status = 'primary';
        //     instance.disabled = this.isChoosedMode;
        //     instance.title = this.cms.translateText('Common.generateToken');
        //     instance.label = this.cms.translateText('Common.generateToken');
        //     instance.init.subscribe(value => {
        //       // const processMap = AppModule.processMaps.commerceServiceByCycle[value || ''];
        //       // instance.label = this.cms.translateText(processMap?.label);
        //       // instance.status = processMap?.status;
        //       // instance.outline = processMap?.outline;
        //     });
        //     instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: PageModel) => {
        //       this.apiService.putPromise<PageModel[]>(this.apiPath, { generateToken: true }, [{ Code: rowData.Code }]).then(rs => {
        //         this.cms.showDialog('Collaborator', rs[0].PlatformApiToken, [
        //           {
        //             label: 'Close',
        //             status: 'danger',
        //             action: () => { },
        //           }
        //         ])
        //       });
        //     });
        //   },
        // },
        State: {
          title: this.cms.translateText('Common.state'),
          type: 'custom',
          width: '5%',
          // class: 'align-right',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'checkmark-circle';
            instance.display = true;
            instance.status = 'success';
            instance.disabled = this.isChoosedMode;
            instance.title = this.cms.translateText('Common.state');
            instance.label = this.cms.translateText('Common.state');
            instance.valueChange.subscribe(value => {
              const processMap = AppModule.processMaps.commerceServiceByCycle[value || ''];
              instance.label = this.cms.translateText(processMap?.label);
              instance.status = processMap?.status;
              instance.outline = processMap?.outline;
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: PageModel) => {
              this.changeStateConfirm(instance.rowData).then(status => {
                if (status) this.refresh();
              });
            });
          },
          filter: {
            type: 'custom',
            component: SmartTableSelect2FilterComponent,
            config: {
              delay: 0,
              condition: 'eq',
              select2Option: {
                placeholder: this.cms.translateText('Common.state') + '...',
                allowClear: true,
                width: '100%',
                dropdownAutoWidth: true,
                minimumInputLength: 0,
                keyMap: {
                  id: 'id',
                  text: 'text',
                },
                // multiple: true,
                ajax: {
                  url: (params: any) => {
                    return 'data:text/plan,[]';
                  },
                  delay: 0,
                  processResults: (data: any, params: any) => {
                    return {
                      results: this.stateList.filter(cate => !params.term || this.cms.smartFilter(cate.text, params.term)),
                    };
                  },
                },
              },
            },
          },
        },
        Permission: {
          title: this.cms.translateText('Common.permission'),
          type: 'custom',
          width: '5%',
          class: 'align-right',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'shield';
            instance.display = true;
            instance.status = 'danger';
            instance.style = 'text-align: right';
            instance.class = 'align-right';
            instance.title = this.cms.translateText('Common.preview');
            instance.valueChange.subscribe(value => {
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: PageModel) => {

              this.cms.openDialog(ResourcePermissionEditComponent, {
                context: {
                  inputMode: 'dialog',
                  inputId: [rowData.Code],
                  note: 'Click vào nút + để thêm 1 phân quyền, mỗi phân quyền bao gồm người được phân quyền và các quyền mà người đó được thao tác',
                  resourceName: this.cms.translateText('Sales.PriceReport.title', { action: '', definition: '' }) + ` ${rowData.Title || ''}`,
                  apiPath: this.apiPath,
                }
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

  initDataSource() {
    const source = super.initDataSource();

    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {
      params['includeParent'] = true;
      params['includeRelativeVouchers'] = true;
      params['sort_DateOfStart'] = 'asc';
      return params;
    };

    return source;
  }

  changeStateConfirm(data: PageModel) {
    const params = { id: [data.Code] };
    const processMap: ProcessMap = AppModule.processMaps.commerceServiceByCycle[data.State || ''];
    params['changeState'] = processMap?.nextState;

    return new Promise(resolve => {
      this.cms.showDialog(this.cms.translateText('Common.confirm'), this.cms.translateText(processMap?.confirmText, { object: this.cms.translateText('CommerceServiceByCycle.ServieByCycle.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
        {
          label: this.cms.translateText('Common.goback'),
          status: 'primary',
          action: () => {
            resolve(false);
          },
        },
        {
          label: this.cms.translateText(processMap?.nextStateLabel),
          status: AppModule.processMaps.commerceServiceByCycle[processMap.nextState || ''].status,
          action: async () => {
            this.loading = true;
            return this.apiService.putPromise<PageModel[]>(this.apiPath, params, [{ Code: data.Code }]).then(rs => {
              this.loading = false;
              this.cms.toastService.show(this.cms.translateText(processMap?.responseText, { object: this.cms.translateText('CommerceServiceByCycle.ServieByCycle.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), this.cms.translateText(processMap?.responseTitle), {
                status: 'success',
              });
              resolve(true);
              return true;
            }).catch(err => {
              this.loading = false;
              resolve(false);
              return false;
            });
          },
        },
      ], () => {
        resolve(false);
      });
    });
  }

}
