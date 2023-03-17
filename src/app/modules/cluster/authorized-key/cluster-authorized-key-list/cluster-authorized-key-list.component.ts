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
import { ClusterAuthorizedModel } from '../../../../models/cluster.model';
import { ProcessMap } from '../../../../models/process-map.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { MobileAppService } from '../../../mobile-app/mobile-app.service';
import { ClusterAuthorizedKeyFormComponent } from '../cluster-authorized-key-form/cluster-authorized-key-form.component';

@Component({
  selector: 'ngx-cluster-authorized-key-list',
  templateUrl: './cluster-authorized-key-list.component.html',
  styleUrls: ['./cluster-authorized-key-list.component.scss']
})
export class ClusterAuthorizedKeyListComponent extends ServerDataManagerListComponent<ClusterAuthorizedModel> implements OnInit {

  componentName: string = 'ClusterAuthorizedKeyListComponent';
  formPath = '/cluster/authorized-key/form';
  apiPath = '/cluster/authorized-keys';
  idKey = 'Id';
  formDialog = ClusterAuthorizedKeyFormComponent;

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
    public ref: NbDialogRef<ClusterAuthorizedKeyListComponent>,
    public mobileAppService: MobileAppService
  ) {
    super(apiService, router, cms, dialogService, toastService, ref);
  }

  async init() {
    // await this.loadCache();
    await this.cms.waitForReady();
    // this.cycleMap = {
    //   MONTHLY: this.cms.translateText('Common.monthly'),
    //   YEARLY: this.cms.translateText('Common.yearly'),
    // };
    this.stateList = [
      {
        id: 'VERIFIED',
        text: this.cms.translateText('Common.verified'),
      },
      {
        id: 'EXPIRED',
        text: this.cms.translateText('Common.expired'),
      },
      {
        id: 'ERROR',
        text: this.cms.translateText('Common.expiredSoon'),
      },
    ];
    return super.init();
  }

  editing = {};
  rows = [];

  loadListSetting(): SmartTableSetting {
    return this.configSetting({
      columns: {
        Issuer: {
          title: this.cms.translateText('Common.node'),
          type: 'string',
          width: '10%',
        },
        Description: {
          title: this.cms.translateText('Common.description'),
          type: 'string',
          width: '40%',
          // filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
        },
        ApiUrl: {
          title: this.cms.translateText('Common.api'),
          type: 'string',
          width: '30%',
          // filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
        },
        State: {
          title: this.cms.translateText('Common.state'),
          type: 'custom',
          width: '10%',
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
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: ClusterAuthorizedModel) => {
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
        IsEnabled: {
          title: this.cms.translateText('Common.enable'),
          type: 'boolean',
          width: '10%',
          // filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
        },
        // Permission: {
        //   title: this.cms.translateText('Common.permission'),
        //   type: 'custom',
        //   width: '5%',
        //   class: 'align-right',
        //   renderComponent: SmartTableButtonComponent,
        //   onComponentInitFunction: (instance: SmartTableButtonComponent) => {
        //     instance.iconPack = 'eva';
        //     instance.icon = 'shield';
        //     instance.display = true;
        //     instance.status = 'danger';
        //     instance.style = 'text-align: right';
        //     instance.class = 'align-right';
        //     instance.title = this.cms.translateText('Common.preview');
        //     instance.valueChange.subscribe(value => {
        //       // instance.icon = value ? 'unlock' : 'lock';
        //       // instance.status = value === 'REQUEST' ? 'warning' : 'success';
        //       // instance.disabled = value !== 'REQUEST';
        //     });
        //     instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: ClusterAuthorizedModel) => {

        //       this.cms.openDialog(ResourcePermissionEditComponent, {
        //         context: {
        //           inputMode: 'dialog',
        //           inputId: [rowData.Code],
        //           note: 'Click vào nút + để thêm 1 phân quyền, mỗi phân quyền bao gồm người được phân quyền và các quyền mà người đó được thao tác',
        //           resourceName: this.cms.translateText('Sales.PriceReport.title', { action: '', definition: '' }) + ` ${rowData.Title || ''}`,
        //           // resrouce: rowData,
        //           apiPath: this.apiPath,
        //         }
        //       });

        //       // this.getFormData([rowData.Code]).then(rs => {
        //       //   this.preview(rs);
        //       // });
        //     });
        //   },
        // },
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

  changeStateConfirm(data: ClusterAuthorizedModel) {
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
            return this.apiService.putPromise<ClusterAuthorizedModel[]>(this.apiPath, params, [{ Code: data.Code }]).then(rs => {
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
