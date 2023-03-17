import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { takeUntil } from 'rxjs/operators';
import { AppModule } from '../../../../app.module';
import { SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { SmartTableSelect2FilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { CollaboratorPublisherModel } from '../../../../models/collaborator.model';
import { PageModel } from '../../../../models/page.model';
import { ProcessMap } from '../../../../models/process-map.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { MobileAppService } from '../../../mobile-app/mobile-app.service';
import { CollaboratorPageFormComponent } from '../collaborator-page-form/collaborator-page-form.component';

@Component({
  selector: 'ngx-collaborator-page-list',
  templateUrl: './collaborator-subscription-page-list.component.html',
  styleUrls: ['./collaborator-subscription-page-list.component.scss']
})
export class CollaboratorSubscriptionPageListComponent extends ServerDataManagerListComponent<PageModel> implements OnInit {

  componentName: string = 'CollaboratorSubscriptionPageListComponent';
  formPath = '/collaborator/page/form';
  apiPath = '/collaborator/subscription-pages';
  idKey = ['Page', 'Publisher'];
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
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<CollaboratorSubscriptionPageListComponent>,
    public mobileAppService: MobileAppService
  ) {
    super(apiService, router, cms, dialogService, toastService, ref);
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
      // remove action buttons
      this.actionButtonList = this.actionButtonList.filter(f => ['add', 'edit', 'delete'].indexOf(f.name) < 0)

      // Push product, categories, groups and units to collaborator platform
      // this.actionButtonList.unshift({
      //   type: 'button',
      //   name: 'pushProduct',
      //   label: this.cms.translateText('Collaborator.Product.push'),
      //   icon: 'cloud-upload-outline',
      //   status: 'danger',
      //   size: 'medium',
      //   title: this.cms.translateText('Common.subscribe'),
      //   click: () => {
      //     this.cms.openDialog(CollaboratorProductPreviewListComponent, {
      //       context: {
      //         inputMode: 'dialog',
      //         onDialogChoose: async (chooseItems: PageModel[]) => {
      //           console.log(chooseItems);
      //           this.cms.openDialog(ShowcaseDialogComponent, {
      //             context: {
      //               title: this.cms.translateText('Common.subscribe'),
      //               content: this.cms.translateText('Collaborator.Product.subscribeConfirmText') + '<br>' + chooseItems.map(product => product.Name).join(', '),
      //               actions: [
      //                 {
      //                   label: this.cms.translateText('Common.close'),
      //                   status: 'primary',
      //                 },
      //                 {
      //                   label: this.cms.translateText('Common.subscribe'),
      //                   status: 'danger',
      //                   action: () => {
      //                     this.apiService.putPromise<PageModel[]>('/collaborator/pages', { id: [chooseItems.map(product => product.Code)], subscribe: true, page: this.collaboratorService.currentpage$.value }, chooseItems.map(product => ({ Code: product.Code }))).then(rs => {
      //                       this.cms.toastService.show(this.cms.translateText('Common.success'), this.cms.translateText('Collaborator.Product.subscribeSuccessText'), {
      //                         status: 'success',
      //                       })
      //                       this.refresh();
      //                     });
      //                   }
      //                 },
      //               ],
      //             },
      //           })
      //         },
      //         onDialogClose: () => {
      //         },
      //       },
      //     })
      //   },
      // });

      return rs;
    });
  }

  editing = {};
  rows = [];

  loadListSetting(): SmartTableSetting {
    return this.configSetting({
      columns: {
        Page: {
          title: this.cms.translateText('Common.code'),
          type: 'string',
          width: '10%',
        },
        Name: {
          title: this.cms.translateText('Common.name'),
          type: 'string',
          width: '60%',
        },
        Assigned: {
          title: this.cms.translateText('Common.assigned'),
          type: 'datetime',
          width: '20%',
        },
        Level: {
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
            instance.outline = true
            // instance.label = this.cms.translateText('Common.state');
            instance.init.subscribe((row: CollaboratorPublisherModel) => {
              // const processMap = AppModule.processMaps.commerceServiceByCycle[row.State || ''];
              instance.title = row.LevelLabel;
              instance.label = row.LevelLabel;
              // instance.status = processMap?.status;
              // instance.outline = processMap?.outline;
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: CollaboratorPublisherModel) => {
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
      params['subscription'] = true;
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
