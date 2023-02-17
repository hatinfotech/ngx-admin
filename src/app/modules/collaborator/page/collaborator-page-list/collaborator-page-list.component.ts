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
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<CollaboratorPageListComponent>,
    public mobileAppService: MobileAppService
  ) {
    super(apiService, router, commonService, dialogService, toastService, ref);
  }

  async init() {
    // await this.loadCache();
    await this.commonService.waitForReady();
    this.cycleMap = {
      MONTHLY: this.commonService.translateText('Common.monthly'),
      YEARLY: this.commonService.translateText('Common.yearly'),
    };
    this.stateList = [
      {
        id: 'ACTIVE',
        text: this.commonService.translateText('Common.activated'),
      },
      {
        id: 'INACTIVE',
        text: this.commonService.translateText('Common.inactivated'),
      },
      {
        id: 'EXPIREDSOON',
        text: this.commonService.translateText('Common.expiredSoon'),
      },
      {
        id: 'OVEREXPIRED',
        text: this.commonService.translateText('Common.overExpired'),
      },
      {
        id: 'EXPIRED',
        text: this.commonService.translateText('Common.expired'),
      },
    ];
    return super.init().then(rs => {

      this.actionButtonList.unshift({
        type: 'button',
        name: 'generateConnectionString',
        label: this.commonService.translateText(''),
        icon: 'cloud-upload-outline',
        status: 'danger',
        size: 'medium',
        title: this.commonService.translateText('Tạo chuỗi kết nối'),
        click: () => {
          this.apiService.postPromise(this.apiPath, { generateConnectionString: true }, []).then(rs => {
            this.commonService.showDialog('Chuỗi kết nối core', rs['data'], [
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
          title: this.commonService.translateText('Common.code'),
          type: 'string',
          width: '10%',
        },
        Name: {
          title: this.commonService.translateText('Common.name'),
          type: 'string',
          width: '20%',
        },
        Description: {
          title: this.commonService.translateText('Common.description'),
          type: 'string',
          width: '40%',
        },
        PriceTable: {
          title: this.commonService.translateText('Sales.priceTable '),
          type: 'string',
          width: '10%',
        },
        Created: {
          title: this.commonService.translateText('Common.created'),
          type: 'datetime',
          width: '15%',
        },
        Push: {
          title: this.commonService.translateText('Collaborator.Page.pushProductLabel'),
          type: 'custom',
          width: '10%',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'cloud-upload-outline';
            instance.display = true;
            instance.status = 'danger';
            instance.disabled = this.isChoosedMode;
            instance.title = this.commonService.translateText('Collaborator.Page.pushProductLabel');
            instance.label = this.commonService.translateText('Collaborator.Page.pushProductLabel');
            instance.init.subscribe((page: PageModel) => {
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: PageModel) => {
              this.commonService.openDialog(ShowcaseDialogComponent, {
                closeOnBackdropClick: false,
                closeOnEsc: false,
                context: {
                  title: this.commonService.translateText('Common.subscribe'),
                  content: this.commonService.translateText('Collaborator.Page.pushProductConfirmText'),
                  actions: [
                    {
                      label: this.commonService.translateText('Common.close'),
                      icon: 'arrow-ios-back-outline',
                      status: 'primary',
                    },
                    {
                      label: this.commonService.translateText('Collaborator.Page.pushProductLabel'),
                      status: 'danger',
                      icon: 'cloud-upload-outline',
                      action: async (item, dialog) => {
                        dialog.setLoading(true);
                        try {
                          await this.apiService.putPromise<PageModel[]>('/collaborator/pages', { id: [rowData.Code], push: true }, [{ Code: rowData.Code }]).then(rs => {
                            this.commonService.toastService.show(this.commonService.translateText('Common.success'), this.commonService.translateText('Collaborator.Page.pushProductSuccessText'), {
                              status: 'success',
                            });
                          });
                        } catch (err) {
                          dialog.setLoading(false);
                          this.commonService.toastService.show('Lỗi đồng bộ', err?.logs?.join(', '), { status: 'dander' });
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
        //   title: this.commonService.translateText('Common.token'),
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
        //     instance.title = this.commonService.translateText('Common.generateToken');
        //     instance.label = this.commonService.translateText('Common.generateToken');
        //     instance.init.subscribe(value => {
        //       // const processMap = AppModule.processMaps.commerceServiceByCycle[value || ''];
        //       // instance.label = this.commonService.translateText(processMap?.label);
        //       // instance.status = processMap?.status;
        //       // instance.outline = processMap?.outline;
        //     });
        //     instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: PageModel) => {
        //       this.apiService.putPromise<PageModel[]>(this.apiPath, { generateToken: true }, [{ Code: rowData.Code }]).then(rs => {
        //         this.commonService.showDialog('Collaborator', rs[0].PlatformApiToken, [
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
          title: this.commonService.translateText('Common.state'),
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
            instance.title = this.commonService.translateText('Common.state');
            instance.label = this.commonService.translateText('Common.state');
            instance.valueChange.subscribe(value => {
              const processMap = AppModule.processMaps.commerceServiceByCycle[value || ''];
              instance.label = this.commonService.translateText(processMap?.label);
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
                placeholder: this.commonService.translateText('Common.state') + '...',
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
                      results: this.stateList.filter(cate => !params.term || this.commonService.smartFilter(cate.text, params.term)),
                    };
                  },
                },
              },
            },
          },
        },
        Permission: {
          title: this.commonService.translateText('Common.permission'),
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
            instance.title = this.commonService.translateText('Common.preview');
            instance.valueChange.subscribe(value => {
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: PageModel) => {

              this.commonService.openDialog(ResourcePermissionEditComponent, {
                context: {
                  inputMode: 'dialog',
                  inputId: [rowData.Code],
                  note: 'Click vào nút + để thêm 1 phân quyền, mỗi phân quyền bao gồm người được phân quyền và các quyền mà người đó được thao tác',
                  resourceName: this.commonService.translateText('Sales.PriceReport.title', { action: '', definition: '' }) + ` ${rowData.Title || ''}`,
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
      this.commonService.showDialog(this.commonService.translateText('Common.confirm'), this.commonService.translateText(processMap?.confirmText, { object: this.commonService.translateText('CommerceServiceByCycle.ServieByCycle.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
        {
          label: this.commonService.translateText('Common.goback'),
          status: 'primary',
          action: () => {
            resolve(false);
          },
        },
        {
          label: this.commonService.translateText(processMap?.nextStateLabel),
          status: AppModule.processMaps.commerceServiceByCycle[processMap.nextState || ''].status,
          action: async () => {
            this.loading = true;
            return this.apiService.putPromise<PageModel[]>(this.apiPath, params, [{ Code: data.Code }]).then(rs => {
              this.loading = false;
              this.commonService.toastService.show(this.commonService.translateText(processMap?.responseText, { object: this.commonService.translateText('CommerceServiceByCycle.ServieByCycle.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), this.commonService.translateText(processMap?.responseTitle), {
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
